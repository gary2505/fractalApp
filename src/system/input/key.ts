import { forbidRapidRepeat } from './action';
import { runExclusive } from './race';

export interface KeyInfo {
  key: string;
  code: string;
  combo: string;
  ctrl: boolean;
  alt: boolean;
  shift: boolean;
  meta: boolean;
  repeat: boolean;
}

export interface KeyHandlerContext {
  signal: AbortSignal;
  originalEvent: KeyboardEvent;
}

export type KeyHandler = (info: KeyInfo, context: KeyHandlerContext) => void | Promise<void>;

export interface Keybinding {
  combo: string;
  onPress: KeyHandler;
  onRepeat?: KeyHandler;
}

export interface KeyControllerOptions {
  key?: string;
  minRepeatMs?: number;
  allowHoldRepeat?: boolean;
  preventDefault?: boolean;
  stopPropagation?: boolean;
  acceptTarget?: (target: EventTarget | null) => boolean;
  macMetaAsCtrl?: boolean;
}

function isMacPlatform(): boolean {
  return typeof navigator !== 'undefined' && /mac/i.test(navigator.platform);
}

export function normalizeKeyEvent(event: KeyboardEvent, macMetaAsCtrl = true): KeyInfo {
  const isMac = isMacPlatform();
  const ctrl = Boolean(event.ctrlKey || (isMac && macMetaAsCtrl && event.metaKey));
  const meta = Boolean(event.metaKey);
  const alt = Boolean(event.altKey);
  const shift = Boolean(event.shiftKey);
  const prettyKey = event.key.length === 1 ? event.key.toUpperCase() : event.key;

  const mods = [
    ctrl ? 'Ctrl' : null,
    shift ? 'Shift' : null,
    alt ? 'Alt' : null,
    !ctrl && meta ? 'Meta' : null
  ].filter(Boolean);

  return {
    key: event.key,
    code: event.code,
    combo: mods.length ? `${mods.join('+')}+${prettyKey}` : prettyKey,
    ctrl,
    alt,
    shift,
    meta,
    repeat: event.repeat
  };
}

export function defaultAcceptKeyTarget(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  if (!el) return true;
  if (el.closest?.('input, textarea, select, [contenteditable=""], [contenteditable="true"]')) return false;
  return true;
}

export function createKeyController(bindings: Keybinding[] = [], options: KeyControllerOptions = {}) {
  const controllerKey = options.key ?? 'key';
  const minRepeatMs = options.minRepeatMs ?? 120;
  const allowHoldRepeat = options.allowHoldRepeat ?? false;
  const preventDefault = options.preventDefault ?? true;
  const stopPropagation = options.stopPropagation ?? true;
  const macMetaAsCtrl = options.macMetaAsCtrl ?? true;
  const acceptTarget = options.acceptTarget ?? defaultAcceptKeyTarget;

  const map = new Map<string, Keybinding>();
  for (const binding of bindings) map.set(binding.combo, binding);

  let busy = false;
  let currentAbort: AbortController | null = null;
  let pending: { kind: 'press' | 'repeat'; binding: Keybinding; info: KeyInfo; event: KeyboardEvent } | null = null;

  function abortCurrent(): void {
    currentAbort?.abort();
    currentAbort = null;
  }

  function markHandled(event: KeyboardEvent): void {
    if (preventDefault) event.preventDefault();
    if (stopPropagation) event.stopPropagation();
  }

  async function run(
    kind: 'press' | 'repeat',
    binding: Keybinding,
    info: KeyInfo,
    event: KeyboardEvent
  ): Promise<void> {
    pending = null;
    abortCurrent();

    currentAbort = new AbortController();
    const signal = currentAbort.signal;
    busy = true;

    try {
      await runExclusive(
        `${controllerKey}:${binding.combo}`,
        async () => {
          if (signal.aborted) return;
          if (kind === 'press') await binding.onPress(info, { signal, originalEvent: event });
          else if (binding.onRepeat) await binding.onRepeat(info, { signal, originalEvent: event });
        },
        { scope: 'ui', action: `key:${kind}` }
      );
    } finally {
      busy = false;
      currentAbort = null;

      if (pending) {
        const next = pending as { kind: 'press' | 'repeat'; binding: Keybinding; info: KeyInfo; event: KeyboardEvent };
        pending = null;
        setTimeout(() => void run(next.kind, next.binding, next.info, next.event), 0);
      }
    }
  }

  function onKeyDown(event: KeyboardEvent): void {
    const info = normalizeKeyEvent(event, macMetaAsCtrl);
    const binding = map.get(info.combo);
    if (!binding) return;
    if (!acceptTarget(event.target)) return;

    if (!forbidRapidRepeat(`key:${info.combo}`, minRepeatMs)) return;

    const kind: 'press' | 'repeat' = info.repeat && allowHoldRepeat ? 'repeat' : 'press';
    if (kind === 'repeat' && !binding.onRepeat) return;

    markHandled(event);

    if (busy) {
      pending = { kind, binding, info, event };
      return;
    }

    void run(kind, binding, info, event);
  }

  function onKeyUp(_event: KeyboardEvent): void {
    // Reserved for future key-hold workflows.
  }

  return {
    onKeyDown,
    onKeyUp,
    isBusy: () => busy,
    abort: abortCurrent,
    addBinding(binding: Keybinding): void {
      map.set(binding.combo, binding);
    },
    removeBinding(combo: string): void {
      map.delete(combo);
    },
    clearBindings(): void {
      map.clear();
    }
  };
}
