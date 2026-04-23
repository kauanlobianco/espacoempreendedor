// Professor dashboard + validations queue
const T = window.EE;

function ProfDashboardScreen() {
  const cases = [
    { code: 'EE-2026-0147', name: 'Josefa Martins', summary: 'Recebeu uma cobrança de R$ 120 pela "manutenção do MEI".', status: 'NEW', cat: 'Golpe suspeito', when: 'há 32 min', loc: 'Niterói · RJ', urgent: true },
    { code: 'EE-2026-0138', name: 'Joana Albuquerque', summary: 'Abertura MEI para confeitaria artesanal — aguardando documentos.', status: 'WAITING', cat: 'Abrir MEI', when: 'há 2h', resp: 'Maria Silva' },
    { code: 'EE-2026-0131', name: 'Eduardo Siqueira', summary: 'DAS regularizada, aguardando confirmação de pagamento.', status: 'ASSIGNED', cat: 'Regularização', when: 'ontem', resp: 'Pedro Ramos' },
  ];

  return (
    <div style={{ width: 1440, height: 1000, background: T.paper, display: 'grid', gridTemplateColumns: '260px 1fr', fontFamily: T.fontSans, color: T.ink }}>
      <Sidebar role="professor" active="dash"/>
      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <TopBar title="Visão geral" crumbs={['Professor']} />

        <div style={{ padding: 36, overflow: 'auto' }}>
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.orange, fontWeight: 700 }}>Semana de 22 abr</div>
            <h1 style={{ fontFamily: T.fontDisplay, fontSize: 36, fontWeight: 500, letterSpacing: '-0.03em', margin: '10px 0 6px' }}>
              Bom dia, Professor Ricardo.
            </h1>
            <div style={{ fontSize: 15, color: T.mute }}>
              <span style={{ color: T.orangeDeep, fontWeight: 600 }}>5 validações de horas</span> aguardam sua revisão · <span style={{ color: T.ink, fontWeight: 600 }}>1 caso urgente</span> na fila há mais de 30 min.
            </div>
          </div>

          {/* Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
            <Metric label="Casos abertos" value="23" delta="+4 esta semana"/>
            <Metric label="Em atendimento" value="16"/>
            <Metric label="Concluídos no mês" value="42" delta="+28%" tone="green"/>
            <Metric label="Alunos ativos" value="12"/>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 22 }}>
            {/* Cases */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <h2 style={{ fontFamily: T.fontDisplay, fontSize: 22, fontWeight: 500, letterSpacing: '-0.02em', margin: 0 }}>Casos que precisam da sua atenção</h2>
                <Btn variant="ghost" size="sm" iconRight={<Icon.arrow/>}>Ver todos</Btn>
              </div>
              <div style={{ display: 'grid', gap: 10 }}>
                {cases.map((c, i) => <CaseRow key={i} {...c}/>)}
              </div>

              {/* Chart */}
              <div style={{ background: '#fff', border: `1px solid ${T.softLine}`, borderRadius: 20, padding: 28, marginTop: 22 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <div>
                    <div style={{ fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.mute, fontWeight: 700 }}>Volume de atendimentos</div>
                    <div style={{ fontFamily: T.fontDisplay, fontSize: 22, fontWeight: 500, letterSpacing: '-0.02em', marginTop: 4 }}>Últimas 8 semanas</div>
                  </div>
                  <div style={{ display: 'flex', gap: 14, fontSize: 12 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: T.mute }}><span style={{ width: 10, height: 10, borderRadius: 2, background: T.orange }}/>Novos</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: T.mute }}><span style={{ width: 10, height: 10, borderRadius: 2, background: T.ink }}/>Concluídos</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'end', gap: 14, height: 160 }}>
                  {[[8,5],[11,8],[14,12],[10,9],[16,13],[19,15],[17,18],[22,19]].map((v, i) => (
                    <div key={i} style={{ flex: 1, display: 'flex', alignItems: 'end', gap: 3, height: '100%' }}>
                      <div style={{ flex: 1, height: `${v[0]*4}px`, background: T.orange, borderRadius: '4px 4px 0 0' }}/>
                      <div style={{ flex: 1, height: `${v[1]*4}px`, background: T.ink, borderRadius: '4px 4px 0 0' }}/>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11, color: T.mute }}>
                  <span>4 mar</span><span>1 abr</span><span>22 abr</span>
                </div>
              </div>
            </div>

            {/* Students / validations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ background: T.ink, color: '#fff', borderRadius: 20, padding: 24, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', right: -40, bottom: -40, width: 180, height: 180, borderRadius: '50%', background: `radial-gradient(circle, ${T.orange}, transparent 70%)`, opacity: .35 }}/>
                <div style={{ position: 'relative' }}>
                  <div style={{ fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.orange, fontWeight: 700 }}>Validações pendentes</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 12 }}>
                    <div style={{ fontFamily: T.fontDisplay, fontSize: 56, fontWeight: 500, letterSpacing: '-0.04em', lineHeight: 1 }}>5</div>
                    <div style={{ fontSize: 14, color: 'rgba(255,255,255,.6)' }}>registros para revisar</div>
                  </div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,.6)', marginTop: 10, lineHeight: 1.55 }}>
                    Cada validação confirma horas extensionistas do aluno. A mais antiga está há 3 dias aguardando.
                  </div>
                  <Btn variant="orange" size="md" style={{ marginTop: 18 }} iconRight={<Icon.arrow/>}>Revisar agora</Btn>
                </div>
              </div>

              <div style={{ background: '#fff', border: `1px solid ${T.softLine}`, borderRadius: 20, padding: 24 }}>
                <div style={{ fontFamily: T.fontDisplay, fontSize: 20, fontWeight: 500, letterSpacing: '-0.02em' }}>Seus alunos</div>
                <div style={{ fontSize: 13, color: T.mute, marginBottom: 16 }}>12 ativos · 2 precisam de acompanhamento</div>
                {[
                  { n: 'Maria Silva', h: '74h / 120h', p: 62, active: true },
                  { n: 'Pedro Ramos', h: '68h / 120h', p: 57, active: true },
                  { n: 'Ana Beatriz Costa', h: '42h / 120h', p: 35, active: true, warn: true },
                  { n: 'Rafael Mendes', h: '89h / 120h', p: 74, active: true },
                  { n: 'Beatriz Nunes', h: '22h / 120h', p: 18, warn: true },
                ].map((s, i) => (
                  <div key={i} style={{ padding: '10px 0', borderTop: i === 0 ? 'none' : `1px solid ${T.softLine}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: s.warn ? T.amberSoft : T.paperDeep, color: s.warn ? T.amber : T.ink, display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 11.5 }}>
                          {s.n.split(' ').map(x => x[0]).slice(0,2).join('')}
                        </div>
                        <div style={{ fontSize: 13.5, fontWeight: 600, color: T.ink }}>{s.n}</div>
                      </div>
                      <div style={{ fontSize: 12.5, color: s.warn ? T.amber : T.mute, fontWeight: 600 }}>{s.h}</div>
                    </div>
                    <div style={{ height: 4, borderRadius: 999, background: T.paperDeep, overflow: 'hidden' }}>
                      <div style={{ width: `${s.p}%`, height: '100%', background: s.warn ? T.amber : T.orange }}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfValidationsScreen() {
  const items = [
    {
      student: 'Maria Silva', when: '22 abr · 10:14', case: 'EE-2026-0138', kind: 'Com encaminhamento', time: '45 min',
      demand: 'Joana quer saber se "produção artesanal de doces" pode ser cadastrada como atividade do MEI.',
      action: 'Confirmei CNAE 1091-1/02. Expliquei alvará sanitário de Niterói. Enviei link oficial.',
      outcome: 'Empreendedora vai enviar comprovante de endereço para prosseguir.',
    },
    {
      student: 'Pedro Ramos', when: '21 abr · 16:02', case: 'EE-2026-0131', kind: 'Suporte detalhado', time: '2h 10min',
      demand: 'Empreendedor tem DAS em atraso há 6 meses. Queria entender valores e opções.',
      action: 'Calculei junto com ele o total de débitos com juros, acompanhei emissão da guia e esclareci as 3 opções de parcelamento possíveis.',
      outcome: 'Guia emitida durante o atendimento. Ele pagou no dia seguinte (comprovante anexo).',
    },
    {
      student: 'Rafael Mendes', when: '19 abr · 14:30', case: 'EE-2026-0127', kind: 'Orientação simples', time: '25 min',
      demand: 'Dúvida sobre emissão de nota fiscal eletrônica para primeira venda.',
      action: 'Orientei sobre o emissor da prefeitura do Rio e mandei tutorial em vídeo.',
      outcome: 'Empreendedora emitiu a primeira NF com sucesso.',
    },
  ];

  return (
    <div style={{ width: 1440, height: 1000, background: T.paper, display: 'grid', gridTemplateColumns: '260px 1fr', fontFamily: T.fontSans, color: T.ink }}>
      <Sidebar role="professor" active="validations"/>
      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <TopBar title="Validação de atendimentos" crumbs={['Professor', 'Validações']} />

        <div style={{ padding: 36, overflow: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 26 }}>
            <div>
              <div style={{ fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.orange, fontWeight: 700 }}>Horas extensionistas</div>
              <h1 style={{ fontFamily: T.fontDisplay, fontSize: 34, fontWeight: 500, letterSpacing: '-0.03em', margin: '10px 0 4px' }}>5 registros aguardando validação</h1>
              <div style={{ fontSize: 14, color: T.mute, maxWidth: 620 }}>
                Confirme, peça esclarecimento ou recuse. Registros validados contam automaticamente para o semestre do aluno.
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <Btn variant="outline" size="md">Todos · 42</Btn>
              <Btn variant="orange" size="md" icon={<Icon.check/>}>Validar todos visíveis</Btn>
            </div>
          </div>

          <div style={{ display: 'grid', gap: 14 }}>
            {items.map((it, i) => (
              <div key={i} style={{ background: '#fff', border: `1px solid ${T.softLine}`, borderRadius: 18, padding: 24, display: 'grid', gridTemplateColumns: '220px 1fr 200px', gap: 28 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: T.orangeGhost, color: T.orangeDeep, display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 13 }}>
                      {it.student.split(' ').map(x => x[0]).slice(0,2).join('')}
                    </div>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: T.ink }}>{it.student}</div>
                      <div style={{ fontSize: 11, color: T.mute }}>{it.when}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 14 }}>
                    <div style={{ fontFamily: T.fontMono, fontSize: 11.5, color: T.mute, fontWeight: 700 }}>{it.case}</div>
                    <Pill tone="orange" style={{ width: 'fit-content' }}>{it.kind}</Pill>
                    <div style={{ fontSize: 13, color: T.ink, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Icon.clock style={{ color: T.orange }}/>{it.time}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gap: 12, borderLeft: `1px solid ${T.softLine}`, paddingLeft: 24 }}>
                  <div>
                    <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: T.mute, fontWeight: 700, marginBottom: 4 }}>Demanda</div>
                    <div style={{ fontSize: 13.5, color: T.night, lineHeight: 1.5 }}>{it.demand}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: T.mute, fontWeight: 700, marginBottom: 4 }}>Ação realizada</div>
                    <div style={{ fontSize: 13.5, color: T.night, lineHeight: 1.5 }}>{it.action}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: T.mute, fontWeight: 700, marginBottom: 4 }}>Resultado</div>
                    <div style={{ fontSize: 13.5, color: T.night, lineHeight: 1.5 }}>{it.outcome}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'stretch', justifyContent: 'center' }}>
                  <Btn variant="orange" size="md" style={{ justifyContent: 'center' }} icon={<Icon.check/>}>Validar</Btn>
                  <Btn variant="outline" size="md" style={{ justifyContent: 'center' }}>Pedir esclarecimento</Btn>
                  <Btn variant="ghost" size="sm" style={{ justifyContent: 'center', color: T.red }} icon={<Icon.x/>}>Recusar</Btn>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

window.ProfDashboardScreen = ProfDashboardScreen;
window.ProfValidationsScreen = ProfValidationsScreen;
