# Espaço Empreendedor — Backend MVP

Plataforma universitária de atendimento assistido para microempreendedores MEI.
Backend em NestJS + Prisma + PostgreSQL.

## Requisitos

- Node.js 20+
- Docker + Docker Compose (para o banco local)
- npm 10+

## Setup

```bash
cd backend
cp .env.example .env
npm install
docker compose up -d
npm run prisma:migrate -- --name init
npm run seed
npm run start:dev
```

API: `http://localhost:3000/api`
Swagger: `http://localhost:3000/api/docs`

## Usuários do seed

Senha padrão: `Senha@123`

| Papel     | E-mail             |
|-----------|--------------------|
| Professor | `professor@uni.br` |
| Aluno     | `aluno@uni.br`     |
| Admin     | `admin@uni.br`     |

## Fluxo principal

1. `POST /api/requests` (público) — microempreendedor envia formulário.
2. Sistema cria `EntrepreneurRequest` + `Case` em status `NEW`.
3. Aluno autentica (`POST /api/auth/login`) e consulta a fila (`GET /api/cases?status=NEW`).
4. Aluno assume o caso (`POST /api/cases/:id/assign` com o próprio `studentId`).
5. Aluno registra atendimento (`POST /api/cases/:caseId/attendances`).
6. Aluno muda status (`PATCH /api/cases/:id/status`).
7. Professor lista pendências (`GET /api/validations/pending`) e decide (`PATCH /api/validations/:id/decision`).
8. Aluno registra horas extensionistas (`POST /api/extension-hours`); professor valida.
9. Professor fecha o caso (`PATCH /api/cases/:id/status` → `CLOSED`).

## Scripts

```bash
npm run start:dev       # desenvolvimento com watch
npm run build           # build de produção
npm run start:prod      # executa dist
npm run prisma:migrate  # cria/atualiza migrations
npm run prisma:studio   # UI do Prisma
npm run seed            # popula usuários iniciais
npm run lint
npm test                # unit tests
npm run test:e2e        # testes e2e (requer banco rodando)
```

## Testes e2e

Os testes cobrem o fluxo completo: solicitação pública → assunção → atendimento → validação → horas extensionistas → fechamento.

```bash
# Inicie o banco antes
docker compose up -d

# Aplique migrations no banco de teste (ou use o mesmo banco de dev)
DATABASE_URL="..." npm run prisma:deploy

# Rode os testes
DATABASE_URL_TEST="postgresql://postgres:postgres@localhost:5432/espaco_empreendedor?schema=public" \
  npm run test:e2e
```

## Rate limiting

`POST /api/requests` (endpoint público): máximo 5 requisições por 60 segundos por IP.
Configurável via `THROTTLE_TTL` e `THROTTLE_LIMIT` no `.env`.

## E-mail

E-mail é **best-effort**: falha de SMTP não quebra o fluxo.
Em desenvolvimento use um servidor local como [Mailhog](https://github.com/mailhog/MailHog):

```bash
docker run -d -p 1025:1025 -p 8025:8025 mailhog/mailhog
# MAIL_HOST=localhost MAIL_PORT=1025 no .env
```

Eventos que disparam e-mail:
- Solicitação recebida → para o microempreendedor (se informou e-mail)
- Caso atribuído → para o aluno
- Status alterado pelo professor → para o aluno responsável
- Validação decidida → para o aluno

## Estrutura

```
backend/
├─ prisma/
│  ├─ schema.prisma
│  └─ seed.ts
├─ src/
│  ├─ common/          # guards, decorators, filtros
│  ├─ config/
│  ├─ modules/
│  │  ├─ auth/
│  │  ├─ users/
│  │  ├─ requests/        (público)
│  │  ├─ cases/
│  │  ├─ attendances/
│  │  ├─ validations/
│  │  ├─ extension-hours/
│  │  ├─ audit/
│  │  └─ prisma/
│  ├─ app.module.ts
│  └─ main.ts
├─ docker-compose.yml
├─ .env.example
├─ package.json
└─ tsconfig.json
```

## Regras de negócio ativas

- Usuário público não precisa de conta para solicitar ajuda (formulário + token de rastreio).
- Aluno vê fila (`NEW`, `TRIAGED`) e seus casos atribuídos.
- Aluno só pode assumir caso para si mesmo e só um aluno ativo por caso.
- Professor vê tudo, valida atendimentos e horas.
- Aluno não fecha caso (`CLOSED` exige professor/admin).
- Máquina de estados do caso impede transições inválidas.
- Toda criação de atendimento gera uma `Validation` pendente para o professor.
- Horas extensionistas seguem o mesmo fluxo de validação.
- Ações sensíveis gravam `AuditLog`.

## Próximos passos sugeridos

- Testes e2e (pasta `test/` já criada).
- Anexos/documentos com storage local ou S3.
- Notificações por e-mail (nodemailer) nas mudanças de status.
- Painel do aluno/professor no frontend (Vite/React ou Next.js).
- Endpoint de triagem automática por categoria (heurística simples antes de ML).
- Paginação uniforme + ordenação em todos os listings.
- Rate limit no endpoint público `/requests`.
