import { useState } from 'react'
import type { Prato } from '../types'
import { calcularPreco, formatarPreco, formatarTempo } from '../utils/preco'
import { traduzirCozinha, traduzirPrato } from '../utils/traducao'

type Props = {
  prato: Prato
  ocupado: boolean
  aoEditar: (prato: Prato) => void
  aoExcluir: (prato: Prato) => void
}

/** Card de um prato: foto, nome, cozinha, tempos e preço calculado. */
export default function PratoCard({ prato, ocupado, aoEditar, aoExcluir }: Props) {
  const [imagemFalhou, setImagemFalhou] = useState(false)
  const preco = calcularPreco(prato)
  const tempoTotal = prato.prepTimeMinutes + prato.cookTimeMinutes
  const nome = traduzirPrato(prato.name)
  const cozinha = traduzirCozinha(prato.cuisine)

  return (
    <li className="prato-card">
      {prato.image && !imagemFalhou ? (
        <img
          className="prato-foto"
          src={prato.image}
          alt={nome}
          loading="lazy"
          onError={() => setImagemFalhou(true)}
        />
      ) : (
        <div className="prato-foto prato-foto-vazia" aria-hidden="true">
          🍽️
        </div>
      )}

      <div className="prato-corpo">
        <h2 className="prato-nome">{nome}</h2>
        <p className="prato-cozinha">{cozinha}</p>

        <p className="prato-detalhes">
          <span title="Preparo + cozimento">⏱ {formatarTempo(tempoTotal)}</span>
          <span>{formatarPreco(preco)}</span>
        </p>

        <div className="prato-acoes">
          <button
            type="button"
            className="botao botao-secundario"
            onClick={() => aoEditar(prato)}
            disabled={ocupado}
          >
            Editar
          </button>
          <button
            type="button"
            className="botao botao-perigo"
            onClick={() => aoExcluir(prato)}
            disabled={ocupado}
            aria-label={`Excluir ${nome}`}
          >
            {ocupado ? 'Aguarde…' : 'Excluir'}
          </button>
        </div>
      </div>
    </li>
  )
}
