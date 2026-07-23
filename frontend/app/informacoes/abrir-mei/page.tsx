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
          description="O MEI é o jeito mais simples de ter um negócio no seu nome. Aqui você vê quem pode abrir, o que preparar e como fazer tudo de graça, direto no site do governo."
          chips={[
            { label: "Grátis no site oficial", tone: "green" },
            { label: "CNPJ sai na hora", tone: "neutral" },
            { label: "Precisa de conta gov.br", tone: "neutral" },
          ]}
          essential={{
            title: "O essencial",
            lines: [
              "Abrir MEI é grátis. Tudo é feito pela internet, no Portal do Empreendedor.",
              "O CNPJ sai na hora, no mesmo dia do cadastro.",
              "Você precisa de conta gov.br nível prata ou ouro.",
              "Depois de abrir: pagar um boleto por mês (DAS) e declarar uma vez por ano.",
            ],
          }}
        />

        {/* Entenda rápido */}
        <div className="space-y-5">
          <SectionHeader
            eyebrow="Entenda rápido"
            title="O que muda quando você abre o MEI"
            description="Quatro pontos para entender o básico antes de começar."
          />
          <QuickFacts
            items={[
              {
                icon: "Briefcase",
                kicker: "O que é",
                title: "Um CNPJ simples para você",
                description:
                  "O MEI é o tipo de empresa mais simples do Brasil. Você ganha um CNPJ, pode emitir nota fiscal e paga o INSS em um boleto só.",
                tone: "orange",
              },
              {
                icon: "ShieldCheck",
                kicker: "Por que importa",
                title: "Você fica protegido pelo INSS",
                description:
                  "Pagando o boleto mensal (DAS) em dia, você tem direito a auxílio-doença, salário-maternidade e aposentadoria por idade.",
                tone: "green",
              },
              {
                icon: "AlertTriangle",
                kicker: "Erro comum",
                title: "Pagar para abrir",
                description:
                  "Não existe taxa para abrir MEI. Se alguém cobrar por isso, desconfie: é golpe ou um serviço que você não precisa contratar.",
                tone: "amber",
              },
              {
                icon: "Sparkles",
                kicker: "Próximo passo",
                title: "Junte o básico",
                description:
                  "CPF, RG, endereço, a atividade que você faz e uma conta gov.br nível prata ou ouro. Só isso.",
                tone: "neutral",
              },
            ]}
          />
        </div>

        {/* Passo a passo */}
        <div className="space-y-5">
          <SectionHeader
            eyebrow="Como abrir"
            title="O caminho oficial, em 4 passos"
            description="É o mesmo caminho do site do governo, explicado de forma simples."
          />
          <StepFlow
            variant="horizontal"
            items={[
              {
                icon: "Compass",
                title: "Entre no Portal do Empreendedor",
                description:
                  "No site oficial (gov.br), toque em “Quero ser MEI” e depois em “Formalize-se”.",
                hint: "O endereço certo sempre termina em .gov.br.",
              },
              {
                icon: "KeyRound",
                title: "Entre com sua conta gov.br",
                description:
                  "A conta precisa ser nível prata ou ouro. Para estrangeiros com visto permanente, o nível bronze basta.",
              },
              {
                icon: "ClipboardList",
                title: "Preencha seus dados",
                description:
                  "Informe seus dados pessoais e os do negócio: atividade principal, forma de atuação e endereço.",
              },
              {
                icon: "FileCheck2",
                title: "Confira e finalize",
                description:
                  "Revise tudo, marque as declarações e conclua. O CNPJ sai na hora — e você já pode baixar o CCMEI.",
                hint: "Guarde o CCMEI: é o certificado do seu MEI e vale como alvará provisório.",
              },
            ]}
          />
        </div>

        {/* Cenários */}
        <div className="space-y-5">
          <SectionHeader
            eyebrow="Por situação"
            title="Encontre o cenário mais parecido com o seu"
            description="Cada situação tem cuidados um pouco diferentes. Veja a sua."
          />
          <ScenarioTabs
            scenarios={[
              {
                id: "primeira-vez",
                icon: "Compass",
                label: "Estou começando agora",
                hint: "Primeiro CNPJ da vida",
                intro:
                  "Você nunca teve CNPJ. A ideia é entender o básico e abrir com calma, sem pagar nada.",
                steps: [
                  "Crie ou suba sua conta gov.br para o nível prata ou ouro.",
                  "Anote o que você faz no dia a dia: vende produto, presta serviço ou os dois.",
                  "Confira se a sua atividade está na lista oficial do MEI.",
                  "Abra pelo Portal do Empreendedor, sem intermediário.",
                ],
                nextStep:
                  "Depois de abrir, marque o dia 20 de cada mês para pagar o DAS.",
              },
              {
                id: "vendedor",
                icon: "ShoppingBag",
                label: "Vendo produto",
                hint: "Comércio físico ou online",
                intro:
                  "Quem vende produto precisa pensar em estoque, nota fiscal e onde vende. O MEI cobre vários tipos de comércio.",
                steps: [
                  "Confirme se a sua atividade de venda está na lista do MEI.",
                  "Se tiver loja física, veja com a prefeitura se pode funcionar no endereço.",
                  "Vendeu para empresa? A nota fiscal é obrigatória.",
                  "Vende pela internet? Anote tudo o que entra no mês.",
                ],
                nextStep: "Dúvida sobre nota fiscal? Veja a página específica.",
              },
              {
                id: "prestador",
                icon: "Users",
                label: "Presto serviço",
                hint: "Trabalho autônomo",
                intro:
                  "Para serviço, a nota é a NFS-e nacional, emitida no site oficial do governo.",
                steps: [
                  "Confirme se a sua ocupação está na lista do MEI.",
                  "Ative a emissão de NFS-e no emissor nacional.",
                  "Combine com quem te contratou quando a nota será emitida.",
                  "Guarde os comprovantes de cada serviço.",
                ],
                nextStep:
                  "Use o emissor oficial. Não pague aplicativos de terceiros sem necessidade.",
              },
              {
                id: "caminhoneiro",
                icon: "Truck",
                label: "Sou caminhoneiro",
                hint: "Transporte de cargas",
                intro:
                  "Existe um MEI especial para quem transporta cargas: o MEI Caminhoneiro. As regras são um pouco diferentes.",
                steps: [
                  "O limite é maior: até R$ 251.600 por ano.",
                  "Só vale para atividades de transporte rodoviário de cargas.",
                  "O boleto mensal também é diferente: 12% do salário mínimo.",
                  "Para viagens fora do município, é preciso ter registro na ANTT.",
                ],
                nextStep:
                  "A abertura é no mesmo Portal do Empreendedor — basta escolher a atividade de transporte de cargas.",
              },
              {
                id: "freelancer",
                icon: "PiggyBank",
                label: "Já trabalho por conta",
                hint: "Sem CNPJ ainda",
                intro:
                  "Você já trabalha por conta própria e quer se formalizar. O MEI dá mais segurança e garante o INSS.",
                steps: [
                  "Some quanto você fatura por mês para ver se cabe no limite anual.",
                  "Veja se o que você faz está na lista oficial do MEI.",
                  "Lembre: pagando o DAS, você contribui para o INSS.",
                  "Combine com seus clientes a mudança para venda com nota.",
                ],
                nextStep:
                  "Se a sua atividade não couber no MEI, existem outros caminhos — peça orientação.",
              },
            ]}
          />
        </div>

        {/* Guia principal */}
        <div className="space-y-5">
          <SectionHeader
            eyebrow="Guia detalhado"
            title="O que você precisa saber para abrir tranquilo"
            description="Toque em cada bloco para ver a lista completa, dicas e cuidados."
          />
          <RichGuide
            sections={[
              {
                icon: "Users",
                title: "Quem pode abrir o MEI",
                intro:
                  "As regras são poucas, mas todas importam. Confira antes de começar.",
                checklist: [
                  "Sua atividade precisa estar na lista oficial do MEI (ex.: cabeleireiro, eletricista, confeiteiro, fotógrafo, motoboy).",
                  "Faturar até R$ 81 mil por ano. Se abrir no meio do ano, o limite é proporcional aos meses.",
                  "Não ser dono, sócio ou administrador de outra empresa.",
                  "Ter 18 anos ou mais (ou 16, se for emancipado).",
                  "Ser brasileiro ou estrangeiro com visto permanente.",
                  "Pode ter no máximo 1 empregado e não pode ter filial.",
                ],
                tip: "Caminhoneiro tem limite maior: até R$ 251.600 por ano, só para transporte de cargas.",
              },
              {
                icon: "Eye",
                title: "Antes de abrir, confira sua situação",
                intro:
                  "Algumas situações pedem atenção extra. Vale conferir antes de clicar em qualquer coisa.",
                checklist: [
                  "Recebe benefício do INSS (ex.: auxílio-doença, aposentadoria por invalidez) ou seguro-desemprego? Procure orientação antes — abrir MEI pode afetar o benefício.",
                  "Servidor público federal não pode ser MEI. Servidor estadual ou municipal: depende das regras do órgão.",
                  "Trabalha de carteira assinada (CLT)? Pode ser MEI — mas, se for demitido sem justa causa, perde o seguro-desemprego.",
                  "Recebe pensão por morte como dependente inválido? Ligue 135 (INSS) antes de se formalizar.",
                  "Faça a consulta prévia no site da prefeitura: ela diz se a atividade pode funcionar no endereço escolhido.",
                ],
                warning:
                  "Na dúvida sobre benefício do INSS, não abra ainda. Fale com a gente ou ligue 135 antes.",
              },
              {
                icon: "ClipboardList",
                title: "O que separar antes de começar",
                intro: "Coisas simples que evitam travar no meio do cadastro.",
                checklist: [
                  "Conta gov.br nível prata ou ouro (estrangeiro: bronze).",
                  "CPF, RG e dados pessoais atualizados.",
                  "Endereço onde vai trabalhar (pode ser a sua casa).",
                  "A atividade principal e, se quiser, outras atividades secundárias.",
                  "Consulta prévia na prefeitura, se for atender público no local.",
                ],
                action:
                  "Com tudo em mãos, o cadastro no portal leva poucos minutos.",
              },
              {
                icon: "FileText",
                title: "O que você recebe ao final",
                intro:
                  "Assim que confirmar, você já pode baixar e usar os documentos do seu MEI.",
                checklist: [
                  "CNPJ ativo na hora.",
                  "Registro da empresa, automático.",
                  "CCMEI — o certificado do seu MEI, que vale como alvará provisório na maioria dos casos.",
                  "Acesso aos serviços do MEI no portal e no App MEI.",
                ],
                tip: "Salve o CCMEI em PDF no celular. Bancos e cadastros costumam pedir.",
              },
              {
                icon: "CreditCard",
                title: "Cuidados depois de abrir",
                intro:
                  "Mesmo sem faturar, o MEI tem obrigações simples. Anotar essas datas evita dor de cabeça.",
                checklist: [
                  "Pague o DAS todo mês, até o dia 20. Em 2026, o valor parte de R$ 81,05.",
                  "Envie a declaração anual (DASN-SIMEI) até 31 de maio — mesmo que tenha faturado R$ 0.",
                  "Anote suas vendas no relatório mensal e guarde notas por 5 anos.",
                  "Use uma conta separada para o dinheiro do negócio.",
                  "Acompanhe o faturamento para não passar do limite anual.",
                ],
                warning:
                  "12 meses de DAS sem pagar podem cancelar o seu CNPJ, e a dívida continua no seu CPF.",
              },
            ]}
          />
        </div>

        {/* Comparativo oficial vs golpe */}
        <div className="space-y-5">
          <SectionHeader
            eyebrow="Identifique"
            title="O site oficial e o que tenta se passar por ele"
            description="Quase toda cobrança para abrir ou manter o MEI fora do site oficial não é do governo."
          />
          <Comparison
            goodLabel="Canal oficial"
            badLabel="Sinais de golpe"
            good={{
              title: "Portal e app oficiais do governo",
              caption: "O endereço sempre termina em .gov.br e o login é pela conta gov.br.",
              items: [
                "Abertura do MEI grátis, no Portal do Empreendedor.",
                "Boleto DAS emitido no Portal do Simples Nacional ou no App MEI.",
                "Nota fiscal emitida com login gov.br.",
                "Comunicação sem pressa e sem ameaça.",
              ],
            }}
            bad={{
              title: "Cobrança ou boleto fora do canal oficial",
              caption: "Imitam o visual do governo, mas o endereço ou o favorecido é diferente.",
              items: [
                "Site parecido com o oficial cobrando para abrir MEI.",
                "Boleto de “associação” ou “taxa de adesão” que você não pediu.",
                "E-mail ou SMS com link pedindo pagamento urgente.",
                "Promessa de crédito fácil pedindo depósito antecipado.",
              ],
            }}
          />
        </div>

        {/* Erros comuns */}
        <AlertCard
          tone="amber"
          eyebrow="Erros comuns"
          title="O que costuma travar quem está abrindo pela primeira vez"
          description="Pequenos descuidos no começo dão trabalho depois. Atenção a estes pontos."
          items={[
            "Escolher uma atividade que não combina com o que você faz de verdade.",
            "Esquecer o DAS achando que é opcional — ele vence todo dia 20.",
            "Pagar boleto que chegou por e-mail sem conferir quem está cobrando.",
            "Acreditar em mensagem de “cancelamento imediato” do CNPJ.",
            "Misturar o dinheiro pessoal com o do negócio.",
            "Esquecer a declaração anual no ano seguinte (até 31 de maio).",
          ]}
        />

        {/* CTA */}
        <InfoCTA
          title="Quer abrir com alguém do projeto te acompanhando?"
          description="A equipe do Espaço do Empreendedor te orienta de graça: ajuda a escolher a atividade certa, tirar dúvidas e abrir sem cair em golpe."
        />
      </section>
    </PublicShell>
  );
}
