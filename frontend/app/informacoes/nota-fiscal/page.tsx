import {
  AlertTriangle,
  Building2,
  CalendarDays,
  CreditCard,
  FileText,
  Globe2,
  Hammer,
  Package,
  Receipt,
  ShoppingBag,
  Sparkles,
  Wallet,
  Wrench,
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

export default function NotaFiscalPage() {
  return (
    <PublicShell>
      <section className="mx-auto max-w-6xl space-y-14 px-4 py-10 md:px-6 md:py-16">
        <InfoHero
          eyebrow="Operação do dia a dia"
          title="Nota fiscal e DAS"
          highlight="sem complicação."
          description="O primeiro passo é separar produto de serviço. Depois fica mais fácil entender quando emitir nota, qual modelo usar e como organizar a guia mensal."
          chips={[
            { label: "Produto: NF-e", tone: "neutral" },
            { label: "Serviço: NFS-e", tone: "neutral" },
            { label: "DAS vence dia 20", tone: "orange" },
          ]}
          essential={{
            title: "Em duas linhas",
            lines: [
              "Quem vende para empresa quase sempre precisa emitir nota.",
              "Quem vende para pessoa física tem regras que dependem da operação.",
              "MEI prestador de serviço usa o emissor nacional de NFS-e.",
              "DAS é a guia mensal — paga uma vez por mês, com ou sem nota.",
            ],
          }}
        />

        {/* Entenda rápido */}
        <div className="space-y-5">
          <SectionHeader
            eyebrow="Entenda rápido"
            title="Os quatro conceitos que fazem tudo se encaixar"
            description="Antes dos detalhes, alinhar essas ideias resolve a maior parte das dúvidas."
          />
          <QuickFacts
            items={[
              {
                icon: "Package",
                kicker: "O que é",
                title: "Nota fiscal",
                description:
                  "Documento que comprova que houve venda ou serviço. Existe para produto (NF-e) e para serviço (NFS-e).",
                tone: "orange",
              },
              {
                icon: "Receipt",
                kicker: "Não confunda",
                title: "DAS",
                description:
                  "É a guia única do MEI, não é nota. Ela reúne INSS e o valor fixo de imposto, conforme a sua atividade.",
                tone: "neutral",
              },
              {
                icon: "AlertTriangle",
                kicker: "Erro comum",
                title: "Achar que MEI nunca emite",
                description:
                  "Não é regra. Quando vende para empresa, a emissão de nota costuma ser obrigatória.",
                tone: "amber",
              },
              {
                icon: "Sparkles",
                kicker: "Próximo passo",
                title: "Saber o que você faz",
                description:
                  "Liste se vende produto, presta serviço ou os dois. Esse mapa muda completamente o caminho.",
                tone: "green",
              },
            ]}
          />
        </div>

        {/* Comparativo Produto x Serviço */}
        <div className="space-y-5">
          <SectionHeader
            eyebrow="Compare"
            title="Produto e serviço seguem caminhos diferentes"
            description="A primeira separação importante: o tipo de operação muda o modelo de nota e o sistema usado."
          />
          <Comparison
            variant="types"
            goodLabel="Produto"
            badLabel="Serviço"
            good={{
              title: "Vende algo físico ou digital",
              caption: "Comércio, revenda, fabricação, venda online.",
              items: [
                "Padrão usado: NF-e (nota fiscal eletrônica de produto).",
                "Para vender em marketplace, a plataforma pode pedir a NF.",
                "Movimentação de estoque costuma exigir registro.",
                "Em alguns estados, o MEI tem regras específicas para emissão.",
              ],
            }}
            bad={{
              title: "Presta serviço",
              caption: "Prestador autônomo, profissional independente.",
              items: [
                "Padrão usado: NFS-e (nota fiscal de serviço, eletrônica).",
                "MEI usa o emissor nacional, com login gov.br.",
                "Para empresa contratante, a NFS-e é praticamente sempre necessária.",
                "Para pessoa física, depende do que foi combinado.",
              ],
            }}
          />
        </div>

        {/* Comparativo Empresa x PF */}
        <div className="space-y-5">
          <SectionHeader
            eyebrow="Outra comparação"
            title="Para quem você está vendendo?"
            description="O cliente final muda a obrigação de emitir nota."
          />
          <Comparison
            variant="types"
            goodLabel="Para empresa (B2B)"
            badLabel="Para pessoa física (B2C)"
            good={{
              title: "Empresa precisa do seu CNPJ na nota",
              caption: "Toda empresa precisa do documento para registrar a despesa.",
              items: [
                "Emissão de nota é regra geral — sem nota, geralmente não pagam.",
                "A empresa contratante costuma orientar o formato esperado.",
                "Mantenha contrato e proposta junto da nota emitida.",
                "Combine quem cuida do recolhimento de tributos extras se houver.",
              ],
            }}
            bad={{
              title: "Pessoa física tem regra mais flexível",
              caption: "Mas a obrigação não some por completo.",
              items: [
                "Em muitos casos a emissão é facultativa para o cliente.",
                "Para você, manter registro de venda ajuda no controle.",
                "Vendas pela internet têm regras específicas mesmo para PF.",
                "Em casos de troca, devolução ou reclamação, a nota protege quem vendeu.",
              ],
            }}
          />
        </div>

        {/* Cenários */}
        <div className="space-y-5">
          <SectionHeader
            eyebrow="Por situação"
            title="Veja o caminho do seu tipo de venda"
            description="Cada cenário tem o jeito mais comum de operar. Use isso como ponto de partida, não como regra fixa."
          />
          <ScenarioTabs
            scenarios={[
              {
                id: "vendo-produto",
                icon: "ShoppingBag",
                label: "Vendo produto físico",
                hint: "Loja, feira, marketplace",
                intro:
                  "Quem comercializa produto precisa pensar em estoque, nota e canal de venda.",
                steps: [
                  "Confirme se sua atividade está enquadrada no MEI.",
                  "Verifique se sua secretaria estadual exige emissão de NF-e.",
                  "Para venda em marketplace, a plataforma pode emitir a nota por você.",
                  "Mantenha registro do quanto entra mês a mês.",
                ],
                nextStep:
                  "Combine com seu cliente empresa o formato da nota antes da primeira venda.",
              },
              {
                id: "presto-servico",
                icon: "Wrench",
                label: "Presto serviço",
                hint: "Trabalhos pontuais ou recorrentes",
                intro:
                  "Para serviço, o emissor nacional de NFS-e é o caminho padrão para quem é MEI.",
                steps: [
                  "Habilite a emissão no portal nacional da NFS-e.",
                  "Faça login com a conta gov.br para começar.",
                  "Antes de emitir, confirme dados do tomador (CNPJ ou CPF).",
                  "Guarde uma cópia da nota emitida em PDF.",
                ],
                nextStep: "Em casos especiais, vale checar se o município tem regras adicionais.",
              },
              {
                id: "vendo-online",
                icon: "Globe2",
                label: "Vendo pela internet",
                hint: "Site próprio, marketplace ou rede social",
                intro:
                  "Venda online costuma exigir mais cuidado com nota, mesmo para pessoa física.",
                steps: [
                  "Confirme se o canal de venda emite nota automaticamente por você.",
                  "Em caso negativo, configure a emissão manual após cada venda.",
                  "Cuide do prazo de entrega e do registro de cada pedido.",
                  "Mantenha controle de devoluções para reemitir a nota se preciso.",
                ],
              },
              {
                id: "produto-servico",
                icon: "Hammer",
                label: "Faço produto sob encomenda",
                hint: "Mistura entre produto e serviço",
                intro:
                  "Algumas atividades misturam fabricação e serviço. O modelo da nota depende do que predomina.",
                steps: [
                  "Identifique se o que pesa mais é o produto entregue ou o trabalho prestado.",
                  "Em geral, predominância de produto vai para NF-e.",
                  "Predominância de serviço, para NFS-e.",
                  "Em casos mistos, vale conversar com a equipe para evitar erro.",
                ],
                nextStep:
                  "Esse é o cenário em que mais aparece dúvida — não force a resposta sem checar.",
              },
            ]}
          />
        </div>

        {/* Lembretes mensais */}
        <div className="space-y-5">
          <SectionHeader
            eyebrow="Mensalmente"
            title="O que o MEI precisa lembrar todo mês"
            description="Quatro hábitos simples que organizam quase tudo."
          />
          <StepFlow
            variant="horizontal"
            items={[
              {
                icon: "CalendarDays",
                title: "Pagar o DAS",
                description:
                  "Vence todo dia 20. Pode ser emitido no portal oficial ou no app oficial do MEI.",
                hint: "Sem pagar, INSS e regularidade ficam comprometidos.",
              },
              {
                icon: "FileText",
                title: "Emitir nota quando preciso",
                description: "Para empresas, sempre. Para PF, conforme o tipo de operação.",
              },
              {
                icon: "Wallet",
                title: "Conferir faturamento",
                description: "Some o que entrou no mês para acompanhar o limite anual.",
              },
              {
                icon: "Building2",
                title: "Guardar comprovantes",
                description:
                  "Notas, contratos e recibos. Mantenha por pelo menos 5 anos, idealmente em pasta digital.",
              },
            ]}
          />
        </div>

        {/* Guia detalhado */}
        <div className="space-y-5">
          <SectionHeader
            eyebrow="Guia detalhado"
            title="Tudo que você precisa para emitir e guardar com tranquilidade"
            description="Toque em cada bloco para ver o passo a passo, dicas e cuidados."
          />
          <RichGuide
            sections={[
              {
                icon: "FileText",
                title: "Quando a nota é obrigatória",
                intro:
                  "A regra muda conforme o cliente final e o tipo de operação. Estes cenários cobrem a maior parte do dia a dia.",
                checklist: [
                  "Venda para empresa (CNPJ): praticamente sempre exige nota.",
                  "Serviço prestado para empresa: NFS-e é praticamente padrão.",
                  "Venda para PF em loja física: regra mais flexível, mas vale emitir.",
                  "Venda online ou em marketplace: depende da plataforma e do estado.",
                ],
                tip: "Mesmo quando não é obrigatória, emitir nota protege o vendedor em caso de problema.",
              },
              {
                icon: "Building2",
                title: "Sobre a NFS-e do MEI",
                intro:
                  "A NFS-e nacional foi pensada para simplificar a vida de quem presta serviço.",
                checklist: [
                  "MEI prestador usa o emissor nacional pela conta gov.br.",
                  "Em vários casos, não é necessário certificado digital.",
                  "Antes da primeira emissão, complete o cadastro inicial.",
                  "Em alguns municípios, ainda existe sistema próprio em transição.",
                ],
                action:
                  "Se o seu município ainda não migrou totalmente, a equipe pode te ajudar a entender qual sistema usar.",
              },
              {
                icon: "CreditCard",
                title: "DAS — o básico que se repete",
                intro:
                  "A guia mensal é mais simples do que parece. O importante é manter a regularidade.",
                checklist: [
                  "Vence todo dia 20 do mês seguinte.",
                  "Reúne INSS e o valor fixo de imposto, conforme a atividade.",
                  "Pode ser emitida no portal ou no app oficial do MEI.",
                  "Pague mesmo sem ter faturado no mês.",
                ],
                warning:
                  "Não confie em mensagem que oferece 'guia DAS pronta' fora do canal oficial — golpe muito comum.",
              },
              {
                icon: "Receipt",
                title: "Como organizar tudo isso na rotina",
                intro:
                  "Hábito vale mais que sistema sofisticado. Algumas práticas simples evitam dor de cabeça.",
                checklist: [
                  "Crie pasta digital separada por mês para guardar notas e DAS.",
                  "Reserve dia fixo para emitir o que ficou pendente.",
                  "Mantenha conta bancária separada para o que vem do MEI.",
                  "Anote rapidamente o que entrou para conferir no fim do mês.",
                ],
                tip: "Planilha simples no celular já dá conta do recado — não precisa de app caro.",
              },
            ]}
          />
        </div>

        {/* Alerta */}
        <AlertCard
          tone="amber"
          eyebrow="Cuidado"
          title="O que muita gente confunde — e gera dor de cabeça"
          description="Esses pontos costumam causar problema porque parecem detalhes pequenos."
          items={[
            "Achar que DAS é nota fiscal — não é, são coisas separadas.",
            "Pagar boleto de DAS recebido por mensagem em vez de emitir no portal oficial.",
            "Esquecer da nota em venda para empresa, mesmo de valor pequeno.",
            "Misturar nota de produto e nota de serviço sem entender a diferença.",
            "Acreditar que pagar app de terceiros é exigência do governo.",
            "Deixar de guardar a NFS-e por achar que 'já está no sistema'.",
          ]}
        />

        {/* CTA */}
        <InfoCTA
          title="Tem dúvida sobre uma nota específica?"
          description="A equipe pode olhar o seu caso, sugerir o modelo certo de nota e indicar o canal oficial para você emitir com tranquilidade."
        />
      </section>
    </PublicShell>
  );
}
