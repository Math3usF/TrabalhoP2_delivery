export type Usuario = {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  image: string
}

/** Um prato do cardápio (recurso /recipes do DummyJSON). */
export type Prato = {
  id: number
  name: string
  cuisine: string
  image: string
  prepTimeMinutes: number
  cookTimeMinutes: number
}

/** O DummyJSON devolve a lista dentro de um objeto com paginação. */
export type ListaPratos = {
  recipes: Prato[]
  total: number
  skip: number
  limit: number
}
