import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { CHAVE_TOKEN, registrarAoExpirar } from '../services/http'
import { login as loginApi, me } from '../services/auth'
import type { Usuario } from '../types'

type AuthValue = {
  usuario: Usuario | null
  token: string | null
  carregando: boolean
  login: (username: string, senha: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [carregando, setCarregando] = useState(true)

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
    if (!salvo) {
      setCarregando(false)
      return
    }
    me(salvo)
      .then((u) => {
        setToken(salvo)
        setUsuario(u)
      })
      .catch(() => localStorage.removeItem(CHAVE_TOKEN))
      .finally(() => setCarregando(false))
  }, [])

  // Entrega o logout para o interceptor de 401 (token vencido).
  useEffect(() => {
    registrarAoExpirar(logout)
    return () => registrarAoExpirar(null)
  }, [logout])

  return (
    <AuthContext.Provider value={{ usuario, token, carregando, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth precisa estar dentro de <AuthProvider>')
  }
  return ctx
}
