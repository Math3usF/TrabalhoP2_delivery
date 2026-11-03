import type { Prato } from '../types'

type Tempos = Pick<Prato, 'prepTimeMinutes' | 'cookTimeMinutes'>

/**
 * Regra do trabalho: a API não tem preço.
 * preço = 15 + 0,50 × (preparo + cozimento)
 */
export function calcularPreco({ prepTimeMinutes, cookTimeMinutes }: Tempos): number {
  return 15 + 0.5 * (prepTimeMinutes + cookTimeMinutes)
}

const formatoReal = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

export function formatarPreco(valor: number): string {
  return formatoReal.format(valor)
}

/** Minutos → "1 h 20 min" / "25 min". */
export function formatarTempo(totalMinutos: number): string {
  const horas = Math.floor(totalMinutos / 60)
  const minutos = totalMinutos % 60
  if (horas === 0) return `${minutos} min`
  if (minutos === 0) return `${horas} h`
  return `${horas} h ${minutos} min`
}
