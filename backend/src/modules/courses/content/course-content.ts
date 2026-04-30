export interface CourseModule {
  slug: string;
  order: number;
  title: string;
  description: string;
  content: string;
  keyTakeaways: string[];
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
    'Prepare-se para atender microempreendedores com segurança, linguagem simples e base oficial sobre o MEI.',
  passingScore: 7,
  modules: [
    {
      slug: 'espaco-empreendedor',
      order: 1,
      title: 'O que é o Espaço Empreendedor',
      description: 'Conheça o programa, seu objetivo e o papel do aluno extensionista.',
      keyTakeaways: [
        'O Espaço Empreendedor é um projeto de extensão universitária',
        'Conecta alunos voluntários a microempreendedores que precisam de orientação gratuita',
        'Você não é advogado, contador ou consultor — é um orientador com base técnica',
        'Limites claros protegem você e o empreendedor',
      ],
      content: `O **Espaço Empreendedor** é um projeto de extensão universitária que conecta alunos extensionistas voluntários a microempreendedores individuais (MEIs) que precisam de orientação gratuita e acessível.

## Por que ele existe

Milhões de MEIs enfrentam dificuldades para entender obrigações, emitir documentos e evitar golpes — e muitas vezes não conseguem pagar por consultoria especializada. O Espaço Empreendedor preenche essa lacuna com orientação gratuita, baseada em fontes oficiais.

## O papel do aluno extensionista

Como aluno extensionista, você não é advogado, contador ou consultor. Você é um **orientador treinado** que:

- Explica conceitos de forma simples e acessível
- Indica os canais oficiais corretos
- Registra cada atendimento na plataforma
- Sabe quando encaminhar para um profissional especializado

## Limites importantes

Nunca prometa resultados. Nunca assine documentos em nome do empreendedor. Nunca cobre por orientação. Sempre deixe claro que você está fornecendo informações gerais, não assessoria profissional.

## A plataforma

Esta plataforma registra todos os atendimentos, mantém o histórico dos casos e permite que professores orientadores acompanhem o trabalho. Use-a corretamente — o registro é parte do seu papel.`,
    },
    {
      slug: 'quem-e-o-mei',
      order: 2,
      title: 'Quem é o MEI e quando ele faz sentido',
      description: 'Entenda o perfil do microempreendedor individual e quando formalizar é vantajoso.',
      videoUrl: 'https://www.youtube.com/embed/M3HnyXWPfoM',
      keyTakeaways: [
        'MEI é a pessoa que trabalha por conta própria e se formaliza como empresário',
        'Limite de faturamento: R$ 81.000/ano (ou R$ 251.600 para caminhoneiro)',
        'Pode ter apenas 1 funcionário com salário mínimo ou piso da categoria',
        'Só pode exercer atividades permitidas pelo CNES',
      ],
      content: `O **Microempreendedor Individual (MEI)** é a pessoa que trabalha por conta própria — cabeleireiro, padeiro, costureira, mototaxista, eletricista — e decide se formalizar como empresário de forma simples e barata.

## Quem pode ser MEI

Para ser MEI, a pessoa precisa:

- Faturar até **R$ 81.000 por ano** (caminhoneiros: R$ 251.600)
- Exercer uma das **atividades permitidas pelo CNES** (Classificação Nacional de Atividades Econômicas Simplificada)
- Não ser sócio ou titular de outra empresa
- Não ser servidor público federal em atividade

## Vantagens da formalização

Ao se formalizar como MEI, o empreendedor passa a ter:

- **CNPJ** para emitir nota fiscal e abrir conta PJ
- Acesso a **crédito** com condições melhores
- **Cobertura previdenciária**: aposentadoria, auxílio-doença, salário-maternidade
- Possibilidade de participar de **licitações públicas**
- Redução de impostos: tudo em uma única guia mensal (DAS)

## Quando o MEI não é adequado

Se a pessoa fatura mais de R$ 81 mil/ano, tem sócios, ou quer contratar mais de 1 funcionário, o MEI não é o formato certo. Nesse caso, indique que ela precisará de ajuda profissional para avaliar outros enquadramentos.

## Um funcionário

O MEI pode contratar **1 funcionário** que receba o salário mínimo nacional ou o piso salarial da categoria. Mais que isso, o MEI precisa migrar para outro enquadramento.`,
    },
    {
      slug: 'como-abrir-mei',
      order: 3,
      title: 'Como abrir MEI com segurança',
      description: 'Passo a passo oficial para abertura de MEI e como evitar golpes no processo.',
      keyTakeaways: [
        'A abertura é gratuita no Portal do Empreendedor (gov.br/mei)',
        'Nunca pague para abrir MEI — qualquer cobrança é golpe',
        'É preciso ter conta gov.br e CPF regular na Receita Federal',
        'O CNPJ sai na hora após o cadastro',
      ],
      content: `Abrir um MEI é gratuito e pode ser feito em minutos pelo portal oficial. O processo é simples, mas muitas pessoas são enganadas por sites falsos que cobram por esse serviço.

## Portal oficial

O único portal oficial para abertura de MEI é: **gov.br/mei**

Nunca indique sites de terceiros. Qualquer cobrança para abrir MEI é golpe.

## Pré-requisitos

Antes de iniciar, o empreendedor precisa:

1. **CPF regular na Receita Federal** — sem pendências
2. **Conta gov.br** — nível prata ou ouro (verificação de identidade)
3. **Endereço para sede da empresa** — pode ser a residência

## Passo a passo

1. Acesse **gov.br/mei**
2. Clique em "Formalize-se"
3. Faça login com conta gov.br
4. Preencha os dados pessoais e da atividade
5. Informe o endereço da empresa
6. Confirme e aguarde — o CNPJ é gerado **na hora**

## Documentos gerados

Após o cadastro, o empreendedor recebe:
- **CNPJ** — Cadastro Nacional de Pessoas Jurídicas
- **CCMEI** — Certificado da Condição de Microempreendedor Individual
- **Inscrição na Receita Federal**

O CCMEI funciona como o "contrato social" do MEI e é obtido no próprio portal.

## Alvará e licenças

Dependendo do município e da atividade, pode ser necessário alvará de funcionamento. Oriente o empreendedor a consultar a prefeitura local após a abertura.

## Golpes comuns

- Sites que cobram R$ 100-500 para "abrir MEI"
- E-mails pedindo atualização de dados cadastrais
- Ligações de "consultores" oferecendo serviços obrigatórios

Sempre oriente: **abrir MEI é sempre gratuito**.`,
    },
    {
      slug: 'obrigacoes-mei',
      order: 4,
      title: 'Obrigações básicas: DAS, declaração anual e relatório mensal',
      description: 'O que o MEI precisa fazer mensalmente e anualmente para manter a regularidade.',
      videoUrl: 'https://www.youtube.com/embed/BvUhZk6YmRY',
      keyTakeaways: [
        'DAS é a guia mensal com INSS + ISS/ICMS — vence dia 20 de cada mês',
        'DASN-SIMEI é a declaração anual — prazo até 31 de maio',
        'Relatório mensal de receitas deve ser guardado pelo MEI',
        'Atraso no DAS gera multa e juros — e pode causar perda do CNPJ',
      ],
      content: `Ser MEI não é apenas ter um CNPJ. É preciso cumprir obrigações mensais e anuais para manter a regularidade e não perder os benefícios.

## DAS — Documento de Arrecadação do Simples Nacional

O **DAS** é a guia mensal de pagamento do MEI. Inclui:

| Tributo | Valor fixo |
|--------|-----------|
| INSS (Previdência) | 5% do salário mínimo |
| ISS (Serviços) | R$ 5,00 — se a atividade for de serviços |
| ICMS (Comércio/Indústria) | R$ 1,00 — se comercial ou industrial |

**Vencimento:** dia 20 de cada mês

O DAS pode ser gerado pelo portal **gov.br/mei** ou pelo aplicativo **MEI** (disponível para Android e iOS).

## Consequências do atraso

- Multa de 0,33% ao dia (máximo 20%) + INSS em juros
- Perda de benefícios previdenciários para os meses não pagos
- Risco de cancelamento do CNPJ após atraso prolongado

## DASN-SIMEI — Declaração Anual

Uma vez por ano, o MEI precisa enviar a **Declaração Anual do Simples Nacional (DASN-SIMEI)**, informando o faturamento bruto do ano anterior.

- **Prazo:** 31 de maio de cada ano
- **Como enviar:** gov.br/mei → Declaração Anual
- **Multa por atraso:** mínimo R$ 50,00

Mesmo que o MEI não tenha faturado nada no ano, precisa entregar a declaração com faturamento zero.

## Relatório Mensal de Receitas

O MEI deve guardar um **relatório mensal** com todas as receitas recebidas. Não precisa enviar para nenhum órgão, mas deve ser mantido por 5 anos. Serve como comprovante em caso de fiscalização.

Este relatório pode ser feito em qualquer planilha ou caderno.`,
    },
    {
      slug: 'nota-fiscal',
      order: 5,
      title: 'Nota fiscal e NFS-e sem confusão',
      description: 'Quando o MEI precisa emitir nota fiscal e como fazer isso corretamente.',
      keyTakeaways: [
        'MEI só é obrigado a emitir nota fiscal para pessoas jurídicas (empresas)',
        'Para emitir NFS-e (serviços), o MEI se cadastra no sistema da prefeitura',
        'NF-e de produtos é emitida pelo sistema estadual (SEFAZ)',
        'Venda a pessoa física não exige nota fiscal do MEI',
      ],
      content: `A dúvida sobre nota fiscal é uma das mais comuns entre os MEIs. A regra básica é simples, mas pode causar confusão.

## Quando o MEI é obrigado a emitir nota fiscal

O MEI **só é obrigado** a emitir nota fiscal quando vende para outra empresa (pessoa jurídica).

Quando vende para pessoa física (consumidor final), **não é obrigado** — mas pode emitir se quiser ou se o cliente pedir.

## Tipos de nota fiscal do MEI

### NFS-e — Nota Fiscal de Serviços Eletrônica
Para quem presta serviços (cabeleireiro, designer, eletricista, etc.):
- Emitida pelo sistema da **prefeitura** do município
- O MEI se cadastra no portal da prefeitura
- Cada cidade tem seu próprio sistema

### NF-e — Nota Fiscal Eletrônica de Produtos
Para quem vende mercadorias:
- Emitida pelo sistema da **SEFAZ estadual**
- Exige certificado digital em alguns estados

## Como orientar o empreendedor

1. Identifique se a atividade é serviço ou comércio (ou ambos)
2. Se for serviço, indique o sistema da prefeitura do município
3. Se tiver dificuldade no cadastro, ofereça suporte

## Erros comuns

- Confundir NFS-e com NF-e
- Achar que qualquer venda exige nota fiscal
- Emitir nota com dados errados e não cancelar dentro do prazo
- Não saber que cada prefeitura tem seu próprio sistema

Oriente sempre a verificar as instruções específicas do município — cada sistema é diferente.`,
    },
    {
      slug: 'debitos-regularizacao',
      order: 6,
      title: 'Débitos, regularização e parcelamento',
      description: 'Como ajudar MEIs com pendências na Receita Federal, PGFN e Simples Nacional.',
      keyTakeaways: [
        'Débitos do DAS podem ser parcelados pelo Portal do Simples Nacional',
        'O parcelamento convencional permite até 60 vezes',
        'MEI pode consultar sua situação fiscal em gov.br/mei',
        'Baixa (encerramento) do MEI só é possível após regularização',
      ],
      content: `Muitos microempreendedores chegam ao Espaço Empreendedor com débitos em aberto. Saber orientar sobre regularização é essencial.

## Consultando a situação fiscal

O MEI pode consultar sua situação pelo portal **gov.br/mei** ou pelo **e-CAC** (Centro Virtual de Atendimento da Receita Federal).

No portal MEI é possível ver:
- DAS em aberto ou atrasados
- Situação da declaração anual
- Histórico de pagamentos

## Parcelamento de débitos do Simples Nacional

Débitos do DAS podem ser parcelados pelo **Portal do Simples Nacional**:

- Acesso em **www8.receita.fazenda.gov.br/simplesnacional**
- Parcelamento convencional: até **60 parcelas**
- Parcela mínima: R$ 50,00 para MEI
- O parcelamento regulariza a situação fiscal imediatamente após o primeiro pagamento

## Débitos previdenciários (INSS)

Se o MEI ficou meses sem pagar o DAS, os meses em atraso **não contam para benefícios previdenciários** (aposentadoria, afastamento). O parcelamento não recupera esses meses retroativamente — apenas evita que a situação piore.

## Regularização antes da baixa

Para encerrar um MEI (dar baixa), é necessário:
1. Quitar ou parcelar todos os débitos
2. Entregar todas as declarações anuais pendentes
3. Solicitar a baixa pelo portal gov.br/mei

## Quando encaminhar

Se a dívida for muito alta ou envolver PGFN (Procuradoria da Fazenda Nacional), oriente o empreendedor a procurar um **contador** ou a **Defensoria Pública**, pois pode haver programas especiais de parcelamento.`,
    },
    {
      slug: 'golpes-fraudes',
      order: 7,
      title: 'Golpes, cobranças falsas e canais oficiais',
      description: 'Como identificar e alertar sobre golpes que atingem MEIs com frequência.',
      videoUrl: 'https://www.youtube.com/embed/DJzcumH_YtQ',
      keyTakeaways: [
        'Nunca pague por abertura, alteração ou manutenção de MEI',
        'A Receita Federal não liga pedindo pagamento por telefone',
        'Desconfie de boletos com logos do governo mas de dados bancários privados',
        'Canais oficiais: gov.br/mei, e-CAC, e Portal do Simples Nacional',
      ],
      content: `Os MEIs são um dos grupos mais visados por golpistas, justamente por muitas vezes não conhecerem bem seus direitos e obrigações. Parte do seu papel como extensionista é alertar sobre esses golpes.

## Golpes mais comuns

### Cobranças por abertura ou manutenção de MEI
Empresas e sites que cobram R$ 100 a R$ 500 para "abrir MEI", "regularizar CNPJ" ou "atualizar cadastro". Tudo isso é **gratuito** no portal oficial.

### Boletos falsos de "anuidade"
MEIs não pagam anuidade para nenhum órgão. Boletos com logos da Receita Federal, SEBRAE ou "Conselho Federal de MEI" são **falsos**.

### E-mails de phishing
Mensagens pedindo atualização de dados, com links para sites falsos que roubam CPF e senha do gov.br.

### Ligações de "consultores"
Pessoas que ligam afirmando que o CNPJ do MEI "está irregular" e pedem pagamento para regularizar.

### Serviços de certificado digital desnecessários
MEIs geralmente não precisam de certificado digital. Vendedores que insistem no contrário podem estar lucrando indevidamente.

## Canais 100% oficiais

| O que fazer | Canal oficial |
|------------|---------------|
| Tudo sobre MEI | gov.br/mei |
| Consultar débitos | e-CAC (gov.br/ecac) |
| Parcelamento | Portal Simples Nacional |
| Dúvidas gerais | Receita Federal: 146 |
| Nota fiscal serviços | Portal da prefeitura |

## Como orientar

Se o empreendedor chegar com um boleto suspeito:
1. Verifique o CNPJ do beneficiário — deve ser do governo
2. Confira o endereço do site — deve terminar em .gov.br
3. Nunca pague boletos sem verificar a origem
4. Denuncie suspeitas em consumidor.gov.br`,
    },
    {
      slug: 'como-atender-bem',
      order: 8,
      title: 'Como atender bem: escuta, linguagem simples e registro',
      description: 'Técnicas de atendimento humanizado e como registrar corretamente o caso.',
      keyTakeaways: [
        'Escute antes de dar respostas — entenda o problema real',
        'Use linguagem simples: evite jargões técnicos desnecessários',
        'Registre todos os atendimentos na plataforma com detalhes claros',
        'Saiba quando dizer "não sei" e encaminhar para outra fonte',
      ],
      content: `Saber o conteúdo técnico é necessário, mas não suficiente. A qualidade do atendimento depende de como você se comunica.

## A escuta ativa

Antes de dar qualquer resposta, entenda o problema real. Muitas vezes o empreendedor não sabe descrever exatamente o que precisa.

**Faça perguntas abertas:**
- "Me conta o que está acontecendo com seu negócio?"
- "O que você já tentou fazer?"
- "Qual é o maior problema hoje?"

**Evite:**
- Interromper antes de entender completamente
- Assumir que sabe o problema antes de ouvir
- Dar soluções para o problema errado

## Linguagem simples

O empreendedor não precisa entender termos técnicos — ele precisa entender o que deve fazer.

❌ "O DASN-SIMEI deve ser entregue antes do prazo decadencial"
✅ "A declaração anual do MEI precisa ser enviada até 31 de maio"

❌ "Há pendência no cadastro SEFAZ para emissão de NF-e"
✅ "Você precisa se cadastrar no sistema de nota fiscal do seu estado"

## Limites do seu papel

É normal não saber tudo. Quando não souber:
1. Diga claramente: "Preciso verificar essa informação"
2. Consulte as fontes oficiais (gov.br, Receita Federal)
3. Se for complexo demais, encaminhe para um profissional

Nunca invente respostas ou prometa algo que não pode garantir.

## Registro na plataforma

Todo atendimento deve ser registrado. Um bom registro inclui:

- **Canal e tipo de interação** — como e que tipo de atendimento foi
- **O que o empreendedor precisava** — a demanda real
- **O que você fez** — as orientações ou encaminhamentos
- **Resultado** — o que foi resolvido ou ficou pendente
- **Precisa de retorno?** — se vai ser necessário acompanhar

Um registro bem feito protege você, ajuda o professor orientador e cria histórico útil se outro extensionista precisar continuar o atendimento.`,
    },
  ],
  quiz: [
    {
      id: 1,
      question: 'Qual é o único portal oficial para abrir um MEI gratuitamente?',
      options: ['receitafederal.gov.br', 'gov.br/mei', 'sebrae.com.br', 'cnpj.net'],
      correctIndex: 1,
      explanation: 'O portal oficial e gratuito para abertura de MEI é gov.br/mei. Qualquer site que cobra por esse serviço é golpe.',
    },
    {
      id: 2,
      question: 'Qual é o limite anual de faturamento para um MEI (atividade geral)?',
      options: ['R$ 50.000', 'R$ 81.000', 'R$ 120.000', 'R$ 144.000'],
      correctIndex: 1,
      explanation: 'O MEI pode faturar até R$ 81.000 por ano (exceto caminhoneiro: R$ 251.600).',
    },
    {
      id: 3,
      question: 'O MEI é obrigado a emitir nota fiscal para qual tipo de cliente?',
      options: ['Pessoa física em qualquer valor', 'Apenas para clientes do estado', 'Pessoa jurídica (empresas)', 'Qualquer venda acima de R$ 200'],
      correctIndex: 2,
      explanation: 'O MEI só é obrigado a emitir nota fiscal quando vende para outra empresa (pessoa jurídica). Para pessoa física, não há obrigatoriedade.',
    },
    {
      id: 4,
      question: 'Qual é o prazo de vencimento do DAS mensal?',
      options: ['Dia 10 de cada mês', 'Dia 15 de cada mês', 'Dia 20 de cada mês', 'Último dia do mês'],
      correctIndex: 2,
      explanation: 'O DAS vence no dia 20 de cada mês. O atraso gera multa e juros.',
    },
    {
      id: 5,
      question: 'Um empreendedor recebe um boleto para pagar "anuidade do CNPJ MEI". O que você deve orientar?',
      options: [
        'Pagar pois todo CNPJ paga anuidade',
        'Verificar se é emitido pelo SEBRAE',
        'Não pagar — MEI não paga anuidade, é golpe',
        'Pagar apenas se for menos de R$ 100',
      ],
      correctIndex: 2,
      explanation: 'MEI não paga anuidade para nenhum órgão. Qualquer boleto cobrando isso é golpe.',
    },
    {
      id: 6,
      question: 'Qual é o prazo para entrega da declaração anual do MEI (DASN-SIMEI)?',
      options: ['31 de março', '30 de abril', '31 de maio', '30 de junho'],
      correctIndex: 2,
      explanation: 'A DASN-SIMEI deve ser entregue até 31 de maio de cada ano, com dados do ano anterior.',
    },
    {
      id: 7,
      question: 'Quantos funcionários o MEI pode contratar?',
      options: ['Nenhum', 'Apenas 1', 'Até 3', 'Sem limite'],
      correctIndex: 1,
      explanation: 'O MEI pode ter apenas 1 funcionário, que deve receber o salário mínimo ou o piso salarial da categoria.',
    },
    {
      id: 8,
      question: 'Um empreendedor não sabe emitir NFS-e. Onde ele deve se cadastrar?',
      options: ['Portal gov.br/mei', 'SEFAZ do estado', 'Portal da prefeitura do município', 'Receita Federal'],
      correctIndex: 2,
      explanation: 'NFS-e (nota de serviços) é emitida pelo sistema da prefeitura do município. Cada cidade tem seu próprio portal.',
    },
    {
      id: 9,
      question: 'Como orientador extensionista, o que você deve fazer quando não sabe a resposta para uma dúvida?',
      options: [
        'Dar uma resposta baseada no que acha correto',
        'Dizer que não sabe e encaminhar para fonte oficial ou profissional',
        'Evitar o assunto e mudar o tema',
        'Pedir ao empreendedor que pesquise sozinho',
      ],
      correctIndex: 1,
      explanation: 'Dizer "não sei" e encaminhar corretamente é mais responsável do que inventar respostas. Isso protege você e o empreendedor.',
    },
    {
      id: 10,
      question: 'O que deve constar no registro de um atendimento na plataforma?',
      options: [
        'Apenas o nome do empreendedor',
        'Canal, demanda do empreendedor, o que foi feito, resultado e se precisa retorno',
        'Somente se o caso foi resolvido',
        'Apenas o tempo gasto no atendimento',
      ],
      correctIndex: 1,
      explanation: 'Um registro completo inclui canal, tipo de interação, a demanda real, as ações tomadas, o resultado e se há necessidade de retorno.',
    },
  ],
};

export const COURSES: Course[] = [MEI_COURSE];

export function getCourseBySlug(slug: string): Course | undefined {
  return COURSES.find((c) => c.slug === slug);
}
