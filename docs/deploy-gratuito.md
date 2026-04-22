# Deploy gratuito inicial

Arquitetura recomendada para o projeto:

- `frontend` no Vercel Hobby
- `backend` no Render Free Web Service
- `database` no Neon Free
- `PDFs` no Cloudflare R2
- `e-mails` no Resend Free

## Frontend no Vercel

1. Importe o repositório no Vercel.
2. Defina o diretório raiz do projeto como `frontend`.
3. Configure a variável:

```env
NEXT_PUBLIC_API_URL=https://SEU-BACKEND.onrender.com/api
```

4. Faça o deploy.

## Backend no Render

Crie um `Web Service` apontando para o diretório `backend`.

- Build Command: `npm install && npm run build`
- Start Command: `npm run start:prod`

Variáveis mínimas:

```env
NODE_ENV=production
PORT=10000
DATABASE_URL=postgresql://...
JWT_SECRET=...
JWT_EXPIRES_IN=1d
CORS_ORIGIN=https://SEU-FRONTEND.vercel.app
THROTTLE_TTL=60
THROTTLE_LIMIT=5

REPORT_STORAGE_DRIVER=r2
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET=...
# opcional se preferir informar manualmente
R2_ENDPOINT=https://SEU_ACCOUNT_ID.r2.cloudflarestorage.com

MAIL_PROVIDER=resend
RESEND_API_KEY=...
MAIL_FROM=Espaco Empreendedor <onboarding@SEU_DOMINIO.com>
```

## Banco no Neon

1. Crie um projeto Postgres no Neon.
2. Copie a connection string para `DATABASE_URL`.
3. Aplique as migrations:

```bash
cd backend
npm install
npm run prisma:deploy
```

4. Rode o seed inicial:

```bash
$env:DATABASE_URL="postgresql://..."
npm run seed
```

## Cloudflare R2

1. Crie um bucket para relatórios.
2. Gere credenciais S3 compatíveis.
3. Preencha `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY` e `R2_BUCKET`.
4. Use `R2_ACCOUNT_ID` ou informe `R2_ENDPOINT` manualmente.

## Resend

1. Crie uma conta no Resend.
2. Valide o domínio ou subdomínio do remetente.
3. Gere uma API key.
4. Preencha:

```env
MAIL_PROVIDER=resend
RESEND_API_KEY=...
MAIL_FROM=Espaco Empreendedor <onboarding@SEU_DOMINIO.com>
```

## Verificações após deploy

- Abrir a homepage pública
- Enviar uma solicitação pública
- Acompanhar a solicitação
- Fazer login como aluno e professor
- Gerar preview e download de relatório
- Validar upload de PDF assinado
- Confirmar que PDFs continuam disponíveis após restart do backend
