export type UnifiedDiffPatch = {
  id: string;
  issueId: string;
  traceId: string;
  files: string[];
  diff: string;
};

export function isUnifiedDiff(diff: string): boolean {
  return diff.includes('--- ') && diff.includes('+++ ') && diff.includes('@@');
}

export function touchedFiles(diff: string): string[] {
  return diff
    .split('\n')
    .filter((line) => line.startsWith('+++ b/'))
    .map((line) => line.slice(6).trim())
    .filter(Boolean);
}
