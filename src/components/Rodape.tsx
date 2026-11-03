type Props = {
  restaurante: string
  dupla: string[]
}

/** Rodapé com os créditos da dupla (aparece em todas as telas logadas). */
export default function Rodape({ restaurante, dupla }: Props) {
  return (
    <footer className="rodape">
      <span>
        {restaurante} · painel do restaurante
      </span>
      <span>{dupla.join(' & ')} · 2026.2</span>
    </footer>
  )
}
