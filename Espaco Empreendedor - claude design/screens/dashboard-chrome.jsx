// Shared dashboard chrome + student screens
const T = window.EE;

function Sidebar({ role = 'student', active }) {
  const studentNav = [
    { k: 'queue', label: 'Fila de atendimento', icon: <Icon.inbox/>, badge: 7 },
    { k: 'mine', label: 'Meus casos', icon: <Icon.folder/>, badge: 4 },
    { k: 'hours', label: 'Horas extensionistas', icon: <Icon.clock/> },
    { k: 'reports', label: 'Relatórios', icon: <Icon.doc/> },
  ];
  const profNav = [
    { k: 'dash', label: 'Visão geral', icon: <Icon.chart/> },
    { k: 'cases', label: 'Todos os casos', icon: <Icon.folder/>, badge: 23 },
    { k: 'validations', label: 'Validações', icon: <Icon.check/>, badge: 5, tone: 'orange' },
    { k: 'students', label: 'Alunos', icon: <Icon.cap/> },
    { k: 'reports', label: 'Relatórios', icon: <Icon.doc/> },
  ];
  const nav = role === 'student' ? studentNav : profNav;

  return (
    <aside style={{
      width: 260, background: '#fff', borderRight: `1px solid ${T.softLine}`,
      padding: 22, display: 'flex', flexDirection: 'column', height: '100%',
    }}>
      <Logo />
      <div style={{
        marginTop: 28, fontSize: 11, letterSpacing: '0.18em',
        textTransform: 'uppercase', color: T.mute, fontWeight: 700, padding: '0 6px 10px',
      }}>{role === 'student' ? 'Aluno extensionista' : 'Professor orientador'}</div>
      <nav style={{ display: 'grid', gap: 2 }}>
        {nav.map(n => (
          <div key={n.k} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '11px 12px', borderRadius: 10, cursor: 'pointer',
            background: active === n.k ? T.orangeGhost : 'transparent',
            color: active === n.k ? T.orangeDeep : T.night,
            fontSize: 14, fontWeight: active === n.k ? 600 : 500,
          }}>
            <span style={{ color: active === n.k ? T.orange : T.mute }}>{n.icon}</span>
            <span style={{ flex: 1 }}>{n.label}</span>
            {n.badge && <span style={{
              background: n.tone === 'orange' ? T.orange : (active === n.k ? T.orange : T.paperDeep),
              color: n.tone === 'orange' ? '#fff' : (active === n.k ? '#fff' : T.night),
              fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999,
            }}>{n.badge}</span>}
          </div>
        ))}
      </nav>

      <div style={{ flex: 1 }}/>

      <div style={{
        background: T.paper, borderRadius: 14, padding: 14,
        border: `1px solid ${T.softLine}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: T.orange, color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 14 }}>
            {role === 'student' ? 'MS' : 'PR'}
          </div>
          <div style={{ lineHeight: 1.2, minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: T.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {role === 'student' ? 'Maria Silva' : 'Prof. Ricardo A.'}
            </div>
            <div style={{ fontSize: 11.5, color: T.mute, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {role === 'student' ? 'maria.silva@id.uff.br' : 'ricardo@id.uff.br'}
            </div>
          </div>
          <Icon.out style={{ color: T.mute, cursor: 'pointer' }}/>
        </div>
      </div>
    </aside>
  );
}

function TopBar({ title, crumbs }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '18px 36px', borderBottom: `1px solid ${T.softLine}`, background: '#fff',
    }}>
      <div>
        <div style={{ fontSize: 12, color: T.mute, display: 'flex', gap: 6 }}>
          {crumbs?.map((c, i) => <span key={i}>{i > 0 && '/'} {c}</span>)}
        </div>
        <div style={{ fontSize: 19, fontWeight: 700, color: T.ink, letterSpacing: '-0.01em', marginTop: 2 }}>{title}</div>
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: T.paper, border: `1px solid ${T.softLine}`,
          borderRadius: 10, padding: '8px 12px', width: 300,
        }}>
          <Icon.search style={{ color: T.mute }}/>
          <input placeholder="Buscar por nome, código ou CPF" style={{
            border: 'none', outline: 'none', fontSize: 13.5, flex: 1, background: 'transparent', fontFamily: T.fontSans,
          }}/>
          <span style={{ fontSize: 11, color: T.mute, padding: '2px 6px', background: '#fff', borderRadius: 4, border: `1px solid ${T.softLine}` }}>⌘K</span>
        </div>
        <Btn variant="outline" size="sm" icon={<Icon.plus/>}>Nova ação</Btn>
      </div>
    </div>
  );
}

// Row component for case lists
function CaseRow({ code, name, summary, status, cat, when, loc, resp, urgent, onClick, primary }) {
  return (
    <div style={{
      background: '#fff', border: `1px solid ${primary ? T.orange : T.softLine}`,
      borderRadius: 14, padding: '18px 22px',
      display: 'grid', gridTemplateColumns: '100px 1fr auto', gap: 24, alignItems: 'center',
      boxShadow: primary ? '0 0 0 4px rgba(232,93,31,.08)' : 'none',
      position: 'relative',
    }}>
      {urgent && <div style={{ position: 'absolute', top: 0, left: 22, right: 22, height: 3, background: T.orange, borderRadius: 999 }}/>}
      <div>
        <div style={{ fontFamily: T.fontMono, fontSize: 11.5, fontWeight: 700, color: T.mute, letterSpacing: '0.04em' }}>{code}</div>
        <div style={{ fontSize: 11, color: T.mute, marginTop: 4 }}>{when}</div>
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 15.5, fontWeight: 700, color: T.ink }}>{name}</span>
          <span style={{ fontSize: 11, color: T.mute, textTransform: 'uppercase', letterSpacing: '0.12em' }}>· {cat}</span>
        </div>
        <div style={{ fontSize: 13.5, color: T.night, opacity: .75, lineHeight: 1.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{summary}</div>
        <div style={{ display: 'flex', gap: 14, fontSize: 12, color: T.mute, marginTop: 8 }}>
          {loc && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Icon.pin/>{loc}</span>}
          {resp && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Icon.user/>{resp}</span>}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
        <Status s={status}/>
        <Btn variant={primary ? 'orange' : 'outline'} size="sm" iconRight={<Icon.arrow/>}>{primary ? 'Assumir' : 'Abrir'}</Btn>
      </div>
    </div>
  );
}

window.Sidebar = Sidebar;
window.TopBar = TopBar;
window.CaseRow = CaseRow;
