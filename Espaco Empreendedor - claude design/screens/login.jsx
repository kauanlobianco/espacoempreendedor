// Screen: Login
const T = window.EE;

function LoginScreen() {
  return (
    <div style={{ width: 1440, height: 900, background: T.paper, fontFamily: T.fontSans, color: T.ink, display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      {/* Left panel — institutional */}
      <div style={{
        background: T.ink, color: '#fff', padding: '56px 64px',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Orange gradient orb */}
        <div style={{
          position: 'absolute', right: -120, top: -120, width: 420, height: 420,
          borderRadius: '50%', background: `radial-gradient(circle, ${T.orange}, transparent 70%)`, opacity: .5,
        }}/>

        <Logo invert />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', color: T.orange, fontWeight: 700 }}>Acesso interno</div>
          <h1 style={{
            fontFamily: T.fontDisplay, fontSize: 52, fontWeight: 500, letterSpacing: '-0.035em',
            lineHeight: 1.02, margin: '20px 0 22px',
          }}>
            Onde alunos e<br/>professores<br/><em style={{ color: T.orange, fontStyle: 'italic' }}>operam o dia-a-dia.</em>
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.65, color: 'rgba(255,255,255,.72)', maxWidth: 420 }}>
            Se você já tem senha, entre normalmente. Se seu cadastro foi aprovado agora,
            use primeiro acesso para criar sua senha com o e-mail institucional.
          </p>

          <div style={{ marginTop: 40, display: 'grid', gap: 10, maxWidth: 420 }}>
            {[
              { i: <Icon.cap/>, t: 'Aluno extensionista', d: 'Fila, casos e registro de atendimentos' },
              { i: <Icon.user/>, t: 'Professor orientador', d: 'Supervisão, validação e horas extensionistas' },
              { i: <Icon.shield/>, t: 'Primeiro acesso', d: 'Crie sua senha com e-mail institucional' },
            ].map((r, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.08)',
                borderRadius: 14, padding: '14px 16px',
              }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(232,93,31,.18)', color: T.orange, display: 'grid', placeItems: 'center' }}>{r.i}</div>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 700 }}>{r.t}</div>
                  <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,.6)' }}>{r.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 24, fontSize: 12.5, color: 'rgba(255,255,255,.5)' }}>
          <span>← Voltar ao site público</span>
          <span>Novo aluno? Fazer cadastro</span>
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{ padding: '80px 96px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{
          display: 'inline-flex', gap: 4, background: '#fff', padding: 4, borderRadius: 14,
          border: `1px solid ${T.softLine}`, width: 'fit-content', marginBottom: 40,
        }}>
          <div style={{ padding: '10px 20px', fontSize: 14, fontWeight: 600, background: T.ink, color: '#fff', borderRadius: 10 }}>Entrar</div>
          <div style={{ padding: '10px 20px', fontSize: 14, fontWeight: 500, color: T.mute }}>Primeiro acesso</div>
        </div>

        <div style={{ fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', color: T.orange, fontWeight: 700 }}>Entrar</div>
        <h2 style={{ fontFamily: T.fontDisplay, fontSize: 40, fontWeight: 500, letterSpacing: '-0.03em', margin: '12px 0 6px' }}>Faça seu login</h2>
        <p style={{ fontSize: 14.5, color: T.mute, margin: '0 0 32px' }}>Área restrita a membros do projeto.</p>

        <div style={{ display: 'grid', gap: 18, maxWidth: 440 }}>
          <TextInput label="E-mail institucional" placeholder="voce@id.uff.br" icon={<Icon.mail/>} defaultValue="maria.silva@id.uff.br" />
          <TextInput label="Senha" type="password" placeholder="Sua senha" icon={<Icon.shield/>} defaultValue="••••••••••" />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: T.night }}>
              <span style={{ width: 16, height: 16, borderRadius: 4, background: T.orange, display: 'grid', placeItems: 'center', color: '#fff' }}><Icon.check/></span>
              Manter sessão neste navegador
            </label>
            <span style={{ fontSize: 13, color: T.orangeDeep, fontWeight: 600 }}>Esqueci minha senha</span>
          </div>

          <Btn variant="orange" size="lg" style={{ width: '100%', justifyContent: 'center', marginTop: 6 }} iconRight={<Icon.arrow/>}>Entrar na plataforma</Btn>
        </div>
      </div>
    </div>
  );
}

window.LoginScreen = LoginScreen;
