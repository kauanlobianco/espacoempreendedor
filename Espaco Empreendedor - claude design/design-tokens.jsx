// Design tokens - Espaço Empreendedor redesign
// Warm, institutional, humane. Orange kept as anchor.

const tokens = {
  // Surface
  paper: '#FAF6EF',            // warm off-white canvas
  paperDeep: '#F3ECE0',        // slight step for layered sections
  card: '#FFFFFF',
  ink: '#1B1714',              // deep warm black
  night: '#2E2722',            // body
  mute: '#736559',             // muted text
  softLine: 'rgba(121, 94, 73, 0.14)',
  line: 'rgba(121, 94, 73, 0.22)',

  // Brand
  orange: '#E85D1F',           // primary signal (slightly deeper than F27420 for better contrast)
  orangeDeep: '#A83A0F',
  orangeSoft: '#FFE2D1',
  orangeGhost: '#FFF2E8',

  // Semantic
  green: '#2F7D5B',
  greenSoft: '#E3F1E8',
  amber: '#B27100',
  amberSoft: '#FDEFCF',
  red: '#A82A1F',
  redSoft: '#FADFDB',
  blue: '#1E5F8C',
  blueSoft: '#DCECF6',

  // Type
  fontSans: `'Manrope', ui-sans-serif, system-ui, -apple-system, sans-serif`,
  fontDisplay: `'Fraunces', 'Source Serif Pro', Georgia, serif`,
  // (Fraunces is chosen for warmth+institution; Manrope for body)
  fontMono: `'JetBrains Mono', ui-monospace, monospace`,

  // Radius
  r: { xs: 6, sm: 10, md: 14, lg: 20, xl: 28, pill: 999 },
  // Shadow
  shadow: {
    soft: '0 2px 6px rgba(27,23,20,0.04), 0 12px 28px rgba(27,23,20,0.06)',
    lift: '0 2px 6px rgba(27,23,20,0.06), 0 22px 48px rgba(27,23,20,0.10)',
  },
};

window.EE = tokens;
