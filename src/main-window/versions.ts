export type MainWindowVersionId = 'main-v1-0' | 'main-v1-1' | 'main-v1-3' | 'main-v1-4';
export type StartWindowVersionId = 'start-v1-0' | 'start-v1-1';

export type WindowVersionStatus = 'working' | 'candidate' | 'test' | 'broken' | 'archived';

export type MainVersionId = string;

export type MainWindowVersion = (typeof mainWindowVersions)[number];
export type StartWindowVersion = (typeof startWindowVersions)[number];

export type WindowVersion<TId extends string> = {
  id: TId;
  shortLabel: string;
  label: string;
  status: WindowVersionStatus;
  created: string;
  order: number;
  notes: string;
};

export const MAIN_WINDOW_VERSION: MainWindowVersionId = 'main-v1-4';
export const START_WINDOW_VERSION: StartWindowVersionId = 'start-v1-1';

export const MAIN_DEFAULT_STORAGE_KEY = 'fractalApp.mainWindow.defaultVersion';
const OLD_MAIN_DEFAULT_STORAGE_KEY = 'fractalapp.main.default';

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
    id: 'main-v1-3',
    shortLabel: 'v1-3',
    label: 'v1-3',
    status: 'test',
    created: '2026-06-24',
    order: 40,
    notes: 'Layout proof with custom header, panels, AI side toggle, and status bar.'
  },
  {
    id: 'main-v1-4',
    shortLabel: 'v1-4',
    label: 'v1-4',
    status: 'test',
    created: '2026-06-27',
    order: 50,
    notes: 'Versioned child layout blocks: TopRow, TopBar, P0-P4, P3H1/P3H2, and SBar.'
  }
];

export const startWindowVersions: WindowVersion<StartWindowVersionId>[] = [
  {
    id: 'start-v1-0',
    shortLabel: 'start v1-0',
    label: 'start-v1-0',
    status: 'archived',
    created: '2026-06-23',
    order: 10,
    notes: 'Original start window.'
  },
  {
    id: 'start-v1-1',
    shortLabel: 'start v1-1',
    label: 'start-v1-1',
    status: 'working',
    created: '2026-06-23',
    order: 20,
    notes: 'Current start window.'
  }
];

export const mainWindowMainVersions = mainWindowVersions;

export function isMainWindowVersionId(value: string | null): value is MainWindowVersionId {
  return mainWindowVersions.some((version) => version.id === value);
}

export function getDefaultMainWindowVersionId(): MainWindowVersionId {
  const stored = readStorage(MAIN_DEFAULT_STORAGE_KEY);
  if (isMainWindowVersionId(stored)) return stored;

  const oldStored = readStorage(OLD_MAIN_DEFAULT_STORAGE_KEY);
  if (isMainWindowVersionId(oldStored)) {
    setDefaultMainWindowVersionId(oldStored);
    return oldStored;
  }

  return MAIN_WINDOW_VERSION;
}

export function setDefaultMainWindowVersionId(id: MainWindowVersionId): MainWindowVersionId {
  writeStorage(MAIN_DEFAULT_STORAGE_KEY, id);
  return id;
}

export function getLatestMainWindowVersion(): MainWindowVersion {
  return getSortedMainWindowVersions()[0] ?? mainWindowVersions[0]!;
}

export function getNextMainWindowVersion(id: MainWindowVersionId = getDefaultMainWindowVersionId()): MainWindowVersion {
  const sorted = getSortedMainWindowVersions();
  const index = sorted.findIndex((version) => version.id === id);
  return sorted[Math.max(0, Math.min(index + 1, sorted.length - 1))] ?? sorted[0] ?? mainWindowVersions[0]!;
}

export function getPreviousMainWindowVersion(id: MainWindowVersionId = getDefaultMainWindowVersionId()): MainWindowVersion {
  const sorted = getSortedMainWindowVersions();
  const index = sorted.findIndex((version) => version.id === id);
  return sorted[Math.max(0, index - 1)] ?? sorted[0] ?? mainWindowVersions[0]!;
}

export function getStartWindowVersion(id: StartWindowVersionId = START_WINDOW_VERSION): StartWindowVersion {
  return startWindowVersions.find((version) => version.id === id) ?? startWindowVersions[0]!;
}

function getSortedMainWindowVersions(): MainWindowVersion[] {
  return [...mainWindowVersions].sort((a, b) => b.order - a.order);
}

function readStorage(key: string): string | null {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem(key);
}

function writeStorage(key: string, value: string): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(key, value);
}
