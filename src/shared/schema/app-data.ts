export type AppDataFile = {
  relPath: string;
  required: boolean;
  kind: 'dir' | 'json' | 'jsonl' | 'html';
};

export const APP_DATA_CONTRACT: AppDataFile[] = [
  { relPath: 'logs', required: true, kind: 'dir' },
  { relPath: 'set', required: true, kind: 'dir' },
  { relPath: 'sess', required: true, kind: 'dir' },
  { relPath: 'mf', required: true, kind: 'dir' },
  { relPath: 'cmp', required: true, kind: 'dir' },
  { relPath: 'logs/app.jsonl', required: true, kind: 'jsonl' },
  { relPath: 'set/settings.json', required: true, kind: 'json' },
  { relPath: 'sess/session.json', required: true, kind: 'json' },
  { relPath: 'mf/active.json', required: true, kind: 'json' },
  { relPath: 'mf/prev.json', required: true, kind: 'json' },
  { relPath: 'mf/candidate.json', required: true, kind: 'json' },
  { relPath: 'mf/verified.json', required: true, kind: 'json' }
];
