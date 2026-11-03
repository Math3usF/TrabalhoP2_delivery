import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/authContexto'

/**
 * A portaria: só deixa passar quem tem sessão.
 * - carregando: ainda restaurando a sessão do localStorage (evita piscar o login)
 * - sem usuário: volta para /login (replace = o "voltar" não retorna aqui)
 * - logado: mostra a rota filha
 */
export default function ProtectedRoute() {
  const { usuario, carregando } = useAuth()

  if (carregando) {
    return (
      <p className="aviso" role="status">
        Verificando sessão…
      </p>
    )
  }
  if (!usuario) {
    return <Navigate to="/login" replace />
  }
  return <Outlet />
}
