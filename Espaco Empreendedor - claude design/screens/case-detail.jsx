// Case detail screen - where atendimento is registered
const T = window.EE;

function CaseDetailScreen() {
  return (
    <div style={{ width: 1440, height: 1100, background: T.paper, display: 'grid', gridTemplateColumns: '260px 1fr', fontFamily: T.fontSans, color: T.ink }}>
      <Sidebar role="student" active="mine"/>
      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <TopBar title="EE-2026-0138 · Joana das Dores Albuquerque" crumbs={['Área do aluno', 'Meus casos', 'EE-2026-0138']} />

        <div style={{ padding: '28px 36px', overflow: 'auto' }}>
          {/* Case header */}
          <div style={{ background: '#fff', border: `1px solid ${T.softLine}`, borderRadius: 20, padding: 28, marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <span style={{ fontFamily: T.fontMono, fontSize: 12, fontWeight: 700, color: T.mute, background: T.paper, padding: '4px 10px', borderRadius: 6 }}>EE-2026-0138</span>
                  <Status s="ASSIGNED"/>
                  <span style={{ fontSize: 11.5, color: T.mute, textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 600 }}>· Abrir MEI</span>
                </div>
                <h1 style={{ fontFamily: T.fontDisplay, fontSize: 32, fontWeight: 500, letterSpacing: '-0.025em', margin: '0 0 10px', lineHeight: 1.1 }}>Joana das Dores Albuquerque</h1>
                <p style={{ fontSize: 14.5, color: T.night, opacity: .82, maxWidth: 720, lineHeight: 1.55, margin: 0 }}>
                  Quer abrir o MEI como confeiteira mas não sabe se precisa de alvará da prefeitura nem se a atividade "produção de doces" é permitida. Está sem saber por onde começar.
                </p>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 18 }}>
                  {[
                    { l: 'Telefone', v: '(21) 99812-4477', i: <Icon.phone/> },
                    { l: 'E-mail', v: 'joana.albuquerque@gmail.com', i: <Icon.mail/> },
                    { l: 'CPF', v: '123.***.***-45', i: <Icon.user/> },
                    { l: 'Localidade', v: 'Niterói · RJ', i: <Icon.pin/> },
                    { l: 'Abriu em', v: '18 abr · 14:22', i: <Icon.clock/> },
                  ].map((m, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, background: T.paper, padding: '8px 12px', borderRadius: 10, border: `1px solid ${T.softLine}` }}>
                      <span style={{ color: T.mute }}>{m.i}</span>
                      <div>
                        <div style={{ fontSize: 10.5, color: T.mute, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 }}>{m.l}</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: T.ink }}>{m.v}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                <Btn variant="outline" size="sm">Mais opções ▾</Btn>
                <Btn variant="orange" size="md" icon={<Icon.check/>}>Concluir caso</Btn>
                <div style={{ fontSize: 11.5, color: T.mute, textAlign: 'right', marginTop: 6 }}>Você é a responsável</div>
              </div>
            </div>

            {/* Progress bar: status lifecycle */}
            <div style={{ marginTop: 28, paddingTop: 24, borderTop: `1px solid ${T.softLine}` }}>
              <div style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: T.mute, fontWeight: 700, marginBottom: 14 }}>Jornada do caso</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                {[
                  { k: 'Recebido', done: true, date: '18 abr' },
                  { k: 'Triado', done: true, date: '18 abr' },
                  { k: 'Em atendimento', done: true, current: true, date: '19 abr' },
                  { k: 'Aguardando retorno', done: false },
                  { k: 'Concluído', done: false },
                ].map((s, i, arr) => (
                  <React.Fragment key={i}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, minWidth: 120 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%',
                        background: s.current ? T.orange : (s.done ? T.ink : T.paperDeep),
                        color: s.current || s.done ? '#fff' : T.mute,
                        display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 700,
                        boxShadow: s.current ? `0 0 0 6px ${T.orangeSoft}` : 'none',
                      }}>{s.done ? <Icon.check style={{ width: 14, height: 14 }}/> : i + 1}</div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 12.5, fontWeight: 600, color: s.done || s.current ? T.ink : T.mute }}>{s.k}</div>
                        {s.date && <div style={{ fontSize: 11, color: T.mute, marginTop: 2 }}>{s.date}</div>}
                      </div>
                    </div>
                    {i < arr.length - 1 && <div style={{ flex: 1, height: 2, background: s.done ? T.ink : T.softLine, marginTop: -28 }}/>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Body grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: 20 }}>
            {/* Registration form */}
            <div style={{ background: '#fff', border: `1px solid ${T.softLine}`, borderRadius: 20, padding: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: 18, borderBottom: `1px solid ${T.softLine}`, marginBottom: 22 }}>
                <div>
                  <div style={{ fontSize: 11.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.orange, fontWeight: 700 }}>Novo registro</div>
                  <h2 style={{ fontFamily: T.fontDisplay, fontSize: 24, fontWeight: 500, letterSpacing: '-0.02em', margin: '6px 0 4px' }}>Registrar atendimento</h2>
                  <div style={{ fontSize: 13, color: T.mute }}>Esse registro compõe suas horas extensionistas do semestre.</div>
                </div>
                <Pill tone="green"><Dot tone="green"/>Salvamento automático</Pill>
              </div>

              <div style={{ display: 'grid', gap: 22 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: T.ink, marginBottom: 10 }}>Canal do atendimento</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {['WhatsApp', 'Presencial', 'Telefone', 'E-mail', 'Outro'].map((c, i) => (
                      <div key={c} style={{
                        padding: '9px 16px', borderRadius: 999, fontSize: 13, fontWeight: 600,
                        border: i === 0 ? `1px solid ${T.orange}` : `1px solid ${T.softLine}`,
                        background: i === 0 ? T.orange : '#fff', color: i === 0 ? '#fff' : T.night, cursor: 'pointer',
                      }}>{c}</div>
                    ))}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: T.ink, marginBottom: 4 }}>O que a empreendedora precisava?</div>
                  <div style={{ fontSize: 12, color: T.mute, marginBottom: 10 }}>Descreva a dúvida de forma objetiva.</div>
                  <div style={{ border: `1px solid ${T.line}`, borderRadius: 12, padding: '14px 16px', fontSize: 14, color: T.ink, background: '#fff', minHeight: 72, lineHeight: 1.5 }}>
                    Joana quer saber se "produção artesanal de doces" pode ser cadastrada como atividade do MEI e quais documentos precisa para isso. Também perguntou sobre alvará sanitário.
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: T.ink, marginBottom: 4 }}>O que você fez?</div>
                  <div style={{ fontSize: 12, color: T.mute, marginBottom: 10 }}>Sua orientação ou encaminhamento.</div>
                  <div style={{ border: `1px solid ${T.line}`, borderRadius: 12, padding: '14px 16px', fontSize: 14, color: T.ink, background: '#fff', minHeight: 72, lineHeight: 1.5 }}>
                    Confirmei a CNAE 1091-1/02 (fabricação de produtos de padaria e confeitaria). Expliquei que precisa de alvará sanitário da prefeitura de Niterói. Enviei o link oficial e orientei sobre o passo seguinte.
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: T.ink, marginBottom: 10 }}>Complexidade do atendimento</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                    {[
                      { t: 'Orientação simples', d: 'Dúvida pontual respondida na hora', time: '30 min', sel: false },
                      { t: 'Com encaminhamento', d: 'Pedi documentos ou encaminhei a outro órgão', time: '45 min', sel: true },
                      { t: 'Suporte detalhado', d: 'Acompanhei todo o processo junto', time: '1h 30min', sel: false },
                    ].map((o, i) => (
                      <div key={i} style={{
                        padding: 14, borderRadius: 14,
                        border: o.sel ? `1.5px solid ${T.orange}` : `1px solid ${T.softLine}`,
                        background: o.sel ? T.orangeGhost : '#fff', cursor: 'pointer',
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                          <div style={{ fontSize: 13.5, fontWeight: 700, color: T.ink }}>{o.t}</div>
                          {o.sel && <div style={{ width: 18, height: 18, borderRadius: '50%', background: T.orange, color: '#fff', display: 'grid', placeItems: 'center' }}><Icon.check style={{ width: 12, height: 12 }}/></div>}
                        </div>
                        <div style={{ fontSize: 12, color: T.mute, lineHeight: 1.5, marginBottom: 10 }}>{o.d}</div>
                        <div style={{ fontSize: 12, color: o.sel ? T.orangeDeep : T.mute, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Icon.clock style={{ width: 12, height: 12 }}/>{o.time}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: T.ink, marginBottom: 10 }}>Precisa de retorno?</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <div style={{ padding: '9px 16px', borderRadius: 999, fontSize: 13, fontWeight: 600, border: `1px solid ${T.softLine}`, background: '#fff', color: T.night, cursor: 'pointer' }}>Não, está resolvido</div>
                    <div style={{ padding: '9px 16px', borderRadius: 999, fontSize: 13, fontWeight: 600, border: `1px solid ${T.orange}`, background: T.orange, color: '#fff', cursor: 'pointer' }}>Sim, precisa de retorno</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10, paddingTop: 20, borderTop: `1px solid ${T.softLine}` }}>
                  <Btn variant="orange" size="lg" style={{ flex: 1, justifyContent: 'center' }} icon={<Icon.check/>}>Salvar registro</Btn>
                  <Btn variant="outline" size="lg">Salvar e concluir</Btn>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 11.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.mute, fontWeight: 700 }}>Histórico</div>
                  <div style={{ fontFamily: T.fontDisplay, fontSize: 22, fontWeight: 500, letterSpacing: '-0.02em', marginTop: 4 }}>Tudo o que aconteceu</div>
                </div>
                <Pill tone="neutral">3 registros</Pill>
              </div>

              <div style={{ position: 'relative', paddingLeft: 28 }}>
                <div style={{ position: 'absolute', left: 11, top: 12, bottom: 12, width: 2, background: T.softLine }}/>

                {[
                  {
                    date: '22 abr · 10:14', title: 'Pedido reaberto para retorno',
                    body: 'Joana enviou os documentos solicitados. Aguardando nova análise.', tone: 'orange',
                  },
                  {
                    date: '19 abr · 15:32', title: 'Orientação prestada (WhatsApp)',
                    body: 'Confirmei CNAE, expliquei alvará sanitário e enviei links oficiais da prefeitura de Niterói.',
                    tags: ['WhatsApp', 'Com encaminhamento', '45 min'], tone: 'green',
                  },
                  {
                    date: '18 abr · 14:44', title: 'Caso assumido por você',
                    body: 'Você entrou na fila e assumiu este caso a partir da triagem.', tone: 'neutral',
                  },
                  {
                    date: '18 abr · 14:22', title: 'Pedido recebido',
                    body: 'Cadastro inicial feito pela própria empreendedora via formulário público.', tone: 'neutral',
                  },
                ].map((e, i) => (
                  <div key={i} style={{ position: 'relative', marginBottom: 18 }}>
                    <div style={{
                      position: 'absolute', left: -28, top: 14, width: 22, height: 22,
                      borderRadius: '50%', background: '#fff', border: `2px solid ${e.tone === 'orange' ? T.orange : e.tone === 'green' ? T.green : T.line}`,
                      display: 'grid', placeItems: 'center',
                    }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: e.tone === 'orange' ? T.orange : e.tone === 'green' ? T.green : T.mute }}/>
                    </div>
                    <div style={{ background: '#fff', border: `1px solid ${T.softLine}`, borderRadius: 14, padding: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: T.ink }}>{e.title}</div>
                        <div style={{ fontSize: 11.5, color: T.mute }}>{e.date}</div>
                      </div>
                      <div style={{ fontSize: 13, color: T.night, opacity: .8, lineHeight: 1.55 }}>{e.body}</div>
                      {e.tags && (
                        <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
                          {e.tags.map(t => <Pill key={t} tone="neutral">{t}</Pill>)}
                        </div>
                      )}
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

window.CaseDetailScreen = CaseDetailScreen;
