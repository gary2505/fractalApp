<script context="module" lang="ts">
  export type ShellTab = 'welcome' | 'explorer' | 'editor' | 'chat' | 'terminal' | 'settings';
</script>

<script lang="ts">
  import { t } from '../core/i18n/i18n';
  import type { TextKey } from '../core/i18n/i18n';

  export let active: ShellTab = 'welcome';
  export let onSelect: (tab: ShellTab) => void = () => {};

  const tabs: ShellTab[] = ['welcome', 'explorer', 'editor', 'chat', 'terminal', 'settings'];
</script>

<nav class="tabs tabs-boxed bg-base-200 p-1" aria-label={$t('shell.tabs')}>
  {#each tabs as tab}
    <button
      class="tab text-xs sm:text-sm"
      class:tab-active={active === tab}
      onclick={() => onSelect(tab)}
      type="button"
    >
      {$t(`tab.${tab}` as TextKey)}
    </button>
  {/each}
</nav>
