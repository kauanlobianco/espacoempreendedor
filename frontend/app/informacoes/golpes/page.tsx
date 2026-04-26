import {
  AlertOctagon,
  AlertTriangle,
  BadgeCheck,
  Ban,
  CircleAlert,
  Eye,
  FileSearch,
  Globe2,
  Hourglass,
  KeyRound,
  Mail,
  MessageSquareWarning,
  PhoneCall,
  ShieldAlert,
  ShieldCheck,
  TriangleAlert,
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

export default function GolpesPage() {
  return (
    <PublicShell>
      <section className="mx-auto max-w-6xl space-y-14 px-4 py-10 md:px-6 md:py-16">
        <InfoHero
          eyebrow="Segurança"
          title="Recebi uma cobrança estranha."
          highlight="O que faço?"
          description="Golpe contra MEI quase sempre vem com pressa, ameaça e aparência de documento oficial. Antes de pagar, vale parar e checar com calma — a maior parte dessas cobranças não vem do governo."
          chips={[
            { label: "Pare antes de pagar", tone: "red" },
            { label: "Confira o emissor", tone: "amber" },
            { label: "Use canal oficial", tone: "green" },
          ]}
          essential={{
            title: "Em uma frase",
            lines: [
              "O governo não cobra para abrir, manter ou encerrar MEI fora do canal oficial.",
              "Boletos avulsos costumam ser de associações privadas, não exigência da Receita.",
              "Mensagem com pressa, ameaça ou link estranho é o sinal mais comum.",
              "Se já clicou ou pagou, ainda dá para limitar o estrago.",
            ],
          }}
        />

        {/* Sinais rápidos */}
        <div className="space-y-5">
          <SectionHeader
            eyebrow="Sinais de alerta"
            title="Quatro pistas que aparecem em quase todo golpe"
            description="Quando dois ou mais aparecerem juntos, considere fraude até prova em contrário."
          />
          <QuickFacts
            items={[
              {
                icon: Hourglass,
                kicker: "Pressa",
                title: "'Você tem 24h para pagar'",
                description:
                  "Cobrança com prazo curto e ameaça de cancelamento imediato é tática comum de golpe.",
                tone: "amber",
              },
              {
                icon: AlertOctagon,
                kicker: "Ameaça",
                title: "'CNPJ será cancelado'",
                description:
                  "Mensagens com tom agressivo ou ameaça de bloqueio existem para te tirar do raciocínio.",
                tone: "amber",
              },
              {
                icon: Globe2,
                kicker: "Link estranho",
                title: "Sem .gov.br",
                description:
                  "O canal oficial sempre termina em .gov.br. Domínios parecidos, mas diferentes, são alerta máximo.",
                tone: "amber",
              },
              {
                icon: Mail,
                kicker: "Boleto avulso",
                title: "Cobrança que você não pediu",
                description:
                  "Recebeu boleto sem ter solicitado nada? Provavelmente é serviço opcional ou fraude.",
                tone: "amber",
              },
            ]}
          />
        </div>

        {/* Comparativo Oficial vs Suspeito */}
        <div className="space-y-5">
          <SectionHeader
            eyebrow="Compare"
            title="Como reconhecer o canal oficial e o que tenta se passar por ele"
            description="A regra mais segura: emita você mesmo, no canal oficial, em vez de aceitar o que chega pronto."
          />
          <Comparison
            goodLabel="Canal oficial"
            badLabel="Suspeito"
            good={{
              title: "Vem do governo de verdade",
              caption: "Sempre encerra em .gov.br e usa login gov.br.",
              items: [
                "Você acessa o portal e gera o documento — não recebe pronto.",
                "Boleto da União ou município no campo de favorecido.",
                "Comunicação calma, sem pressa irreal.",
                "Aceita validação do código pelo próprio portal oficial.",
              ],
            }}
            bad={{
              title: "Imita o oficial, mas não é",
              caption: "Logos parecidos, mas o emissor real é outro.",
              items: [
                "Boleto chega por e-mail ou WhatsApp sem você ter pedido.",
                "Pix com chave ou favorecido em nome de empresa privada.",
                "Mensagem com erros de português ou pressa exagerada.",
                "Link com domínio estranho ou encurtado.",
              ],
            }}
          />
        </div>

        {/* Cenários */}
        <div className="space-y-5">
          <SectionHeader
            eyebrow="Por situação"
            title="Identifique o tipo de cobrança que chegou"
            description="Cada cenário tem uma resposta diferente. Aqui você vê a mais comum."
          />
          <ScenarioTabs
            scenarios={[
              {
                id: "boleto-email",
                icon: Mail,
                label: "Boleto por e-mail",
                hint: "Cobrança que apareceu sem aviso",
                intro:
                  "Provavelmente é cobrança de associação privada, serviço opcional ou tentativa de golpe.",
                steps: [
                  "Não pague antes de identificar o emissor real do boleto.",
                  "Procure no boleto o CNPJ do beneficiário e pesquise quem é.",
                  "Confira no portal oficial se você realmente tem cobrança em aberto.",
                  "Se não conhecer o emissor, descarte com tranquilidade.",
                ],
                nextStep:
                  "Cobrança de associação privada não é taxa obrigatória do governo.",
              },
              {
                id: "mensagem-whatsapp",
                icon: PhoneCall,
                label: "Mensagem por WhatsApp",
                hint: "Pressa, ameaça e link suspeito",
                intro:
                  "Mensagens cobrando rapidez ou pedindo dados pelo WhatsApp são alertas claros de fraude.",
                steps: [
                  "Não clique em links recebidos por mensagem.",
                  "Não envie selfie, código ou senha por aplicativo de mensagem.",
                  "Bloqueie e denuncie o número no próprio app.",
                  "Confira sua situação direto no portal oficial.",
                ],
                nextStep:
                  "A Receita não pede pagamento por WhatsApp. Nunca.",
              },
              {
                id: "site-falso",
                icon: Globe2,
                label: "Caí em site parecido",
                hint: "Imitação do portal oficial",
                intro:
                  "Sites falsos copiam logo, cores e nome do portal oficial. A diferença está no domínio.",
                steps: [
                  "Confirme se o endereço termina em .gov.br.",
                  "Não informe dados pessoais ou senha em sites com domínio diferente.",
                  "Se já forneceu dados, troque a senha da gov.br imediatamente.",
                  "Acompanhe extratos e cobranças nos próximos dias.",
                ],
                nextStep: "Em caso de suspeita confirmada, registre boletim de ocorrência.",
              },
              {
                id: "ja-paguei",
                icon: CircleAlert,
                label: "Já paguei algo suspeito",
                hint: "O dinheiro já saiu",
                intro:
                  "Calma. Existem caminhos para tentar reverter, mas o tempo conta a favor de quem age rápido.",
                steps: [
                  "Reúna o comprovante de pagamento e a mensagem original.",
                  "Entre em contato com seu banco para tentar contestar a transação.",
                  "Registre boletim de ocorrência online no estado.",
                  "Confira na conta gov.br se houve acesso indevido.",
                ],
                nextStep:
                  "Mesmo sem garantia de devolução, registrar tudo ajuda em casos coletivos.",
              },
            ]}
          />
        </div>

        {/* Passos rápidos: o que fazer agora */}
        <div className="space-y-5">
          <SectionHeader
            eyebrow="Plano de ação"
            title="Se a cobrança acabou de chegar, faça assim"
            description="Quatro movimentos simples, na ordem. Vale para boleto, e-mail, SMS ou WhatsApp."
          />
          <StepFlow
            variant="horizontal"
            items={[
              {
                icon: ShieldAlert,
                title: "Pare e respire",
                description: "Não pague nem clique em nada antes de checar com calma.",
                hint: "Pressa é o ingrediente principal de quase todo golpe.",
              },
              {
                icon: Eye,
                title: "Olhe para os detalhes",
                description:
                  "Domínio, CNPJ do emissor, ortografia, urgência. Anote o que estiver fora do padrão.",
              },
              {
                icon: FileSearch,
                title: "Confirme no canal oficial",
                description:
                  "Acesse o portal pelo navegador (digitando o endereço) e verifique se há cobrança real.",
              },
              {
                icon: BadgeCheck,
                title: "Decida com segurança",
                description:
                  "Se tudo bater com canal oficial, pague por lá. Caso contrário, descarte e bloqueie.",
                hint: "Quando ainda restar dúvida, peça orientação humana antes de pagar.",
              },
            ]}
          />
        </div>

        {/* Guia detalhado */}
        <div className="space-y-5">
          <SectionHeader
            eyebrow="Guia detalhado"
            title="Como conferir, o que evitar e o que fazer depois"
            description="Conteúdo prático organizado por tipo de situação. Toque para abrir cada bloco."
          />
          <RichGuide
            sections={[
              {
                icon: ShieldCheck,
                title: "Como conferir antes de pagar qualquer coisa",
                intro:
                  "Pequenas verificações que demoram um minuto e podem te livrar de prejuízo.",
                checklist: [
                  "Acesse o portal oficial digitando o endereço você mesmo, sem clicar em link.",
                  "Confira se o endereço termina em .gov.br.",
                  "Veja o nome do favorecido e o CNPJ no boleto antes de pagar.",
                  "Se for Pix, confirme se o nome do favorecido aparece no app do banco.",
                ],
                tip:
                  "Boleto legítimo do governo sempre tem favorecido vinculado à União ou município.",
              },
              {
                icon: Ban,
                title: "O que nunca fazer",
                intro:
                  "Estas situações são sempre suspeitas. Não há exceção para o caso real do governo.",
                checklist: [
                  "Não envie senhas, códigos ou selfies por mensagem.",
                  "Não clique em links recebidos por SMS ou WhatsApp.",
                  "Não pague por pressão ou medo de cancelamento imediato.",
                  "Não trate boleto avulso como obrigação do governo.",
                ],
                warning:
                  "O governo nunca pede pagamento por mensagem com link. Sem exceções.",
              },
              {
                icon: KeyRound,
                title: "Se já clicou em algo suspeito",
                intro:
                  "Mesmo que você não tenha pago, o clique pode ter exposto dados. Vale agir nas próximas horas.",
                checklist: [
                  "Troque a senha da conta gov.br pelo próprio portal oficial.",
                  "Ative dois fatores de segurança onde for possível.",
                  "Verifique se houve cadastro novo ou alteração no seu CNPJ.",
                  "Acompanhe extratos do banco nos próximos dias.",
                ],
                action:
                  "Se notar acesso suspeito na gov.br, recupere a conta com biometria pelo app.",
              },
              {
                icon: TriangleAlert,
                title: "Se já pagou e suspeita de fraude",
                intro:
                  "A janela de tempo para reverter é curta — agir nas próximas horas faz diferença.",
                checklist: [
                  "Junte comprovante, boleto, mensagem e prints em uma pasta.",
                  "Acione o banco e peça contestação ou MED (mecanismo de devolução).",
                  "Registre boletim de ocorrência online — costuma estar disponível 24h.",
                  "Procure orientação humana para entender próximos passos.",
                ],
                tip: "Mesmo casos sem devolução do dinheiro ajudam a alimentar investigações coletivas.",
              },
              {
                icon: MessageSquareWarning,
                title: "Quando pedir ajuda humana",
                intro:
                  "A equipe do Espaço Empreendedor pode te orientar com calma. Em alguns casos, isso evita que o problema se repita.",
                checklist: [
                  "Quando não conseguir identificar o emissor da cobrança.",
                  "Quando já tiver pago e quiser registrar formalmente.",
                  "Quando o caso parece envolver mais de uma cobrança suspeita.",
                  "Sempre que ainda restar dúvida — perguntar é mais barato que pagar errado.",
                ],
                action:
                  "Você pode abrir uma solicitação aqui mesmo no site e acompanhar com um código.",
              },
            ]}
          />
        </div>

        {/* Alerta forte */}
        <AlertCard
          tone="red"
          icon={AlertTriangle}
          eyebrow="Linha vermelha"
          title="Estes pedidos nunca são oficiais — e ponto"
          description="Sempre que receber um destes, considere golpe e ignore."
        items={[
            "Pedido para informar senha da gov.br por mensagem.",
            "Cobrança para evitar cancelamento imediato do CNPJ.",
            "Pix para 'agilizar' qualquer regularização.",
            "Solicitação de selfie segurando documento por canal informal.",
            "Promessa de aposentadoria garantida em troca de pagamento avulso.",
            "Boleto cobrando taxa para gerar ou reenviar o CCMEI.",
          ]}
        />

        {/* CTA */}
        <InfoCTA
          title="Recebeu algo agora e está em dúvida?"
          description="A equipe do Espaço Empreendedor pode olhar a cobrança com você antes de qualquer pagamento. Sem custo, sem cobrança, sem pressão."
        />
      </section>
    </PublicShell>
  );
}
