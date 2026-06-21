export function makeId(prefix: string): string {
  const stamp = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}.${stamp}.${rand}`;
}

export function makeTraceId(): string {
  return makeId('trace');
}
