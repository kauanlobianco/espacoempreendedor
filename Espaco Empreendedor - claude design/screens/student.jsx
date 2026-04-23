// Student: Queue + My cases + Hours
const T = window.EE;

function StudentQueueScreen() {
  const items = [
    { code: 'EE-2026-0147', name: 'Josefa Martins', summary: 'Recebeu uma cobrança de R$ 120 pela "manutenção do MEI" e quer saber se é golpe.', status: 'NEW', cat: 'Golpe suspeito', when: 'há 32 min', loc: 'Niterói · RJ', urgent: true, primary: true },
    { code: 'EE-2026-0146', name: 'Carlos Henrique Pereira', summary: 'Quer abrir MEI como cabeleireiro, mas não sabe se a atividade é permitida.', status: 'TRIAGED', cat: 'Abrir MEI', when: 'há 1h 20min', loc: 'São Gonçalo · RJ' },
    { code: 'EE-2026-0144', name: 'Roberta Nogueira', summary: 'DAS em atraso há 4 meses — quer entender juros e se pode parcelar.', status: 'TRIAGED', cat: 'Regularização', when: 'há 2h', loc: 'Maricá · RJ' },
    { code: 'EE-2026-0141', name: 'André Lopes da Costa', summary: 'Dúvida sobre emissão de nota fiscal para pessoa jurídica.', status: 'NEW', cat: 'Nota fiscal', when: 'há 3h', loc: 'Rio de Janeiro · RJ' },
    { code: 'EE-2026-0139', name: 'Márcia Ferreira', summary: 'Pediu desenquadramento do Simples e não sabe o que fazer agora.', status: 'TRIAGED', cat: 'Regularização', when: 'ontem', loc: 'Niterói · RJ' },
  ];

  return (
    <div style={{ width: 1440, height: 900, background: T.paper, display: 'grid', gridTemplateColumns: '260px 1fr', fontFamily: T.fontSans, color: T.ink }}>
      <Sidebar role="student" active="queue"/>
      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <TopBar title="Fila de atendimento" crumbs={['Área do aluno', 'Fila']} />

        <div style={{ padding: 36, overflow: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 22 }}>
            <div>
              <div style={{ fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.orange, fontWeight: 700 }}>Quem pode atender</div>
              <h1 style={{ fontFamily: T.fontDisplay, fontSize: 36, fontWeight: 500, letterSpacing: '-0.03em', margin: '10px 0 4px' }}>
                7 pedidos aguardando atendimento
              </h1>
              <div style={{ fontSize: 14, color: T.mute }}>Escolha um caso compatível com sua carga. Um pedido marcado como urgente precisa de resposta em até 24h.</div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <Btn variant="outline" size="md" icon={<Icon.list/>}>Filtros</Btn>
              <Btn variant="outline" size="md">Minha fila</Btn>
            </div>
          </div>

          {/* Summary chips */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
            <Pill tone="orange"><Dot tone="orange"/>Urgente · 1</Pill>
            <Pill tone="amber"><Dot tone="amber"/>Novos · 2</Pill>
            <Pill tone="blue">Triados · 4</Pill>
            <Pill tone="neutral">Presencial · 1</Pill>
            <Pill tone="neutral">WhatsApp · 4</Pill>
            <Pill tone="neutral">E-mail · 2</Pill>
          </div>

          <div style={{ display: 'grid', gap: 10 }}>
            {items.map((it, i) => <CaseRow key={i} {...it}/>)}
          </div>
        </div>
      </div>
    </div>
  );
}

function StudentMyCasesScreen() {
  const items = [
    { code: 'EE-2026-0138', name: 'Joana das Dores Albuquerque', summary: 'Aguardando envio do comprovante de endereço para emissão do CCMEI.', status: 'WAITING', cat: 'Abrir MEI', when: 'atualizado há 2h', loc: 'Niterói · RJ', resp: 'Você' },
    { code: 'EE-2026-0131', name: 'Eduardo Siqueira', summary: 'Guia DAS regularizada, aguardando confirmação de pagamento.', status: 'ASSIGNED', cat: 'Regularização', when: 'atualizado ontem', loc: 'Maricá · RJ', resp: 'Você' },
    { code: 'EE-2026-0129', name: 'Fernanda L. Ribeiro', summary: '1º atendimento realizado por WhatsApp — ela vai retornar semana que vem.', status: 'WAITING', cat: 'Já sou MEI', when: 'há 3 dias', loc: 'São Gonçalo · RJ', resp: 'Você' },
    { code: 'EE-2026-0112', name: 'Paulo César da Mata', summary: 'Empreendedor decidiu contratar contador privado — encerrar caso.', status: 'ASSIGNED', cat: 'Orientação', when: 'há 5 dias', resp: 'Você' },
  ];

  return (
    <div style={{ width: 1440, height: 900, background: T.paper, display: 'grid', gridTemplateColumns: '260px 1fr', fontFamily: T.fontSans, color: T.ink }}>
      <Sidebar role="student" active="mine"/>
      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <TopBar title="Meus casos" crumbs={['Área do aluno', 'Meus casos']} />

        <div style={{ padding: 36, overflow: 'auto' }}>
          {/* Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
            <Metric label="Em aberto" value="4" delta="+1 esta semana"/>
            <Metric label="Aguardando retorno" value="2"/>
            <Metric label="Concluídos no mês" value="7" delta="+3"/>
            <Metric label="Tempo médio" value="3,2d"/>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontFamily: T.fontDisplay, fontSize: 26, fontWeight: 500, letterSpacing: '-0.02em', margin: 0 }}>Casos sob sua responsabilidade</h2>
            <div style={{ display: 'flex', gap: 8 }}>
              <Pill tone="neutral">Todos · 4</Pill>
              <Pill tone="orange"><Dot tone="orange"/>Precisa de ação · 2</Pill>
            </div>
          </div>

          <div style={{ display: 'grid', gap: 10 }}>
            {items.map((it, i) => <CaseRow key={i} {...it}/>)}
          </div>
        </div>
      </div>
    </div>
  );
}

function StudentHoursScreen() {
  const monthData = [
    { m: 'Dez', h: 8 }, { m: 'Jan', h: 12 }, { m: 'Fev', h: 18 }, { m: 'Mar', h: 22 }, { m: 'Abr', h: 14 },
  ];
  const max = 24;
  const entries = [
    { d: '22 abr', code: 'EE-2026-0138', kind: 'Orientação simples', t: '45 min', status: 'validated' },
    { d: '21 abr', code: 'EE-2026-0131', kind: 'Atendimento detalhado', t: '1h 30min', status: 'validated' },
    { d: '19 abr', code: 'EE-2026-0129', kind: 'Encaminhamento', t: '30 min', status: 'pending' },
    { d: '17 abr', code: 'EE-2026-0125', kind: 'Orientação simples', t: '25 min', status: 'validated' },
    { d: '15 abr', code: 'EE-2026-0118', kind: 'Atendimento detalhado', t: '2h 10min', status: 'pending' },
  ];

  return (
    <div style={{ width: 1440, height: 900, background: T.paper, display: 'grid', gridTemplateColumns: '260px 1fr', fontFamily: T.fontSans, color: T.ink }}>
      <Sidebar role="student" active="hours"/>
      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <TopBar title="Horas extensionistas" crumbs={['Área do aluno', 'Horas']} />

        <div style={{ padding: 36, overflow: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 22, marginBottom: 28 }}>
            {/* Progress card */}
            <div style={{ background: T.ink, color: '#fff', borderRadius: 20, padding: 32, position: 'relative', overflow: 'hidden' }}>
              <div style={{
                position: 'absolute', right: -60, top: -60, width: 240, height: 240,
                borderRadius: '50%', background: `radial-gradient(circle, ${T.orange}, transparent 70%)`, opacity: .4,
              }}/>
              <div style={{ position: 'relative' }}>
                <div style={{ fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.orange, fontWeight: 700 }}>Semestre 2026.1</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginTop: 18 }}>
                  <div style={{ fontFamily: T.fontDisplay, fontSize: 72, fontWeight: 500, letterSpacing: '-0.04em', lineHeight: 1 }}>74h</div>
                  <div style={{ fontSize: 17, color: 'rgba(255,255,255,.6)' }}>de 120h</div>
                </div>
                <div style={{ marginTop: 16, height: 8, borderRadius: 999, background: 'rgba(255,255,255,.12)', overflow: 'hidden' }}>
                  <div style={{ width: '62%', height: '100%', background: T.orange, borderRadius: 999 }}/>
                </div>
                <div style={{ marginTop: 14, display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'rgba(255,255,255,.7)' }}>
                  <span>62% do total exigido</span>
                  <span>Faltam 46h · ~12 atendimentos</span>
                </div>
              </div>
            </div>

            {/* Month chart */}
            <div style={{ background: '#fff', border: `1px solid ${T.softLine}`, borderRadius: 20, padding: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <div>
                  <div style={{ fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.mute, fontWeight: 700 }}>Últimos 5 meses</div>
                  <div style={{ fontFamily: T.fontDisplay, fontSize: 22, fontWeight: 500, letterSpacing: '-0.02em', marginTop: 4 }}>Ritmo mensal</div>
                </div>
                <Pill tone="green"><Icon.arrow/> +18% vs. média</Pill>
              </div>
              <div style={{ display: 'flex', alignItems: 'end', gap: 18, height: 150, padding: '10px 0' }}>
                {monthData.map((m, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'end', width: '100%' }}>
                      <div style={{
                        width: '100%', height: `${(m.h / max) * 100}%`,
                        background: i === monthData.length - 1 ? T.orange : T.orangeSoft,
                        borderRadius: 6, minHeight: 8,
                      }}/>
                    </div>
                    <div style={{ fontSize: 12, color: T.mute, fontWeight: 600 }}>{m.m}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: T.ink }}>{m.h}h</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Entries table */}
          <div style={{ background: '#fff', border: `1px solid ${T.softLine}`, borderRadius: 20, overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: `1px solid ${T.softLine}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontFamily: T.fontDisplay, fontSize: 20, fontWeight: 500, letterSpacing: '-0.02em' }}>Registros recentes</div>
                <div style={{ fontSize: 13, color: T.mute, marginTop: 2 }}>Cada registro gera horas automaticamente ao ser validado pelo professor.</div>
              </div>
              <Btn variant="outline" size="sm" icon={<Icon.doc/>}>Exportar relatório</Btn>
            </div>
            <div>
              {entries.map((e, i) => (
                <div key={i} style={{
                  padding: '16px 24px', borderBottom: i === entries.length - 1 ? 'none' : `1px solid ${T.softLine}`,
                  display: 'grid', gridTemplateColumns: '80px 140px 1fr 120px 140px', gap: 16, alignItems: 'center',
                }}>
                  <div style={{ fontSize: 13, color: T.mute, fontWeight: 600 }}>{e.d}</div>
                  <div style={{ fontFamily: T.fontMono, fontSize: 12, color: T.ink, fontWeight: 600 }}>{e.code}</div>
                  <div style={{ fontSize: 14, color: T.ink }}>{e.kind}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: T.ink }}>{e.t}</div>
                  <div>{e.status === 'validated' ? <Pill tone="green"><Icon.check/>Validado</Pill> : <Pill tone="amber"><Icon.clock/>Em validação</Pill>}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.StudentQueueScreen = StudentQueueScreen;
window.StudentMyCasesScreen = StudentMyCasesScreen;
window.StudentHoursScreen = StudentHoursScreen;
