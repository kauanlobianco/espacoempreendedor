// Diagnosis + design system overview
const T = window.EE;

function SwatchRow({ name, hex, note, border }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '52px 1fr auto', gap: 14, alignItems: 'center', padding: '10px 0', borderTop: `1px solid ${T.softLine}` }}>
      <div style={{ width: 52, height: 36, borderRadius: 8, background: hex, border: border ? `1px solid ${T.line}` : 'none' }}/>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: T.ink, letterSpacing: '-0.005em' }}>{name}</div>
        {note && <div style={{ fontSize: 11.5, color: T.mute, marginTop: 1 }}>{note}</div>}
      </div>
      <div style={{ fontSize: 12, color: T.mute, fontFamily: T.fontMono, fontWeight: 600 }}>{hex}</div>
    </div>
  );
}

function SystemOverviewScreen() {
  return (
    <div style={{ width: 1400, background: T.paper, padding: 56, fontFamily: T.fontSans, color: T.ink }}>
      {/* Header */}
      <div style={{ marginBottom: 44, paddingBottom: 32, borderBottom: `1px solid ${T.softLine}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 40 }}>
        <div style={{ maxWidth: 880 }}>
          <Logo size={1.3}/>
          <div style={{ marginTop: 32 }}>
            <Eyebrow>Reformulação do frontend · v2 · 22 abr 2026</Eyebrow>
            <h1 style={{
              fontFamily: T.fontDisplay, fontSize: 60, fontWeight: 500,
              letterSpacing: '-0.04em', lineHeight: 0.98, margin: '16px 0 18px',
            }}>
              Um produto <em style={{ fontStyle: 'italic', color: T.orange, fontWeight: 500 }}>sério, humano e acolhedor</em> — não um SaaS genérico.
            </h1>
            <p style={{ fontSize: 17, color: T.night, opacity: .78, lineHeight: 1.55, margin: 0 }}>
              Uma plataforma de utilidade pública que parece feita por uma universidade de verdade. Tipografia editorial (Fraunces) para dar peso institucional, Manrope para a operação diária, laranja forte mantido como cor de marca e um sistema visual disciplinado entre áreas pública e interna.
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 200 }}>
          <Pill tone="dark" size="md"><Dot tone="orange" size={6}/>Revisado · v2 polish</Pill>
          <div style={{ fontSize: 12, color: T.mute, lineHeight: 1.5 }}>
            Arraste artboards para reordenar. Clique em qualquer um para abrir em foco (← → Esc).
          </div>
        </div>
      </div>

      {/* Diagnosis vs direction */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 56 }}>
        <div style={{ background: '#fff', border: `1px solid ${T.softLine}`, borderRadius: 20, padding: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: T.redSoft, color: T.red, display: 'grid', placeItems: 'center' }}><Icon.alert/></div>
            <Eyebrow tone="mute">Diagnóstico · antes</Eyebrow>
          </div>
          <h3 style={{ fontFamily: T.fontDisplay, fontSize: 26, fontWeight: 500, letterSpacing: '-0.025em', margin: '0 0 20px', lineHeight: 1.1 }}>O que não estava funcionando</h3>
          {[
            ['Áreas internas genéricas', 'Aluno e professor com cara de SaaS qualquer.'],
            ['Hierarquia frouxa', 'Tudo tem o mesmo peso, nada grita prioridade.'],
            ['Dashboards sem narrativa', 'O professor não sabe no que mexer primeiro.'],
            ['Registro de atendimento longo', 'Sem sensação de progresso nem fim.'],
            ['Horas sem visualização', 'O aluno não sabe onde está no semestre.'],
            ['Landing fria', 'Falta calor, prova e humanidade.'],
            ['Copy operacional demais', 'Pouco tranquilizadora para quem pede ajuda.'],
          ].map(([t, d], i) => (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '22px 1fr', gap: 12,
              padding: '12px 0', borderTop: i === 0 ? 'none' : `1px solid ${T.softLine}`,
            }}>
              <div style={{ marginTop: 1 }}><Icon.x style={{ color: T.red }}/></div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.ink, letterSpacing: '-0.005em' }}>{t}</div>
                <div style={{ fontSize: 13, color: T.mute, lineHeight: 1.5, marginTop: 2 }}>{d}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: T.ink, color: '#fff', borderRadius: 20, padding: 32, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -60, bottom: -60, width: 220, height: 220, borderRadius: '50%', background: `radial-gradient(circle, ${T.orange}, transparent 70%)`, opacity: .35 }}/>
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(232,93,31,.18)', color: T.orange, display: 'grid', placeItems: 'center' }}><Icon.spark/></div>
              <Eyebrow>Direção · agora</Eyebrow>
            </div>
            <h3 style={{ fontFamily: T.fontDisplay, fontSize: 26, fontWeight: 500, letterSpacing: '-0.025em', margin: '0 0 20px', lineHeight: 1.1, color: '#fff' }}>Por onde elevamos o produto</h3>
            {[
              ['Tipografia pareada', 'Fraunces editorial + Manrope operacional.'],
              ['Laranja disciplinado', 'Um único laranja como cor de sinalização.'],
              ['Preto quente', 'Ancora institucional — não cinza SaaS.'],
              ['Hierarquia por escala', 'Peso e espaço, não só cor.'],
              ['Dashboards narrativos', 'Cabeçalho conta o que importa hoje.'],
              ['Jornada visualizada', 'Cada caso mostra progresso em etapas.'],
              ['Copy humana', 'Ajuda honesta, retorno em 48h, sem juridiquês.'],
            ].map(([t, d], i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '22px 1fr', gap: 12,
                padding: '12px 0', borderTop: i === 0 ? 'none' : '1px solid rgba(255,255,255,.08)',
              }}>
                <div style={{ marginTop: 1 }}><Icon.check style={{ color: T.orange }}/></div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', letterSpacing: '-0.005em' }}>{t}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,.65)', lineHeight: 1.5, marginTop: 2 }}>{d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tokens */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
          <SectionHead eyebrow="Design system" title="Tokens fundamentais" size="lg"/>
          <div style={{ fontSize: 12, color: T.mute, maxWidth: 280, textAlign: 'right' }}>
            Base compartilhada entre landing, login, área do aluno e área do professor.
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: 20 }}>
          {/* Palette */}
          <div style={{ background: '#fff', border: `1px solid ${T.softLine}`, borderRadius: 20, padding: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.ink }}>Paleta</div>
              <div style={{ fontSize: 11, color: T.mute, fontFamily: T.fontMono }}>8 core</div>
            </div>
            <div style={{ fontSize: 12, color: T.mute, marginBottom: 10, lineHeight: 1.5 }}>Laranja como cor única de sinal. Preto quente e papel como âncoras.</div>
            <SwatchRow name="Brand orange" hex="#E85D1F" note="Signal · CTAs · marca"/>
            <SwatchRow name="Orange deep" hex="#A83A0F" note="Texto em laranja ghost"/>
            <SwatchRow name="Orange ghost" hex="#FFF2E8" note="Fundos de destaque"/>
            <SwatchRow name="Ink" hex="#1B1714" note="Texto · âncora institucional"/>
            <SwatchRow name="Night" hex="#2E2722" note="Texto corrente"/>
            <SwatchRow name="Paper" hex="#FAF6EF" note="Canvas quente" border/>
            <SwatchRow name="Success" hex="#2F7D5B"/>
            <SwatchRow name="Warning" hex="#B27100"/>
          </div>

          {/* Type */}
          <div style={{ background: '#fff', border: `1px solid ${T.softLine}`, borderRadius: 20, padding: 28 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.ink, marginBottom: 8 }}>Tipografia</div>
            <div style={{ fontSize: 12, color: T.mute, marginBottom: 20, lineHeight: 1.5 }}>Serif editorial para display + sans operacional.</div>

            <div style={{ paddingBottom: 18, borderBottom: `1px solid ${T.softLine}`, marginBottom: 18 }}>
              <div style={{ fontSize: 10.5, color: T.mute, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 10 }}>Display · Fraunces</div>
              <div style={{ fontFamily: T.fontDisplay, fontSize: 48, fontWeight: 500, letterSpacing: '-0.035em', lineHeight: 1 }}>Aa</div>
              <div style={{ fontFamily: T.fontDisplay, fontSize: 14, fontStyle: 'italic', color: T.orange, marginTop: 6 }}>ajuda honesta</div>
            </div>
            <div style={{ paddingBottom: 18, borderBottom: `1px solid ${T.softLine}`, marginBottom: 18 }}>
              <div style={{ fontSize: 10.5, color: T.mute, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 10 }}>Sans · Manrope</div>
              <div style={{ fontFamily: T.fontSans, fontSize: 26, fontWeight: 700, letterSpacing: '-0.015em' }}>Operar com clareza</div>
              <div style={{ fontFamily: T.fontSans, fontSize: 13, color: T.mute, marginTop: 4 }}>400 · 500 · 600 · 700 · 800</div>
            </div>
            <div>
              <div style={{ fontSize: 10.5, color: T.mute, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 10 }}>Mono · JetBrains</div>
              <div style={{ fontFamily: T.fontMono, fontSize: 15, fontWeight: 600 }}>EE-2026-0138</div>
              <div style={{ fontFamily: T.fontMono, fontSize: 12, color: T.mute, marginTop: 2 }}>Códigos, CPF, referências</div>
            </div>
          </div>

          {/* Components */}
          <div style={{ background: '#fff', border: `1px solid ${T.softLine}`, borderRadius: 20, padding: 28 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.ink, marginBottom: 8 }}>Componentes-chave</div>
            <div style={{ fontSize: 12, color: T.mute, marginBottom: 18, lineHeight: 1.5 }}>Botões, status, badges — reutilizados em toda a plataforma.</div>

            <div style={{ fontSize: 10.5, color: T.mute, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 8 }}>Botões</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 18 }}>
              <Btn variant="orange" size="sm">Primário</Btn>
              <Btn variant="primary" size="sm">Ink</Btn>
              <Btn variant="outline" size="sm">Outline</Btn>
              <Btn variant="soft" size="sm">Soft</Btn>
              <Btn variant="ghost" size="sm">Ghost</Btn>
            </div>

            <div style={{ fontSize: 10.5, color: T.mute, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 8 }}>Status de caso</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 18 }}>
              <Status s="NEW"/><Status s="TRIAGED"/><Status s="ASSIGNED"/>
              <Status s="WAITING"/><Status s="RESOLVED"/>
            </div>

            <div style={{ fontSize: 10.5, color: T.mute, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 8 }}>Badges</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              <Pill tone="orange">laranja</Pill>
              <Pill tone="green">sucesso</Pill>
              <Pill tone="amber">atenção</Pill>
              <Pill tone="blue">info</Pill>
              <Pill tone="neutral">neutro</Pill>
            </div>
          </div>
        </div>
      </div>

      {/* Principles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {[
          { t: 'Institucional', d: 'Parece feito por uma universidade pública de verdade.', ic: <Icon.cap/> },
          { t: 'Acolhedor',     d: 'Papel quente, serif editorial, copy humana.', ic: <Icon.user/> },
          { t: 'Confiável',     d: 'Diferencia oficial, opcional e golpe de forma explícita.', ic: <Icon.shield/> },
          { t: 'Operacional',   d: 'Densidade ajustada — aluno e professor operam rápido.', ic: <Icon.chart/> },
        ].map((p, i) => (
          <div key={i} style={{ background: '#fff', border: `1px solid ${T.softLine}`, borderRadius: 16, padding: 22 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: T.orangeGhost, color: T.orange, display: 'grid', placeItems: 'center', marginBottom: 14 }}>{p.ic}</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: T.ink, letterSpacing: '-0.01em' }}>{p.t}</div>
            <div style={{ fontSize: 13, color: T.mute, marginTop: 6, lineHeight: 1.5 }}>{p.d}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

window.SystemOverviewScreen = SystemOverviewScreen;
