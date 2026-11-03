import axios from 'axios'

/** Chave única do token no localStorage (evita erro de grafia em dois lugares). */
export const CHAVE_TOKEN = 'fastsnack.token'

/** A única instância que conversa com a API do cardápio. */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
})

// ── Interceptor de request: carimba o token em todo pedido ────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(CHAVE_TOKEN)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── Interceptor de response: 401 significa sessão vencida ────────────────
// O http.ts vive fora do React, então o AuthContext se registra aqui.
let aoExpirar: (() => void) | null = null

export function registrarAoExpirar(fn: (() => void) | null) {
  aoExpirar = fn
}

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Um 401 no próprio login significa "senha errada", não "sessão vencida".
    const ehLogin = String(err.config?.url).includes('/auth/login')
    if (axios.isAxiosError(err) && err.response?.status === 401 && !ehLogin) {
      aoExpirar?.()
    }
    return Promise.reject(err)
  },
)
