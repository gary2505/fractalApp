<script lang="ts">
  import Popup from '$lib/ui/tpl/popup.svelte';
  import { t } from '../core/i18n/i18n';
  import type { TextKey } from '../core/i18n/i18n';

  const STORAGE_KEY = 'fractalapp:explorer-config';

  type SectionId =
    | 'files' | 'editors' | 'aiChat' | 'aiAgent'
    | 'timeline' | 'outline' | 'search' | 'git'
    | 'bookmarks' | 'npmScripts' | 'sourceControl' | 'testing';

  interface SectionConfig {
    id: SectionId;
    enabled: boolean;
  }

  const DEFAULT_SECTIONS: SectionId[] = [
    'files', 'editors', 'aiChat', 'aiAgent',
    'timeline', 'outline', 'search', 'git',
    'bookmarks', 'npmScripts', 'sourceControl', 'testing'
  ];

  const SECTION_LABELS: Record<SectionId, TextKey> = {
    files: 'p2.section.files',
    editors: 'p2.section.editors',
    aiChat: 'p2.section.aiChat',
    aiAgent: 'p2.section.aiAgent',
    timeline: 'p2.section.timeline',
    outline: 'p2.section.outline',
    search: 'p2.section.search',
    git: 'p2.section.git',
    bookmarks: 'p2.section.bookmarks',
    npmScripts: 'p2.section.npmScripts',
    sourceControl: 'p2.section.sourceControl',
    testing: 'p2.section.testing',
  };

  function loadConfig(): { order: SectionId[]; enabled: Set<SectionId> } {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { order: [...DEFAULT_SECTIONS], enabled: new Set(DEFAULT_SECTIONS) };
      const parsed: SectionConfig[] = JSON.parse(raw);
      const order = parsed.map((s) => s.id);
      const enabled = new Set(parsed.filter((s) => s.enabled).map((s) => s.id));
      return { order, enabled };
    } catch {
      return { order: [...DEFAULT_SECTIONS], enabled: new Set(DEFAULT_SECTIONS) };
    }
  }

  function saveConfig(order: SectionId[], enabled: Set<SectionId>) {
    const data: SectionConfig[] = order.map((id) => ({ id, enabled: enabled.has(id) }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  let savedOrder = $state<SectionId[]>(loadConfig().order);
  let savedEnabled = $state<Set<SectionId>>(loadConfig().enabled);

  let popupOpen = $state(false);
  let editOrder = $state<SectionId[]>([]);
  let editEnabled = $state<Set<SectionId>>(new Set());
  let dragIdx: number | null = $state(null);
  let dragOverIdx: number | null = $state(null);

  let openSections = $state<Set<SectionId>>(new Set());

  let visibleSections = $derived(
    savedOrder.filter((id) => savedEnabled.has(id))
  );

  function openPopup() {
    editOrder = [...savedOrder];
    editEnabled = new Set(savedEnabled);
    popupOpen = true;
  }

  function closePopup() {
    popupOpen = false;
    dragIdx = null;
    dragOverIdx = null;
  }

  function savePopup() {
    savedOrder = [...editOrder];
    savedEnabled = new Set(editEnabled);
    saveConfig(savedOrder, savedEnabled);
    closePopup();
  }

  function cancelPopup() {
    closePopup();
  }

  function restoreDefaults() {
    editOrder = [...DEFAULT_SECTIONS];
    editEnabled = new Set(DEFAULT_SECTIONS);
  }

  function toggleEditEnabled(id: SectionId) {
    const next = new Set(editEnabled);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    editEnabled = next;
  }

  function onDragStart(e: MouseEvent, idx: number) {
    e.preventDefault();
    dragIdx = idx;
    const onMove = (ev: MouseEvent) => {
      const items = document.querySelectorAll('.explorer-drag-item');
      items.forEach((item, i) => {
        const rect = item.getBoundingClientRect();
        const mid = rect.top + rect.height / 2;
        if (i !== idx) {
          if (ev.clientY > mid && i > idx) dragOverIdx = i;
          else if (ev.clientY < mid && i < idx) dragOverIdx = i;
        }
      });
    };
    const onUp = () => {
      const targetIdx = dragOverIdx;
      if (targetIdx !== null && dragIdx !== null && targetIdx !== dragIdx) {
        const arr = [...editOrder];
        const moved = arr.splice(dragIdx, 1)[0];
        arr.splice(targetIdx, 0, moved!);
        editOrder = arr;
      }
      dragIdx = null;
      dragOverIdx = null;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }

  function toggleSection(id: SectionId) {
    const next = new Set(openSections);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    openSections = next;
  }

  function onClosePanel() {
    const ev = new CustomEvent('p2-close');
    window.dispatchEvent(ev);
  }

  function sectionContent(id: SectionId): string {
    const samples: Record<SectionId, string> = {
      files: 'src/\n  main.ts\n  App.svelte\n  core/\n  lib/',
      editors: 'main.ts — active\nApp.svelte\np2-v1-0.svelte',
      aiChat: 'Chat history will appear here',
      aiAgent: 'Agent sessions and logs',
      timeline: 'No recent changes',
      outline: 'No symbols in active file',
      search: 'Use Ctrl+Shift+F to search',
      git: 'main branch — up to date',
      bookmarks: 'No bookmarks yet',
      npmScripts: 'dev / build / preview',
      sourceControl: 'No changes staged',
      testing: 'No test results',
    };
    return samples[id];
  }
</script>

<aside
  id="p2"
  class="w-full h-full bg-base-100 text-base-content flex flex-col overflow-hidden"
  aria-label="Explorer panel"
>
  <!-- Header -->
  <div class="flex items-center justify-between px-2 py-1.5 border-b border-base-300 min-h-0 shrink-0">
    <span class="text-xs font-semibold uppercase tracking-wider text-base-content/70">{$t('p2.explorer')}</span>
    <div class="flex items-center gap-0.5">
      <button
        type="button"
        class="btn btn-ghost btn-xs min-h-0 h-6 w-6 p-0"
        title={$t('p2.settings')}
        onclick={openPopup}
      >⋯</button>
      <button
        type="button"
        class="btn btn-ghost btn-xs min-h-0 h-6 w-6 p-0"
        title={$t('p2.close')}
        onclick={onClosePanel}
      >✕</button>
    </div>
  </div>

  <!-- Accordion sections -->
  <div class="flex-1 overflow-y-auto overflow-x-hidden">
    {#each visibleSections as id (id)}
      {@const label = SECTION_LABELS[id]}
      {@const isOpen = openSections.has(id)}
      <div class="border-b border-base-200 last:border-b-0">
        <!-- Accordion trigger -->
        <button
          type="button"
          class="flex items-center gap-1 w-full px-2 py-1 text-xs font-medium text-base-content/80 hover:bg-base-200 transition-colors duration-100"
          onclick={() => toggleSection(id)}
        >
          <svg
            class="w-3 h-3 transition-transform duration-150 {isOpen ? 'rotate-90' : ''}"
            viewBox="0 0 16 16"
            fill="currentColor"
          ><path d="M6 4l4 4-4 4z"/></svg>
          {$t(label)}
        </button>
        {#if isOpen}
          <div class="px-2 py-1.5 text-xs text-base-content/60 whitespace-pre font-mono leading-relaxed">
            {sectionContent(id)}
          </div>
        {/if}
      </div>
    {/each}
  </div>

  <!-- Proof badge -->
  <div class="text-[10px] text-base-content/40 text-center py-1 border-t border-base-300 shrink-0">
    P2 files proof only. No real FS access.
  </div>
</aside>

<!-- Settings popup -->
<Popup
  id="p2-customize-view"
  bind:open={popupOpen}
  title={$t('p2.popup.title')}
  description="Drag to reorder. Check to show. Uncheck to hide."
  onClose={cancelPopup}
>
  <div class="flex flex-col gap-2">
    <div class="flex flex-col gap-1 w-64">
      {#each editOrder as id, idx (id)}
        {@const label = SECTION_LABELS[id]}
        <div
          class="explorer-drag-item flex items-center gap-2 px-2 py-1.5 rounded-md text-xs {dragIdx === idx ? 'opacity-50 bg-base-200' : ''} {dragOverIdx === idx && dragIdx !== null && dragOverIdx !== dragIdx ? 'border-t-2 border-primary' : ''}"
        >
          <span
            class="cursor-grab active:cursor-grabbing text-base-content/30 hover:text-base-content/60 shrink-0"
            onmousedown={(e) => onDragStart(e, idx)}
            role="button"
            aria-label="Drag to reorder"
            tabindex="0"
          >⠿</span>
          <input
            type="checkbox"
            class="checkbox checkbox-xs"
            checked={editEnabled.has(id)}
            onchange={() => toggleEditEnabled(id)}
          />
          <span class="flex-1 truncate">{$t(label)}</span>
        </div>
      {/each}
    </div>

    <div class="flex items-center justify-between gap-2 w-64">
      <button
        type="button"
        class="btn btn-ghost btn-xs min-h-0 h-7"
        onclick={restoreDefaults}
      >{$t('p2.popup.restoreDefaults')}</button>
      <div class="flex items-center gap-1.5">
        <button
          type="button"
          class="btn btn-ghost btn-xs min-h-0 h-7"
          onclick={cancelPopup}
        >{$t('p2.popup.cancel')}</button>
        <button
          type="button"
          class="btn btn-primary btn-xs min-h-0 h-7"
          onclick={savePopup}
        >{$t('p2.popup.save')}</button>
      </div>
    </div>
  </div>
</Popup>
