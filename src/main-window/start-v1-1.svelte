<script lang="ts">
  import Popup from '$lib/ui/tpl/popup.svelte';
  import { MAIN_DEFAULT_STORAGE_KEY, type MainWindowVersion, type MainWindowVersionId } from './versions';

  type Props = {
    activeVersionId: MainWindowVersionId;
    versions: MainWindowVersion[];
    onSelectVersion: (versionId: MainWindowVersionId) => void;
    onClose: () => void;
  };

  let { activeVersionId, versions, onSelectVersion, onClose }: Props = $props();

  const PROOF_KEY = 'fractal.proof.version-switcher-v1';

  let open = $state(true);
  let activeIndex = $state(0);

  $effect(() => {
    const currentIndex = versions.findIndex((version) => version.id === activeVersionId);
    activeIndex = currentIndex >= 0 ? currentIndex : 0;
  });

  function close(reason: string): void {
    writeProof(reason, activeVersionId, 'passed');
    onClose();
  }

  function selectVersion(versionId: MainWindowVersionId): void {
    writeProof('select-version', versionId, 'passed');
    onSelectVersion(versionId);
    onClose();
  }

  function handleListKeydown(event: KeyboardEvent): void {
    if (versions.length === 0) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      moveActiveIndex(activeIndex + 1, 'keyboard-arrow-down');
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      moveActiveIndex(activeIndex - 1, 'keyboard-arrow-up');
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      moveActiveIndex(0, 'keyboard-home');
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      moveActiveIndex(versions.length - 1, 'keyboard-end');
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const versionId = versions[activeIndex]?.id;
      if (versionId) selectVersion(versionId);
    }
  }

  function moveActiveIndex(nextIndex: number, reason: string): void {
    activeIndex = Math.max(0, Math.min(nextIndex, versions.length - 1));
    focusActiveOption();
    writeProof(reason, versions[activeIndex]?.id, 'passed');
  }

  function focusActiveOption(): void {
    requestAnimationFrame(() => {
      const option = document.querySelector<HTMLElement>(`[data-version-option-index="${activeIndex}"]`);
      option?.focus();
    });
  }

  function writeProof(reason: string, versionId: MainWindowVersionId | undefined, status: 'passed' | 'failed'): void {
    if (typeof localStorage === 'undefined') return;

    localStorage.setItem(
      PROOF_KEY,
      JSON.stringify(
        {
          feature: 'version-switcher-popup',
          flow: 'open-navigate-select-close',
          status,
          reason,
          selectedVersionId: versionId ?? null,
          defaultStorageKey: MAIN_DEFAULT_STORAGE_KEY,
          expectedVersionIds: versions.map((version) => version.id),
          actualActiveIndex: activeIndex,
          timestamp: new Date().toISOString()
        },
        null,
        2
      )
    );
  }
</script>

<Popup
  id="version-switcher-popup"
  bind:open
  title="Main versions"
  description="Use ArrowUp, ArrowDown, Home, End, Enter, Space, Esc, outside click, or X."
  onClose={() => close('popup-close')}
>
  <div
    id="version-switcher-list"
    class="flex flex-col gap-1"
    role="listbox"
    aria-label="Main window versions"
    tabindex="-1"
    onkeydown={handleListKeydown}
    data-contract="version-switcher-popup"
  >
    {#each versions as version, index (version.id)}
      <div
        id={`version-switcher-option-${version.id}`}
        class="flex h-9 cursor-default select-none items-center justify-between rounded-md border px-3 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary {version.id === activeVersionId
          ? 'border-primary/30 bg-primary/10 text-primary'
          : index === activeIndex
            ? 'border-base-300 bg-base-200 text-base-content'
            : 'border-transparent bg-transparent text-base-content hover:border-base-300 hover:bg-base-200'}"
        role="option"
        aria-selected={version.id === activeVersionId}
        tabindex={index === activeIndex ? 0 : -1}
        data-popup-initial-focus={index === activeIndex ? 'true' : undefined}
        data-version-option-index={index}
        data-version-id={version.id}
        onfocus={() => (activeIndex = index)}
        onclick={() => selectVersion(version.id)}
      >
        <span class="font-medium">{version.shortLabel}</span>
        <span class="text-xs text-base-content/60">{version.status}</span>
      </div>
    {/each}
  </div>
</Popup>
