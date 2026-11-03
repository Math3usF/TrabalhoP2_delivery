import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { CHAVE_TOKEN, registrarAoExpirar } from '../services/http'
import { login as loginApi, me } from '../services/auth'
import { ContextoAuth, type AuthValue } from './authContexto'
import type { Usuario } from '../types'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [token, setToken] = useState<string | null>(null)
  // Já começa "carregando" se existe token salvo: o efeito vai validá-lo.
  // Sem token, não há o que restaurar e a portaria pode decidir na hora.
  const [carregando, setCarregando] = useState(
    () => localStorage.getItem(CHAVE_TOKEN) !== null,
  )

  // O logout é estável (useCallback) porque o interceptor do Axios guarda
  // esta função: se ela fosse recriada a cada render, registraríamos a antiga.
  const logout = useCallback(() => {
    localStorage.removeItem(CHAVE_TOKEN)
    setToken(null)
    setUsuario(null)
  }, [])

  async function login(username: string, senha: string) {
    const dados = await loginApi(username, senha)
    localStorage.setItem(CHAVE_TOKEN, dados.accessToken)
    setToken(dados.accessToken)
    setUsuario({
      id: dados.id,
      username: dados.username,
      email: dados.email,
      firstName: dados.firstName,
      lastName: dados.lastName,
      image: dados.image,
    })
  }

  // Ao abrir o app: se há token salvo, pergunta à API se ele ainda vale.
  useEffect(() => {
    const salvo = localStorage.getItem(CHAVE_TOKEN)
    if (!salvo) return

    let ativo = true
    me(salvo)
      .then((u) => {
        if (!ativo) return
        setToken(salvo)
        setUsuario(u)
      })
      .catch(() => localStorage.removeItem(CHAVE_TOKEN))
      .finally(() => {
        if (ativo) setCarregando(false)
      })

    return () => {
      ativo = false
    }
  }, [])

  // Entrega o logout para o interceptor de 401 (token vencido).
  useEffect(() => {
    registrarAoExpirar(logout)
    return () => registrarAoExpirar(null)
  }, [logout])

  const valor: AuthValue = { usuario, token, carregando, login, logout }

  return <ContextoAuth.Provider value={valor}>{children}</ContextoAuth.Provider>
}
