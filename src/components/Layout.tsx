import { Outlet } from 'react-router-dom'
import Cabecalho from './Cabecalho'
import { useAuth } from '../contexts/AuthContext'

/** Moldura das telas logadas: cabeçalho fixo + a página filha no <Outlet />. */
export default function Layout() {
  const { usuario, logout } = useAuth()

  return (
    <>
      {usuario && (
        <Cabecalho nomeRestaurante="FastSnack" usuario={usuario} aoSair={logout} />
      )}
      <main className="conteudo">
        <Outlet />
      </main>
    </>
  )
}
