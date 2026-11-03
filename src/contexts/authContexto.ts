import { createContext, useContext } from 'react'
import type { Usuario } from '../types'

export type AuthValue = {
  usuario: Usuario | null
  token: string | null
  carregando: boolean
  login: (username: string, senha: string) => Promise<void>
  logout: () => void
}

export const ContextoAuth = createContext<AuthValue | null>(null)

/** Acesso ao contexto de autenticação (usuário, token, login e logout). */
export function useAuth() {
  const ctx = useContext(ContextoAuth)
  if (!ctx) {
    throw new Error('useAuth precisa estar dentro de <AuthProvider>')
  }
  return ctx
}
