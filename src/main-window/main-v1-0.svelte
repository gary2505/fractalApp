<script lang="ts">
  import { onMount } from 'svelte';
  import CoreStatus from '../shell/core-status.svelte';
  import ComponentHost from '../shell/cmp-host.svelte';
  import LogPanel from '../shell/log-panel.svelte';
  import UpdatePanel from '../shell/update-panel.svelte';
  import BindingPanel from '../shell/binding-panel.svelte';
  import AppDataPanel from '../shell/app-data-panel.svelte';
  import HealthPanel from '../shell/health-panel.svelte';
  import ShellTabs, { type ShellTab } from '../shell/shell-tabs.svelte';
  import SafeScreen from '../shell/safe-screen.svelte';
  import CrashScreen from '../shell/crash-screen.svelte';
  import { initCore, coreInfo } from '../core/boot/boot';
  import { coreState, setCoreState } from '../core/state/state';
  import { t, lang } from '../core/i18n/i18n';
  import { theme, applyTheme } from '../core/theme/theme';
  import { loadSettings, saveSettings } from '../core/set/settings';
  import { writeLog } from '../core/log/log';
  import type { Lang } from '../core/i18n/i18n';
  import type { ThemeMode } from '../core/theme/theme';
  import { MAIN_WINDOW_VERSION } from './versions';

  let errorMessage = '';
  let ready = false;
  let hostKey = 0;
  let activeTab: ShellTab = 'welcome';

  onMount(async () => {
    try {
      setCoreState('BOOT');
      const info = await initCore();
      coreInfo.set(info);

      setCoreState('SESSION_LOAD');
      const settings = await loadSettings();
      lang.set(settings.lang);
      theme.set(settings.theme);
      applyTheme(settings.theme);

      await writeLog({ id: 'core.boot.ok', level: 'info', msg: 'Core boot completed' });
      setCoreState('RUNNING');
      ready = true;
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : String(error);
      setCoreState('CRASH');
    }
  });

  async function changeTheme(value: ThemeMode) {
    theme.set(value);
    applyTheme(value);
    await saveSettings({ theme: value, lang: $lang });
  }

  async function changeLang(value: Lang) {
    lang.set(value);
    await saveSettings({ theme: $theme, lang: value });
  }

  function applyExternalSettings(settings: { theme: ThemeMode; lang: Lang }) {
    theme.set(settings.theme);
    lang.set(settings.lang);
    applyTheme(settings.theme);
  }
</script>

<svelte:head>
  <title>{$t('app.title')}</title>
</svelte:head>

<div class="flex h-screen flex-col bg-base-200 text-base-content">
  <header class="navbar border-b border-base-300 bg-base-100 px-4">
    <div class="flex-1">
      <div class="flex items-center gap-2">
        <div class="text-lg font-semibold">{$t('app.title')}</div>
        <span class="badge badge-primary badge-sm">{MAIN_WINDOW_VERSION}</span>
      </div>
      <div class="ml-3 hidden text-xs opacity-70 sm:block">{$t('app.subtitle')}</div>
    </div>

    <div class="flex gap-2">
      <select
        class="select select-bordered select-sm"
        aria-label={$t('settings.theme')}
        bind:value={$theme}
        onchange={(event) => changeTheme(event.currentTarget.value as ThemeMode)}
      >
        <option value="light">{$t('theme.light')}</option>
        <option value="dark">{$t('theme.dark')}</option>
        <option value="system">{$t('theme.system')}</option>
      </select>

      <select
        class="select select-bordered select-sm"
        aria-label={$t('settings.language')}
        bind:value={$lang}
        onchange={(event) => changeLang(event.currentTarget.value as Lang)}
      >
        <option value="en">English</option>
        <option value="es">Español</option>
        <option value="zh">中文</option>
        <option value="ru">Русский</option>
        <option value="ja">日本語</option>
      </select>
    </div>
  </header>

  {#if $coreState === 'SAFE_MODE'}
    <SafeScreen />
  {:else if $coreState === 'CRASH'}
    <CrashScreen message={errorMessage} />
  {:else}
    <main class="grid min-h-0 flex-1 grid-cols-1 gap-3 overflow-hidden p-3 lg:grid-cols-[320px_1fr]">
      <aside class="min-h-0 space-y-3 overflow-y-auto pr-1">
        <CoreStatus />
        <UpdatePanel onChanged={() => (hostKey += 1)} />
        <BindingPanel />
        <AppDataPanel />
        <HealthPanel />
        <LogPanel />
      </aside>

      <section class="min-h-0 rounded-box border border-base-300 bg-base-100 p-3 shadow-sm">
        <div class="mb-3">
          <ShellTabs active={activeTab} onSelect={(tab) => (activeTab = tab)} />
        </div>

        {#if ready}
          <ComponentHost componentId={activeTab} reloadKey={hostKey} onSettingsChanged={applyExternalSettings} />
        {:else}
          <div class="skeleton h-full min-h-96 w-full"></div>
        {/if}
      </section>
    </main>
  {/if}
</div>
