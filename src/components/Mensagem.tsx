import type { ReactNode } from 'react'

type Props = {
  tipo: 'carregando' | 'erro' | 'vazio' | 'ok'
  children: ReactNode
  aoTentarDeNovo?: () => void
}

const ICONE: Record<Props['tipo'], string> = {
  carregando: '⏳',
  erro: '⚠️',
  vazio: '📭',
  ok: '✅',
}

/** Bloco único para os quatro estados da tela (carregando, erro, vazio, aviso). */
export default function Mensagem({ tipo, children, aoTentarDeNovo }: Props) {
  return (
    <div className={`mensagem mensagem-${tipo}`} role={tipo === 'erro' ? 'alert' : 'status'}>
      <span className="mensagem-icone" aria-hidden="true">
        {ICONE[tipo]}
      </span>
      <div className="mensagem-texto">{children}</div>
      {aoTentarDeNovo && (
        <button type="button" className="botao botao-secundario" onClick={aoTentarDeNovo}>
          Tentar de novo
        </button>
      )}
    </div>
  )
}
