import { useState, type FormEvent, type KeyboardEvent } from 'react'
import type { Prato } from '../types'
import type { CamposPrato } from '../services/pratos'
import { calcularPreco, formatarPreco } from '../utils/preco'
import { traduzirCozinha, traduzirPrato } from '../utils/traducao'

type Props = {
  /** Quando vem um prato, o formulário entra em modo edição. */
  inicial?: Prato | null
  salvando: boolean
  erro: string | null
  aoSalvar: (campos: CamposPrato) => void
  aoCancelar: () => void
}

export default function PratoForm({
  inicial,
  salvando,
  erro,
  aoSalvar,
  aoCancelar,
}: Props) {
  // Ao editar, o formulário já abre com o texto em português.
  const [name, setName] = useState(inicial ? traduzirPrato(inicial.name) : '')
  const [cuisine, setCuisine] = useState(
    inicial ? traduzirCozinha(inicial.cuisine) : '',
  )
  const [image, setImage] = useState(inicial?.image ?? '')
  const [preparo, setPreparo] = useState(String(inicial?.prepTimeMinutes ?? 15))
  const [cozimento, setCozimento] = useState(String(inicial?.cookTimeMinutes ?? 15))
  const [erroLocal, setErroLocal] = useState<string | null>(null)

  const preparoNum = Number(preparo)
  const cozimentoNum = Number(cozimento)
  const precoPrevisto =
    Number.isFinite(preparoNum) && Number.isFinite(cozimentoNum)
      ? calcularPreco({
          prepTimeMinutes: preparoNum,
          cookTimeMinutes: cozimentoNum,
        })
      : null

  function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErroLocal(null)

    if (name.trim().length < 3) {
      setErroLocal('Escreve o nome do prato (pelo menos 3 letras).')
      return
    }

    if (cuisine.trim().length < 2) {
      setErroLocal('Informa a cozinha (ex.: Italiana, Japonesa).')
      return
    }

    const temposValidos = [preparoNum, cozimentoNum].every(
      (n) => Number.isFinite(n) && n >= 0 && n <= 600,
    )

    if (!temposValidos) {
      setErroLocal('Os tempos precisam ser números entre 0 e 600 minutos.')
      return
    }

    aoSalvar({
      name: name.trim(),
      cuisine: cuisine.trim(),
      image: image.trim(),
      prepTimeMinutes: preparoNum,
      cookTimeMinutes: cozimentoNum,
    })
  }

  /** Esc fecha o formulário, mas não enquanto o pedido está no ar. */
  function aoTeclar(e: KeyboardEvent<HTMLFormElement>) {
    if (e.key === 'Escape' && !salvando) {
      e.preventDefault()
      aoCancelar()
    }
  }

  return (
    <form
      className="cartao form-prato"
      onSubmit={enviar}
      onKeyDown={aoTeclar}
      noValidate
    >
      <h2>{inicial ? 'Editar prato' : 'Novo prato'}</h2>

      <div className="campo">
        <label htmlFor="nome-prato">Nome do prato</label>
        <input
          id="nome-prato"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex.: Macarrão ao molho branco"
          disabled={salvando}
          aria-invalid={erroLocal !== null}
          aria-describedby={erroLocal ? 'erro-prato' : undefined}
          autoFocus
        />
      </div>

      <div className="campo">
        <label htmlFor="cozinha-prato">Cozinha</label>
        <input
          id="cozinha-prato"
          value={cuisine}
          onChange={(e) => setCuisine(e.target.value)}
          placeholder="Ex.: Italiana"
          disabled={salvando}
          aria-invalid={erroLocal !== null}
          aria-describedby={erroLocal ? 'erro-prato' : undefined}
        />
      </div>

      <div className="campo">
        <label htmlFor="imagem-prato">URL da foto (opcional)</label>
        <input
          id="imagem-prato"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="https://…"
          disabled={salvando}
        />
      </div>

      <div className="campo-linha">
        <div className="campo">
          <label htmlFor="preparo">Preparo (min)</label>
          <input
            id="preparo"
            type="number"
            min={0}
            max={600}
            value={preparo}
            onChange={(e) => setPreparo(e.target.value)}
            disabled={salvando}
          />
        </div>
        <div className="campo">
          <label htmlFor="cozimento">Cozimento (min)</label>
          <input
            id="cozimento"
            type="number"
            min={0}
            max={600}
            value={cozimento}
            onChange={(e) => setCozimento(e.target.value)}
            disabled={salvando}
          />
        </div>
      </div>

      {precoPrevisto !== null && (
        <p className="preco-previsto">
          Preço pelo tempo total: <strong>{formatarPreco(precoPrevisto)}</strong>
        </p>
      )}

      {(erroLocal || erro) && (
        <p className="msg-erro" id="erro-prato" role="alert">
          {erroLocal ?? erro}
        </p>
      )}

      <div className="form-acoes">
        <button type="submit" className="botao botao-primario" disabled={salvando}>
          {salvando ? 'Salvando…' : inicial ? 'Salvar alterações' : 'Adicionar ao cardápio'}
        </button>
        <button
          type="button"
          className="botao botao-secundario"
          onClick={aoCancelar}
          disabled={salvando}
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
