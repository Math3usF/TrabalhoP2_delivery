import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { mensagemDeErro, statusDoErro } from '../utils/erros'

export default function Login() {
  const { login, usuario } = useAuth()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [senha, setSenha] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErro(null)

    if (!username.trim() || !senha.trim()) {
      setErro('Preenche usuário e senha.')
      return
    }

    setEnviando(true)
    try {
      await login(username.trim(), senha)
      navigate('/', { replace: true })
    } catch (err) {
      const status = statusDoErro(err)
      // 400 ou 401 no login significam credenciais erradas (aula 9).
      setErro(
        status === 400 || status === 401
          ? 'Usuário ou senha incorretos.'
          : mensagemDeErro(err),
      )
    } finally {
      setEnviando(false)
    }
  }

  if (usuario) {
    return <Navigate to="/" replace />
  }

  return (
    <main className="tela-login">
      <form className="cartao form-login" onSubmit={enviar} noValidate>
        <h1>
          <span aria-hidden="true">🍔</span> FastSnack
        </h1>
        <p className="subtitulo">Painel do restaurante</p>

        <label htmlFor="username">Usuário</label>
        <input
          id="username"
          value={username}
          autoComplete="username"
          onChange={(e) => setUsername(e.target.value)}
          disabled={enviando}
        />

        <label htmlFor="senha">Senha</label>
        <input
          id="senha"
          type="password"
          value={senha}
          autoComplete="current-password"
          onChange={(e) => setSenha(e.target.value)}
          disabled={enviando}
        />

        {erro && (
          <p className="msg-erro" role="alert">
            {erro}
          </p>
        )}

        <button type="submit" className="botao botao-primario" disabled={enviando}>
          {enviando ? 'Entrando…' : 'Entrar'}
        </button>

        <p className="dica">Conta de teste: emilys / emilyspass</p>
      </form>
    </main>
  )
}
