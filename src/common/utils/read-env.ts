export function readEnv(name: string): string | undefined {
  if (typeof process === 'undefined') {
    return undefined;
  }

  return process.env?.[name] || undefined;
}
