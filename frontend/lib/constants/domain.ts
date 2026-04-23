import type { PillTone } from "@/components/ui/pill";
import type {
  AttendanceChannel,
  AttendanceInteractionType,
  CaseCategory,
  CaseStatus,
  UserRole,
  ValidationStatus,
} from "@/types/api";

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api";

export const APP_NAME = "Espaço do Empreendedor";

export const PREFERRED_CHANNEL_OPTIONS: Array<{
  value: AttendanceChannel;
  label: string;
  description: string;
}> = [
  { value: "WHATSAPP", label: "WhatsApp", description: "Mensagem pelo celular" },
  { value: "TELEFONE", label: "Ligação", description: "Chamada de voz" },
  { value: "PRESENCIAL", label: "Presencial", description: "Atendimento no local do projeto" },
  { value: "EMAIL", label: "E-mail", description: "Resposta por e-mail" },
  { value: "OUTRO", label: "Outro", description: "Combinar na hora" },
];

export const PREFERRED_CHANNEL_LABEL: Record<AttendanceChannel, string> = {
  WHATSAPP: "WhatsApp",
  TELEFONE: "Ligação",
  PRESENCIAL: "Presencial",
  EMAIL: "E-mail",
  OUTRO: "Outro",
};

export const CATEGORY_OPTIONS: Array<{ value: CaseCategory; label: string; help: string }> = [
  { value: "ABERTURA_MEI", label: "Abrir meu MEI", help: "Entender requisitos e começar do jeito certo." },
  { value: "ENQUADRAMENTO", label: "Ver se posso ser MEI", help: "Checar se sua atividade cabe no regime." },
  { value: "OCUPACOES_PERMITIDAS", label: "Atividade permitida", help: "Confirmar se a ocupação está na lista oficial." },
  { value: "DAS", label: "Pagamento do DAS", help: "Emitir, entender atraso ou organizar o pagamento mensal." },
  { value: "DECLARACAO_ANUAL", label: "Declaração anual", help: "Enviar a DASN-SIMEI ou entender pendências." },
  { value: "CCMEI", label: "CCMEI", help: "Emitir ou localizar o comprovante do MEI." },
  { value: "CONSULTA_CNPJ", label: "Consulta de CNPJ", help: "Entender comprovantes e situação cadastral." },
  { value: "NOTA_FISCAL", label: "Nota fiscal", help: "Saber quando emitir e por onde começar." },
  { value: "DEBITOS_PARCELAMENTO", label: "Débitos e parcelamento", help: "Regularizar pendências com mais clareza." },
  { value: "REGULARIZACAO", label: "Regularização geral", help: "Resolver dados, pendências ou ajustes do MEI." },
  { value: "BENEFICIOS_PREVIDENCIARIOS", label: "Benefícios do MEI", help: "Entender direitos e limites previdenciários." },
  { value: "CONTRATACAO_EMPREGADO", label: "Contratar empregado", help: "Ver limite, salário e cuidados básicos." },
  { value: "GOV_BR", label: "Conta gov.br", help: "Resolver acesso e níveis da conta." },
  { value: "GOLPES_FRAUDES", label: "Cobrança suspeita ou golpe", help: "Identificar sinais de fraude e agir com segurança." },
  { value: "OUTROS", label: "Outro assunto", help: "Se não encontrou sua situação na lista." },
];

export const CATEGORY_LABEL: Record<CaseCategory, string> = Object.fromEntries(
  CATEGORY_OPTIONS.map((option) => [option.value, option.label]),
) as Record<CaseCategory, string>;

export const STATUS_LABEL: Record<CaseStatus, string> = {
  NEW: "Novo",
  TRIAGED: "Triado",
  ASSIGNED: "Assumido",
  IN_PROGRESS: "Em andamento",
  WAITING_USER: "Aguardando você",
  WAITING_SUPERVISION: "Acompanhamento interno",
  RESOLVED: "Resolvido",
  CLOSED: "Fechado",
  CANCELLED: "Cancelado",
};

export const VALIDATION_LABEL: Record<ValidationStatus, string> = {
  PENDING: "Pendente",
  APPROVED: "Aprovado",
  REJECTED: "Reprovado",
};

export const STATUS_TONE: Record<CaseStatus, PillTone> = {
  NEW: "amber",
  TRIAGED: "orange",
  ASSIGNED: "blue",
  IN_PROGRESS: "orange",
  WAITING_USER: "amber",
  WAITING_SUPERVISION: "blue",
  RESOLVED: "green",
  CLOSED: "neutral",
  CANCELLED: "red",
};

export const VALIDATION_TONE: Record<ValidationStatus, PillTone> = {
  PENDING: "amber",
  APPROVED: "green",
  REJECTED: "red",
};

export const CASE_TRANSITIONS: Record<CaseStatus, CaseStatus[]> = {
  NEW: ["TRIAGED", "ASSIGNED", "CANCELLED"],
  TRIAGED: ["ASSIGNED", "CANCELLED"],
  ASSIGNED: ["IN_PROGRESS", "WAITING_USER", "RESOLVED", "CLOSED", "CANCELLED"],
  IN_PROGRESS: ["WAITING_USER", "WAITING_SUPERVISION", "RESOLVED", "CLOSED", "CANCELLED"],
  WAITING_USER: ["IN_PROGRESS", "CLOSED", "CANCELLED"],
  WAITING_SUPERVISION: ["IN_PROGRESS", "RESOLVED", "CLOSED", "CANCELLED"],
  RESOLVED: ["CLOSED"],
  CLOSED: [],
  CANCELLED: [],
};

export const CASE_TRANSITIONS_BY_ROLE = (status: CaseStatus, role: UserRole) => {
  void role;
  const base = CASE_TRANSITIONS[status];
  return base;
};

export const PUBLIC_NAV = [
  { href: "/", label: "Início" },
  { href: "/quero-ajuda", label: "Quero ajuda" },
  { href: "/acompanhar", label: "Acompanhar" },
  { href: "/informacoes/abrir-mei", label: "Abrir MEI" },
  { href: "/sobre", label: "Sobre" },
];

export const INTERACTION_TYPE_OPTIONS: Array<{
  value: AttendanceInteractionType;
  label: string;
  description: string;
  durationMin: number;
}> = [
  {
    value: "SIMPLE_GUIDANCE",
    label: "Orientação simples",
    description: "Resposta direta a uma dúvida pontual",
    durationMin: 15,
  },
  {
    value: "GUIDANCE_WITH_REFERRAL",
    label: "Orientação com encaminhamento",
    description: "Orientei e direcionei o empreendedor para o canal ou recurso correto",
    durationMin: 30,
  },
  {
    value: "DETAILED_SUPPORT",
    label: "Apoio detalhado",
    description: "Analisei a situação com mais profundidade e prestei suporte estruturado",
    durationMin: 45,
  },
];

export const INTERACTION_TYPE_LABEL: Record<AttendanceInteractionType, string> = {
  SIMPLE_GUIDANCE: "Orientação simples",
  GUIDANCE_WITH_REFERRAL: "Orientação com encaminhamento",
  DETAILED_SUPPORT: "Apoio detalhado",
  ONGOING_CASE: "Apoio detalhado", // fallback para registros legados
};

export const STUDENT_NAV: Array<{ href: string; label: string; badge?: number | string }> = [
  { href: "/aluno/fila", label: "Fila" },
  { href: "/aluno/meus-casos", label: "Meus casos" },
  { href: "/aluno/relatorio-extensao", label: "Relatório de extensão" },
];

export const PROFESSOR_NAV: Array<{ href: string; label: string; badge?: number | string }> = [
  { href: "/professor/dashboard", label: "Dashboard" },
  { href: "/professor/alunos", label: "Alunos" },
  { href: "/professor/relatorios", label: "Relatórios" },
];

export const QUICK_ACTIONS = [
  {
    title: "Quero abrir meu MEI",
    description: "Veja quem pode abrir, o que precisa separar e como fazer tudo no canal oficial.",
    href: "/informacoes/abrir-mei",
  },
  {
    title: "Já sou MEI",
    description: "Entenda DAS, declaração anual, atualização de dados, dívidas e baixa do CNPJ.",
    href: "/informacoes/ja-sou-mei",
  },
  {
    title: "Nota fiscal e DAS",
    description: "Saiba quando emitir nota, onde gerar a guia mensal e o que não pode esquecer.",
    href: "/informacoes/nota-fiscal",
  },
  {
    title: "Recebi uma cobrança estranha",
    description: "Aprenda a reconhecer golpe, conferir o site certo e evitar pagamento indevido.",
    href: "/informacoes/golpes",
  },
];

export const FAQ_ITEMS = [
  {
    question: "Abrir MEI é pago?",
    answer:
      "Não. A abertura oficial do MEI é gratuita no Portal do Empreendedor. Se aparecer taxa para abrir, desconfie.",
  },
  {
    question: "Quanto o MEI paga por mês?",
    answer:
      "O MEI paga o DAS todo mês. A guia junta INSS e, conforme a atividade, um valor fixo de ISS e ou ICMS. O vencimento normal é dia 20.",
  },
  {
    question: "Preciso declarar mesmo sem faturar?",
    answer:
      "Sim. A declaração anual continua obrigatória mesmo se a empresa ficou parada ou faturou zero.",
  },
  {
    question: "Posso emitir nota fiscal?",
    answer:
      "Pode, e em muitos casos precisa. Para serviço, o MEI usa a NFS-e nacional. Para produto, a regra depende da operação e da orientação da Sefaz.",
  },
  {
    question: "Posso contratar alguém?",
    answer:
      "Pode, mas só um empregado. Depois disso, entram eSocial, FGTS, folha e outras rotinas mensais.",
  },
  {
    question: "Posso fechar o MEI mesmo com dívida?",
    answer:
      "Pode pedir a baixa, mas a dívida antiga não desaparece. O CNPJ fecha, mas a pendência continua e pode ficar ligada ao CPF.",
  },
];

export const INFO_PAGES = {
  "abrir-mei": {
    eyebrow: "Começar com segurança",
    title: "Quer abrir seu MEI e não sabe por onde começar?",
    intro:
      "O MEI foi feito para quem trabalha por conta própria e quer se formalizar sem complicação. Antes de abrir, vale checar se sua atividade entra no regime e se você cumpre as regras básicas.",
    blocks: [
      {
        title: "Quem pode abrir",
        items: [
          "A atividade precisa estar na lista oficial do MEI.",
          "Na regra comum, o limite é de R$ 81 mil por ano.",
          "No primeiro ano, esse limite é proporcional aos meses de atividade.",
          "Quem é MEI não pode ser sócio, titular ou administrador de outra empresa.",
          "O MEI não pode ter filial.",
          "É permitido contratar no máximo um empregado.",
        ],
      },
      {
        title: "O que separar antes de abrir",
        items: [
          "Conta gov.br com nível adequado, normalmente prata ou ouro.",
          "CPF, RG e dados pessoais atualizados.",
          "Endereço onde a atividade vai funcionar.",
          "Nome da atividade e ocupações que vai registrar.",
          "Consulta básica na prefeitura para ver regras do local.",
        ],
      },
      {
        title: "O que você recebe ao final",
        items: [
          "CNPJ.",
          "Registro empresarial.",
          "CCMEI, que é o certificado do seu MEI.",
          "Acesso aos serviços oficiais do regime.",
        ],
      },
      {
        title: "Cuidados importantes",
        items: [
          "A abertura oficial é gratuita.",
          "O único caminho seguro é o portal oficial do governo.",
          "Cobrança para abrir MEI não faz parte do procedimento oficial.",
          "Se o site parecer estranho, pare antes de informar dados ou pagar.",
        ],
      },
    ],
  },
  "ja-sou-mei": {
    eyebrow: "Rotina do negócio",
    title: "Já tem MEI e precisa organizar sua situação?",
    intro:
      "O MEI é simples, mas precisa de cuidado ao longo do ano. Pagar o DAS, declarar no prazo e manter os dados corretos evita multa e dor de cabeça.",
    blocks: [
      {
        title: "Todo mês",
        items: [
          "Pague o DAS até o dia 20.",
          "Mesmo sem faturar, a guia mensal continua existindo.",
          "Acompanhe quanto entrou no mês para não perder o limite anual.",
          "Guarde notas e comprovantes por segurança.",
        ],
      },
      {
        title: "Todo ano",
        items: [
          "Envie a DASN-SIMEI até 31 de maio.",
          "A declaração é obrigatória mesmo sem faturamento.",
          "Atraso gera multa e bagunça a vida do CNPJ.",
        ],
      },
      {
        title: "Se você estiver com dívida",
        items: [
          "Primeiro veja se é guia do mês, atraso antigo ou parcelamento.",
          "Débito pode ser pago à vista ou parcelado, conforme o sistema permitir.",
          "Se a dívida já foi para a PGFN, a regularização pode ir para o Regularize.",
          "Atrasar parcelas pode cancelar o parcelamento.",
        ],
      },
      {
        title: "Quando algo mudar ou acabar",
        items: [
          "Atualize telefone, endereço e atividade no portal oficial.",
          "Depois da alteração, gere um novo CCMEI.",
          "Se parar de vez, faça a baixa do CNPJ no portal.",
          "A baixa não apaga dívida antiga nem a declaração pendente.",
        ],
      },
    ],
  },
  golpes: {
    eyebrow: "Segurança",
    title: "Recebeu uma cobrança estranha? Veja como se proteger.",
    intro:
      "Golpe contra MEI costuma vir com pressa, ameaça e aparência de documento oficial. O principal é separar o que é cobrança do governo, serviço privado opcional e fraude.",
    blocks: [
      {
        title: "Sinais mais comuns de golpe",
        items: [
          "Boleto enviado sem você pedir.",
          "Mensagem com ameaça de cancelamento imediato.",
          "Cobrança para abrir ou regularizar MEI sem passar pelo portal oficial.",
          "Link estranho, domínio diferente ou canal sem .gov.br.",
        ],
      },
      {
        title: "Como conferir antes de pagar",
        items: [
          "Entre você mesmo no canal oficial para emitir a guia.",
          "Confira se o site termina em .gov.br.",
          "Se for Pix, confira o favorecido mostrado no ambiente oficial.",
          "Não trate boleto de associação como taxa obrigatória do governo.",
        ],
      },
      {
        title: "Se você suspeitar de fraude",
        items: [
          "Pare antes de pagar.",
          "Guarde print, boleto, link e mensagem.",
          "Verifique sua situação no portal oficial.",
          "Recupere a conta gov.br se achar que alguém mexeu no seu cadastro.",
          "Peça ajuda humana se continuar em dúvida.",
        ],
      },
    ],
  },
  "nota-fiscal": {
    eyebrow: "Operação do dia a dia",
    title: "Entenda nota fiscal e guia mensal sem complicação.",
    intro:
      "O primeiro passo é separar produto de serviço. Depois disso, fica mais fácil entender quando emitir nota e como seguir o canal certo.",
    blocks: [
      {
        title: "Quando a nota entra na conversa",
        items: [
          "Para vender ou prestar serviço para empresa, a emissão de nota ganha centralidade.",
          "Para pessoa física, a regra depende do tipo de operação.",
          "Se você presta serviço, o padrão principal do MEI é a NFS-e nacional.",
        ],
      },
      {
        title: "Produto e serviço não são a mesma coisa",
        items: [
          "Produto normalmente segue a lógica da NF-e.",
          "Serviço normalmente segue a lógica da NFS-e.",
          "Antes de emitir, confirme se sua atividade é venda, serviço ou os dois.",
        ],
      },
      {
        title: "Sobre a NFS-e do MEI",
        items: [
          "O MEI prestador de serviços usa o emissor nacional.",
          "Em muitos casos, dá para acessar com conta gov.br.",
          "Nem sempre é preciso certificado digital para esse fluxo.",
        ],
      },
      {
        title: "DAS: o básico que você precisa lembrar",
        items: [
          "O DAS vence no dia 20.",
          "A guia reúne INSS e valores fixos de imposto, conforme a atividade.",
          "Pode ser emitida no portal oficial ou no app oficial do MEI.",
          "Não espere receber essa guia por mensagem como se fosse rotina do governo.",
        ],
      },
    ],
  },
  beneficios: {
    eyebrow: "Proteção previdenciária",
    title: "Veja os benefícios que o MEI pode ter quando está em dia.",
    intro:
      "Pagar o DAS não serve só para manter o CNPJ regular. A guia também ajuda a manter a proteção do INSS, mas isso depende de pagamento em dia e, em alguns casos, de carência.",
    blocks: [
      {
        title: "Benefícios mais conhecidos",
        items: [
          "Aposentadoria por idade.",
          "Auxílio por incapacidade temporária.",
          "Aposentadoria por incapacidade permanente.",
          "Salário-maternidade.",
          "Pensão por morte e auxílio-reclusão para dependentes, quando cabível.",
        ],
      },
      {
        title: "O que precisa acontecer para ter direito",
        items: [
          "O DAS precisa estar pago em dia.",
          "Alguns benefícios exigem carência, que é um tempo mínimo de contribuição.",
          "Abrir o MEI hoje não significa ter acesso imediato a todo benefício.",
        ],
      },
      {
        title: "Sobre aposentadoria",
        items: [
          "A regra depende da idade, do tempo de contribuição e do histórico da pessoa.",
          "Em geral, a contribuição normal do MEI conversa com aposentadoria por idade.",
          "Para tempo de contribuição ou valor maior, pode existir complementação.",
        ],
      },
      {
        title: "Se você estiver em dúvida",
        items: [
          "Olhe seu histórico de pagamento primeiro.",
          "Não confie em promessa rápida de benefício garantido.",
          "Quando a dúvida for individual, vale consultar o INSS ou pedir orientação.",
        ],
      },
    ],
  },
} as const;
