<script lang="ts">
  import { onMount } from 'svelte';
  import MainV10 from './main-window/main-v1-0.svelte';
  import MainV11 from './main-window/main-v1-1.svelte';
  import MainV13 from './main-window/main-v1-3.svelte';
  import MainV14 from './main-window/main-v1-4.svelte';
  import StartV11 from './main-window/start-v1-1.svelte';
  import {
    getDefaultMainWindowVersionId,
    mainWindowMainVersions,
    setDefaultMainWindowVersionId,
    type MainWindowVersionId
  } from './main-window/versions';
  import {
    logAppBoot,
    logAppRunEnd,
    logMainVersionChange
  } from './core/log/smart-log-app-flow';

  let isSwitcherOpen = false;
  let activeVersionId: MainWindowVersionId = getDefaultMainWindowVersionId();
  // 🔍 SEARCH: One-run boot guard — prevents double boot from Svelte remount / reactive re-run.
  // CRITICAL for next agent: Do NOT move logAppBoot outside onMount without keeping the guard.
  let bootLogged = false;

  onMount(() => {
    if (!bootLogged) {
      bootLogged = true;
      void logAppBoot(activeVersionId, import.meta.env.DEV ? 'dev' : 'prod');
    }

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

    function onVersionSwitcher() {
      isSwitcherOpen = true;
    }

    // 🔍 SEARCH: End is only written from cleanup (beforeunload / onMount return).
    // Never log end from onMount body. Skip if refresh is in progress.
    // CRITICAL for next agent: __FRACTALAPP_REFRESHING__ is set before clearSmartLogs in p0.
    function onBeforeUnload() {
      if ((window as any).__FRACTALAPP_REFRESHING__) return;
      void logAppRunEnd();
    }

    window.addEventListener('keydown', onKeydown);
    window.addEventListener('fractal:open-version-switcher', onVersionSwitcher);
    window.addEventListener('beforeunload', onBeforeUnload);

    return () => {
      window.removeEventListener('keydown', onKeydown);
      window.removeEventListener('fractal:open-version-switcher', onVersionSwitcher);
      window.removeEventListener('beforeunload', onBeforeUnload);
      if ((window as any).__FRACTALAPP_REFRESHING__) return;
      void logAppRunEnd();
    };
  });

  function openMainVersion(versionId: MainWindowVersionId) {
    activeVersionId = setDefaultMainWindowVersionId(versionId);
    void logMainVersionChange(versionId);
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
{:else if activeVersionId === 'main-v1-4'}
  <MainV14 />
{/if}

{#if isSwitcherOpen}
  <StartV11
    activeVersionId={activeVersionId}
    versions={mainWindowMainVersions}
    onSelectVersion={openMainVersion}
    onClose={closeSwitcher}
  />
{/if}
