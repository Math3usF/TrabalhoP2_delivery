import { api } from './http'
import type { Usuario } from '../types'

export type LoginResposta = Usuario & {
  accessToken: string
  refreshToken: string
}

/** POST /auth/login — devolve o usuário junto com o accessToken (JWT). */
export async function login(
  username: string,
  password: string,
): Promise<LoginResposta> {
  const { data } = await api.post<LoginResposta>('/auth/login', {
    username,
    password,
    expiresInMins: 60,
  })
  return data
}

/** GET /auth/me — pergunta à API de quem é o token informado. */
export async function me(token: string): Promise<Usuario> {
  const { data } = await api.get<Usuario>('/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  })
  return data
}
