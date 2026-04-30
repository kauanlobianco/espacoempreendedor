// Curso "Atendimento ao Microempreendedor — Fundamentos para o Espaço Empreendedor"
// Conteúdo baseado em fontes oficiais do NotebookLM "Espaco Empreendedor":
// - Portal do Empreendedor (Gov.br)
// - Página oficial de Contratação de Empregado pelo MEI (Gov.br)
// - Mapeamento Normativo e Documental (Relatório Técnico de Fontes Oficiais)

export type CalloutType =
  | 'attention'
  | 'practice'
  | 'common-error'
  | 'attendance-tip'
  | 'escalation'
  | 'official-source';

export interface Callout {
  type: CalloutType;
  title: string;
  body: string;
}

export type ActivityType =
  | 'reflection'
  | 'true-false'
  | 'case-study'
  | 'checklist'
  | 'scenario';

export interface ModuleActivity {
  type: ActivityType;
  prompt: string;
  options?: string[];
  expectedAnswer?: string;
}

export interface FixationQuestion {
  question: string;
  answer: string;
}

export interface CourseModule {
  slug: string;
  order: number;
  title: string;
  description: string;
  objective: string;
  intro: string;
  content: string;
  callouts: Callout[];
  activity: ModuleActivity;
  summary: string[];
  fixationQuestions: FixationQuestion[];
  sources: string[];
  videoUrl?: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Course {
  slug: string;
  title: string;
  description: string;
  modules: CourseModule[];
  quiz: QuizQuestion[];
  passingScore: number;
}

export const MEI_COURSE: Course = {
  slug: 'atendimento-mei',
  title: 'Atendimento ao Microempreendedor — Fundamentos para o Espaço Empreendedor',
  description:
    'Capacitação institucional para alunos extensionistas atenderem microempreendedores com segurança técnica, base oficial e linguagem simples.',
  passingScore: 7,
  modules: [
    // ─── MÓDULO 1 ─────────────────────────────────────────────────────
    {
      slug: 'papel-extensionista',
      order: 1,
      title: 'O papel do Espaço Empreendedor e do aluno extensionista',
      description: 'Entenda o programa, a missão da extensão universitária e os limites do seu papel como orientador.',
      objective:
        'Ao final deste módulo, você será capaz de explicar o que é o Espaço Empreendedor, qual é o seu papel como aluno extensionista e quais são os limites éticos e técnicos da sua atuação.',
      intro:
        'O Espaço Empreendedor é mais do que um balcão de atendimento — é uma ponte entre a universidade e os microempreendedores que precisam de orientação confiável e gratuita. Este módulo apresenta o programa, sua missão e o seu papel dentro dele.',
      content: `## O que é o Espaço Empreendedor

O Espaço Empreendedor é um programa de extensão universitária que conecta alunos voluntários a microempreendedores individuais (MEIs) e pessoas que querem se formalizar. A premissa é simples: muitos cidadãos não conseguem pagar por consultoria especializada e acabam reféns de informações imprecisas, sites pagos desnecessários ou golpes.

A formalização como MEI é, antes de qualquer coisa, **um ato de cidadania econômica**. Permite que o trabalhador autônomo tenha CNPJ, emita notas fiscais e acesse direitos como aposentadoria e auxílio-doença. Ajudar alguém a entender e percorrer esse caminho com segurança é, portanto, um trabalho social — não apenas burocrático.

## Por que existe a extensão universitária

A universidade pública tem três pilares: ensino, pesquisa e extensão. A extensão é o pilar que devolve à sociedade o conhecimento construído dentro da universidade. Ao atender no Espaço Empreendedor, você está cumprindo esse papel: traduzir conhecimento técnico em orientação prática para quem precisa.

Você sai ganhando também. Atendimentos reais desenvolvem competências que nenhum estágio convencional oferece com a mesma intensidade: comunicação com público leigo, escuta ativa, raciocínio aplicado, responsabilidade pela informação que você passa.

## Os três limites do seu papel

Esta é a parte mais importante do módulo. O extensionista é um **orientador treinado**, não um profissional liberal. Três limites devem estar absolutamente claros desde o primeiro atendimento:

### 1. Limite técnico
Você não é contador, advogado ou consultor tributário. Sua função é orientar com base em fontes oficiais, indicar canais corretos e ajudar o empreendedor a entender o que está olhando. Não interprete leis, não faça cálculos tributários complexos, não dê pareceres jurídicos.

### 2. Limite ético
Nunca prometa resultados. Nunca assine documentos em nome do empreendedor. Nunca cobre por orientação. Nunca peça senha do gov.br ou dados bancários para "agilizar" um processo — essas senhas são pessoais e intransferíveis.

### 3. Limite operacional
Quando uma situação ultrapassar o que você consegue resolver com base nas fontes oficiais, **encaminhe para o professor orientador**. Não invente respostas para parecer útil. "Não sei, mas vou verificar" é uma resposta profissional. "Acho que é assim" é uma resposta perigosa.

## Como você se conecta com o resto da plataforma

Cada conversa que você tem com um empreendedor vira um **caso** no sistema. Esse caso tem um histórico, um responsável (você) e um professor orientador que acompanha. O registro do atendimento na plataforma não é burocracia: é o que permite continuidade caso outro extensionista precise atender o mesmo empreendedor depois.

A boa notícia é que você não está sozinho. A plataforma reúne ferramentas, registra histórico, calcula horas de extensão e gera relatórios institucionais que você pode apresentar como comprovação de atividade acadêmica.`,
      callouts: [
        {
          type: 'attention',
          title: 'Cuidado com promessas',
          body: 'Frases como "tenho certeza que vai resolver" ou "vai ficar tudo certo" criam expectativas que você não controla. Diga sempre o que está nas fontes oficiais e oriente o empreendedor a confirmar prazos e situação fiscal pelos canais oficiais.',
        },
        {
          type: 'attendance-tip',
          title: 'Como abrir um atendimento',
          body: 'Apresente-se: "Olá, sou aluno extensionista do Espaço Empreendedor da Universidade. Posso te ajudar com orientações gratuitas baseadas em fontes oficiais." Isso enquadra a conversa e protege ambos os lados.',
        },
        {
          type: 'escalation',
          title: 'Quando chamar o professor orientador',
          body: 'Sempre que: a dúvida envolver dívida ativa na PGFN, conflito trabalhista, fiscalização em curso, ou quando o empreendedor estiver emocionalmente abalado. Esses casos exigem suporte qualificado.',
        },
      ],
      activity: {
        type: 'scenario',
        prompt:
          'Um empreendedor pede que você acesse o gov.br dele com a senha que ele acabou de te passar para "deixar tudo regularizado". O que você faz?',
        expectedAnswer:
          'Recuso o acesso e explico que a senha do gov.br é pessoal e intransferível. Ofereço guiar o empreendedor passo a passo enquanto ele mesmo opera o sistema. Registro o ocorrido como observação no caso.',
      },
      summary: [
        'O Espaço Empreendedor conecta alunos extensionistas a MEIs e potenciais MEIs',
        'Seu papel é de orientador treinado, não de profissional liberal',
        'Três limites: técnico (não interprete leis), ético (não cobre, não prometa) e operacional (encaminhe quando necessário)',
        'Todo atendimento é registrado na plataforma — isso protege você, o empreendedor e a continuidade do programa',
        'A formalização é um ato de cidadania econômica, não apenas um procedimento burocrático',
      ],
      fixationQuestions: [
        {
          question: 'Qual é o papel principal do aluno extensionista no Espaço Empreendedor?',
          answer:
            'Orientar microempreendedores com base em fontes oficiais, em linguagem simples, dentro dos limites éticos e técnicos do papel — sem substituir contadores ou advogados.',
        },
        {
          question: 'Por que o aluno não deve dar pareceres jurídicos ou tributários complexos?',
          answer:
            'Porque ele não tem formação profissional para isso, e uma orientação errada pode causar prejuízo real ao empreendedor (multas, perda de benefícios, descaracterização do regime). O extensionista orienta com base no que está em fontes oficiais e encaminha o que ultrapassa esse escopo.',
        },
        {
          question: 'O que fazer quando você não sabe a resposta de uma dúvida?',
          answer:
            'Ser honesto: dizer que vai verificar, consultar as fontes oficiais (Portal do Empreendedor, e-CAC, Meu INSS) e, se necessário, encaminhar ao professor orientador. Inventar resposta é o pior cenário.',
        },
        {
          question: 'Por que registrar o atendimento na plataforma é importante?',
          answer:
            'Porque cria histórico do caso, permite que outro extensionista dê continuidade se necessário, protege juridicamente o aluno e a universidade, e gera comprovação de horas de extensão.',
        },
      ],
      sources: [
        'Portal do Empreendedor — Gov.br (https://www.gov.br/empresas-e-negocios/pt-br/empreendedor)',
        'Mapeamento Normativo e Documental para Capacitação no Atendimento ao MEI (Relatório Técnico)',
      ],
    },

    // ─── MÓDULO 2 ─────────────────────────────────────────────────────
    {
      slug: 'mei-do-zero',
      order: 2,
      title: 'MEI do zero: conceito, finalidade e enquadramento',
      description: 'Entenda juridicamente o que é o MEI, por que ele existe e quem pode (ou não pode) se formalizar.',
      objective:
        'Ao final deste módulo, você será capaz de explicar o conceito jurídico de MEI, seus critérios de elegibilidade, o limite de faturamento e os principais impedimentos para a formalização.',
      intro:
        'O MEI não é apenas uma "categoria de empresa". É um regime jurídico e tributário diferenciado, criado por lei para tirar milhões de trabalhadores autônomos da informalidade. Antes de ensinar como abrir, é preciso entender por que ele existe e quem ele atende.',
      videoUrl: 'https://www.youtube.com/embed/M3HnyXWPfoM',
      content: `## A origem jurídica do MEI

O Microempreendedor Individual foi instituído pela **Lei Complementar nº 128/2008**, que alterou a Lei Complementar nº 123/2006 (Lei Geral da Micro e Pequena Empresa). A finalidade explícita é **reduzir a burocracia e a carga tributária** para o pequeno empreendedor que trabalha de forma autônoma.

Em outras palavras, o legislador olhou para milhões de trabalhadores informais — manicures, pedreiros, costureiras, motoristas de aplicativo, vendedores ambulantes — e criou um regime simplificado para que pudessem ter CNPJ, emitir nota fiscal, contribuir para a previdência e acessar direitos sociais. O MEI é, portanto, **uma rampa de acesso à formalidade**.

## O que muda na vida do empreendedor

Quando alguém vira MEI, a pessoa física continua sendo a mesma. Mas surge uma pessoa jurídica simplificada conectada a ela, com um CNPJ próprio. Isso abre portas:

- Pode emitir nota fiscal (essencial para vender para empresas)
- Pode abrir conta bancária PJ
- Pode acessar crédito com condições melhores
- Tem direito a aposentadoria, auxílio-doença, salário-maternidade e outros benefícios do INSS
- Pode participar de licitações públicas
- Recolhe impostos por valor fixo e baixo, em uma única guia mensal (DAS)

## Critérios de elegibilidade — o checklist

Esta é a parte que você mais vai usar no atendimento. Para ser MEI, a pessoa precisa cumprir **todos** os requisitos abaixo:

### 1. Limite de faturamento: R$ 81.000/ano
Esse é o teto. Caminhoneiros têm limite especial de R$ 251.600/ano. Se a pessoa começar no meio do ano, o limite é proporcional aos meses (R$ 6.750/mês × meses ativos).

### 2. Atividade permitida (Anexo XI da Resolução CGSN nº 140/2018)
Nem toda atividade pode ser MEI. A lista oficial está consolidada na Resolução do Comitê Gestor do Simples Nacional. Profissões intelectuais regulamentadas (médico, advogado, engenheiro, dentista) **não podem** ser MEI — devem usar outros regimes do Simples Nacional.

### 3. Não ser sócio ou titular de outra empresa
A pessoa não pode ter participação em outra pessoa jurídica. Quem já tem empresa não pode abrir MEI.

### 4. Não ser servidor público federal em atividade
Servidores estaduais e municipais podem, dependendo da legislação local. Federais ativos, não.

### 5. Limite de 1 empregado
O MEI pode contratar **apenas 1 funcionário**, recebendo o salário mínimo nacional ou o piso da categoria. Mais que isso obriga a migrar de regime.

## O que pode dar errado: desenquadramento

Quando o empreendedor ultrapassa qualquer um desses limites, ele precisa migrar para outro enquadramento — geralmente Microempresa (ME) dentro do Simples Nacional. Esse processo se chama **desenquadramento**.

Sair do MEI por **sucesso** (faturar mais que R$ 81 mil) é uma boa notícia, mas exige cuidado: as obrigações fiscais e contábeis crescem. É hora de procurar um contador.

Sair do MEI por **descumprimento** (atividade não permitida, falsa declaração, atraso prolongado) pode gerar multas e cobrança retroativa de impostos. Por isso, a verificação inicial — antes mesmo da abertura — é tão importante.

## Quando o MEI não é a melhor opção

Em alguns casos, abrir MEI pode até prejudicar o empreendedor. Atenção:

- **Quem recebe BPC/LOAS** pode perder o benefício ao virar MEI (o programa exige renda familiar baixa).
- **Quem recebe seguro-desemprego** tem o pagamento suspenso quando abre CNPJ.
- **Aposentado por invalidez** pode ter o benefício revisto.
- **Profissionais regulamentados** precisam de outro enquadramento — Simples Nacional como ME, geralmente.

Sempre pergunte se a pessoa recebe algum benefício antes de orientar a abertura.`,
      callouts: [
        {
          type: 'official-source',
          title: 'Onde verificar a lista de atividades permitidas',
          body: 'A lista oficial está no Anexo XI da Resolução CGSN nº 140/2018. O Portal do Empreendedor (gov.br/mei) tem uma busca amigável: você digita a atividade e ele indica o CNAE correspondente. Sempre use essa busca antes de garantir que uma atividade pode ser MEI.',
        },
        {
          type: 'common-error',
          title: 'Erro comum: confundir faturamento com lucro',
          body: 'Faturamento é tudo que entrou (vendas brutas). Lucro é o que sobra depois de despesas. O limite de R$ 81.000 é de faturamento — então mesmo que a pessoa tenha tido prejuízo no ano, se ela vendeu mais de R$ 81 mil, ultrapassou o teto.',
        },
        {
          type: 'attention',
          title: 'Pessoas recebendo benefícios',
          body: 'Antes de orientar a formalização, pergunte: "Você recebe BPC, seguro-desemprego, aposentadoria por invalidez ou outro benefício do governo?" Se a resposta for sim, oriente a verificar com o INSS ou ao próprio órgão pagador antes de abrir o MEI.',
        },
        {
          type: 'practice',
          title: 'Na prática',
          body: 'Maria é manicure e fatura cerca de R$ 3.000/mês (R$ 36 mil/ano). Ela está abaixo do teto, manicure é atividade permitida, ela não tem outra empresa. Pode abrir MEI. Já João, advogado, fatura R$ 4.000/mês — mesmo abaixo do teto, advogado não pode ser MEI. Deve procurar contador para abrir como ME no Simples.',
        },
      ],
      activity: {
        type: 'true-false',
        prompt:
          'Um empreendedor te pergunta: "Sou bombeiro civil aposentado e estou recebendo aposentadoria por invalidez. Posso abrir MEI para vender bolos por encomenda?" Marque V ou F e justifique.',
        options: [
          'Verdadeiro: aposentado por invalidez sempre pode abrir MEI',
          'Falso: pode haver impacto na aposentadoria — precisa verificar com o INSS antes',
        ],
        expectedAnswer:
          'Falso. A aposentadoria por invalidez pressupõe incapacidade total para o trabalho. Abrir MEI e exercer atividade econômica pode levar à revisão do benefício. Oriente a confirmar com o INSS antes de formalizar.',
      },
      summary: [
        'MEI foi criado pela LC 128/2008 para tirar trabalhadores autônomos da informalidade',
        'Limite de faturamento: R$ 81.000/ano (R$ 251.600 para caminhoneiros), proporcional ao mês de abertura',
        'Atividades permitidas: lista do Anexo XI da Resolução CGSN nº 140/2018',
        'Restrições: não pode ser sócio de outra empresa, servidor público federal ativo ou exercer profissão regulamentada',
        'Pode contratar apenas 1 empregado, com salário mínimo ou piso da categoria',
        'Beneficiários do INSS, BPC ou seguro-desemprego precisam verificar impactos antes de formalizar',
      ],
      fixationQuestions: [
        {
          question: 'Qual é o limite anual de faturamento de um MEI em atividade geral?',
          answer:
            'R$ 81.000,00 por ano. Para caminhoneiros, o limite é R$ 251.600. Quando a abertura é no meio do ano, o limite é proporcional aos meses ativos.',
        },
        {
          question: 'Onde está a lista oficial de atividades que podem ser MEI?',
          answer:
            'No Anexo XI da Resolução CGSN nº 140/2018. O Portal do Empreendedor (gov.br/mei) tem busca amigável que indica o CNAE correto para cada atividade.',
        },
        {
          question: 'Um advogado pode abrir MEI?',
          answer:
            'Não. Advocacia é profissão intelectual regulamentada. Profissionais regulamentados precisam usar outro regime (ME no Simples Nacional, por exemplo) e devem ser orientados a procurar um contador.',
        },
        {
          question:
            'Por que é importante perguntar sobre benefícios sociais antes de orientar a abertura de MEI?',
          answer:
            'Porque benefícios como BPC/LOAS, seguro-desemprego e aposentadoria por invalidez podem ser suspensos ou revistos quando a pessoa abre CNPJ. O empreendedor pode acabar perdendo a renda atual sem compensação.',
        },
        {
          question: 'O que é desenquadramento do MEI?',
          answer:
            'É o processo de migração para outro regime tributário, geralmente quando o empreendedor ultrapassa o teto de R$ 81 mil ou começa a exercer atividade não permitida. Pode ser por sucesso (faturamento alto) ou por descumprimento (multas envolvidas).',
        },
      ],
      sources: [
        'Portal do Empreendedor — Gov.br (https://www.gov.br/empresas-e-negocios/pt-br/empreendedor)',
        'Lei Complementar nº 128/2008 e LC nº 123/2006',
        'Resolução CGSN nº 140/2018, Anexo XI (atividades permitidas)',
        'Mapeamento Normativo e Documental — Relatório Técnico',
      ],
    },

    // ─── MÓDULO 3 ─────────────────────────────────────────────────────
    {
      slug: 'abrir-mei-seguro',
      order: 3,
      title: 'Como abrir MEI com segurança',
      description: 'Passo a passo oficial da formalização: pré-requisitos, conta gov.br, documentação, CCMEI e cuidados para evitar golpes.',
      objective:
        'Ao final deste módulo, você será capaz de orientar a abertura de MEI passo a passo pelo canal oficial, identificar pré-requisitos da conta gov.br, ler o CCMEI e alertar sobre serviços pagos desnecessários.',
      intro:
        'A formalização do MEI é gratuita, digital e leva poucos minutos quando feita pelo canal correto. Mas é também o momento mais visado por golpistas, justamente porque envolve gente leiga em sistemas digitais. Este módulo ensina o caminho seguro.',
      content: `## O canal oficial é único: gov.br/mei

A formalização do MEI é feita exclusivamente pelo **Portal do Empreendedor** (gov.br/mei), integrado à **Redesim** (Rede Nacional para a Simplificação do Registro e da Legalização de Empresas e Negócios). Qualquer outro site que cobre por esse serviço está vendendo algo desnecessário.

Anote essa frase para usar com empreendedores: **"Abrir MEI é sempre gratuito e leva minutos pelo gov.br/mei. Qualquer cobrança é serviço privado que você não é obrigado a contratar."**

## Pré-requisito principal: conta gov.br

A conta gov.br é o pilar de identidade digital do cidadão brasileiro. Ela tem três níveis:

| Nível | Como se obtém | Acesso |
|-------|---------------|--------|
| **Bronze** | Apenas com CPF e dados básicos | Serviços simples |
| **Prata** | Validação biométrica via app, ou bancos credenciados | Maioria dos serviços do governo |
| **Ouro** | Reconhecimento facial via app + biometria do TSE | Acesso mais amplo |

**Para abrir MEI é exigido nível Prata ou Ouro**. Se o empreendedor estiver no nível Bronze, ele precisa primeiro elevar o nível. Existem duas formas:

1. **Pelo aplicativo gov.br** — tirando foto do documento e fazendo selfie de validação
2. **Pelo Internet Banking** de bancos credenciados (Caixa, Banco do Brasil, Itaú, Bradesco, Santander, entre outros)

Saber explicar essa parte é metade do atendimento. Muitas formalizações travam aqui — não no MEI em si, mas no degrau anterior da conta gov.br.

## Documentos e informações necessárias

Antes de iniciar o cadastro, peça ao empreendedor que tenha em mãos:

- **CPF** (regular na Receita Federal — sem pendências)
- **RG** ou outro documento de identidade
- **Título de Eleitor** OU número do recibo da última declaração de IRPF
- **Endereço completo** da residência (que pode ser também a sede da empresa)
- **Telefone e e-mail** atualizados
- **Atividade econômica** (CNAE) — pesquise antes no portal

## Passo a passo da formalização

1. Acesse **gov.br/mei**
2. Clique em **"Quero ser MEI"**
3. Faça login com a conta gov.br (nível Prata/Ouro)
4. Confirme os dados pessoais (puxados automaticamente do gov.br)
5. Informe a **atividade principal** e até 15 atividades secundárias (CNAE)
6. Informe o **endereço comercial** (pode ser o residencial)
7. Defina o **nome empresarial** (geralmente "Nome do titular + CNPJ")
8. Aceite os termos e confirme

O CNPJ é gerado **na hora**. Junto, o sistema emite o **CCMEI — Certificado da Condição de Microempreendedor Individual**.

## O CCMEI e como lê-lo

O CCMEI é o documento que comprova a condição de MEI. Ele equivale, para efeitos práticos, ao "contrato social" e à inscrição estadual/municipal. Contém:

- **CNPJ** da empresa
- **Razão social** (geralmente o nome civil + sequência)
- **Nome fantasia** (se informado)
- **Atividades CNAE** (principal e secundárias)
- **Endereço** comercial
- **Código de autenticidade** — usado para verificar se o documento é genuíno no Portal do Empreendedor

O CCMEI pode ser baixado a qualquer momento no portal. Ele é **gratuito** e não precisa ser autenticado em cartório para a maioria dos usos. Vale como prova da inscrição em bancos, prefeituras e empresas contratantes.

## Consulta de viabilidade municipal

Embora o MEI tenha **dispensa de alvará** prévio em muitos casos (regra trazida pela Lei da Liberdade Econômica), a fiscalização municipal continua existindo. Antes de formalizar, peça ao empreendedor para verificar com a prefeitura:

- Se a atividade pretendida é permitida no endereço (uso do solo)
- Se há exigências sanitárias específicas (alimentação, saúde, beleza)
- Se há obrigatoriedade de licenças complementares (Bombeiros, Vigilância Sanitária)

Esse passo evita que o empreendedor abra o MEI e, dois meses depois, seja interditado pela prefeitura.

## Os golpes mais comuns nessa etapa

- **Sites pagos** com nomes parecidos ("MEI Fácil", "Abertura de MEI Online") cobrando R$ 99 a R$ 500 por algo gratuito
- **Anúncios patrocinados no Google** que aparecem antes do site oficial — sempre confira se a URL termina em **.gov.br**
- **"Consultores"** que oferecem "agilizar" a abertura — desnecessário
- **Pedidos de senha do gov.br** "para te ajudar" — nunca compartilhar`,
      callouts: [
        {
          type: 'official-source',
          title: 'Portal correto = gov.br/mei',
          body: 'O domínio termina obrigatoriamente em .gov.br. Se o site estiver em .com, .net ou outro domínio, NÃO é oficial. Ensine o empreendedor a verificar isso antes de qualquer cadastro.',
        },
        {
          type: 'common-error',
          title: 'Erro comum: tentar abrir antes de elevar a conta gov.br',
          body: 'Muitos empreendedores entram no portal, tentam logar com conta nível Bronze e travam na tela de "nível insuficiente". Antes de orientar a abertura, verifique o nível da conta. Se for Bronze, oriente a elevar primeiro.',
        },
        {
          type: 'attendance-tip',
          title: 'Como guiar passo a passo',
          body: 'Sente-se ao lado (ou compartilhe a tela) e peça que o empreendedor opere o sistema enquanto você narra: "Agora clique em Quero ser MEI...". Você ensina o caminho. Da próxima vez, ele fará sozinho.',
        },
        {
          type: 'attention',
          title: 'Nunca peça nem aceite a senha',
          body: 'A senha do gov.br é pessoal. Não acesse a conta do empreendedor mesmo que ele insista. Se ele tiver dificuldade, oriente vocalmente; não opere o sistema por ele.',
        },
      ],
      activity: {
        type: 'checklist',
        prompt:
          'Antes de iniciar a formalização de MEI com um empreendedor, marque o que precisa estar pronto:',
        options: [
          'CPF regular na Receita Federal',
          'Conta gov.br nível Prata ou Ouro',
          'RG e Título de Eleitor (ou recibo IRPF)',
          'Endereço comercial definido',
          'CNAE da atividade pesquisado no portal',
          'Verificação de benefícios sociais (BPC, seguro-desemprego, aposentadoria)',
          'Verificação de viabilidade junto à prefeitura, se aplicável',
        ],
        expectedAnswer: 'Todos os itens acima formam o checklist mínimo para uma abertura segura.',
      },
      summary: [
        'A abertura é gratuita e exclusiva pelo gov.br/mei (Portal do Empreendedor + Redesim)',
        'Exige conta gov.br nível Prata ou Ouro — Bronze não funciona',
        'Documentação: CPF regular, RG, Título de Eleitor (ou recibo IRPF), endereço, CNAE',
        'O CCMEI é gerado na hora e equivale ao contrato social',
        'Verifique benefícios sociais e viabilidade municipal antes de formalizar',
        'Qualquer cobrança para abrir MEI é serviço privado desnecessário',
      ],
      fixationQuestions: [
        {
          question: 'Qual é o domínio do site oficial para abertura de MEI?',
          answer:
            'gov.br/mei (Portal do Empreendedor). O domínio precisa terminar em .gov.br. Sites em .com ou outros domínios não são oficiais, mesmo que pareçam.',
        },
        {
          question: 'Qual é o nível mínimo da conta gov.br para abrir MEI?',
          answer:
            'Nível Prata. O nível Bronze não permite a formalização. Para subir de nível, o empreendedor pode usar o app gov.br (validação biométrica) ou Internet Banking de bancos credenciados.',
        },
        {
          question: 'O que é o CCMEI?',
          answer:
            'Certificado da Condição de Microempreendedor Individual. É o documento gerado na formalização que comprova a inscrição e equivale, na prática, ao contrato social. Contém CNPJ, atividades, endereço e código de autenticidade.',
        },
        {
          question: 'Por que verificar a viabilidade municipal antes de abrir?',
          answer:
            'Porque mesmo com dispensa de alvará prévio, a prefeitura pode exigir licenças sanitárias, Bombeiros, ou pode ter restrição de uso do solo. Verificar antes evita que o MEI seja aberto e depois interditado.',
        },
      ],
      sources: [
        'Portal do Empreendedor — Gov.br (gov.br/mei)',
        'Redesim — Rede Nacional para Simplificação do Registro de Empresas',
        'Lei da Liberdade Econômica (Lei nº 13.874/2019) — dispensa de alvará',
        'Mapeamento Normativo e Documental — Relatório Técnico',
      ],
    },

    // ─── MÓDULO 4 ─────────────────────────────────────────────────────
    {
      slug: 'obrigacoes-mei',
      order: 4,
      title: 'Obrigações básicas do MEI: DAS, declaração anual e organização',
      description: 'O que o MEI precisa cumprir mensalmente e anualmente para se manter regular: DAS, DASN-SIMEI e o Relatório Mensal.',
      objective:
        'Ao final deste módulo, você será capaz de explicar as três obrigações fundamentais do MEI (DAS, DASN-SIMEI, Relatório Mensal), seus prazos, valores e consequências do descumprimento.',
      intro:
        'Ter o CNPJ é só o começo. A maior parte das dúvidas que chegam ao Espaço Empreendedor são sobre o que vem depois: o que pagar, quando pagar, que declaração entregar, o que fazer se atrasou. Este módulo te equipa para responder com segurança.',
      videoUrl: 'https://www.youtube.com/embed/BvUhZk6YmRY',
      content: `## A regra de ouro: três obrigações

Toda a rotina do MEI gira em torno de três obrigações:

1. **DAS — Documento de Arrecadação do Simples Nacional** (mensal)
2. **DASN-SIMEI — Declaração Anual de Faturamento** (anual)
3. **Relatório Mensal de Receitas Brutas** (mensal, para controle interno)

Se o empreendedor cumprir essas três coisas, ele está em dia. Se descumprir qualquer uma, abre porta para multas, perda de benefícios e até cancelamento do CNPJ.

## DAS — a guia mensal única

O DAS é a guia de recolhimento que **unifica todos os tributos do MEI** em um único pagamento. Em vez de pagar INSS para o governo federal, ICMS para o estado e ISS para o município separadamente, o MEI paga tudo junto, em valor fixo.

### O que o DAS contém

| Tributo | Valor | Quem se aplica |
|---------|-------|----------------|
| INSS (5% do salário mínimo) | Variável conforme SM vigente | Todos os MEIs |
| ICMS (R$ 1,00 fixo) | R$ 1,00 | Comércio e Indústria |
| ISS (R$ 5,00 fixo) | R$ 5,00 | Serviços |

Em 2026, com o salário mínimo vigente, o valor mensal aproximado fica em torno de **R$ 80–85 reais**, dependendo da atividade. Quem é prestador de serviços paga um pouco mais (INSS + ISS), quem é comerciante paga um pouco menos (INSS + ICMS).

### O vencimento

**Sempre dia 20 de cada mês.** Se o dia 20 cair em fim de semana ou feriado, o vencimento é prorrogado para o próximo dia útil.

### Como gerar e pagar

Pelo Portal do Empreendedor (gov.br/mei) ou pelo aplicativo **MEI** (Android/iOS), o empreendedor pode:

- Gerar o boleto do mês corrente e meses anteriores
- Pagar via PIX (modalidade incentivada pelo governo)
- Configurar **débito automático** em conta corrente
- Imprimir guias para pagamento em lotérica ou banco

### Consequências do atraso

Atraso no DAS gera:

- **Multa de mora**: 0,33% por dia, limitada a 20%
- **Juros pela taxa Selic** sobre o valor em atraso
- **Perda de carência previdenciária** dos meses não pagos (afeta aposentadoria, auxílio-doença etc.)
- **Risco de cancelamento do CNPJ** após 12 meses consecutivos sem pagamento e sem regularização

## DASN-SIMEI — a declaração anual

Uma vez por ano, todo MEI precisa enviar a **Declaração Anual de Faturamento do MEI (DASN-SIMEI)**, informando o quanto faturou bruto no ano anterior.

### Quando entregar

**Até 31 de maio** de cada ano, com dados do ano anterior. Exemplo: a declaração de 2026 cobre o faturamento de 2025.

### Onde entregar

No Portal do Empreendedor (gov.br/mei), seção "Declaração Anual".

### Mesmo sem faturamento, é obrigatória

Se o MEI não faturou nada no ano (ficou parado), ainda assim precisa entregar a DASN-SIMEI **com faturamento zero**. A não-entrega impede a geração do DAS do ano seguinte e coloca o CNPJ em situação de irregularidade.

### Multa por atraso

Mínima de **R$ 50,00** ou 2% ao mês sobre os tributos declarados, o que for maior. Se a entrega for feita antes do empreendedor ser autuado, a multa cai pela metade.

## Relatório Mensal de Receitas Brutas

Este é o documento **mais ignorado** pelos MEIs e o que mais aparece em fiscalizações. O empreendedor precisa preencher um relatório simples, mês a mês, anotando todas as receitas recebidas.

### Para que serve

- **Não é entregue à Receita Federal**, mas precisa ser guardado
- Serve como base para preencher a DASN-SIMEI no ano seguinte
- É exigido em caso de fiscalização
- Deve ser mantido **por 5 anos**

### Onde encontrar o modelo

O Portal do Empreendedor disponibiliza um **modelo gratuito de Relatório Mensal de Receitas Brutas**. Pode ser preenchido no papel, em planilha simples, ou em apps de gestão. O importante é a consistência.

## Sintetizando: rotina mensal do MEI

Aqui está o que um MEI bem organizado faz:

1. **Todo dia 20**: paga o DAS (ou tem débito automático)
2. **Todo final de mês**: anota as vendas/serviços do mês no Relatório Mensal
3. **Em maio do ano seguinte**: usa os relatórios mensais para preencher a DASN-SIMEI
4. **Guarda tudo por 5 anos**: relatórios, comprovantes, notas fiscais emitidas

Esse ritmo é simples, mas exige disciplina. Boa parte do trabalho do extensionista é construir esse hábito junto com o empreendedor.`,
      callouts: [
        {
          type: 'common-error',
          title: 'Erro comum: confundir DAS com Nota Fiscal',
          body: 'O DAS é a guia que paga os impostos do MEI — valor fixo, não importa quanto a pessoa fatura (desde que dentro do teto de R$ 81 mil). A nota fiscal documenta a venda. Pagar o DAS NÃO emite nota fiscal automaticamente. São coisas separadas.',
        },
        {
          type: 'attention',
          title: 'Não entregou DASN-SIMEI? Não consegue pagar o DAS',
          body: 'O sistema bloqueia a geração do DAS para quem está com a declaração anual atrasada. Se o empreendedor reclamar que "não consegue gerar o boleto", a primeira coisa a verificar é se a DASN-SIMEI do ano anterior foi entregue.',
        },
        {
          type: 'practice',
          title: 'Na prática',
          body: 'Carlos abriu MEI em março de 2025 e faturou R$ 30.000 no ano. Em 2026, ele precisa: (1) declarar esses R$ 30.000 na DASN-SIMEI até 31 de maio; (2) continuar pagando o DAS todo dia 20; (3) começar a anotar as receitas de 2026 no Relatório Mensal para usar na declaração de 2027.',
        },
        {
          type: 'attendance-tip',
          title: 'Configure o débito automático',
          body: 'Para quem esquece direto de pagar o DAS, oriente a configurar débito automático no app MEI. Isso elimina o risco de atraso e mantém a regularidade previdenciária preservada.',
        },
        {
          type: 'official-source',
          title: 'Onde consultar',
          body: 'Portal do Empreendedor (gov.br/mei) → "Pagamento de Contribuição Mensal" para o DAS, e "Declaração Anual" para a DASN-SIMEI. App MEI nas lojas oficiais (Google Play e App Store).',
        },
      ],
      activity: {
        type: 'case-study',
        prompt:
          'Joana abriu MEI em janeiro de 2024 e pagou todos os DAS em dia. Em maio de 2025 ela esqueceu de entregar a DASN-SIMEI. Em julho de 2025, ela tenta pagar o DAS de julho e o sistema não gera o boleto. O que aconteceu e como você orienta?',
        expectedAnswer:
          'O sistema bloqueou a geração do DAS porque a DASN-SIMEI 2024 (com prazo até 31/05/2025) não foi entregue. Oriente Joana a entrar no Portal do Empreendedor, ir em "Declaração Anual", entregar a DASN-SIMEI atrasada (vai gerar multa mínima de R$ 50). Após a entrega, o sistema libera a geração do DAS imediatamente.',
      },
      summary: [
        'Três obrigações: DAS (mensal), DASN-SIMEI (anual, até 31/maio) e Relatório Mensal (controle interno)',
        'DAS = guia única que une INSS + ICMS/ISS, com vencimento dia 20',
        'Atraso no DAS perde carência previdenciária e, em 12 meses, pode cancelar o CNPJ',
        'DASN-SIMEI é obrigatória mesmo com faturamento zero',
        'Relatório Mensal não é entregue, mas deve ser guardado por 5 anos',
        'Não entregar DASN-SIMEI bloqueia geração do DAS',
      ],
      fixationQuestions: [
        {
          question: 'Qual é o vencimento do DAS?',
          answer: 'Sempre dia 20 de cada mês. Se cair em fim de semana ou feriado, prorroga para o próximo dia útil.',
        },
        {
          question: 'O que acontece com a aposentadoria do MEI que atrasa o DAS por vários meses?',
          answer:
            'Os meses não pagos não contam para carência previdenciária. Isso afeta o cálculo de aposentadoria, auxílio-doença e outros benefícios. Mesmo se o MEI pagar atrasado depois, a contagem dos meses pagos em atraso pode não ser totalmente recuperada para fins previdenciários.',
        },
        {
          question: 'Qual é o prazo da DASN-SIMEI?',
          answer:
            'Até 31 de maio de cada ano, com dados do faturamento bruto do ano anterior. É obrigatória mesmo se o MEI não faturou nada (declaração com valor zero).',
        },
        {
          question: 'O Relatório Mensal de Receitas precisa ser entregue à Receita Federal?',
          answer:
            'Não. Ele é de controle interno do empreendedor. Mas precisa ser preenchido todo mês, guardado por 5 anos e serve de base para preencher a DASN-SIMEI no ano seguinte. É exigido em caso de fiscalização.',
        },
        {
          question: 'Pagar o DAS emite a nota fiscal?',
          answer:
            'Não. DAS e nota fiscal são coisas distintas. O DAS é a guia que paga os impostos. A nota fiscal documenta a venda ao cliente. Quando obrigatória (venda para PJ), a nota é emitida em sistema separado.',
        },
      ],
      sources: [
        'Portal do Empreendedor — Gov.br (gov.br/mei)',
        'Portal do Simples Nacional (Receita Federal)',
        'Resolução CGSN nº 140/2018 — regras do regime',
        'Mapeamento Normativo e Documental — Relatório Técnico',
      ],
    },

    // ─── MÓDULO 5 ─────────────────────────────────────────────────────
    {
      slug: 'nota-fiscal-nfse',
      order: 5,
      title: 'Nota fiscal, NFS-e e a diferença entre nota e guia de pagamento',
      description: 'Quando o MEI emite nota fiscal, qual sistema usar (NFS-e nacional, NF-e estadual) e como diferenciar nota de guia.',
      objective:
        'Ao final deste módulo, você será capaz de explicar quando o MEI é obrigado a emitir nota fiscal, qual tipo de nota usar, como acessar o Portal Nacional da NFS-e e diferenciar nota fiscal de guia de pagamento.',
      intro:
        'Em 2023 o sistema de nota fiscal de serviços passou por uma mudança grande: o Portal Nacional da NFS-e centralizou a emissão em um sistema federal único. Isso facilitou para o MEI, mas também gerou confusão durante a transição. Este módulo te ensina a navegar nessa nova realidade.',
      content: `## A regra básica: quando o MEI emite nota?

A regra é simples e está no Portal do Empreendedor:

- **Para pessoa jurídica (empresas, órgãos públicos)** → emissão **obrigatória**
- **Para pessoa física (consumidor final)** → emissão **dispensada**, salvo se o cliente pedir

Ou seja: quando a Maria-manicure atende a Dona Joana em casa, ela **não precisa** emitir nota. Mas se a Maria for prestar serviço de manicure num evento corporativo da Empresa X, ela **precisa** emitir nota para a empresa.

## Os dois tipos de nota fiscal do MEI

### NFS-e — Nota Fiscal de Serviços eletrônica
Para quem **presta serviços**: cabeleireiro, designer, eletricista, encanador, professor particular, programador autônomo, etc.

Desde 2023, a emissão é centralizada no **Portal Nacional da NFS-e**, um sistema federal único. Antes, cada município tinha seu próprio portal — agora a maioria adere ao padrão nacional.

**Onde acessar:**
- Web: **www.nfse.gov.br**
- App **NFSe Mobile** (Google Play e App Store)
- Acesso com conta gov.br

**Importante:** alguns municípios ainda mantêm sistemas próprios (geralmente capitais e cidades grandes). O Portal Nacional indica se o município do MEI já aderiu ou se ele precisa usar o sistema da prefeitura local.

### NF-e — Nota Fiscal Eletrônica (mercadorias)
Para quem **vende produtos**: roupas, alimentos, artesanato, produtos eletrônicos, etc.

A emissão é feita pelo sistema da **SEFAZ estadual** do estado do MEI. Cada estado tem sua interface, mas o padrão técnico é nacional. Em alguns estados pode ser exigido **certificado digital**.

### Nota Fiscal Avulsa
Para casos pontuais, quando o MEI não tem sistema próprio. Emitida pelos portais das Secretarias Estaduais de Fazenda. Útil quando o MEI vende eventualmente para uma empresa.

## Diferença essencial: nota fiscal NÃO é guia de pagamento

Esse é um dos erros mais frequentes do MEI iniciante. Vamos deixar claro:

| | DAS | Nota Fiscal |
|--|------|-------------|
| O que é | Guia de pagamento de impostos | Documento que registra a venda |
| Quem paga | O MEI paga ao governo | O cliente paga ao MEI |
| Frequência | Mensal, valor fixo | A cada venda obrigatória |
| Onde gerar | Portal do Empreendedor | Portal Nacional NFS-e ou SEFAZ |
| Quanto custa | R$ 80–85 mensal | Não custa nada gerar |

**O DAS é fixo** — não importa se o MEI faturou R$ 1.000 ou R$ 7.000 no mês. **A nota fiscal é por venda** e o valor é o da venda.

Muitos MEIs perguntam: "Se eu emitir uma nota de R$ 5 mil, vou pagar mais imposto?" — A resposta é **não**. O DAS continua o mesmo. A nota só importa para: (1) o cliente comprovar despesa, (2) o teto anual de R$ 81 mil ser controlado.

## Acesso ao Portal Nacional da NFS-e — passo a passo

1. Acesse **www.nfse.gov.br**
2. Clique em **"Acesso pelo gov.br"**
3. Faça login com conta gov.br (nível Prata ou Ouro)
4. Aceite o termo de adesão
5. Preencha os dados de prestador (já vêm puxados pelo CNPJ)
6. Clique em **"Emitir NFS-e"**
7. Informe os dados do tomador (cliente), valor, descrição do serviço
8. Confirme — a nota é gerada com chave de acesso e pode ser impressa ou enviada por e-mail

## Cuidados na emissão

- **Verificar o tomador**: CNPJ ou CPF correto. Erro aqui invalida a nota para uso fiscal.
- **Descrição clara do serviço**: "Corte de cabelo masculino" é melhor que apenas "Serviço".
- **Valor real**: nunca emitir por valor diferente do efetivamente cobrado.
- **Cancelamento**: notas têm prazo para cancelamento (geralmente 24h a 7 dias). Se errou e passou o prazo, a alternativa é emitir uma nota de "carta de correção" ou nota substituta, conforme as regras do município.

## E se o município não aderiu ao Portal Nacional?

Algumas capitais (São Paulo, Rio de Janeiro, etc.) ainda têm sistemas próprios — Nota Carioca, NFS-e Paulistana, e outros. Nesses casos, o MEI precisa:

1. Cadastrar-se no portal da prefeitura
2. Solicitar autorização de emissão (geralmente automática para MEI)
3. Emitir as notas pelo sistema municipal

Sempre oriente o empreendedor a procurar a página de **"Notas Fiscais Eletrônicas"** no site da prefeitura. Se houver dificuldade, o canal oficial pode ajudar.`,
      callouts: [
        {
          type: 'common-error',
          title: 'Erro comum: achar que pagar DAS substitui emitir nota',
          body: 'O DAS recolhe os impostos. A nota fiscal documenta a venda. São obrigações independentes. Para pessoa física, a nota é dispensada. Para pessoa jurídica, é obrigatória — independentemente do DAS estar pago ou não.',
        },
        {
          type: 'attention',
          title: 'Cuidado com municípios que ainda não aderiram',
          body: 'Antes de orientar a emissão pelo Portal Nacional, verifique se o município do MEI aderiu. Em algumas capitais (SP, RJ), ainda se usa o sistema municipal. O próprio Portal Nacional informa quando você acessa.',
        },
        {
          type: 'practice',
          title: 'Na prática',
          body: 'Pedro é eletricista MEI em Niterói (RJ). Ele atende Maria, particular, em casa: NÃO precisa emitir nota. No mesmo dia, ele faz instalação na loja XYZ Ltda: precisa emitir NFS-e. Como Niterói aderiu ao Portal Nacional, ele acessa nfse.gov.br, faz login com gov.br e emite a nota para o CNPJ da loja.',
        },
        {
          type: 'attendance-tip',
          title: 'Como ensinar a primeira emissão',
          body: 'Sente junto, narre o passo a passo enquanto o empreendedor opera. Ensine a verificar tomador, descrição clara e valor correto. Faça uma nota de teste se possível (pode ser cancelada em 24h). Da próxima venda, ele emite sozinho.',
        },
        {
          type: 'official-source',
          title: 'Canais oficiais',
          body: 'Portal Nacional NFS-e: www.nfse.gov.br | App NFSe Mobile (lojas oficiais) | Para mercadorias: SEFAZ do estado do empreendedor.',
        },
      ],
      activity: {
        type: 'true-false',
        prompt: 'Marque V ou F: "Se eu emitir nota fiscal de R$ 8 mil em um mês, meu DAS vai aumentar nesse mês."',
        options: ['Verdadeiro', 'Falso'],
        expectedAnswer:
          'Falso. O DAS é fixo. O valor da nota não influencia o DAS do mês. O que importa é o faturamento ANUAL não ultrapassar R$ 81 mil. Se o MEI emitir R$ 8 mil em um mês e R$ 6 mil no próximo, o DAS continua o mesmo nos dois meses.',
      },
      summary: [
        'MEI é obrigado a emitir nota só para pessoa jurídica; para pessoa física é dispensado',
        'Serviços: NFS-e pelo Portal Nacional (nfse.gov.br) — desde 2023, sistema federal unificado',
        'Mercadorias: NF-e pela SEFAZ estadual',
        'DAS e nota fiscal são obrigações distintas e independentes',
        'O valor da nota não influencia o valor do DAS — DAS é fixo',
        'Alguns municípios ainda mantêm sistema próprio (SP, RJ); verificar antes',
      ],
      fixationQuestions: [
        {
          question: 'O MEI é obrigado a emitir nota fiscal para venda a pessoa física?',
          answer:
            'Não, salvo se o cliente exigir. A obrigatoriedade existe quando o cliente é pessoa jurídica (empresa, órgão público).',
        },
        {
          question: 'Onde o MEI prestador de serviços emite a NFS-e em 2026?',
          answer:
            'No Portal Nacional da NFS-e (www.nfse.gov.br) ou pelo app NFSe Mobile, com acesso via conta gov.br. Alguns municípios grandes ainda mantêm sistema próprio.',
        },
        {
          question: 'Por que o valor da nota fiscal não muda o valor do DAS?',
          answer:
            'Porque o DAS é fixo e calculado sobre o salário mínimo, não sobre o faturamento. O que o faturamento controla é apenas o teto anual de R$ 81 mil — ultrapassar esse teto leva ao desenquadramento.',
        },
        {
          question: 'Qual é a diferença prática entre DAS e nota fiscal?',
          answer:
            'DAS é a guia que o MEI paga ao governo (impostos), todo mês, valor fixo. Nota fiscal é o documento que registra a venda — o cliente paga o MEI e a nota comprova a operação. São fluxos opostos e independentes.',
        },
      ],
      sources: [
        'Portal do Empreendedor — Gov.br',
        'Portal Nacional da NFS-e (www.nfse.gov.br)',
        'Manual da NFS-e Padrão Nacional — Receita Federal',
        'Mapeamento Normativo e Documental — Relatório Técnico',
      ],
    },

    // ─── MÓDULO 6 ─────────────────────────────────────────────────────
    {
      slug: 'debitos-regularizacao',
      order: 6,
      title: 'Débitos, atraso, parcelamento e regularização',
      description: 'Como ajudar o MEI a sair do vermelho: parcelamento Simples, Dívida Ativa, portal Regularize e impactos no CPF.',
      objective:
        'Ao final deste módulo, você será capaz de explicar os diferentes estágios da dívida do MEI, como consultar e parcelar débitos, e quando o caso passa para a PGFN e exige escalonamento.',
      intro:
        'Boa parte dos atendimentos no Espaço Empreendedor envolve débitos em aberto. Saber em que estágio a dívida está, qual o canal correto e o que pode ser feito é o que separa um atendimento útil de uma orientação errada que piora a situação. Este é o módulo mais técnico — leia com calma.',
      content: `## Os três estágios da dívida do MEI

Quando o MEI atrasa o DAS, a dívida passa por estágios. Saber identificar em qual estágio o caso está é fundamental:

### Estágio 1 — Atraso recente (Receita Federal)
DAS atrasado de 1 a alguns meses, ainda na Receita Federal. Pode ser pago com juros e multa pelo próprio Portal do Empreendedor. Sem complicação maior.

### Estágio 2 — Acumulado na Receita
Vários meses atrasados, dívida ainda na Receita Federal. Pode ser **parcelada** pelo Portal do Simples Nacional. Acesso via gov.br.

### Estágio 3 — Dívida Ativa (PGFN)
Após esgotar prazos administrativos sem pagamento ou parcelamento, a dívida é **inscrita em Dívida Ativa da União** e o controle passa para a **PGFN — Procuradoria-Geral da Fazenda Nacional**. A regularização passa a ser feita pelo portal **Regularize**. Aqui a coisa fica mais séria — afeta CPF, pode gerar protesto, execução fiscal.

## Como consultar a situação fiscal

Existem dois caminhos principais:

### Pelo Portal do Empreendedor
- Login com conta gov.br
- Seção "Pagamento de Contribuição Mensal"
- Mostra DAS pagos, em aberto, e DAS atrasados

### Pelo e-CAC (Receita Federal)
- Site: cav.receita.fazenda.gov.br
- Login com gov.br
- "Situação Fiscal" → mostra dívidas em aberto, parcelamentos vigentes e situação cadastral
- Consulta integrada CPF + CNPJ

A diferença é que o e-CAC mostra de forma mais ampla — incluindo eventuais dívidas em Dívida Ativa.

## Parcelamento de débitos do Simples Nacional

Para débitos ainda na Receita Federal (estágios 1 e 2):

- Acesso pelo **Portal do Simples Nacional** (www8.receita.fazenda.gov.br/simplesnacional)
- Parcelamento convencional: **até 60 vezes**
- **Parcela mínima: R$ 50,00** para MEI
- A regularização da situação fiscal acontece **imediatamente após o pagamento da primeira parcela**
- Pagamento por boleto

### Regra crucial: continuar pagando o DAS corrente
Estar parcelado **não isenta** o MEI dos novos DAS. Se ele parcelou em 60 vezes a dívida antiga, ele continua pagando o DAS de cada mês corrente normalmente, dia 20. Se atrasar três DAS correntes, o parcelamento é **rescindido** e a dívida volta integral.

## Quando vira Dívida Ativa

Geralmente após **um ano** de débito não pago e não parcelado, a Receita Federal envia o débito para a PGFN. A partir desse momento:

- A dívida está com a Procuradoria, não mais com a Receita
- O parcelamento e renegociação são feitos no portal **Regularize** (regularize.pgfn.gov.br)
- O nome do MEI pode ser **inscrito no CADIN**
- O **CPF do titular** também é afetado — pode bloquear concursos públicos, financiamentos e crédito
- Há possibilidade de **protesto extrajudicial** da dívida
- Em casos extremos, **execução fiscal** judicial

## Como o extensionista atua nesses casos

A regra de ouro: **cada estágio tem um canal e um nível de complexidade diferente**.

### Estágios 1 e 2 (Receita Federal)
Você pode orientar com tranquilidade. Mostre o caminho: acessar Portal do Empreendedor ou Portal do Simples Nacional, fazer login com gov.br, gerar guia ou parcelamento.

### Estágio 3 (PGFN/Regularize)
**Encaminhe para o professor orientador**. Esse caso pode envolver renegociação especial, possibilidade de protesto, impactos no CPF. Não tente resolver sozinho. Seu papel é registrar a situação no caso e escalonar.

## Programas especiais de renegociação

De tempos em tempos, o governo federal abre **programas de renegociação especial** (REFIS, "transação tributária", etc.) com descontos em juros e multas. Esses programas têm prazos curtos. Se o empreendedor estiver em Dívida Ativa, vale verificar se há programa vigente — mas isso, novamente, é caso para o professor orientador, pois exige análise específica.

## Baixa do MEI com débitos

Para encerrar (dar baixa) um MEI com débitos, o processo é:

1. Quitar ou parcelar todos os débitos
2. Entregar todas as DASN-SIMEI pendentes
3. Solicitar a baixa pelo Portal do Empreendedor

Se o MEI tentar dar baixa com dívidas, a **baixa é concedida**, mas a dívida persiste no nome do titular como pessoa física. Ou seja: dar baixa não apaga dívida.`,
      callouts: [
        {
          type: 'attention',
          title: 'Dívida Ativa no CPF é sério',
          body: 'Quando a dívida vai para a PGFN, o CPF do titular do MEI é afetado, não apenas o CNPJ. Isso pode bloquear financiamentos, concursos públicos, e gerar protesto. Não trate como um atraso comum.',
        },
        {
          type: 'escalation',
          title: 'Quando chamar o professor orientador',
          body: 'Sempre que: (1) a dívida estiver em Dívida Ativa/Regularize; (2) houver protesto extrajudicial ou execução fiscal; (3) o empreendedor mencionar penhora, citação ou bloqueio judicial; (4) houver renegociação especial em andamento. Esses casos exigem análise técnica.',
        },
        {
          type: 'common-error',
          title: 'Erro comum: parcelar e parar de pagar o DAS corrente',
          body: 'Muitos MEIs parcelam a dívida antiga e relaxam, achando que "já está em dia". Não está. O DAS de cada mês corrente continua devido. Atraso de 3 DAS rescinde o parcelamento e a dívida volta integralmente, agora com novos juros.',
        },
        {
          type: 'practice',
          title: 'Na prática',
          body: 'José tem 14 meses de DAS atrasados e o sistema do Simples Nacional não mostra a dívida — significa que provavelmente já foi inscrita em Dívida Ativa. Oriente-o a acessar regularize.pgfn.gov.br com a conta gov.br para ver o estado real da dívida e abra o caso para o professor orientar a renegociação.',
        },
        {
          type: 'official-source',
          title: 'Canais oficiais',
          body: 'Portal do Empreendedor (gov.br/mei) | Portal do Simples Nacional (www8.receita.fazenda.gov.br/simplesnacional) | e-CAC (cav.receita.fazenda.gov.br) | Regularize/PGFN (regularize.pgfn.gov.br)',
        },
      ],
      activity: {
        type: 'scenario',
        prompt:
          'Antônia chega ao atendimento dizendo: "Recebi uma carta da Procuradoria. Diz que tenho dívida do MEI e que vão protestar meu nome. O que faço?" Como você conduz o atendimento?',
        expectedAnswer:
          '1) Acolha — explique que existe caminho. 2) Identifique o estágio: já está na PGFN (Dívida Ativa). 3) Oriente acessar regularize.pgfn.gov.br com conta gov.br para ver detalhes. 4) Registre o caso na plataforma. 5) Escalone para o professor orientador, pois envolve renegociação na PGFN e possível protesto — fora do escopo de orientação básica.',
      },
      summary: [
        'Três estágios: atraso recente (Receita), acumulado parcelável (Receita) e Dívida Ativa (PGFN)',
        'Parcelamento Simples Nacional: até 60 vezes, parcela mínima R$ 50',
        'Estar parcelado não isenta dos DAS correntes; atraso de 3 rescinde o parcelamento',
        'Dívida Ativa afeta o CPF do titular, não só o CNPJ',
        'Casos em Dívida Ativa/PGFN devem ser escalonados ao professor orientador',
        'Baixa do MEI com dívida transfere o débito para a pessoa física',
      ],
      fixationQuestions: [
        {
          question: 'Onde se parcela débito do MEI ainda na Receita Federal?',
          answer:
            'No Portal do Simples Nacional (www8.receita.fazenda.gov.br/simplesnacional), com login via gov.br. Parcelamento em até 60 vezes, parcela mínima de R$ 50.',
        },
        {
          question: 'O que acontece quando a dívida do MEI vai para Dívida Ativa?',
          answer:
            'O controle passa para a PGFN. A regularização é feita no portal Regularize (regularize.pgfn.gov.br). Pode haver protesto extrajudicial, inscrição no CADIN e impacto direto no CPF do titular.',
        },
        {
          question: 'O MEI parcelou a dívida antiga em 60 vezes. Ele ainda precisa pagar o DAS dos meses correntes?',
          answer:
            'Sim. O parcelamento cobre apenas a dívida antiga. Os DAS de cada mês corrente continuam vencendo no dia 20 e devem ser pagos. Atraso em 3 DAS correntes pode rescindir o parcelamento.',
        },
        {
          question: 'Quando você como extensionista deve escalonar para o professor orientador?',
          answer:
            'Quando houver Dívida Ativa, protesto, execução fiscal, programas de renegociação especial em curso, citação judicial ou qualquer caso fora do simples parcelamento na Receita Federal.',
        },
        {
          question: 'Dar baixa no MEI apaga a dívida?',
          answer:
            'Não. A dívida persiste no nome do titular como pessoa física. Para dar baixa "limpa", é preciso primeiro quitar ou parcelar os débitos.',
        },
      ],
      sources: [
        'Portal do Empreendedor — Gov.br',
        'Portal do Simples Nacional (Receita Federal)',
        'Portal Regularize — PGFN (regularize.pgfn.gov.br)',
        'e-CAC — Centro de Atendimento Virtual da Receita Federal',
        'Mapeamento Normativo e Documental — Relatório Técnico',
      ],
    },

    // ─── MÓDULO 7 ─────────────────────────────────────────────────────
    {
      slug: 'golpes-canais-oficiais',
      order: 7,
      title: 'Golpes, canais oficiais e proteção do microempreendedor',
      description: 'Reconhecer fraudes comuns contra MEI, validar canais oficiais e proteger o empreendedor contra desinformação.',
      objective:
        'Ao final deste módulo, você será capaz de identificar os golpes mais frequentes contra MEIs, listar os canais oficiais por tipo de demanda e orientar o empreendedor a verificar a autenticidade de cobranças e mensagens.',
      intro:
        'Microempreendedores são alvo preferencial de golpistas — combinam menor familiaridade digital, menor poder econômico e medo de "estar irregular com a Receita". Parte essencial do seu papel é treinar o empreendedor a reconhecer ameaças e usar apenas canais oficiais.',
      videoUrl: 'https://www.youtube.com/embed/DJzcumH_YtQ',
      content: `## A premissa: o governo nunca pede assim

Antes de entrar nos golpes específicos, fixe esta regra com o empreendedor:

**O governo federal não cobra nem pede dados por:**
- WhatsApp ou SMS
- Ligação telefônica não solicitada
- E-mail com link para pagamento
- Boleto enviado pelos correios sem cadastro prévio

**O governo federal sempre se comunica por:**
- Portal oficial (gov.br)
- e-CAC (com login pessoal)
- Carta registrada (em casos formais de fiscalização ou execução)

Isso já elimina 90% dos golpes.

## Os golpes mais comuns

### 1. Boletos falsos de "associações" e "filiações"

Empresas privadas enviam boletos com aparência oficial para o MEI, simulando que são "anuidade", "registro obrigatório" ou "filiação ao conselho". Geralmente vêm em valores entre R$ 60 e R$ 500.

**A regra absoluta:** o **único** boleto obrigatório do MEI é o **DAS**, gerado pelo Portal do Empreendedor ou pelo app MEI. Qualquer outro boleto é facultativo (você decide se quer pagar ou não) ou golpe.

### 2. Sites pagos para abrir/regularizar MEI

Sites com nomes como "MEI Fácil", "Abertura MEI Online", "Regulariza Já" cobram R$ 100–500 por serviços que são gratuitos no portal oficial. Aparecem em anúncios patrocinados no Google, muitas vezes acima do site oficial.

**Como identificar:** o domínio **NÃO termina em .gov.br**. Ensine o empreendedor a sempre olhar a URL antes de informar dados.

### 3. Falsa "auditoria da Receita Federal"

Pessoa liga ou envia mensagem dizendo que o "CNPJ está irregular" ou que "a Receita identificou inconsistência". Pede pagamento via PIX para "regularizar".

**Verdade:** a Receita Federal **nunca pede pagamento via PIX para conta de pessoa física**. Quando há débito real, o caminho oficial é gerar guia DAS no Portal do Empreendedor — e a guia tem código de barras com identificação do governo (Banco do Brasil ou Caixa).

### 4. Phishing por e-mail e SMS

E-mails e mensagens com links para "atualizar cadastro", "regularizar pendência" ou "evitar bloqueio do CNPJ". O link leva a uma página falsa, idêntica ao gov.br, que captura CPF e senha do empreendedor.

**Regra de ouro:** nunca clicar em links de mensagens. Sempre acessar digitando o endereço oficial direto no navegador (gov.br/mei).

### 5. Falso suporte de NFS-e ou e-CAC

Pessoas se passam por suporte técnico, oferecem ajuda para emitir nota ou regularizar e pedem a senha do gov.br "para acessar e resolver". Sempre recusar — a senha é pessoal e intransferível.

### 6. Vendedores de certificado digital desnecessário

Para a esmagadora maioria dos MEIs, **certificado digital não é obrigatório**. A conta gov.br nível Prata/Ouro substitui na maior parte dos casos. Vendedores que insistem que "todo MEI precisa" estão lucrando indevidamente.

## O mapa de canais oficiais

Decore esta tabela. É o seu mapa de navegação no atendimento:

| Para quê | Canal oficial |
|----------|---------------|
| Tudo sobre MEI (abertura, DAS, declaração) | **gov.br/mei** (Portal do Empreendedor) |
| Consultar débitos e situação fiscal | **e-CAC** (cav.receita.fazenda.gov.br) |
| Parcelar débitos do Simples | **Portal do Simples Nacional** |
| Dívida Ativa | **Regularize** (regularize.pgfn.gov.br) |
| Emitir nota de serviço | **Portal Nacional NFS-e** (nfse.gov.br) |
| Emitir nota de mercadoria | **SEFAZ do estado** |
| Aposentadoria, auxílios, benefícios | **Meu INSS** (meu.inss.gov.br ou app) |
| Registro de empresa | **Redesim** (integrada ao gov.br/mei) |
| Capacitação e gestão | **Sebrae** (sebrae.com.br) |
| Telefone Receita | **146** |

## Como orientar quando o empreendedor recebe algo suspeito

1. **Acolha sem julgar**: "Você fez bem em desconfiar e me trazer."
2. **Olhe o documento junto**: peça que mostre o boleto, e-mail ou mensagem.
3. **Verifique o emissor**: se é boleto, qual o CNPJ do beneficiário? Se for pessoa física ou empresa privada qualquer, é golpe.
4. **Compare com a fonte oficial**: acesse o Portal do Empreendedor e veja se há algum DAS pendente real.
5. **Oriente a denunciar**: consumidor.gov.br, delegacia de crimes virtuais, ou para a própria Receita pelo 146.

Esse cuidado vale ouro. Empreendedor que aprendeu a desconfiar não cai mais.`,
      callouts: [
        {
          type: 'attention',
          title: 'O DAS é o único boleto obrigatório',
          body: 'MEI não paga anuidade, contribuição sindical, filiação ou registro adicional. O DAS gerado pelo Portal do Empreendedor é o único pagamento obrigatório. Qualquer outro é facultativo ou fraude.',
        },
        {
          type: 'common-error',
          title: 'Erro comum: clicar em links de e-mail "do governo"',
          body: 'O governo não envia links de pagamento por e-mail ou SMS. Mesmo que pareça verdadeiro, sempre acesse digitando o endereço oficial diretamente. Phishing é o golpe mais frequente — basta um clique para vazar dados.',
        },
        {
          type: 'attendance-tip',
          title: 'Frase para repetir com o empreendedor',
          body: '"Se a URL não termina em .gov.br, NÃO é oficial. Se vier por WhatsApp pedindo pagamento, NÃO é o governo. Se ligarem pedindo PIX, NÃO atenda."',
        },
        {
          type: 'practice',
          title: 'Na prática',
          body: 'Dona Marta recebeu boleto de "Conselho Federal de Microempreendedores" no valor de R$ 198 ameaçando bloqueio de CNPJ. Você acessa o Portal do Empreendedor com ela, confirma que o CNPJ está regular e o único débito é o DAS do mês. Orienta-a a descartar o boleto e denunciar em consumidor.gov.br.',
        },
        {
          type: 'official-source',
          title: 'Para denunciar',
          body: 'consumidor.gov.br | Delegacia de Crimes Cibernéticos local | Procon | Receita Federal: 146 | Para boletos com falsificação de logo do governo: Polícia Federal',
        },
      ],
      activity: {
        type: 'scenario',
        prompt:
          'Um empreendedor te liga em pânico: "Recebi um WhatsApp do número da Receita Federal dizendo que meu MEI vai ser bloqueado em 24h se eu não pagar R$ 350 por PIX. O que faço?"',
        expectedAnswer:
          '1) Acalme: explique que o governo NUNCA cobra por WhatsApp e nunca pede PIX para pessoa física. 2) Confirme: peça que ele acesse o gov.br/mei (digitando direto) e veja se há DAS pendente real — provavelmente não há. 3) Oriente a NÃO pagar, NÃO responder a mensagem, bloquear o número. 4) Sugira denunciar: consumidor.gov.br e à Polícia. 5) Registre o caso na plataforma.',
      },
      summary: [
        'O governo federal só cobra MEI via DAS gerado pelo Portal do Empreendedor',
        'Nunca há cobrança oficial por WhatsApp, SMS ou ligação não solicitada',
        'URLs oficiais terminam em .gov.br — sempre verificar antes de inserir dados',
        'Senha do gov.br é pessoal e intransferível — nunca compartilhar',
        'Certificado digital geralmente NÃO é obrigatório para MEI',
        'Em caso de dúvida sobre boleto/cobrança, sempre consultar o Portal do Empreendedor',
      ],
      fixationQuestions: [
        {
          question: 'Qual é o único boleto obrigatório que o MEI precisa pagar mensalmente?',
          answer:
            'O DAS — Documento de Arrecadação do Simples Nacional — gerado pelo Portal do Empreendedor (gov.br/mei) ou app MEI. Qualquer outro boleto é facultativo ou fraudulento.',
        },
        {
          question: 'Como o cidadão pode verificar se um site é realmente oficial do governo?',
          answer:
            'Verificando se o domínio termina em .gov.br. Sites em .com, .net, .org ou outros domínios não são oficiais, mesmo que pareçam, mesmo se aparecerem em anúncios patrocinados no Google.',
        },
        {
          question: 'A Receita Federal pode entrar em contato pedindo pagamento via PIX para CPF de pessoa física?',
          answer:
            'Não. A Receita usa exclusivamente boletos oficiais com código de barras integrado ao sistema bancário. Cobrança via PIX para conta pessoal é golpe certeiro.',
        },
        {
          question: 'Por que o MEI não deve clicar em links recebidos por SMS ou e-mail "do governo"?',
          answer:
            'Porque o golpe mais comum é o phishing: o link leva a uma página falsa idêntica ao gov.br que captura CPF, senha e dados bancários. Sempre acessar digitando o endereço diretamente no navegador.',
        },
        {
          question: 'Onde denunciar uma fraude contra MEI?',
          answer:
            'consumidor.gov.br, Procon, Delegacia de Crimes Cibernéticos, Receita Federal (146) e, em casos com falsificação de logo do governo, Polícia Federal.',
        },
      ],
      sources: [
        'Portal do Empreendedor — Gov.br (seção Segurança e Golpes)',
        'Guia de Segurança Digital para Pequenos Negócios — Gov.br / CERT.br',
        'Mapeamento Normativo e Documental — Relatório Técnico',
      ],
    },

    // ─── MÓDULO 8 ─────────────────────────────────────────────────────
    {
      slug: 'atendimento-humanizado',
      order: 8,
      title: 'Atendimento humanizado: linguagem simples, escuta e registro correto',
      description: 'Técnicas de comunicação clara, escuta ativa, princípios da Linguagem Simples (ENAP) e registro estruturado do caso.',
      objective:
        'Ao final deste módulo, você será capaz de aplicar princípios de Linguagem Simples, conduzir uma escuta ativa, registrar atendimentos de forma estruturada e identificar quando encaminhar.',
      intro:
        'Saber a parte técnica é metade do trabalho. A outra metade é como você se comunica e como registra. Atendimento humanizado é a habilidade que distingue um extensionista mediano de um excelente. Este módulo fecha o curso com essa peça-chave.',
      content: `## Linguagem Simples — uma técnica, não uma simplificação

A **Linguagem Simples** é uma metodologia oficial usada pela Administração Pública Federal e formalizada pela ENAP (Escola Nacional de Administração Pública). O objetivo é claro:

> "Permitir que o cidadão encontre o que precisa, entenda o que encontrou e aja com base nessa informação."

Linguagem simples **não é** infantilizar o conteúdo. É **eliminar barreiras desnecessárias** entre quem fala e quem ouve. Veja a diferença:

| ❌ Juridiquês/Tecniquês | ✅ Linguagem Simples |
|---|---|
| "Inadimplência pecuniária" | "Pagamentos em atraso" |
| "Exequibilidade da atividade econômica" | "Se o negócio pode funcionar nesse lugar" |
| "Recolhimento da contribuição mensal previdenciária" | "Pagar o INSS todo mês" |
| "Desenquadramento compulsório" | "Sair do MEI por ordem da Receita" |
| "Anuidade da DASN-SIMEI deve ser entregue antes do prazo decadencial" | "A declaração anual precisa ser enviada até 31 de maio" |

### Os princípios práticos

1. **Frases curtas** (até 15-20 palavras quando possível)
2. **Voz ativa** ("você precisa enviar" em vez de "deve ser enviado por você")
3. **Vocabulário cotidiano**, evitando termos técnicos sem explicação
4. **Estrutura clara**: comece pelo importante, depois detalhe
5. **Exemplos concretos** sempre que possível

## Escuta ativa — antes de responder, entenda

Muitos extensionistas iniciantes querem mostrar competência respondendo rápido. É um erro. O empreendedor frequentemente **não sabe descrever exatamente o problema**, e a primeira frase quase nunca é a real demanda.

### Perguntas abertas para começar

- "Me conta com calma o que está acontecendo no seu negócio."
- "O que você já tentou fazer?"
- "Qual é a maior preocupação agora?"
- "Você tem alguma carta, mensagem ou documento que possa me mostrar?"

### O que evitar

- **Interromper** — deixe a pessoa terminar a fala antes de responder
- **Assumir** — não conclua o problema antes de ouvir tudo
- **Ironizar** — mesmo que a dúvida pareça óbvia para você, é nova para a pessoa
- **Pular para a solução** — primeiro entenda, depois responda

### O sinal de uma boa escuta

Você consegue **resumir o problema do empreendedor com as próprias palavras dele** antes de responder. Algo como:

> "Deixa ver se entendi: você abriu o MEI em janeiro, pagou os DAS até abril, viajou e perdeu três pagamentos. Agora você está com medo de que tenham bloqueado seu CNPJ. É isso?"

Quando o empreendedor confirma esse resumo, ele já se sente ouvido — e você responde com precisão.

## Os limites da resposta

Existem três respostas legítimas. Saber qual usar é parte da maturidade profissional:

### 1. "Sim, posso te ajudar"
Quando a dúvida está clara, dentro do escopo, e há fonte oficial para embasar.

### 2. "Vou verificar e te respondo"
Quando você não tem certeza e precisa consultar o Portal do Empreendedor, e-CAC ou outra fonte oficial. **Sempre cumpra**: anote o contato e volte com a resposta.

### 3. "Esse caso ultrapassa minha orientação — vou encaminhar para o professor"
Quando há complexidade fiscal, jurídica ou emocional fora do seu escopo. Não é fraqueza dizer isso — é responsabilidade.

## O registro do atendimento na plataforma

Cada caso tem um histórico que protege você, o empreendedor e a continuidade do trabalho. Um registro bem feito tem 5 elementos:

### 1. Canal e tipo de interação
WhatsApp, presencial, e-mail, telefone? Foi orientação simples (15 min), encaminhamento (30 min), apoio detalhado (45 min)?

### 2. O que o empreendedor precisava (demanda)
Em uma frase, o problema real — não o que ele disse no início, mas o problema central que vocês identificaram juntos.

### 3. O que você fez (ação)
As orientações, encaminhamentos, fontes consultadas, links enviados. Seja específico.

### 4. Resultado
O que ficou resolvido? Pendências? Próximos passos?

### 5. Precisa de retorno?
Sim ou não. Se sim, o que disparará o retorno (data, evento, documento aguardado)?

## Pequena ética do atendimento

Algumas regras silenciosas, mas importantes:

- **Confidencialidade**: dados do empreendedor não saem do sistema da plataforma. Não conte casos com nome em conversas casuais.
- **Equanimidade**: trate todos os empreendedores com o mesmo cuidado — não há atendimento de primeira e segunda classe.
- **Honestidade**: nunca invente informação para parecer competente. "Não sei" é resposta digna.
- **Continuidade**: quando passar um caso para colega, faça uma transição limpa — passe contexto, evite que o empreendedor precise repetir tudo.`,
      callouts: [
        {
          type: 'attention',
          title: 'Não traduza com pressa',
          body: 'A pior tradução é aquela que omite informação importante para parecer simples. "Pagar o DAS" omite que o DAS contém INSS — informação relevante quando se fala de aposentadoria. Linguagem simples NÃO é menos informação, é informação clara.',
        },
        {
          type: 'attendance-tip',
          title: 'A regra do papel e caneta',
          body: 'Tenha sempre papel e caneta (ou bloco no celular). Anote nomes, números, datas e dúvidas durante o atendimento. Isso melhora a escuta E o registro posterior.',
        },
        {
          type: 'common-error',
          title: 'Erro comum: registrar tudo no campo "observações"',
          body: 'A plataforma tem campos estruturados (demanda, ação, resultado, follow-up) por uma razão: facilitar leitura por outros e ativar lembretes automáticos. Use os campos corretamente. "Observações" é para o que não se encaixa em nenhum campo.',
        },
        {
          type: 'practice',
          title: 'Na prática',
          body: 'Substitua "O empreendedor estava com inadimplência tributária e foi orientado a regularizar" por "Maria estava com 4 DAS atrasados (jan-abr/2025). Mostrei o caminho no Portal do Simples Nacional para parcelamento em 60x. Ela parcelou na hora. Próximo passo: pagar o DAS de junho normal."',
        },
        {
          type: 'official-source',
          title: 'Aprofunde-se',
          body: 'Glossário de Linguagem Simples para Serviços Públicos — ENAP | Cartilhas de Atendimento Sebrae | Manual de Atendimento Humanizado da Administração Pública',
        },
      ],
      activity: {
        type: 'reflection',
        prompt:
          'Releia uma orientação que você daria sobre DAS atrasado. Pergunte: (a) usei alguma palavra que minha avó não entenderia? (b) coloquei o mais importante na primeira frase? (c) dei um exemplo concreto? Reescreva eliminando jargões e tornando o texto mais direto.',
        expectedAnswer:
          'Exemplo: "Você precisa quitar imediatamente seus débitos tributários para evitar a prescrição decadencial" → "Você está com DAS atrasado de janeiro a abril. Pra ficar em dia, você pode parcelar tudo em até 60 vezes pelo site do Simples Nacional, com parcelas a partir de R$ 50. Quer que eu mostre o caminho?"',
      },
      summary: [
        'Linguagem Simples (ENAP) é técnica oficial: clara, direta, sem juridiquês',
        'Escuta ativa: ouvir tudo antes de responder, fazer perguntas abertas, resumir o problema com as palavras do empreendedor',
        'Três respostas legítimas: "posso ajudar", "vou verificar", "vou encaminhar"',
        'Registro estruturado: canal, demanda real, ação, resultado, follow-up',
        'Ética: confidencialidade, equanimidade, honestidade, continuidade',
      ],
      fixationQuestions: [
        {
          question: 'Linguagem Simples é o mesmo que infantilizar o conteúdo?',
          answer:
            'Não. Linguagem Simples é eliminar barreiras desnecessárias (juridiquês, frases longas, voz passiva), mantendo a informação completa e correta. Infantilizar omite informação importante; Linguagem Simples a torna acessível.',
        },
        {
          question: 'Qual é o sinal de que você fez uma boa escuta ativa?',
          answer:
            'Você consegue resumir o problema usando as palavras do próprio empreendedor antes de responder, e ele confirma que é exatamente isso. Esse momento garante que vocês estão alinhados antes de você sugerir solução.',
        },
        {
          question:
            'Quais são os 5 elementos de um bom registro de atendimento?',
          answer:
            '(1) Canal e tipo de interação; (2) Demanda real do empreendedor; (3) Ação tomada; (4) Resultado; (5) Necessidade de retorno (sim/não e quando).',
        },
        {
          question: 'Quando é correto dizer "não sei" em um atendimento?',
          answer:
            'Sempre que você não tem certeza do que está afirmando. "Não sei, vou verificar" é resposta profissional. Inventar resposta ou repetir senso comum é que é o problema. O importante é cumprir o "vou verificar" — voltando depois com a informação correta.',
        },
        {
          question: 'Por que registrar atendimentos em campos estruturados é melhor que em texto livre?',
          answer:
            'Porque permite que outro extensionista entenda o caso rapidamente, ativa lembretes automáticos (follow-up), gera relatórios de qualidade e protege juridicamente. Texto livre dificulta consulta e perde informação ao longo do tempo.',
        },
      ],
      sources: [
        'Glossário de Linguagem Simples para Serviços Públicos — ENAP',
        'Cartilhas de Atendimento e Gestão MEI — Sebrae',
        'Mapeamento Normativo e Documental — Relatório Técnico',
      ],
    },
  ],

  // ─── AVALIAÇÃO FINAL ──────────────────────────────────────────────
  quiz: [
    {
      id: 1,
      question:
        'Um empreendedor te procura querendo abrir MEI, mas conta que recebe BPC/LOAS. Como você orienta?',
      options: [
        'Oriento abrir o MEI normalmente, pois um não interfere no outro',
        'Recuso o atendimento e digo que ele não pode ser MEI',
        'Explico que abrir CNPJ pode suspender o BPC, e oriento confirmar com o INSS antes',
        'Oriento abrir e depois ajustar com o INSS, se necessário',
      ],
      correctIndex: 2,
      explanation:
        'O BPC/LOAS pressupõe vulnerabilidade econômica. Abrir CNPJ pode suspender o benefício imediatamente. O extensionista deve sempre alertar e orientar a verificação prévia com o INSS antes da formalização — protegendo a renda atual do empreendedor.',
    },
    {
      id: 2,
      question:
        'O DAS de um MEI prestador de serviço, em valor aproximado de 2026, é composto por:',
      options: [
        'Apenas INSS (5% do salário mínimo)',
        'INSS (5% do salário mínimo) + ICMS (R$ 1,00)',
        'INSS (5% do salário mínimo) + ISS (R$ 5,00)',
        'INSS + ICMS + ISS para todos os MEIs',
      ],
      correctIndex: 2,
      explanation:
        'Para prestadores de serviço, o DAS contém INSS (5% do salário mínimo) + ISS (R$ 5,00 fixo). Comércio e indústria pagam INSS + ICMS (R$ 1,00). O DAS unifica tributos em valor fixo, independentemente do faturamento.',
    },
    {
      id: 3,
      question:
        'Em qual situação o MEI prestador de serviço é obrigado a emitir nota fiscal?',
      options: [
        'Quando vende para qualquer cliente, sempre',
        'Apenas quando o valor da venda for superior a R$ 1.000',
        'Quando o cliente é pessoa jurídica (empresa ou órgão público)',
        'Apenas no fim do ano, na declaração',
      ],
      correctIndex: 2,
      explanation:
        'A obrigatoriedade de emitir nota é apenas quando o cliente é pessoa jurídica. Para pessoa física, a emissão é dispensada (salvo se o cliente exigir). A NFS-e é emitida pelo Portal Nacional (nfse.gov.br) ou app NFSe Mobile.',
    },
    {
      id: 4,
      question: 'Qual é o prazo da Declaração Anual de Faturamento (DASN-SIMEI)?',
      options: [
        '31 de março, com dados do ano corrente',
        '30 de abril, com dados do ano anterior',
        '31 de maio, com dados do ano anterior',
        '31 de dezembro, com dados do ano corrente',
      ],
      correctIndex: 2,
      explanation:
        'A DASN-SIMEI deve ser entregue até 31 de maio de cada ano, declarando o faturamento bruto do ano anterior. É obrigatória mesmo se o MEI não faturou (declaração com valor zero). Atraso bloqueia a geração do DAS do ano corrente.',
    },
    {
      id: 5,
      question:
        'Um empreendedor liga e diz que recebeu mensagem do "Conselho dos Microempreendedores" cobrando R$ 198 de "anuidade obrigatória". Como você orienta?',
      options: [
        'Que pague o boleto, pois é obrigação do MEI',
        'Que ignore, pois MEI não tem anuidade — o único boleto obrigatório é o DAS',
        'Que pague metade, para evitar problemas',
        'Que ligue para o "Conselho" pedindo desconto',
      ],
      correctIndex: 1,
      explanation:
        'MEI não tem anuidade. Não existe "Conselho dos Microempreendedores" obrigatório. O único boleto obrigatório é o DAS, gerado no Portal do Empreendedor. Esse tipo de cobrança é golpe — orientar a descartar e denunciar em consumidor.gov.br.',
    },
    {
      id: 6,
      question:
        'Em qual nível mínimo de conta gov.br é possível abrir um MEI pelo Portal do Empreendedor?',
      options: ['Bronze', 'Prata', 'Ouro', 'Não exige nível específico'],
      correctIndex: 1,
      explanation:
        'O nível mínimo é Prata. Bronze não permite a formalização. Para subir o nível, o cidadão pode usar o app gov.br (validação biométrica) ou o Internet Banking de instituições credenciadas (Caixa, BB, Itaú etc.).',
    },
    {
      id: 7,
      question:
        'Um MEI parcelou uma dívida antiga em 60 vezes no Portal do Simples Nacional. Em relação aos DAS de meses correntes, qual afirmação está correta?',
      options: [
        'Pode parar de pagar os DAS correntes durante o parcelamento',
        'O DAS é incorporado ao parcelamento, não precisa pagar separadamente',
        'Continua devendo pagar os DAS de cada mês corrente normalmente — atraso de 3 DAS pode rescindir o parcelamento',
        'Só precisa pagar metade dos DAS correntes durante o parcelamento',
      ],
      correctIndex: 2,
      explanation:
        'O parcelamento cobre apenas a dívida antiga. Os DAS de meses correntes continuam vencendo no dia 20 e devem ser pagos normalmente. Atraso de 3 DAS correntes pode rescindir o parcelamento e a dívida volta integral, com novos juros.',
    },
    {
      id: 8,
      question:
        'Um empreendedor procura você dizendo que recebeu citação judicial por execução fiscal do MEI. O que você faz?',
      options: [
        'Oriento ele a pagar imediatamente para evitar problemas',
        'Oriento parcelar pelo Portal do Simples Nacional sem mais investigação',
        'Acolho, registro o caso e escalono ao professor orientador, pois envolve PGFN/justiça',
        'Oriento ignorar, pois citação judicial geralmente é golpe',
      ],
      correctIndex: 2,
      explanation:
        'Execução fiscal já está em fase judicial — fora do escopo de orientação básica do extensionista. O caminho correto é acolher o empreendedor, registrar o caso na plataforma e escalonar ao professor orientador, que tem condições de avaliar a situação técnica e jurídica.',
    },
    {
      id: 9,
      question:
        'O MEI pode contratar quantos funcionários e em qual condição salarial?',
      options: [
        'Nenhum funcionário, é proibido por lei',
        'Apenas 1 funcionário, com salário mínimo nacional ou piso da categoria',
        'Até 3 funcionários, com salário mínimo',
        'Sem limite, desde que pague impostos',
      ],
      correctIndex: 1,
      explanation:
        'O MEI tem direito a contratar 1 (um) único funcionário, recebendo salário mínimo nacional ou o piso da categoria profissional (verificado em convenção coletiva). Mais que isso obriga migração para outro regime. O custo inclui FGTS (8%) e contribuição patronal (3%), processados via eSocial.',
    },
    {
      id: 10,
      question:
        'Você está atendendo um empreendedor que está chorando, dizendo que perdeu o pai e ainda não conseguiu fazer nada com o MEI dele há meses. Qual a melhor abordagem?',
      options: [
        'Insistir em resolver os pendências fiscais imediatamente',
        'Acolher a situação emocional, fazer perguntas com calma, focar no que é mais urgente e oferecer escalonamento ao professor se for o caso — registrando tudo com cuidado',
        'Pedir que volte quando estiver mais calmo',
        'Resolver tudo rápido sem perguntar para "tirar o peso" do empreendedor',
      ],
      correctIndex: 1,
      explanation:
        'Atendimento humanizado prioriza acolhimento antes de resolução. Escuta ativa, perguntas abertas, foco no urgente (não no urgente percebido) e disposição para encaminhar quando o caso ultrapassar a orientação básica. Pressa para "resolver" pode atropelar a real necessidade do empreendedor e gerar registros incompletos.',
    },
  ],
};

export const COURSES: Course[] = [MEI_COURSE];

export function normalizeCourseSlug(slug: string): string {
  try {
    return decodeURIComponent(slug).trim().toLowerCase();
  } catch {
    return slug.trim().toLowerCase();
  }
}

export function getCourseBySlug(slug: string): Course | undefined {
  const normalizedSlug = normalizeCourseSlug(slug);
  return COURSES.find((c) => normalizeCourseSlug(c.slug) === normalizedSlug);
}
