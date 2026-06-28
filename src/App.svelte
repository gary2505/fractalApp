<script lang="ts">
  import { onMount } from 'svelte';

  import MainV10 from './main-window/main-v1-0.svelte';
  import MainV11 from './main-window/main-v1-1.svelte';
  import MainV13 from './main-window/main-v1-3.svelte';
  import StartV11 from './main-window/start-v1-1.svelte';
  import {
    getDefaultMainWindowVersionId,
    mainWindowMainVersions,
    setDefaultMainWindowVersionId,
    type MainWindowVersionId
  } from './main-window/versions';

  let isSwitcherOpen = false;
  let activeVersionId: MainWindowVersionId = getDefaultMainWindowVersionId();

  onMount(() => {
    function onKeydown(event: KeyboardEvent) {
      if (event.ctrlKey && event.altKey && event.key === 'Backspace') {
        event.preventDefault();
        isSwitcherOpen = true;
        return;
      }

      if (event.key === 'Escape' && isSwitcherOpen) {
        event.preventDefault();
        isSwitcherOpen = false;
      }
    }

    window.addEventListener('keydown', onKeydown);
    return () => window.removeEventListener('keydown', onKeydown);
  });

  function openMainVersion(versionId: MainWindowVersionId) {
    activeVersionId = setDefaultMainWindowVersionId(versionId);
    isSwitcherOpen = false;
  }

  function closeSwitcher() {
    isSwitcherOpen = false;
  }
</script>

{#if activeVersionId === 'main-v1-0'}
  <MainV10 />
{:else if activeVersionId === 'main-v1-1'}
  <MainV11 />
{:else if activeVersionId === 'main-v1-3'}
  <MainV13 />
{/if}

{#if isSwitcherOpen}
  <StartV11
    activeVersionId={activeVersionId}
    versions={mainWindowMainVersions}
    onSelectVersion={openMainVersion}
    onClose={closeSwitcher}
  />
{/if}
