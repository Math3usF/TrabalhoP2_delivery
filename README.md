# FastSnack · Painel do restaurante

Trabalho de **Laboratório de Programação Front End — Engenharia de Software · 2026.2**
(Universidade de Vassouras · FUSVE)

**Dupla**

- Matheus Fernando Cardoso Bezerra
- Marília Soares Caetano da Silva

**Repositório:** <https://github.com/SEU-USUARIO/fastsnack>

---

## O que é

Painel que o dono do restaurante usa para cuidar do cardápio: entra com login,
vê os pratos, busca, cadastra prato novo, edita e tira prato do cardápio.
Funciona no celular (layout mobile-first, testado em 375 px).

## Como rodar

```bash
npm install
# crie o .env na raiz (veja abaixo)
npm run dev
```

O `.env` já está versionado neste repositório; se precisar recriar:

```
VITE_API_URL=https://dummyjson.com
```

> O Vite só lê o `.env` ao iniciar. Depois de criar ou editar o arquivo,
> reinicie o `npm run dev`.

Build de produção:

```bash
npm run build     # tsc -b && vite build
npm run preview
```

## Conta de teste

| Usuário  | Senha       |
| -------- | ----------- |
| `emilys` | `emilyspass` |

## Stack

- React 19 + TypeScript + Vite
- React Router 7 (`BrowserRouter`, `Routes`, `Navigate`, `Outlet`)
- Axios (instância única + interceptors)
- CSS puro, mobile-first

## Estrutura

```
src/
├── components/       peças reutilizáveis (com props)
│   ├── Cabecalho.tsx     identidade + usuário logado + Sair
│   ├── Layout.tsx        moldura das telas logadas (<Outlet />)
│   ├── Mensagem.tsx      carregando / erro / vazio / ok
│   ├── PratoCard.tsx     card do prato (foto, cozinha, tempo, preço)
│   └── PratoForm.tsx     formulário de criar/editar com validação
├── contexts/
│   └── AuthContext.tsx   usuário, token, carregando, login, logout + useAuth()
├── pages/
│   ├── Login.tsx         formulário controlado, erro por status
│   ├── Cardapio.tsx      dona do estado: lista, busca, CRUD, 4 estados
│   └── NaoEncontrada.tsx 404
├── routes/
│   └── ProtectedRoute.tsx portaria: sem sessão → /login
├── services/
│   ├── http.ts           axios.create + interceptor de token e de 401
│   ├── auth.ts           login(), me()
│   └── pratos.ts         listar, criar, atualizar, excluir
├── utils/
│   ├── erros.ts          mensagemDeErro() por status HTTP
│   └── preco.ts          regra de preço + formatação em reais
├── types.ts          Usuario, Prato, ListaPratos
├── App.tsx           tabela de rotas
├── main.tsx          BrowserRouter + AuthProvider
└── index.css         tema e layout responsivo
```

## Funcionalidades

- **Login** com `POST /auth/login`; o `accessToken` fica no `localStorage`
  (`fastsnack.token`) e no Context.
- **Sessão restaurada no F5**: lê o token e valida com `GET /auth/me`
  (`Authorization: Bearer …`). Enquanto isso, `carregando = true`.
- **Cardápio protegido** por `ProtectedRoute` + botão **Sair**.
- **Lista** com foto, nome, cozinha, tempo total e preço; `map` com `key`.
- **Busca** com `filter` + `includes` (nome ou cozinha), sem nova chamada à API.
- **Criar / editar / excluir**, com confirmação (`window.confirm`) antes de excluir.
- **Quatro estados** da tela: carregando, erro, vazio e lista.
- **Erro por status**: 400, 401, 404, 5xx e sem conexão têm mensagens próprias
  (`utils/erros.ts`), sempre na tela com `role="alert"`, nunca o texto cru do Axios.
- **Interceptors**: um carimba o token em todo pedido; o outro trata 401
  (sessão vencida → logout → `/login`), ignorando o `/auth/login`.
- **Atualiza a lista depois de salvar**, sem F5 (a API só simula).

## Regra de preço

A API `/recipes` não tem preço. A regra do trabalho:

```
preço = 15 + 0,50 × (prepTimeMinutes + cookTimeMinutes)
```

Implementada em `src/utils/preco.ts` e formatada com `Intl.NumberFormat('pt-BR')`.

## Sobre a API de treino (DummyJSON)

- `POST /recipes/add` responde **201**, mas não grava. Por isso o app mantém
  o estado local e atualiza a lista a cada ação. Recarregar a página volta ao
  que a API tem — comportamento esperado.
- Todo prato criado volta com **`id` 51** e **não existe no servidor**:
  editar ou excluir esse prato responde **404**, e o app mostra a mensagem
  "Não encontramos esse prato. Ele pode ter sido removido.".
  Como o `id` 51 se repete, o segundo prato criado na mesma sessão recebe um
  `id` local só para não duplicar a `key` do React.

## Rotas

| Rota       | Acesso   |
| ---------- | -------- |
| `/login`   | pública  |
| `/`        | protegida (cardápio) |
| `*`        | 404      |

## Checklist da entrega

- [x] `npm run dev` abre a página
- [x] Login, cardápio, busca, criar, editar e excluir funcionando
- [x] Nenhum botão ou link sem ação
- [x] Usável em 375 px, sem rolagem lateral
- [x] Console sem erro vermelho
- [x] `npm run build` sem erro
- [x] README com os nomes da dupla
