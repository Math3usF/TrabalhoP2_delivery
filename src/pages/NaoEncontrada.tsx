import { Link } from 'react-router-dom'

export default function NaoEncontrada() {
  return (
    <main className="conteudo">
      <div className="cartao vazio">
        <h1>404</h1>
        <p>Essa página não existe no FastSnack.</p>
        <Link className="botao botao-primario" to="/">
          Voltar ao cardápio
        </Link>
      </div>
    </main>
  )
}
