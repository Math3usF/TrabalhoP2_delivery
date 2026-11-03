import type { Usuario } from '../types'

type Props = {
  nomeRestaurante: string
  usuario: Usuario
  aoSair: () => void
}

/** Cabeçalho do painel: identidade do restaurante + quem está logado. */
export default function Cabecalho({ nomeRestaurante, usuario, aoSair }: Props) {
  return (
    <header className="cabecalho">
      <div className="cabecalho-identidade">
        <span className="logo" aria-hidden="true">
          🍔
        </span>
        <strong>{nomeRestaurante}</strong>
        <span className="etiqueta">painel</span>
      </div>

      <div className="cabecalho-usuario">
        <span className="saudacao">
          Olá, <strong>{usuario.firstName || usuario.username}</strong>
        </span>
        <button type="button" className="botao botao-sair" onClick={aoSair}>
          Sair
        </button>
      </div>
    </header>
  )
}
