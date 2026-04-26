import {
  AlertTriangle,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  Coins,
  DoorOpen,
  FileEdit,
  PauseCircle,
  RefreshCcw,
  RotateCcw,
  ScrollText,
  Settings,
  Sparkles,
  Wallet,
} from "lucide-react";

import { AlertCard } from "@/components/info/alert-card";
import { InfoCTA } from "@/components/info/info-cta";
import { InfoHero } from "@/components/info/info-hero";
import { QuickFacts } from "@/components/info/quick-facts";
import { RichGuide } from "@/components/info/rich-guide";
import { ScenarioTabs } from "@/components/info/scenario-tabs";
import { SectionHeader } from "@/components/feedback/section-header";
import { StepFlow } from "@/components/info/step-flow";
import { PublicShell } from "@/components/layout/public-shell";

export default function JaSouMeiPage() {
  return (
    <PublicShell>
      <section className="mx-auto max-w-6xl space-y-14 px-4 py-10 md:px-6 md:py-16">
        <InfoHero
          eyebrow="Rotina do negócio"
          title="Já tenho MEI."
          highlight="Como manter tudo em dia?"
          description="Depois da abertura, o cuidado vira rotina. Pagar a guia mensal, declarar uma vez por ano e atualizar mudanças evita multas e mantém seus benefícios ativos."
          chips={[
            { label: "DAS todo dia 20", tone: "orange" },
            { label: "DASN-SIMEI até 31/maio", tone: "amber" },
            { label: "Tudo no portal oficial", tone: "neutral" },
          ]}
          essential={{
            title: "O que se repete",
            lines: [
              "Pagar o DAS uma vez por mês mantém o INSS em dia.",
              "A declaração anual confirma o faturamento do ano anterior.",
              "Mudanças de endereço, atividade ou contato precisam ser atualizadas.",
              "Encerrar o MEI também tem caminho oficial e gratuito.",
            ],
          }}
        />

        {/* Entenda rápido */}
        <div className="space-y-5">
          <SectionHeader
            eyebrow="Entenda rápido"
            title="Os quatro cuidados que sustentam o seu MEI"
            description="Quando isso fica em dia, você evita 90% dos problemas mais comuns."
          />
          <QuickFacts
            items={[
              {
                icon: "CalendarClock",
                kicker: "Todo mês",
                title: "Pague o DAS",
                description:
                  "Vence dia 20. Mesmo sem faturar no mês, a guia continua existindo.",
                tone: "orange",
              },
              {
                icon: "ScrollText",
                kicker: "Todo ano",
                title: "Faça a declaração",
                description:
                  "DASN-SIMEI até 31 de maio. É obrigatória mesmo se você não teve faturamento.",
                tone: "amber",
              },
              {
                icon: "FileEdit",
                kicker: "Quando muda",
                title: "Atualize seus dados",
                description:
                  "Endereço, telefone, atividade. Tudo pelo portal oficial e sem custo.",
                tone: "neutral",
              },
              {
                icon: "DoorOpen",
                kicker: "Se for parar",
                title: "Faça a baixa",
                description:
                  "O encerramento também é gratuito. Dívida antiga não some — mas o CNPJ deixa de gerar nova guia.",
                tone: "neutral",
              },
            ]}
          />
        </div>

        {/* Cenários */}
        <div className="space-y-5">
          <SectionHeader
            eyebrow="Por situação"
            title="Em qual desses momentos você está agora?"
            description="Escolha o cenário mais próximo da sua realidade para ver o caminho recomendado."
          />
          <ScenarioTabs
            scenarios={[
              {
                id: "em-dia",
                icon: "CheckCircle2",
                label: "Estou em dia",
                hint: "Sem dívida, mas quero organizar",
                intro:
                  "Você quer manter o ritmo e ganhar previsibilidade. A ideia é criar pequenos hábitos que evitam surpresas.",
                steps: [
                  "Coloque um lembrete recorrente para o dia 20 de cada mês.",
                  "Marque uma data fixa em maio para a declaração anual.",
                  "Acompanhe o quanto entra para não estourar o limite anual.",
                  "Mantenha conta separada para o que é do MEI.",
                ],
                nextStep:
                  "Ative os avisos do app oficial do MEI para receber lembretes automáticos.",
              },
              {
                id: "atrasado",
                icon: "AlertTriangle",
                label: "Tenho DAS atrasado",
                hint: "Algumas guias em aberto",
                intro:
                  "Atraso pontual tem solução simples. O importante é entender o tipo de dívida antes de pagar.",
                steps: [
                  "Entre no portal oficial e veja o que está em aberto.",
                  "Avalie pagar à vista ou parcelar pelo próprio sistema.",
                  "Se a dívida foi para a PGFN, a regularização vai pelo Regularize.",
                  "Depois de regularizar, retome a rotina mensal normalmente.",
                ],
                nextStep:
                  "Atrasos antigos podem afetar benefícios — vale buscar orientação se for um caso recorrente.",
              },
              {
                id: "mudou-negocio",
                icon: "RefreshCcw",
                label: "Algo no negócio mudou",
                hint: "Endereço, atividade ou contato",
                intro:
                  "Mudanças simples são feitas pelo próprio portal. Manter o cadastro atualizado evita problemas futuros.",
                steps: [
                  "Faça login no portal do empreendedor com a conta gov.br.",
                  "Atualize o que mudou: endereço, telefone, ocupações.",
                  "Após a alteração, gere novamente o CCMEI para guardar.",
                  "Se mudou a atividade principal, confira regras locais novamente.",
                ],
              },
              {
                id: "parar",
                icon: "PauseCircle",
                label: "Quero pausar ou encerrar",
                hint: "Vou parar com o MEI",
                intro:
                  "Não existe pausa formal — o que existe é a baixa. Ela é gratuita e feita totalmente online.",
                steps: [
                  "Acesse o portal e escolha a opção de baixa do CNPJ.",
                  "Após confirmar, o CNPJ não gera novas guias mensais.",
                  "Dívidas anteriores continuam existindo e podem ser pagas depois.",
                  "Faça a DASN-SIMEI especial referente ao período aberto.",
                ],
                nextStep:
                  "Mesmo após a baixa, mantenha guardadas as notas e comprovantes por 5 anos.",
              },
            ]}
          />
        </div>

        {/* Calendário rápido */}
        <div className="space-y-5">
          <SectionHeader
            eyebrow="Mini calendário"
            title="O ritmo do MEI ao longo do ano"
            description="Uma visão simples para você entender quando cada coisa acontece."
          />
          <StepFlow
            variant="horizontal"
            items={[
              {
                icon: "CalendarDays",
                title: "Todo dia 20",
                description: "DAS do mês anterior vence. Pagamento via portal ou app oficial.",
                hint: "Atraso gera juros e pode afetar benefícios.",
              },
              {
                icon: "ScrollText",
                title: "Até 31 de maio",
                description: "Declaração anual (DASN-SIMEI) referente ao ano anterior.",
                hint: "Obrigatória mesmo sem faturamento.",
              },
              {
                icon: "Wallet",
                title: "A cada trimestre",
                description: "Boa hora para conferir quanto faturou e ajustar a rotina.",
              },
              {
                icon: "Sparkles",
                title: "Início do ano novo",
                description:
                  "Confira mudanças no MEI e atualize cadastro se algo mudou em casa ou no negócio.",
              },
            ]}
          />
        </div>

        {/* Guia detalhado */}
        <div className="space-y-5">
          <SectionHeader
            eyebrow="Guia detalhado"
            title="Os blocos de cuidado por situação"
            description="Toque em cada item para abrir o passo a passo. Conteúdo enxuto, focado em ação."
          />
          <RichGuide
            sections={[
              {
                icon: "CalendarDays",
                title: "Cuidados do mês",
                intro:
                  "Pequenos hábitos mensais evitam multa, dívida acumulada e perda de benefício.",
                checklist: [
                  "Pague o DAS até o dia 20 — sem exceção.",
                  "Acompanhe quanto entrou no mês e some no acumulado anual.",
                  "Guarde notas, comprovantes e contratos pelo menos 5 anos.",
                  "Confira mensagens do Sebrae, Receita ou prefeitura — sempre pelo canal oficial.",
                ],
                tip: "O app oficial do MEI envia lembrete antes do vencimento.",
              },
              {
                icon: "ScrollText",
                title: "Cuidados do ano",
                intro:
                  "Uma vez por ano você confirma o que faturou. É rápido, mas obrigatório.",
                checklist: [
                  "Faça a DASN-SIMEI até 31 de maio.",
                  "Mesmo sem faturamento, a entrega da declaração é obrigatória.",
                  "Tenha em mãos o total bruto recebido no ano anterior.",
                  "Guarde o recibo da declaração junto dos seus documentos.",
                ],
                warning:
                  "Atraso na declaração gera multa e pode bloquear emissão de novas guias.",
              },
              {
                icon: "Coins",
                title: "Se você está com dívida",
                intro:
                  "Existem três cenários comuns. Identificar o tipo ajuda a escolher o caminho certo.",
                checklist: [
                  "Guia do mês — pague atualizado pelo portal oficial.",
                  "Atraso recente — geralmente é possível parcelar pelo Simples Nacional.",
                  "Dívida antiga inscrita em PGFN — regularize pelo portal Regularize.",
                  "Sempre confira juros e multa antes de fechar parcelamento.",
                ],
                action:
                  "Se a dívida vai além do MEI atual, vale conversar com a equipe do Espaço Empreendedor antes de tomar decisão.",
              },
              {
                icon: "Settings",
                title: "Quando algo muda",
                intro:
                  "Endereço, telefone, atividade — manter o cadastro atualizado custa pouco e evita transtorno.",
                checklist: [
                  "Atualize pelo Portal do Empreendedor com a conta gov.br.",
                  "Após alterar, gere um novo CCMEI para uso em bancos e cadastros.",
                  "Mudanças no objeto social podem exigir nova consulta à prefeitura.",
                  "Mudanças de endereço impactam onde a nota é emitida.",
                ],
              },
              {
                icon: "RotateCcw",
                title: "Se vai parar de vez",
                intro:
                  "A baixa do MEI é gratuita e instantânea. Mas alguns cuidados pós-baixa fazem diferença.",
                checklist: [
                  "Solicite a baixa pelo portal oficial.",
                  "Faça a DASN-SIMEI especial do período aberto no ano.",
                  "Pague o DAS dos meses até a data da baixa.",
                  "Guarde o comprovante de baixa por pelo menos 5 anos.",
                ],
                tip: "Dívidas anteriores não desaparecem com a baixa — elas continuam ativas no CPF do titular.",
              },
            ]}
          />
        </div>

        {/* Alerta */}
        <AlertCard
          tone="amber"
          eyebrow="Atenção"
          title="O que mais costuma virar problema sério"
          description="Boa parte dos casos que chegam ao Espaço Empreendedor poderia ter sido evitado com pequenos ajustes na rotina."
          items={[
            "Acreditar que MEI sem faturar não precisa pagar nem declarar.",
            "Pagar boleto recebido por e-mail sem conferir o emissor.",
            "Esquecer da declaração anual e perder o controle do CNPJ.",
            "Ignorar avisos da Receita até receber notificação de dívida ativa.",
            "Misturar movimentação pessoal e do MEI na mesma conta.",
            "Aceitar 'regularização paga' por terceiros sem checar credibilidade.",
          ]}
        />

        {/* CTA */}
        <InfoCTA
          title="Quer revisar a sua situação com alguém?"
          description="Se a sua dúvida é específica do seu CNPJ — atraso, mudança ou encerramento — a equipe pode olhar com você e indicar o caminho mais seguro."
        />
      </section>
    </PublicShell>
  );
}
