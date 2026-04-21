export default async function globalTeardown() {
  // Sem teardown agressivo — banco de teste persiste entre runs para inspeção.
  // Truncate tables é feito no beforeEach de cada spec.
}
