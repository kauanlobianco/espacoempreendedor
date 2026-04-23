// Shared building blocks for Espaço Empreendedor redesign prototypes
const T = window.EE;

// ---- Atoms ----
function Logo({ invert = false, size = 1, mark = 'full' }) {
  // `size` now targets the full height in px (default ~34). We derive everything from it.
  const h = 34 * size;
  const mw = h; // mark is square
  const color = invert ? '#fff' : T.ink;
  const sub = invert ? 'rgba(255,255,255,.55)' : T.mute;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 * size, lineHeight: 1 }}>
      <div style={{
        width: mw, height: h, borderRadius: 9 * size,
        background: T.orange, color: '#fff',
        display: 'grid', placeItems: 'center',
        fontFamily: T.fontDisplay, fontWeight: 700, fontStyle: 'italic',
        fontSize: h * 0.56, letterSpacing: '-0.04em',
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.08)',
      }}>ee</div>
      {mark === 'full' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 * size }}>
          <div style={{
            fontFamily: T.fontDisplay, fontWeight: 500, fontSize: h * 0.45,
            letterSpacing: '-0.025em', color, lineHeight: 1,
          }}>Espaço do Empreendedor</div>
          <div style={{
            fontFamily: T.fontSans, fontSize: h * 0.3, letterSpacing: '0.16em',
            textTransform: 'uppercase', color: sub, fontWeight: 600,
          }}>UFF · Extensão</div>
        </div>
      )}
    </div>
  );
}

function Btn({ children, variant = 'primary', size = 'md', icon, iconRight, full, ...rest }) {
  const sizes = {
    xs: { padding: '6px 10px', fontSize: 12, radius: 8, iconGap: 6 },
    sm: { padding: '8px 14px', fontSize: 13, radius: 10, iconGap: 7 },
    md: { padding: '11px 18px', fontSize: 13.5, radius: 12, iconGap: 8 },
    lg: { padding: '14px 22px', fontSize: 15, radius: 14, iconGap: 9 },
  };
  const s = sizes[size];
  const variants = {
    primary: { background: T.ink, color: '#fff', border: '1px solid transparent' },
    orange:  { background: T.orange, color: '#fff', border: '1px solid transparent',
               boxShadow: '0 1px 0 rgba(0,0,0,.08), inset 0 1px 0 rgba(255,255,255,.18)' },
    outline: { background: '#fff', color: T.ink, border: `1px solid ${T.line}` },
    ghost:   { background: 'transparent', color: T.ink, border: '1px solid transparent' },
    soft:    { background: T.orangeGhost, color: T.orangeDeep, border: `1px solid ${T.orangeSoft}` },
    danger:  { background: '#fff', color: T.red, border: `1px solid ${T.redSoft}` },
  };
  const v = variants[variant];
  return (
    <button
      {...rest}
      style={{
        ...v, padding: s.padding, borderRadius: s.radius, fontSize: s.fontSize,
        fontFamily: T.fontSans, fontWeight: 600, cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', gap: s.iconGap,
        letterSpacing: '-0.005em', transition: 'all .15s ease',
        width: full ? '100%' : undefined,
        justifyContent: full ? 'center' : undefined,
        ...rest.style,
      }}
    >
      {icon}{children}{iconRight}
    </button>
  );
}

function Pill({ children, tone = 'neutral', size = 'md', style }) {
  const tones = {
    neutral: { bg: '#EFE8DC', fg: T.night },
    orange:  { bg: T.orangeSoft, fg: T.orangeDeep },
    green:   { bg: T.greenSoft, fg: T.green },
    amber:   { bg: T.amberSoft, fg: '#8A5700' },
    red:     { bg: T.redSoft, fg: T.red },
    blue:    { bg: T.blueSoft, fg: T.blue },
    ghost:   { bg: 'transparent', fg: T.mute, border: `1px solid ${T.line}` },
    dark:    { bg: T.ink, fg: '#fff' },
  };
  const sizes = {
    sm: { fz: 10.5, py: 3, px: 8, gap: 5 },
    md: { fz: 11.5, py: 4, px: 10, gap: 6 },
  };
  const c = tones[tone]; const s = sizes[size];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: s.gap,
      background: c.bg, color: c.fg, padding: `${s.py}px ${s.px}px`,
      borderRadius: 999, fontSize: s.fz, fontWeight: 600,
      fontFamily: T.fontSans, letterSpacing: '0.01em',
      border: c.border || '1px solid transparent', whiteSpace: 'nowrap', ...style,
    }}>{children}</span>
  );
}

// status dot
function Dot({ tone = 'green', size = 8 }) {
  const bg = { green: T.green, amber: T.amber, red: T.red, orange: T.orange, neutral: T.mute, blue: T.blue }[tone] || T.mute;
  return <span style={{ width: size, height: size, borderRadius: '50%', background: bg, display: 'inline-block', flexShrink: 0 }} />;
}

// Minimal icons (line, 18px)
const Icon = {
  arrow: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 12h14M13 5l7 7-7 7"/></svg>,
  check: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M20 6 9 17l-5-5"/></svg>,
  x: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M18 6 6 18M6 6l12 12"/></svg>,
  clock: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>,
  user: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  pin: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M20 10c0 7-8 13-8 13s-8-6-8-13a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>,
  mail: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>,
  phone: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M22 16.92V21a1 1 0 0 1-1.1 1 19 19 0 0 1-8.3-3.05 19 19 0 0 1-6-6A19 19 0 0 1 3.55 4.1 1 1 0 0 1 4.54 3h4.09a1 1 0 0 1 1 .75 12 12 0 0 0 .6 2.4 1 1 0 0 1-.22 1L8.1 8.57a16 16 0 0 0 6 6L16 12.9a1 1 0 0 1 1-.22 12 12 0 0 0 2.4.6 1 1 0 0 1 .75 1Z"/></svg>,
  search: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="11" cy="11" r="7"/><path d="m21 21-4.35-4.35"/></svg>,
  plus: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 5v14M5 12h14"/></svg>,
  chev: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="m9 18 6-6-6-6"/></svg>,
  down: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="m6 9 6 6 6-6"/></svg>,
  shield: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></svg>,
  book: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14Z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20"/></svg>,
  alert: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.7 3.86a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/></svg>,
  doc: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z"/><path d="M14 3v6h6"/></svg>,
  list: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>,
  inbox: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11Z"/></svg>,
  folder: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 7a2 2 0 0 1 2-2h4l2 3h8a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/></svg>,
  chart: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 3v18h18"/><path d="M7 15l4-4 4 4 5-6"/></svg>,
  out: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>,
  spark: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/></svg>,
  cap: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="m22 10-10-5L2 10l10 5 10-5Z"/><path d="M6 12v5c0 1 4 3 6 3s6-2 6-3v-5"/></svg>,
};

function TextInput({ label, hint, icon, aside, ...rest }) {
  return (
    <label style={{ display: 'block' }}>
      {(label || aside) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          {label && <div style={{ fontSize: 12.5, fontWeight: 700, color: T.ink, letterSpacing: '-0.005em' }}>{label}</div>}
          {aside && <div style={{ fontSize: 12, color: T.orangeDeep, fontWeight: 600, cursor: 'pointer' }}>{aside}</div>}
        </div>
      )}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        background: '#fff', border: `1px solid ${T.line}`,
        borderRadius: 12, padding: '12px 14px',
        transition: 'border .15s ease',
      }}>
        {icon && <span style={{ color: T.mute, display: 'flex' }}>{icon}</span>}
        <input {...rest} style={{
          flex: 1, border: 'none', outline: 'none', fontSize: 14,
          fontFamily: T.fontSans, color: T.ink, background: 'transparent',
          fontWeight: 500, letterSpacing: '-0.005em',
          ...rest.style,
        }} />
      </div>
      {hint && <div style={{ fontSize: 12, color: T.mute, marginTop: 6, lineHeight: 1.4 }}>{hint}</div>}
    </label>
  );
}

// Hero visual: stylized booth / pavilion — geometric, warm, editorial.
// Keeps the "approved" pavilion idea but cleaner — flat, confident, less literal.
function HeroPavilion({ width = 520, height = 380 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 520 380" style={{ display: 'block' }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="hp-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFF1E0"/><stop offset="1" stopColor="#FBE0CA"/>
        </linearGradient>
        <linearGradient id="hp-floor" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#E85D1F"/><stop offset="1" stopColor="#B93B0C"/>
        </linearGradient>
        <linearGradient id="hp-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFDF9"/><stop offset="1" stopColor="#F1E8DA"/>
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect x="0" y="0" width="520" height="380" fill="url(#hp-sky)"/>

      {/* Soft sun */}
      <circle cx="90" cy="92" r="42" fill="#FFFFFF" opacity=".55"/>
      <circle cx="90" cy="92" r="42" fill="#FFB07A" opacity=".35"/>

      {/* Back panel — the 'espaço' */}
      <rect x="86" y="72" width="348" height="210" fill="url(#hp-wall)" stroke="#E2D1B6" strokeWidth="1"/>

      {/* Signage */}
      <rect x="86" y="72" width="348" height="40" fill="#1B1714"/>
      <rect x="86" y="72" width="6" height="40" fill="#E85D1F"/>
      <text x="110" y="98" fontFamily="Fraunces, serif" fontSize="17" fontStyle="italic" fontWeight="600" fill="#fff" letterSpacing="-0.015em">espaço do empreendedor</text>

      {/* Content tiles */}
      <g>
        {/* Tile 1: MEI guide */}
        <rect x="108" y="134" width="92" height="130" rx="7" fill="#FFE2D1"/>
        <circle cx="154" cy="168" r="14" fill="#E85D1F"/>
        <rect x="124" y="198" width="60" height="5" rx="2.5" fill="#A83A0F"/>
        <rect x="124" y="210" width="44" height="4" rx="2" fill="#A83A0F" opacity=".55"/>
        <rect x="124" y="220" width="50" height="4" rx="2" fill="#A83A0F" opacity=".55"/>
        <rect x="124" y="245" width="36" height="10" rx="3" fill="#1B1714"/>

        {/* Tile 2: article/guide */}
        <rect x="214" y="134" width="92" height="130" rx="7" fill="#FAF6EF" stroke="#E2D1B6"/>
        <rect x="230" y="150" width="60" height="5" rx="2.5" fill="#1B1714"/>
        <rect x="230" y="162" width="48" height="4" rx="2" fill="#1B1714" opacity=".5"/>
        <rect x="230" y="172" width="54" height="4" rx="2" fill="#1B1714" opacity=".5"/>
        <rect x="230" y="182" width="42" height="4" rx="2" fill="#1B1714" opacity=".5"/>
        <rect x="230" y="225" width="60" height="24" rx="5" fill="#E85D1F"/>
        <rect x="240" y="236" width="40" height="3" rx="1.5" fill="#fff"/>

        {/* Tile 3: chart */}
        <rect x="320" y="134" width="92" height="130" rx="7" fill="#FFFFFF" stroke="#E2D1B6"/>
        <rect x="336" y="150" width="48" height="4" rx="2" fill="#1B1714"/>
        <rect x="336" y="160" width="32" height="3" rx="1.5" fill="#1B1714" opacity=".4"/>
        <path d="M336 238 L336 210 L352 218 L366 196 L380 205 L394 182 L394 238 Z" fill="#2F7D5B" opacity=".8"/>
        <circle cx="394" cy="182" r="3.5" fill="#1B1714"/>
      </g>

      {/* Floor */}
      <path d="M0 282 L520 268 L520 380 L0 380 Z" fill="url(#hp-floor)"/>
      <path d="M0 282 L520 268" stroke="#8C2D06" strokeWidth="1" opacity=".35"/>

      {/* Counter */}
      <rect x="70" y="270" width="380" height="36" rx="4" fill="#1B1714"/>
      <rect x="70" y="270" width="380" height="4" fill="#E85D1F"/>

      {/* Figures — flat, geometric, not caricatures */}
      <g>
        {/* attendant, left */}
        <circle cx="160" cy="256" r="11" fill="#1B1714"/>
        <path d="M142 306 Q160 268 178 306 Z" fill="#1B1714"/>
        <rect x="155" y="253" width="10" height="3" fill="#E85D1F"/>
        {/* visitor, right */}
        <circle cx="340" cy="262" r="10" fill="#5C4A3B"/>
        <path d="M324 306 Q340 272 356 306 Z" fill="#5C4A3B"/>
        {/* child */}
        <circle cx="372" cy="272" r="6" fill="#8C6F58"/>
        <path d="M363 306 Q372 284 381 306 Z" fill="#8C6F58"/>
      </g>

      {/* Planter */}
      <rect x="446" y="278" width="28" height="24" rx="3" fill="#5C4A3B"/>
      <ellipse cx="460" cy="270" rx="22" ry="14" fill="#2F7D5B"/>
      <ellipse cx="460" cy="266" rx="14" ry="10" fill="#3A9A6F"/>

      {/* Floating badges */}
      <g transform="translate(32 118)">
        <rect x="0" y="0" width="96" height="34" rx="17" fill="#fff" stroke="#E2D1B6"/>
        <circle cx="18" cy="17" r="5" fill="#2F7D5B"/>
        <text x="30" y="21.5" fontFamily="Manrope, sans-serif" fontSize="11" fontWeight="700" fill="#1B1714" letterSpacing="0.02em">100% GRATUITO</text>
      </g>
      <g transform="translate(410 46)">
        <rect x="0" y="0" width="100" height="34" rx="17" fill="#1B1714"/>
        <circle cx="18" cy="17" r="5" fill="#E85D1F"/>
        <text x="30" y="21.5" fontFamily="Manrope, sans-serif" fontSize="11" fontWeight="700" fill="#fff" letterSpacing="0.02em">UFF · PEIM</text>
      </g>
      <g transform="translate(378 232)">
        <rect x="0" y="0" width="108" height="32" rx="8" fill="#fff" stroke="#E2D1B6"/>
        <circle cx="14" cy="16" r="3" fill="#E85D1F"/>
        <text x="24" y="20" fontFamily="Manrope, sans-serif" fontSize="10.5" fontWeight="700" fill="#1B1714">Retorno em 48h</text>
      </g>
    </svg>
  );
}

// Small helper: labeled metric
function Metric({ label, value, delta, hint, tone = 'orange', dark = false }) {
  const bg = dark ? T.ink : '#fff';
  const fg = dark ? '#fff' : T.ink;
  const sub = dark ? 'rgba(255,255,255,.55)' : T.mute;
  return (
    <div style={{
      background: bg, border: dark ? 'none' : `1px solid ${T.softLine}`,
      borderRadius: 16, padding: '18px 20px', color: fg,
    }}>
      <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: sub, fontWeight: 600 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 10 }}>
        <div style={{ fontFamily: T.fontDisplay, fontSize: 38, fontWeight: 500, letterSpacing: '-0.035em', lineHeight: 1 }}>{value}</div>
        {delta && <div style={{
          fontSize: 12, fontWeight: 700,
          color: tone === 'green' ? T.green : tone === 'amber' ? T.amber : T.orangeDeep,
          background: tone === 'green' ? T.greenSoft : tone === 'amber' ? T.amberSoft : T.orangeGhost,
          padding: '2px 8px', borderRadius: 6, letterSpacing: '-0.005em',
        }}>{delta}</div>}
      </div>
      {hint && <div style={{ fontSize: 12, color: sub, marginTop: 8, lineHeight: 1.4 }}>{hint}</div>}
    </div>
  );
}

// Case status badge in our new system
function Status({ s, size = 'md' }) {
  const map = {
    NEW:      { tone: 'amber',   dot: 'amber',   label: 'Novo' },
    TRIAGED:  { tone: 'blue',    dot: 'neutral', label: 'Triado' },
    ASSIGNED: { tone: 'orange',  dot: 'orange',  label: 'Em atendimento' },
    WAITING:  { tone: 'neutral', dot: 'amber',   label: 'Aguardando retorno' },
    RESOLVED: { tone: 'green',   dot: 'green',   label: 'Resolvido' },
    CANCELLED:{ tone: 'red',     dot: 'red',     label: 'Cancelado' },
  };
  const m = map[s] || { tone: 'neutral', dot: 'neutral', label: s };
  return <Pill tone={m.tone} size={size}><Dot tone={m.dot} size={6}/>{m.label}</Pill>;
}

// Eyebrow — the small orange all-caps label we reuse everywhere
function Eyebrow({ children, tone = 'orange', style }) {
  const colors = { orange: T.orange, mute: T.mute, red: T.red, green: T.green };
  return (
    <div style={{
      fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
      color: colors[tone], fontWeight: 700, ...style,
    }}>{children}</div>
  );
}

// SectionHead — eyebrow + display headline + optional subtitle
function SectionHead({ eyebrow, title, subtitle, align = 'start', tone = 'orange', size = 'md' }) {
  const sizes = {
    sm: { h: 22, sub: 13 },
    md: { h: 28, sub: 14 },
    lg: { h: 40, sub: 15 },
    xl: { h: 56, sub: 17 },
  };
  const s = sizes[size];
  return (
    <div style={{ textAlign: align }}>
      {eyebrow && <Eyebrow tone={tone}>{eyebrow}</Eyebrow>}
      {title && <h2 style={{
        fontFamily: T.fontDisplay, fontSize: s.h, fontWeight: 500,
        letterSpacing: '-0.03em', margin: eyebrow ? '10px 0 0' : 0, lineHeight: 1.08,
        color: T.ink,
      }}>{title}</h2>}
      {subtitle && <p style={{ fontSize: s.sub, color: T.mute, margin: '8px 0 0', lineHeight: 1.5, maxWidth: 620 }}>{subtitle}</p>}
    </div>
  );
}

function Avatar({ name, size = 34, tone = 'orange' }) {
  const initials = name.split(' ').filter(Boolean).map(x => x[0]).slice(0, 2).join('').toUpperCase();
  const tones = {
    orange: { bg: T.orange, fg: '#fff' },
    soft:   { bg: T.orangeGhost, fg: T.orangeDeep },
    ink:    { bg: T.ink, fg: '#fff' },
    neutral:{ bg: T.paperDeep, fg: T.ink },
    amber:  { bg: T.amberSoft, fg: '#8A5700' },
  };
  const c = tones[tone] || tones.orange;
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: c.bg, color: c.fg, fontWeight: 700,
      display: 'grid', placeItems: 'center',
      fontSize: size * 0.38, letterSpacing: '-0.01em', flexShrink: 0,
      fontFamily: T.fontSans,
    }}>{initials}</div>
  );
}

function Divider({ label, style }) {
  if (!label) return <div style={{ height: 1, background: T.softLine, ...style }}/>;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, ...style }}>
      <div style={{ flex: 1, height: 1, background: T.softLine }}/>
      <span style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.mute, fontWeight: 700 }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: T.softLine }}/>
    </div>
  );
}

function EmptyState({ icon, title, body, action, style }) {
  return (
    <div style={{
      background: '#fff', border: `1px dashed ${T.line}`, borderRadius: 20,
      padding: '44px 28px', textAlign: 'center', color: T.ink, ...style,
    }}>
      {icon && <div style={{
        width: 48, height: 48, margin: '0 auto 14px', borderRadius: 14,
        background: T.orangeGhost, color: T.orange, display: 'grid', placeItems: 'center',
      }}>{icon}</div>}
      <div style={{ fontFamily: T.fontDisplay, fontSize: 22, fontWeight: 500, letterSpacing: '-0.02em', color: T.ink }}>{title}</div>
      {body && <div style={{ fontSize: 14, color: T.mute, marginTop: 8, maxWidth: 440, margin: '8px auto 0', lineHeight: 1.55 }}>{body}</div>}
      {action && <div style={{ marginTop: 20 }}>{action}</div>}
    </div>
  );
}

Object.assign(window, { Logo, Btn, Pill, Dot, Icon, TextInput, HeroPavilion, Metric, Status, Eyebrow, SectionHead, Avatar, Divider, EmptyState });
