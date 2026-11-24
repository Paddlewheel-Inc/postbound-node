export function buildPath(...segments: string[]): string {
  return `/${segments.map(encodeURIComponent).join('/')}`;
}
