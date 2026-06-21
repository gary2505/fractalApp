export type UiHotkeyScope = 'global' | 'shell' | 'ai-agent-chat' | 'explorer' | 'db1hub' | 'pdf-editor' | 'code-editor' | 'terminal';

export type UiHotkey = {
  id: string;
  scope: UiHotkeyScope;
  combo: string;
  messageKey: string;
  readonly?: boolean;
};

export type UiHotkeyConflict = {
  combo: string;
  scope: UiHotkeyScope;
  ids: string[];
};

export function normalizeHotkey(combo: string): string {
  return combo
    .split('+')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const lower = part.toLowerCase();
      if (lower === 'control') return 'Ctrl';
      if (lower === 'cmd' || lower === 'command' || lower === 'meta') return 'Meta';
      if (lower === 'escape') return 'Escape';
      if (lower.length === 1) return lower.toUpperCase();
      return part[0]?.toUpperCase() + part.slice(1);
    })
    .join('+');
}

export function findHotkeyConflicts(hotkeys: UiHotkey[]): UiHotkeyConflict[] {
  const byScopeAndCombo = new Map<string, UiHotkey[]>();

  for (const hotkey of hotkeys) {
    const combo = normalizeHotkey(hotkey.combo);
    const key = `${hotkey.scope}::${combo}`;
    const existing = byScopeAndCombo.get(key) ?? [];
    existing.push({ ...hotkey, combo });
    byScopeAndCombo.set(key, existing);
  }

  return [...byScopeAndCombo.entries()]
    .filter(([, entries]) => entries.length > 1)
    .map(([key, entries]) => {
      const [scope, combo] = key.split('::') as [UiHotkeyScope, string];
      return { combo, scope, ids: entries.map((entry) => entry.id) };
    });
}

export const baseShellHotkeys: UiHotkey[] = [
  { id: 'shell.close-popup', scope: 'shell', combo: 'Escape', messageKey: 'ui.action.close' },
  { id: 'shell.save', scope: 'shell', combo: 'Ctrl+S', messageKey: 'ui.action.save' },
];
