# O que ja ficou pronto

- `render.yaml` criado na raiz para o backend no Render
- `frontend/.env.example` criado com a variavel publica da API
- `backend/src/app.controller.ts` criado com `GET /api/health`
- backend preparado para listar CPF na busca interna de casos
- frontend preparado para busca global por nome ou CPF no shell interno

# O que ainda e manual

Esses passos dependem de conta, login ou credencial sua:

## 1. GitHub

- garantir que as mudancas estejam no repositório remoto

## 2. Vercel

- importar o repositório
- definir `frontend` como root directory
- criar `NEXT_PUBLIC_API_URL=https://SEU-BACKEND.onrender.com/api`

## 3. Render

- criar o Web Service a partir do repositório
- usar o `render.yaml`
- preencher as envs secretas:
  - `DATABASE_URL`
  - `JWT_SECRET`
  - `CORS_ORIGIN`
  - `R2_ACCOUNT_ID`
  - `R2_ENDPOINT` ou deixar o endpoint derivado
  - `R2_ACCESS_KEY_ID`
  - `R2_SECRET_ACCESS_KEY`
  - `R2_BUCKET`
  - `R2_PUBLIC_BASE_URL` se quiser URL publica fixa
  - `RESEND_API_KEY`
  - `MAIL_FROM`

## 4. Neon

- criar o banco PostgreSQL
- copiar a connection string
- rodar migrations:
  - `cd backend`
  - `npm run prisma:deploy`
- rodar seed com a `DATABASE_URL` do Neon

## 5. Cloudflare R2

- criar o bucket
- gerar credenciais S3 compatíveis

## 6. Resend

- validar dominio ou subdominio
- gerar a API key

# Validacao final

Depois do deploy:

- abrir a home publica
- enviar um pedido publico
- fazer login como aluno
- abrir fila e detalhe de caso
- gerar preview de relatorio
- validar que `/api/health` responde `200`
