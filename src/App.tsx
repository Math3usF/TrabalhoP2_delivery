import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Cardapio from './pages/Cardapio'
import NaoEncontrada from './pages/NaoEncontrada'
import Layout from './components/Layout'
import ProtectedRoute from './routes/ProtectedRoute'

export default function App() {
  return (
    <Routes>
      {/* Rota pública: única porta de entrada sem login */}
      <Route path="/login" element={<Login />} />

      {/* Tudo aqui dentro passa pela portaria */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route index element={<Cardapio />} />
        </Route>
      </Route>

      {/* Qualquer endereço não reivindicado */}
      <Route path="*" element={<NaoEncontrada />} />
    </Routes>
  )
}
