import {
  AlertTriangle,
  Briefcase,
  CalendarDays,
  ClipboardList,
  Compass,
  CreditCard,
  FileCheck2,
  FileText,
  ListChecks,
  PiggyBank,
  ShieldCheck,
  Sparkles,
  Truck,
  Users,
} from "lucide-react";

import { AlertCard } from "@/components/info/alert-card";
import { Comparison } from "@/components/info/comparison";
import { InfoCTA } from "@/components/info/info-cta";
import { InfoHero } from "@/components/info/info-hero";
import { QuickFacts } from "@/components/info/quick-facts";
import { RichGuide } from "@/components/info/rich-guide";
import { ScenarioTabs } from "@/components/info/scenario-tabs";
import { SectionHeader } from "@/components/feedback/section-header";
import { StepFlow } from "@/components/info/step-flow";
import { PublicShell } from "@/components/layout/public-shell";

export default function AbrirMeiPage() {
  return (
    <PublicShell>
      <section className="mx-auto max-w-6xl space-y-14 px-4 py-10 md:px-6 md:py-16">
        <InfoHero
          eyebrow="Começar com segurança"
          title="Quero abrir meu MEI."
          highlight="Por onde começo?"
          description="O MEI é o primeiro passo para quem trabalha por conta própria e quer formalizar o negócio. Antes de abrir, vale entender quem pode, o que separar e o que esperar depois."
          chips={[
            { label: "Gratuito no canal oficial", tone: "green" },
            { label: "Limite de R$ 81 mil/ano", tone: "neutral" },
            { label: "Conta gov.br necessária", tone: "neutral" },
          ]}
          essential={{
            title: "O essencial",
            lines: [
              "Quem trabalha por conta própria pode formalizar o negócio como MEI.",
              "Abrir MEI é gratuito quando feito pelo portal oficial.",
              "Você precisa de conta gov.br ativa antes de começar.",
              "Depois de aberto, há cuidados mensais e anuais simples.",
            ],
          }}
        />

        {/* Entenda rápido */}
        <div className="space-y-5">
          <SectionHeader
            eyebrow="Entenda rápido"
            title="Tudo que muda quando você abre o MEI"
            description="Quatro pontos para já formar uma ideia geral antes de mergulhar nos detalhes."
          />
          <QuickFacts
            items={[
              {
                icon: "Briefcase",
                kicker: "O que é",
                title: "Um CNPJ simples para você",
                description:
                  "MEI é o regime empresarial mais simples do país. Você passa a ter CNPJ, emitir nota e contribuir para a Previdência.",
                tone: "orange",
              },
              {
                icon: "ShieldCheck",
                kicker: "Por que importa",
                title: "Cobertura previdenciária",
                description:
                  "Pagando o DAS em dia, você mantém direito a benefícios como auxílio-doença, aposentadoria e salário-maternidade.",
                tone: "green",
              },
              {
                icon: "AlertTriangle",
                kicker: "Erro comum",
                title: "Pagar para abrir",
                description:
                  "Não existe taxa para abrir MEI no canal oficial. Cobranças por essa abertura são quase sempre golpe ou serviço opcional.",
                tone: "amber",
              },
              {
                icon: "Sparkles",
                kicker: "Próximo passo",
                title: "Reúna os dados básicos",
                description:
                  "CPF, endereço, atividade e conta gov.br nível prata ou ouro são suficientes para começar.",
                tone: "neutral",
              },
            ]}
          />
        </div>

        {/* Passo a passo */}
        <div className="space-y-5">
          <SectionHeader
            eyebrow="Como funciona"
            title="O caminho da abertura, em 4 passos"
            description="Uma trilha simples para você ter clareza de cada etapa antes de começar."
          />
          <StepFlow
            variant="horizontal"
            items={[
              {
                icon: "ListChecks",
                title: "Confirme se pode abrir",
                description:
                  "Verifique se sua atividade está na lista oficial e se você cumpre os requisitos básicos do MEI.",
                hint: "Quem é sócio ou administrador de outra empresa não pode ser MEI.",
              },
              {
                icon: "ClipboardList",
                title: "Separe o que é exigido",
                description:
                  "Conta gov.br ativa, CPF, endereço e a atividade que vai registrar como ocupação principal.",
              },
              {
                icon: "FileCheck2",
                title: "Faça a abertura no portal",
                description:
                  "O cadastro é todo online e leva poucos minutos. Você sai com CNPJ e o CCMEI no mesmo dia.",
              },
              {
                icon: "CalendarDays",
                title: "Organize a rotina",
                description:
                  "Pague o DAS todo mês até o dia 20 e envie a declaração anual até 31 de maio.",
              },
            ]}
          />
        </div>

        {/* Cenários */}
        <div className="space-y-5">
          <SectionHeader
            eyebrow="Por situação"
            title="Encontre o cenário mais próximo do seu"
            description="Cada perfil tem cuidados ligeiramente diferentes. Veja qual mais se parece com o seu momento."
          />
          <ScenarioTabs
            scenarios={[
              {
                id: "primeira-vez",
                icon: "Compass",
                label: "Estou começando agora",
                hint: "Primeiro CNPJ da vida",
                intro:
                  "Você ainda não teve CNPJ. A ideia é entender o básico e abrir com calma, sem pressão.",
                steps: [
                  "Crie ou eleve sua conta gov.br para nível prata ou ouro.",
                  "Liste o que você faz no dia a dia: produto, serviço ou os dois.",
                  "Confira se sua atividade entra na lista oficial do MEI.",
                  "Faça a abertura pelo portal oficial, sem intermediário.",
                ],
                nextStep:
                  "Depois de aberto, marque o dia 20 de cada mês para pagar o DAS.",
              },
              {
                id: "vendedor",
                icon: "Truck",
                label: "Vendo produto",
                hint: "Comércio físico ou online",
                intro:
                  "Quem vende produto precisa pensar em estoque, nota e canal de venda. O MEI cobre vários tipos de comércio.",
                steps: [
                  "Confirme o CNAE da sua atividade comercial.",
                  "Verifique regras locais da prefeitura, se houver loja física.",
                  "Quando vender para empresa, a emissão de nota costuma ser obrigatória.",
                  "Para vendas em marketplace, mantenha controle do que entra no mês.",
                ],
                nextStep: "Em caso de dúvida sobre nota fiscal, veja a página específica.",
              },
              {
                id: "prestador",
                icon: "Users",
                label: "Presto serviço",
                hint: "Trabalho autônomo",
                intro:
                  "Para serviço, o padrão principal é a NFS-e nacional, com acesso pelo portal oficial.",
                steps: [
                  "Confirme se sua ocupação é permitida no MEI.",
                  "Habilite a emissão de NFS-e no emissor nacional.",
                  "Combine com a empresa contratante quando a nota será emitida.",
                  "Guarde os comprovantes de cada serviço prestado.",
                ],
                nextStep:
                  "Use o emissor oficial. Não pague apps de terceiros sem necessidade.",
              },
              {
                id: "freelancer",
                icon: "PiggyBank",
                label: "Sou autônomo informal",
                hint: "Já trabalho, mas sem CNPJ",
                intro:
                  "Você já trabalha por conta própria e está pensando em formalizar. O MEI pode dar mais segurança jurídica e previdenciária.",
                steps: [
                  "Estime quanto fatura por mês para projetar o limite anual.",
                  "Veja se o que você faz está na lista oficial do MEI.",
                  "Considere a vantagem de contribuir para o INSS pelo DAS.",
                  "Combine com o cliente atual a transição para venda com nota.",
                ],
                nextStep:
                  "Se a sua atividade não couber no MEI, há outros regimes a considerar com orientação.",
              },
            ]}
          />
        </div>

        {/* Guia principal */}
        <div className="space-y-5">
          <SectionHeader
            eyebrow="Guia detalhado"
            title="O que você precisa saber para abrir com tranquilidade"
            description="Toque em cada bloco para ver checklist, dicas e cuidados específicos."
          />
          <RichGuide
            sections={[
              {
                icon: "Users",
                title: "Quem pode abrir o MEI",
                intro:
                  "Antes de qualquer passo, vale conferir os requisitos básicos. Eles são poucos, mas todos importam.",
                checklist: [
                  "Sua atividade precisa estar na lista oficial de ocupações do MEI.",
                  "Faturamento de até R$ 81 mil por ano (proporcional no primeiro ano).",
                  "Não pode ser sócio, titular ou administrador de outra empresa.",
                  "MEI não tem filial e pode contratar no máximo um empregado.",
                ],
                tip: "Se sua atividade não estiver na lista, há outros regimes simples que valem a pena consultar.",
              },
              {
                icon: "ClipboardList",
                title: "O que separar antes de começar",
                intro: "Itens simples que evitam idas e vindas durante o cadastro.",
                checklist: [
                  "Conta gov.br nível prata ou ouro, com biometria validada.",
                  "CPF, RG e dados pessoais atualizados.",
                  "Endereço onde a atividade vai funcionar (pode ser residencial).",
                  "Nome da atividade principal e até 15 ocupações secundárias.",
                  "Consulta básica na prefeitura quando houver atendimento ao público.",
                ],
                action:
                  "Com tudo separado, a abertura no portal oficial leva poucos minutos.",
              },
              {
                icon: "FileText",
                title: "O que você recebe ao final",
                intro:
                  "Logo após a confirmação, você já consegue baixar e usar todos os documentos do MEI.",
                checklist: [
                  "CNPJ ativo no mesmo dia.",
                  "Registro empresarial automático.",
                  "CCMEI — o certificado oficial do seu MEI.",
                  "Acesso aos serviços do regime simplificado.",
                ],
                tip: "Salve o CCMEI em PDF e também no celular. É comum precisar dele em bancos e cadastros.",
              },
              {
                icon: "CreditCard",
                title: "Cuidados financeiros logo no início",
                intro:
                  "Mesmo com pouco faturamento, a guia mensal continua existindo. Um detalhe simples evita dor de cabeça.",
                checklist: [
                  "DAS vence todo dia 20 — atrasos geram juros e multa.",
                  "Mantenha conta separada para movimentar o que vem do MEI.",
                  "Guarde comprovantes e notas por pelo menos 5 anos.",
                  "Acompanhe quanto fatura por mês para não estourar o limite anual.",
                ],
                warning:
                  "Se atrasar muitos meses seguidos, o CNPJ pode ser cancelado e cair em dívida ativa.",
              },
            ]}
          />
        </div>

        {/* Comparativo oficial vs golpe */}
        <div className="space-y-5">
          <SectionHeader
            eyebrow="Identifique"
            title="O canal oficial e o que tenta se passar por ele"
            description="A maioria das cobranças relacionadas ao MEI fora do canal oficial não é exigência do governo."
          />
          <Comparison
            goodLabel="Canal oficial"
            badLabel="Sinais suspeitos"
            good={{
              title: "Portal e app oficiais do governo",
              caption: "Sempre encerram em .gov.br e usam login gov.br.",
              items: [
                "Abertura de MEI feita gratuitamente no portal oficial.",
                "Emissão de DAS e nota com login gov.br.",
                "Boletos com favorecido vinculado à União ou município.",
                "Comunicação por canais oficiais, sem pressa.",
              ],
            }}
            bad={{
              title: "Cobrança ou boleto fora do canal oficial",
              caption: "Costumam imitar layout, mas mudam o domínio ou o favorecido.",
              items: [
                "E-mail ou SMS pedindo pagamento urgente para abrir CNPJ.",
                "Boleto cobrando 'taxa de adesão' ou 'inscrição obrigatória'.",
                "Site parecido com o oficial, mas sem .gov.br no endereço.",
                "Promessa de abertura instantânea com cobrança mensal.",
              ],
            }}
          />
        </div>

        {/* Erros comuns */}
        <AlertCard
          tone="amber"
          eyebrow="Erros comuns"
          title="O que costuma travar quem está abrindo pela primeira vez"
          description="Pequenos descuidos no começo podem dar trabalho lá na frente. Atenção especial a estes pontos."
          items={[
            "Escolher uma atividade principal que não combina com o que vende ou faz.",
            "Esquecer de pagar o DAS achando que é opcional.",
            "Pagar boleto enviado por e-mail sem conferir o emissor.",
            "Acreditar em mensagens com 'cancelamento imediato'.",
            "Misturar conta pessoal e conta do MEI.",
            "Esquecer da declaração anual no ano seguinte.",
          ]}
        />

        {/* CTA */}
        <InfoCTA
          title="Quer abrir com alguém para tirar dúvida?"
          description="A equipe do Espaço Empreendedor te orienta na abertura, ajuda a escolher a atividade certa e tira dúvidas sobre o pós-MEI."
        />
      </section>
    </PublicShell>
  );
}
