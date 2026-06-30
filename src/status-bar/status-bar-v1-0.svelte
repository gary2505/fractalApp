<script lang="ts">
  import { onMount } from 'svelte';
  import { invoke } from '@tauri-apps/api/core';
  import { averagedMetrics, enableSystemMetrics, disableSystemMetrics, type AveragedMetrics } from '../system/metrics/metrics';

  type ThemeMode = 'dark' | 'light';
  type LangMode = 'EN' | 'RU';

  type ProcessInfo = {
    name: string;
    pid: string;
    cpuPercent: number;
    memMb: number;
  };

  type TopProcesses = {
    topCpu: ProcessInfo[];
    topRam: ProcessInfo[];
    memTotalBytes: number;
  };

  export let versionId = 'main-v1-4';
  export let lang: LangMode = 'EN';
  export let theme: ThemeMode = 'dark';
  export let onChangeLang: (lang: LangMode) => void = () => {};
  export let onChangeTheme: (theme: ThemeMode) => void = () => {};

  // System metrics thresholds
  const CPU_DANGER = 95;
  const RAM_DANGER = 95;
  const CPU_WARN = 90;
  const RAM_WARN = 90;
  const DISK_WARN = 85;
  const DISK_DANGER = 95;

  let metrics: AveragedMetrics | null = null;
  let cpuDisplay = '--';
  let ramDisplay = '--';
  let cpuDanger = false;
  let cpuOver = false;
  let ramDanger = false;
  let ramOver = false;
  let diskOver = false;
  let diskHover = false;
  let cpuHover = false;
  let ramHover = false;
  let topProcesses: TopProcesses | null = null;
  let fetchTopProcessesAbort = false;
  let systemTooltip = 'System metrics: awaiting data';

  function gb(bytes: number): string {
    return (bytes / (1024 * 1024 * 1024)).toFixed(0) + ' GB';
  }

  function diskColor(pct: number): string {
    if (pct >= DISK_DANGER) return 'text-error font-bold';
    if (pct >= DISK_WARN) return 'text-warning font-bold';
    return '';
  }

  async function fetchTopProcesses() {
    if (topProcesses) return;
    fetchTopProcessesAbort = false;
    try {
      const data = await invoke<TopProcesses>('get_top_processes');
      if (!fetchTopProcessesAbort) topProcesses = data;
    } catch {
      // silent fail
    }
  }

  function clearTopProcesses() {
    fetchTopProcessesAbort = true;
    topProcesses = null;
  }

  $: {
    if (metrics) {
      cpuDisplay = metrics.cpuAvg.toFixed(0);
      ramDisplay = metrics.ramPercent.toFixed(0);
      cpuOver = metrics.cpuAvg >= CPU_WARN && metrics.cpuAvg < CPU_DANGER;
      cpuDanger = metrics.cpuAvg >= CPU_DANGER;
      ramOver = metrics.ramPercent >= RAM_WARN && metrics.ramPercent < RAM_DANGER;
      ramDanger = metrics.ramPercent >= RAM_DANGER;
      diskOver = metrics.disk ? metrics.disk.used_percent >= DISK_WARN : false;
      systemTooltip = `CPU avg: ${metrics.cpuAvg.toFixed(1)}% | RAM: ${metrics.ramPercent.toFixed(1)}%${metrics.disk ? ` | Disk: ${metrics.disk.used_percent.toFixed(1)}% (${metrics.disk.mount_point})` : ''}`;
    }
  }

  onMount(() => {
    enableSystemMetrics();
    const unsub = averagedMetrics.subscribe((value) => { metrics = value; });
    return () => { unsub(); disableSystemMetrics(); };
  });
</script>

<footer id="status-bar" class="h-8 bg-base-200 text-base-content border-t border-base-300 px-2 flex items-center gap-3" aria-label="SBar status bar">
  <button id="status-bar-version" type="button" class="btn-app badge badge-outline cursor-pointer" title="Version switcher (Ctrl+Alt+Backspace)" onclick={() => dispatchEvent(new CustomEvent('fractal:open-version-switcher'))}>{versionId}</button>
  <span class="ml-auto"></span>
  <div class="join">
    <button id="status-bar-lang-en" type="button" class="btn-app btn btn-ghost join-item min-h-0 h-6 px-2 {lang === 'EN' ? 'btn-active' : ''}" onclick={() => onChangeLang('EN')}>EN</button>
    <button id="status-bar-lang-ru" type="button" class="btn-app btn btn-ghost join-item min-h-0 h-6 px-2 {lang === 'RU' ? 'btn-active' : ''}" onclick={() => onChangeLang('RU')}>RU</button>
  </div>
  <div class="join">
    <button id="status-bar-theme-dark" type="button" class="btn-app icon-app-base join-item {theme === 'dark' ? 'opacity-100' : ''}" title="Dark theme" onclick={() => onChangeTheme('dark')}>
      <svg class="icon-app-md" viewBox="0 0 24 24" fill="currentColor"><path d="M21.752 15.002A9.718 9.718 0 0118 15.75 9.75 9.75 0 0110.5 2.248c-.21-.017-.42-.026-.63-.008A9.75 9.75 0 1018.748 14.25c.008-.21.008-.42-.008-.63z"/></svg>
    </button>
    <button id="status-bar-theme-light" type="button" class="btn-app icon-app-base join-item {theme === 'light' ? 'opacity-100' : ''}" title="Light theme" onclick={() => onChangeTheme('light')}>
      <svg class="icon-app-md" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM5.25 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25a.75.75 0 01.75.75zM19.03 4.97a.75.75 0 010 1.06l-1.59 1.59a.75.75 0 01-1.06-1.06l1.59-1.59a.75.75 0 011.06 0zM7.62 16.38a.75.75 0 010 1.06l-1.59 1.59a.75.75 0 01-1.06-1.06l1.59-1.59a.75.75 0 011.06 0zM4.97 4.97a.75.75 0 011.06 0l1.59 1.59a.75.75 0 01-1.06 1.06L4.97 6.03a.75.75 0 010-1.06zM16.38 16.38a.75.75 0 011.06 0l1.59 1.59a.75.75 0 01-1.06 1.06l-1.59-1.59a.75.75 0 010-1.06z"/></svg>
    </button>
  </div>
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <span
    class="opacity-70 text-app-sm relative cursor-default"
    onmouseenter={() => { cpuHover = true; fetchTopProcesses(); }}
    onmouseleave={() => { cpuHover = false; clearTopProcesses(); }}
  >
    CPU <span class="{cpuDanger ? 'text-error font-bold' : cpuOver ? 'text-warning font-bold' : 'font-semibold'}">{cpuDisplay}%</span>
    {#if cpuHover && topProcesses}
      <div class="absolute bottom-full right-0 mb-1 rounded-box border border-base-300 bg-base-100 p-2 shadow-xl z-50 pointer-events-none">
        <table class="text-app-md whitespace-nowrap">
          <thead>
            <tr class="border-b border-base-300 text-base-content/60">
              <th class="pr-3 text-left">Process</th>
              <th class="pr-3 text-right">PID</th>
              <th class="text-right">CPU</th>
            </tr>
          </thead>
          <tbody>
            {#each topProcesses.topCpu as p}
              <tr>
                <td class="pr-3 max-w-32 truncate">{p.name}</td>
                <td class="pr-3 text-right text-base-content/50">{p.pid}</td>
                <td class="text-right">{p.cpuPercent.toFixed(1)}%</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </span>
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <span
    class="opacity-70 text-app-sm relative cursor-default"
    onmouseenter={() => { ramHover = true; fetchTopProcesses(); }}
    onmouseleave={() => { ramHover = false; clearTopProcesses(); }}
  >
    RAM <span class="{ramDanger ? 'text-error font-bold' : ramOver ? 'text-warning font-bold' : 'font-semibold'}">{ramDisplay}%</span>
    {#if ramHover && topProcesses}
      <div class="absolute bottom-full right-0 mb-1 rounded-box border border-base-300 bg-base-100 p-2 shadow-xl z-50 pointer-events-none">
        <table class="text-app-md whitespace-nowrap">
          <thead>
            <tr class="border-b border-base-300 text-base-content/60">
              <th class="pr-3 text-left">Process</th>
              <th class="pr-3 text-right">PID</th>
              <th class="pr-3 text-right">RAM</th>
              <th class="text-right">%</th>
            </tr>
          </thead>
          <tbody>
            {#each topProcesses.topRam as p}
              <tr>
                <td class="pr-3 max-w-32 truncate">{p.name}</td>
                <td class="pr-3 text-right text-base-content/50">{p.pid}</td>
                <td class="pr-3 text-right">{p.memMb.toFixed(0)} MB</td>
                <td class="text-right">{topProcesses.memTotalBytes > 0 ? ((p.memMb * 1024 * 1024) / topProcesses.memTotalBytes * 100).toFixed(1) : '0.0'}%</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </span>
  {#if diskOver && metrics?.disk}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <span
      class="opacity-70 text-app-sm relative cursor-default"
      onmouseenter={() => (diskHover = true)}
      onmouseleave={() => (diskHover = false)}
    >
      Disk <span class="text-warning font-bold">{metrics.disk.used_percent.toFixed(0)}%</span>
      {#if diskHover && metrics.allDisks.length > 0}
        <div class="absolute bottom-full right-0 mb-1 rounded-box border border-base-300 bg-base-100 p-2 shadow-xl z-50 pointer-events-none">
          <table class="text-app-md whitespace-nowrap">
            <thead>
              <tr class="border-b border-base-300 text-base-content/60">
                <th class="pr-3 text-left">Disk</th>
                <th class="pr-3 text-right">Total</th>
                <th class="pr-3 text-right">Free</th>
                <th class="text-right">Used</th>
              </tr>
            </thead>
            <tbody>
              {#each metrics.allDisks as d}
                <tr>
                  <td class="pr-3">{d.mount_point}</td>
                  <td class="pr-3 text-right">{gb(d.total_bytes)}</td>
                  <td class="pr-3 text-right">{gb(d.free_bytes)}</td>
                  <td class="text-right"><span class={diskColor(d.used_percent)}>{d.used_percent.toFixed(0)}%</span></td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
    </span>
  {/if}
</footer>
