// Screen: Public landing — redesigned + refined
const T = window.EE;

function PublicNav({ current }) {
  const links = [
    { k: 'ajuda', label: 'Quero ajuda' },
    { k: 'abrir', label: 'Abrir MEI' },
    { k: 'sou', label: 'Já sou MEI' },
    { k: 'golpes', label: 'Golpes e cobranças' },
    { k: 'sobre', label: 'Sobre o projeto' },
  ];
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '20px 56px', borderBottom: `1px solid ${T.softLine}`,
      background: 'rgba(250,246,239,0.88)', backdropFilter: 'blur(8px)',
    }}>
      <Logo />
      <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
        {links.map(l => (
          <span key={l.k} style={{
            fontSize: 14, color: current === l.k ? T.ink : T.night,
            fontWeight: current === l.k ? 700 : 500, cursor: 'pointer',
            letterSpacing: '-0.005em',
            borderBottom: current === l.k ? `2px solid ${T.orange}` : '2px solid transparent',
            paddingBottom: 2,
          }}>{l.label}</span>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Btn variant="ghost" size="sm">Acompanhar pedido</Btn>
        <Btn variant="primary" size="sm" icon={<Icon.cap/>}>Entrar</Btn>
      </div>
    </div>
  );
}

function LandingScreen() {
  return (
    <div style={{ width: 1440, background: T.paper, fontFamily: T.fontSans, color: T.ink }}>
      <PublicNav current="ajuda"/>

      {/* Hero */}
      <section style={{ padding: '72px 56px 64px', display: 'grid', gridTemplateColumns: '1.05fr 560px', gap: 64, alignItems: 'center' }}>
        <div>
          <Pill tone="orange" size="md" style={{ marginBottom: 26 }}>
            <Dot tone="orange" size={7}/> Atendimento gratuito · UFF · 2026.1
          </Pill>
          <h1 style={{
            fontFamily: T.fontDisplay, fontSize: 86, fontWeight: 500,
            lineHeight: 0.96, letterSpacing: '-0.045em', margin: 0, color: T.ink,
          }}>
            Ajuda honesta<br/>
            para quem está<br/>
            <em style={{ fontStyle: 'italic', color: T.orange, fontWeight: 500 }}>empreendendo.</em>
          </h1>
          <p style={{
            fontSize: 18.5, lineHeight: 1.55, color: T.night,
            maxWidth: 540, marginTop: 26, marginBottom: 36, letterSpacing: '-0.005em',
          }}>
            Entenda o que fazer, evite cobrança errada e fale com alguém de verdade.
            Feito por alunos e professores da UFF — <span style={{ color: T.ink, fontWeight: 600 }}>sem taxa, sem juridiquês, sem pressão.</span>
          </p>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <Btn variant="orange" size="lg" iconRight={<Icon.arrow/>}>Quero ajuda agora</Btn>
            <Btn variant="outline" size="lg">Acompanhar um pedido</Btn>
          </div>
          <div style={{ marginTop: 18, fontSize: 13, color: T.mute, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon.clock style={{ width: 14, height: 14 }}/> Retorno em até 48h úteis · sem login obrigatório
          </div>

          {/* Proof line */}
          <div style={{
            marginTop: 48, display: 'grid', gridTemplateColumns: 'repeat(3, auto)', gap: 44, alignItems: 'end',
            paddingTop: 28, borderTop: `1px solid ${T.softLine}`, justifyContent: 'start',
          }}>
            {[
              { n: '1.247', l: 'Atendimentos realizados' },
              { n: '38',    l: 'Alunos extensionistas' },
              { n: '4,8',   sub: '/5', l: 'Avaliação média' },
            ].map((m, i) => (
              <div key={i}>
                <div style={{ fontFamily: T.fontDisplay, fontSize: 34, fontWeight: 600, letterSpacing: '-0.035em', lineHeight: 1, display: 'flex', alignItems: 'baseline' }}>
                  {m.n}{m.sub && <span style={{ color: T.mute, fontSize: 17, fontWeight: 500 }}>{m.sub}</span>}
                </div>
                <div style={{ fontSize: 11.5, color: T.mute, textTransform: 'uppercase', letterSpacing: '0.14em', marginTop: 6, fontWeight: 600 }}>{m.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          borderRadius: 28, overflow: 'hidden', boxShadow: T.shadow.lift,
          background: '#fff', border: `1px solid ${T.softLine}`,
          transform: 'rotate(0.5deg)',
        }}>
          <HeroPavilion width={560} height={408} />
        </div>
      </section>

      {/* Paths */}
      <section style={{ padding: '40px 56px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 40, alignItems: 'end', marginBottom: 32 }}>
          <SectionHead
            eyebrow="Por onde começar"
            title="Escolha o caminho mais próximo da sua dúvida."
            size="lg"
          />
          <div style={{ fontSize: 14, color: T.mute, maxWidth: 320, lineHeight: 1.5 }}>
            Conteúdo curto, direto e pensado para ler no celular — mesmo com internet lenta.
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {[
            { n: '01', t: 'Quero abrir meu MEI', d: 'Passo a passo oficial no Portal do Empreendedor com checagem de requisitos.', ic: <Icon.spark/> },
            { n: '02', t: 'Já sou MEI', d: 'DAS, DASN, alterações, desenquadramento e o que fazer em atraso.', ic: <Icon.doc/> },
            { n: '03', t: 'Recebi uma cobrança', d: 'Como saber se é oficial, privada opcional, ou tentativa de golpe.', ic: <Icon.shield/>, highlight: true },
            { n: '04', t: 'Falar com atendente', d: 'Abra uma solicitação e um aluno extensionista retorna em até 48h.', ic: <Icon.user/> },
          ].map((c, i) => (
            <div key={i} style={{
              background: c.highlight ? T.ink : '#fff',
              color: c.highlight ? '#fff' : T.ink,
              border: c.highlight ? 'none' : `1px solid ${T.softLine}`,
              borderRadius: 20, padding: 24, display: 'flex', flexDirection: 'column',
              minHeight: 240, position: 'relative', overflow: 'hidden',
              boxShadow: c.highlight ? T.shadow.lift : 'none',
            }}>
              <div style={{
                fontFamily: T.fontMono, fontSize: 11, fontWeight: 700,
                color: c.highlight ? 'rgba(255,255,255,.5)' : T.mute,
                letterSpacing: '0.1em', marginBottom: 18,
              }}>{c.n}</div>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: c.highlight ? 'rgba(232,93,31,.18)' : T.orangeGhost,
                color: T.orange, display: 'grid', placeItems: 'center', marginBottom: 16,
              }}>{c.ic}</div>
              <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.015em', lineHeight: 1.2 }}>{c.t}</div>
              <div style={{
                fontSize: 13.5, color: c.highlight ? 'rgba(255,255,255,.68)' : T.mute,
                lineHeight: 1.55, marginTop: 10, flex: 1,
              }}>{c.d}</div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                color: c.highlight ? T.orange : T.orangeDeep,
                fontSize: 13, fontWeight: 600, marginTop: 18,
              }}>Abrir guia <Icon.arrow/></div>
            </div>
          ))}
        </div>
      </section>

      {/* Commitment band */}
      <section style={{ padding: '0 56px 80px' }}>
        <div style={{
          background: T.ink, borderRadius: 28, padding: '56px 64px', color: '#fff',
          display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 72, alignItems: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', left: -80, bottom: -80, width: 320, height: 320, borderRadius: '50%', background: `radial-gradient(circle, ${T.orange}, transparent 70%)`, opacity: .3 }}/>
          <div style={{ position: 'relative' }}>
            <Eyebrow>Nosso compromisso</Eyebrow>
            <h2 style={{
              fontFamily: T.fontDisplay, fontSize: 48, fontWeight: 500, letterSpacing: '-0.035em',
              lineHeight: 1.02, margin: '14px 0 20px', color: '#fff',
            }}>
              Sem juridiquês.<br/>Sem pressão.<br/><em style={{ fontStyle: 'italic', color: T.orange, fontWeight: 500 }}>Sem cara de golpe.</em>
            </h2>
            <p style={{ fontSize: 15.5, lineHeight: 1.6, color: 'rgba(255,255,255,.72)', maxWidth: 460, margin: 0 }}>
              A gente diferencia o que é procedimento <strong style={{ color: '#fff' }}>oficial</strong>, apoio privado <strong style={{ color: '#fff' }}>opcional</strong> e cobrança <strong style={{ color: '#fff' }}>indevida</strong>. Isso reduz o risco de quem está começando agora.
            </p>
          </div>

          <div style={{ display: 'grid', gap: 0, position: 'relative' }}>
            {[
              { t: 'OFICIAL',  d: 'Informação validada por supervisão acadêmica e fontes do governo federal.', dot: '#2F7D5B', num: '01' },
              { t: 'OPCIONAL', d: 'Apoio privado que pode ser contratado — nunca é obrigatório para ser MEI.', dot: '#E85D1F', num: '02' },
              { t: 'GOLPE',    d: 'Cobranças indevidas, taxas falsas, pressão por pagamento ou links suspeitos.', dot: '#D9544A', num: '03' },
            ].map((r, i, arr) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '36px 110px 1fr', gap: 20, alignItems: 'center',
                padding: '22px 0', borderTop: i === 0 ? 'none' : '1px solid rgba(255,255,255,.08)',
              }}>
                <div style={{ fontFamily: T.fontMono, fontSize: 11, color: 'rgba(255,255,255,.4)', fontWeight: 700 }}>{r.num}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 999, background: r.dot }}/>
                  <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.1em' }}>{r.t}</span>
                </div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,.72)', lineHeight: 1.55 }}>{r.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ + CTA */}
      <section style={{ padding: '0 56px 100px', display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 56 }}>
        <div>
          <SectionHead eyebrow="Dúvidas frequentes" title="Respostas diretas, sem rodeio." size="lg"/>
          <div style={{ marginTop: 28 }}>
            {[
              { q: 'Preciso pagar alguma coisa para abrir MEI?', a: 'Não. Abrir MEI no Portal do Empreendedor (gov.br/mei) é 100% gratuito. Qualquer cobrança de "taxa de abertura" é privada ou indevida — e a gente te ajuda a identificar.', open: true },
              { q: 'Vocês fazem a abertura por mim?' },
              { q: 'Em quanto tempo recebo retorno?' },
              { q: 'Meus dados ficam seguros?' },
              { q: 'Quem são os alunos extensionistas?' },
            ].map((f, i) => (
              <div key={i} style={{ borderTop: `1px solid ${T.softLine}`, padding: '20px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                  <div style={{ fontSize: 17, fontWeight: 600, color: T.ink, letterSpacing: '-0.01em' }}>{f.q}</div>
                  <div style={{ color: T.mute, transform: f.open ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform .15s' }}>{f.open ? <Icon.down/> : <Icon.chev/>}</div>
                </div>
                {f.open && <div style={{ fontSize: 14.5, color: T.night, opacity: .75, lineHeight: 1.6, marginTop: 12, maxWidth: 520 }}>{f.a}</div>}
              </div>
            ))}
            <div style={{ borderTop: `1px solid ${T.softLine}` }}/>
          </div>
        </div>
        <div style={{
          background: T.orangeGhost, borderRadius: 28, padding: 40,
          border: `1px solid ${T.orangeSoft}`, position: 'relative', overflow: 'hidden',
          alignSelf: 'start',
        }}>
          <Eyebrow>Atendimento assistido</Eyebrow>
          <h3 style={{
            fontFamily: T.fontDisplay, fontSize: 34, fontWeight: 500,
            letterSpacing: '-0.03em', margin: '14px 0 14px', color: T.ink, lineHeight: 1.05,
          }}>
            Precisa falar com alguém do projeto?
          </h3>
          <p style={{ fontSize: 15, color: T.night, lineHeight: 1.6, margin: '0 0 24px', maxWidth: 380, opacity: .82 }}>
            Abra uma solicitação gratuita. Um aluno extensionista te retorna pelo canal que você escolher — WhatsApp, e-mail ou telefone.
          </p>

          <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
            <Pill tone="dark" size="sm"><Dot tone="green" size={6}/>Supervisionado</Pill>
            <Pill tone="dark" size="sm">100% gratuito</Pill>
            <Pill tone="dark" size="sm">Sem cadastro obrigatório</Pill>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <Btn variant="orange" size="lg">Pedir ajuda</Btn>
            <Btn variant="outline" size="lg">Acompanhar</Btn>
          </div>

          <div style={{
            marginTop: 28, paddingTop: 20, borderTop: `1px dashed ${T.orangeSoft}`,
            display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: T.orangeDeep, fontWeight: 600,
          }}>
            <Icon.clock style={{ width: 14, height: 14 }}/> Retorno em até 48h úteis
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: T.ink, color: 'rgba(255,255,255,.8)', padding: '48px 56px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr', gap: 48, marginBottom: 40 }}>
          <div>
            <Logo invert/>
            <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,.55)', lineHeight: 1.55, marginTop: 20, maxWidth: 280 }}>
              Projeto de Extensão da Universidade Federal Fluminense · PEIM. Atendimento gratuito, supervisionado por professores.
            </p>
          </div>
          {[
            { t: 'Ajuda', l: ['Abrir MEI', 'Já sou MEI', 'Cobranças e golpes', 'Acompanhar pedido'] },
            { t: 'Projeto', l: ['Sobre o projeto', 'Equipe e orientadores', 'Relatórios semestrais', 'Parcerias'] },
            { t: 'Institucional', l: ['Privacidade (LGPD)', 'Termos de uso', 'Acessibilidade', 'Contato UFF'] },
          ].map((g, i) => (
            <div key={i}>
              <div style={{ fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase', color: T.orange, fontWeight: 700, marginBottom: 14 }}>{g.t}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {g.l.map(a => <span key={a} style={{ fontSize: 13.5, color: 'rgba(255,255,255,.68)' }}>{a}</span>)}
              </div>
            </div>
          ))}
        </div>
        <div style={{
          paddingTop: 24, borderTop: '1px solid rgba(255,255,255,.08)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontSize: 12.5, color: 'rgba(255,255,255,.45)',
        }}>
          <span>© 2026 Espaço do Empreendedor · Universidade Federal Fluminense</span>
          <span>Versão 2.0 · Atualizado em abril de 2026</span>
        </div>
      </footer>
    </div>
  );
}

window.LandingScreen = LandingScreen;
