export function makeCmpTraceId(prefix = 'CMP'): string {
  const time = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}${time}${rand}`;
}

export function makeCmpId(prefix = 'INTENT'): string {
  const time = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 7);
  return `${prefix}-${time}-${rand}`;
}
