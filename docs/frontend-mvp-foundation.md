# Frontend MVP Foundation — Espaço do Empreendedor

## Fonte de verdade

- Conteúdo e microcopy: `base_verdade_mei_densa.md`
- Regras e contratos: backend Nest em `backend/` e OpenAPI em `http://localhost:3000/api-json`
- Identidade visual: `logo.PNG`, `IMG_7853.PNG`, `IMG_7854.PNG`

## Leitura de produto

O frontend precisa atender três ritmos diferentes:

- Público: orientação simples, segura, acolhedora e com baixa carga cognitiva.
- Aluno: operação rápida de fila, caso, atendimento e horas.
- Professor: supervisão objetiva, validação e visão operacional.

## Arquitetura proposta

Criar um app separado em `frontend/` com Next.js App Router, TypeScript e Tailwind.

### Estrutura

```text
frontend/
  app/
    (public)/
    (auth)/
    (student)/
    (professor)/
    api/
    globals.css
    layout.tsx
  components/
    ui/
    branding/
    layout/
    feedback/
    forms/
    data-display/
  features/
    auth/
    public/
    cases/
    attendances/
    validations/
    extension-hours/
    content/
  lib/
    api/
    auth/
    constants/
    formatters/
    guards/
    utils/
  hooks/
  services/
  styles/
  types/
```

### Decisões

- `app/`: layout, rotas e boundaries de erro/loading.
- `features/`: cada domínio concentra queries, schemas, mapeamentos e componentes específicos.
- `services/`: camada de acesso à API por módulo.
- `lib/api`: cliente Axios, interceptors, tratamento de erro e serialização.
- `lib/auth`: sessão, persistência do token, helpers por papel.
- `types/`: contratos compartilhados derivados da API.

## Rotas do MVP

### Pública

- `/`
- `/quero-ajuda`
- `/acompanhar`
- `/informacoes/abrir-mei`
- `/informacoes/ja-sou-mei`
- `/informacoes/golpes`
- `/informacoes/nota-fiscal`
- `/informacoes/beneficios`

### Interna

- `/login`
- `/aluno/fila`
- `/aluno/meus-casos`
- `/aluno/casos/[id]`
- `/aluno/horas`
- `/professor/dashboard`
- `/professor/validacoes`
- `/professor/casos/[id]`

### Auxiliares

- `not-found.tsx`
- `forbidden`
- `session-expired`
- `loading.tsx`
- `error.tsx`

## Mapeamento da API

### Público

- `POST /api/requests`
- `GET /api/requests/track/{token}`

### Auth

- `POST /api/auth/login`
- `GET /api/auth/me`

### Casos

- `GET /api/cases`
- `GET /api/cases/{id}`
- `POST /api/cases/{id}/assign`
- `PATCH /api/cases/{id}/status`
- `GET /api/cases/{caseId}/attendances`
- `POST /api/cases/{caseId}/attendances`

### Validações e horas

- `GET /api/validations/pending`
- `PATCH /api/validations/{id}/decision`
- `POST /api/extension-hours`
- `GET /api/extension-hours/me`
- `GET /api/extension-hours/students/{studentId}/summary`
- `GET /api/users?role=STUDENT`

## Papéis e guardas

- Público: acesso só às rotas abertas.
- `STUDENT`: acesso a `/aluno/*`.
- `PROFESSOR`: acesso a `/professor/*`.
- `ADMIN`: pode ser tratado como professor no frontend MVP, sem expor uma área separada agora.

### Estratégia

- Middleware para bloquear áreas privadas sem token.
- Guardas por papel no layout de grupo.
- `401`: redireciona para `/session-expired`.
- `403`: redireciona para `/forbidden`.

## Sistema visual

### Direção

Inspirar-se em:

- editorial institucional contemporâneo
- tipografia de alto impacto
- blocos claros, fortes e legíveis
- laranja dominante com contraste escuro
- superfícies suaves, não burocráticas

### Estilo

Combinação de:

- `Editorial Grid / Magazine`
- `Swiss Modernism 2.0`
- `Accessible & Ethical`
- `Dimensional Layering` em dose baixa

### Paleta inicial

- `--brand-hero`: `#f97316`
- `--brand-hero-deep`: `#ea580c`
- `--brand-ink`: `#111114`
- `--brand-night`: `#1f2454`
- `--brand-paper`: `#f6f1e8`
- `--brand-card`: `#fffaf4`
- `--brand-line`: `#e7d9c7`
- `--brand-success`: `#1f7a4f`
- `--brand-warning`: `#b76b00`
- `--brand-danger`: `#b42318`

### Tipografia

- Títulos: `Bebas Neue`
- Apoio e destaques curtos: `Sora`
- Corpo e formulários: `Inter`

### Tokens

- Radius: `10 / 16 / 24`
- Shadow: `soft / elevated / glow`
- Spacing: base 4, ritmo principal em 8
- Container público: `max-w-7xl`
- Container interno: `max-w-[1440px]`

## Componentes-base

- Header institucional
- Footer simples
- Hero com CTA duplo
- Card de ação rápida
- Card editorial informativo
- Token tracking box
- Badge de status
- Timeline do caso
- Card de atendimento
- Card de validação
- Metric card
- Search and filter bar
- Sidebar interna
- Mobile sheet navigation
- Empty state
- Loading skeleton
- Toast de feedback

## Princípios de UX

- Um CTA principal por seção.
- Texto curto por bloco.
- Linguagem não técnica.
- Feedback imediato em ações assíncronas.
- Mobile-first na área pública.
- Alta legibilidade para pessoas com baixa familiaridade digital.
- Nunca depender apenas de cor para transmitir estado.

## Tradução de conteúdo do MD para páginas

- `abrir-mei`: o que é, requisitos, gratuidade, conta gov.br.
- `ja-sou-mei`: DAS, declaração anual, débitos, atualização cadastral, baixa.
- `golpes`: cobrança indevida, domínio oficial, DAS e mensagens falsas.
- `nota-fiscal`: quando emitir, diferença entre NF-e e NFS-e, NFS-e nacional.
- `beneficios`: previdência, carência, benefícios para dependentes, limites.

## Painéis internos

### Aluno

- `Fila`: casos `NEW` e `TRIAGED`.
- `Meus casos`: casos atribuídos ao aluno logado.
- `Caso`: dados do pedido, histórico, atendimentos, mudança de status e registro.
- `Horas`: lançamento e histórico com status de validação.

### Professor

- `Dashboard`: resumo de casos por status, validações pendentes, alunos com horas.
- `Validações`: lista única com filtro por alvo.
- `Caso`: visão completa, histórico e fechamento.

## Restrições importantes

- Não criar regras além do backend e do MD.
- Não prometer fluxo não suportado pela API.
- Não transformar a área interna em dashboard SaaS genérico azul.
- Não despejar o conteúdo técnico do MD como cartilha corrida.
