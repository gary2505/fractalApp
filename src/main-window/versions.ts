export type MainWindowVersionId = 'main-v1-0' | 'main-v1-1' | 'main-v1-2';
export type StartWindowVersionId = 'start-v1-0' | 'start-v1-1';
export type WindowVersionStatus = 'working' | 'candidate' | 'test' | 'broken' | 'archived';
export type MainVersionId = string;
export type MainWindowVersion = (typeof mainWindowVersions)[number];

export type WindowVersion<TId extends string> = {
  id: TId;
  shortLabel: string;
  label: string;
  status: WindowVersionStatus;
  created: string;
  order: number;
  notes: string;
};

export const MAIN_WINDOW_VERSION: MainWindowVersionId = 'main-v1-0';
export const START_WINDOW_VERSION: StartWindowVersionId = 'start-v1-1';

const MAIN_DEFAULT_STORAGE_KEY = 'fractalapp.main.default';

export const mainWindowVersions: WindowVersion<MainWindowVersionId>[] = [
  {
    id: 'main-v1-0',
    shortLabel: 'v1-0',
    label: 'v1-0',
    status: 'working',
    created: '2026-06-23',
    order: 10,
    notes: 'Working main window.'
  },
  {
    id: 'main-v1-1',
    shortLabel: 'v1-1',
    label: 'v1-1',
    status: 'candidate',
    created: '2026-06-23',
    order: 20,
    notes: 'Next main window.'
  },
  {
    id: 'main-v1-2',
    shortLabel: 'v1-2',
    label: 'v1-2',
    status: 'test',
    created: '2026-06-23',
    order: 30,
    notes: 'Empty test screen for interaction proof.'
  }
];

export const mainWindowMainVersions = mainWindowVersions;

export function isMainWindowVersionId(value: string | null): value is MainWindowVersionId {
  return mainWindowVersions.some((version) => version.id === value);
}

export function getDefaultMainWindowVersionId(): MainWindowVersionId {
  const stored = readStorage(MAIN_DEFAULT_STORAGE_KEY);
  return isMainWindowVersionId(stored) ? stored : MAIN_WINDOW_VERSION;
}

export function setDefaultMainWindowVersionId(id: MainWindowVersionId): MainWindowVersionId {
  writeStorage(MAIN_DEFAULT_STORAGE_KEY, id);
  return id;
}

function readStorage(key: string): string | null {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem(key);
}

function writeStorage(key: string, value: string): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(key, value);
}
