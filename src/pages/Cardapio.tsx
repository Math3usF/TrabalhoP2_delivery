import { useCallback, useEffect, useRef, useState } from 'react'
import PratoCard from '../components/PratoCard'
import PratoForm from '../components/PratoForm'
import Mensagem from '../components/Mensagem'
import {
  atualizarPrato,
  criarPrato,
  excluirPrato,
  listarPratos,
  type CamposPrato,
} from '../services/pratos'
import { mensagemDeErro } from '../utils/erros'
import { normalizar, textoBuscavel, traduzirPrato } from '../utils/traducao'
import type { Prato } from '../types'

type Aviso = { texto: string; tipo: 'ok' | 'erro' }

export default function Cardapio() {
  const [pratos, setPratos] = useState<Prato[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  const [busca, setBusca] = useState('')
  const [formAberto, setFormAberto] = useState(false)
  const [emEdicao, setEmEdicao] = useState<Prato | null>(null)
  const [salvando, setSalvando] = useState(false)
  const [erroForm, setErroForm] = useState<string | null>(null)

  const [ocupado, setOcupado] = useState<number | null>(null)
  const [aviso, setAviso] = useState<Aviso | null>(null)

  // A API de treino devolve id 51 para TODO prato criado. Para não repetir a
  // `key` no React, o segundo prato em diante ganha um id local. O PATCH/DELETE
  // continua sendo chamado (e continua dando 404) — o enunciado exige a mensagem.
  const proximoIdLocal = useRef(9000)

  const carregar = useCallback(async () => {
    setCarregando(true)
    setErro(null)
    try {
      setPratos(await listarPratos())
    } catch (err) {
      setErro(mensagemDeErro(err))
    } finally {
      setCarregando(false)
    }
  }, [])

  useEffect(() => {
    carregar()
  }, [carregar])

  // Busca local com filter + includes (aula 8): nada de ir à API a cada tecla.
  // Compara sem acento e no texto já traduzido ("macarrao" acha "Macarrão").
  const termo = normalizar(busca)
  const visiveis = termo
    ? pratos.filter((p) => textoBuscavel(p.name, p.cuisine).includes(termo))
    : pratos

  function abrirNovo() {
    setEmEdicao(null)
    setErroForm(null)
    setFormAberto(true)
  }

  function abrirEdicao(prato: Prato) {
    setEmEdicao(prato)
    setErroForm(null)
    setFormAberto(true)
  }

  function fecharForm() {
    setFormAberto(false)
    setEmEdicao(null)
    setErroForm(null)
  }

  async function salvar(campos: CamposPrato) {
    setErroForm(null)
    setSalvando(true)
    setAviso(null)
    try {
      if (emEdicao) {
        await atualizarPrato(emEdicao.id, campos)
        // Primeiro a API; só depois o estado (aula 10).
        setPratos((lista) =>
          lista.map((x) => (x.id === emEdicao.id ? { ...x, ...campos } : x)),
        )
        setAviso({ texto: 'Prato atualizado.', tipo: 'ok' })
      } else {
        const novo = await criarPrato(campos)
        const jaExiste = pratos.some((p) => p.id === novo.id)
        const item = jaExiste ? { ...novo, id: proximoIdLocal.current++ } : novo
        setPratos((lista) => [item, ...lista])
        setAviso({ texto: 'Prato adicionado ao cardápio.', tipo: 'ok' })
      }
      fecharForm()
    } catch (err) {
      // Aqui cai o 404 do prato criado por nós (id 51 não existe no servidor).
      setErroForm(mensagemDeErro(err))
    } finally {
      setSalvando(false)
    }
  }

  async function excluir(prato: Prato) {
    if (!window.confirm(`Tirar "${traduzirPrato(prato.name)}" do cardápio?`)) return

    setAviso(null)
    setOcupado(prato.id)
    try {
      await excluirPrato(prato.id)
      setPratos((lista) => lista.filter((x) => x.id !== prato.id))
      setAviso({ texto: 'Prato removido do cardápio.', tipo: 'ok' })
    } catch (err) {
      setAviso({ texto: mensagemDeErro(err), tipo: 'erro' })
    } finally {
      setOcupado(null)
    }
  }

  return (
    <section className="cardapio" aria-busy={carregando}>
      <div className="cardapio-topo">
        <div>
          <h1>Cardápio</h1>
          <p className="subtitulo">
            {carregando ? 'Carregando…' : `${pratos.length} pratos cadastrados`}
          </p>
        </div>
        <button type="button" className="botao botao-primario" onClick={abrirNovo}>
          + Novo prato
        </button>
      </div>

      <div className="campo busca">
        <label htmlFor="busca">Buscar por nome ou cozinha</label>
        <input
          id="busca"
          type="search"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Ex.: massa, Italiana…"
        />
      </div>

      {aviso && (
        <p
          className={aviso.tipo === 'erro' ? 'msg-erro' : 'msg-ok'}
          role={aviso.tipo === 'erro' ? 'alert' : 'status'}
        >
          {aviso.texto}
        </p>
      )}

      {formAberto && (
        <PratoForm
          key={emEdicao?.id ?? 'novo'}
          inicial={emEdicao}
          salvando={salvando}
          erro={erroForm}
          aoSalvar={salvar}
          aoCancelar={fecharForm}
        />
      )}

      {carregando && <Mensagem tipo="carregando">Carregando o cardápio…</Mensagem>}

      {!carregando && erro && (
        <Mensagem tipo="erro" aoTentarDeNovo={carregar}>
          {erro}
        </Mensagem>
      )}

      {!carregando && !erro && visiveis.length === 0 && (
        <Mensagem tipo="vazio">
          {pratos.length === 0
            ? 'Nenhum prato ainda. Cadastra o primeiro!'
            : `Nenhum prato encontrado para "${busca.trim()}".`}
        </Mensagem>
      )}

      {!carregando && !erro && visiveis.length > 0 && (
        <ul className="lista-pratos">
          {visiveis.map((prato) => (
            <PratoCard
              key={prato.id}
              prato={prato}
              ocupado={ocupado === prato.id}
              aoEditar={abrirEdicao}
              aoExcluir={excluir}
            />
          ))}
        </ul>
      )}
    </section>
  )
}
