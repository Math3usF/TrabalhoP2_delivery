import { api } from './http'
import type { ListaPratos, Prato } from '../types'

/** Só os campos que a tela usa (o /recipes devolve muitos outros). */
const CAMPOS = 'id,name,cuisine,image,prepTimeMinutes,cookTimeMinutes'

/**
 * GET /recipes — lista o cardápio inteiro.
 * `limit: 0` devolve todos os pratos (sem ele, a API corta em 30).
 * A busca é feita na tela com `filter`, reaproveitando esta lista já carregada
 * (o endpoint /recipes/search?q= também existe, mas filtrar local evita
 * uma ida à API a cada tecla).
 */
export async function listarPratos(): Promise<Prato[]> {
  const { data } = await api.get<ListaPratos>('/recipes', {
    params: { limit: 0, select: CAMPOS },
  })
  return data.recipes
}

export type CamposPrato = {
  name: string
  cuisine: string
  image: string
  prepTimeMinutes: number
  cookTimeMinutes: number
}

/** POST /recipes/add — a API só simula: o prato volta sempre com id 51. */
export async function criarPrato(campos: CamposPrato): Promise<Prato> {
  const { data } = await api.post<Prato>('/recipes/add', campos)
  return data
}

/** PATCH /recipes/:id — manda só os campos que mudaram. */
export async function atualizarPrato(
  id: number,
  campos: Partial<CamposPrato>,
): Promise<Prato> {
  const { data } = await api.patch<Prato>(`/recipes/${id}`, campos)
  return data
}

/** DELETE /recipes/:id — a resposta não é usada, por isso devolve void. */
export async function excluirPrato(id: number): Promise<void> {
  await api.delete(`/recipes/${id}`)
}
