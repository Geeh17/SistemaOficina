# 🏍️ Sistema Oficina — Painel de Gestão

Sistema completo de gestão para oficina de motos: clientes, motos, ordens de
serviço (com painel visual estilo etiqueta de OS), estoque de peças,
financeiro/caixa, agenda de horários e controle de funcionários.

## Stack

- **Backend**: Node.js + Express 5 + TypeScript + Prisma + MongoDB + JWT
- **Frontend**: React 19 + Vite + TypeScript + Tailwind CSS 4 + React Router

## Estrutura

```
SistemaOficina/
├── backEnd/     API REST
└── frontEnd/    Painel web (SPA)
```

## 1. Banco de dados (MongoDB)

Você precisa de uma string de conexão MongoDB. A forma mais simples é criar um
cluster gratuito no [MongoDB Atlas](https://www.mongodb.com/atlas):

1. Crie um cluster (camada gratuita M0)
2. Em "Database Access", crie um usuário e senha
3. Em "Network Access", libere seu IP (ou `0.0.0.0/0` em desenvolvimento)
4. Copie a "Connection string" (algo como
   `mongodb+srv://usuario:senha@cluster.mongodb.net/sistema-oficina`)

Também funciona com MongoDB local (`mongodb://localhost:27017/sistema-oficina`),
mas o Prisma exige que o MongoDB local esteja rodando como **replica set**.

## 2. Backend

```bash
cd backEnd
npm install
cp .env.example .env
# edite o .env com sua DATABASE_URL e um JWT_SECRET forte

npx prisma generate      # gera o client do Prisma
npx prisma db push       # cria as coleções no MongoDB a partir do schema
npm run seed              # cria o usuário administrador inicial

npm run dev               # inicia a API em http://localhost:3333
```

Login inicial criado pelo seed:

- **E-mail:** `admin@oficina.com`
- **Senha:** `admin123`

⚠️ Troque essa senha assim que possível (cadastre um novo admin pela tela de
Funcionários e desative/exclua o usuário padrão, ou implemente troca de senha).

### Principais rotas da API

Todas as rotas (exceto `/auth/login`) exigem o header
`Authorization: Bearer <token>`.

| Módulo         | Rota base            |
| -------------- | --------------------- |
| Autenticação   | `/api/auth`            |
| Clientes       | `/api/clientes`        |
| Motos          | `/api/motos`           |
| Ordens de Serviço | `/api/ordens-servico` |
| Estoque        | `/api/pecas`            |
| Financeiro     | `/api/transacoes`      |
| Agenda         | `/api/agendamentos`    |
| Dashboard      | `/api/dashboard/resumo`|

Regras automáticas já implementadas no backend:

- Cada OS recebe um **número sequencial** (`OS-0001`, `OS-0002`, ...)
- Ao dar baixa em peças de uma OS que existam no catálogo de estoque, o
  estoque é **decrementado automaticamente**
- Ao marcar uma OS como **Entregue**, o valor total é lançado automaticamente
  como receita no financeiro

## 3. Frontend

```bash
cd frontEnd
npm install
cp .env.example .env
# ajuste VITE_API_URL se a API não estiver em localhost:3333

npm run dev                # inicia em http://localhost:5173
```

## 4. Fluxo de uso recomendado

1. Faça login com o usuário admin
2. Cadastre um cliente e a moto dele
3. Abra uma Ordem de Serviço (aba **Ordens de Serviço** → *Nova OS*)
4. Acompanhe a OS avançando pelas colunas do painel (Aberta → Diagnóstico →
   Aguardando peça → Em execução → Pronta → Entregue)
5. Ao marcar como **Entregue**, o valor cai automaticamente no **Financeiro**
6. Cadastre peças em **Estoque** e controle entradas/saídas
7. Use a **Agenda** para marcar horários futuros de clientes
8. Em **Funcionários** (apenas admin), cadastre a equipe da oficina

## 5. Deploy

- **Backend**: qualquer serviço Node (Render, Railway, Fly.io, VPS). Configure
  as variáveis de ambiente do `.env.example` no serviço escolhido.
- **Frontend**: `npm run build` gera a pasta `dist/`, pronta para qualquer
  hospedagem estática (Vercel, Netlify, Cloudflare Pages). Configure
  `VITE_API_URL` apontando para a URL pública do backend.

## Observações técnicas

- O design do frontend foi pensado para o dia a dia de uma oficina: os
  cartões de Ordem de Serviço têm um "canhoto" perfurado com o número da OS,
  como uma etiqueta física de ordem de serviço presa na moto.
- MongoDB não possui autoincrement nativo — o número sequencial da OS é
  calculado a partir do maior número existente. Em cenários de altíssima
  concorrência (muitas OS abertas no mesmíssimo milissegundo), considere
  migrar para um contador atômico dedicado.
- Ajuste as regras de permissão (`autorizar("ADMIN")`) nas rotas do backend
  conforme a política da sua oficina.
