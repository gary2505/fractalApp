<script lang="ts">
  type ThemeMode = 'system' | 'dark' | 'light';
  type LangMode = 'EN' | 'RU';

  export let versionId = 'main-v1-4';
  export let lang: LangMode = 'EN';
  export let theme: ThemeMode = 'system';
  export let status = 'Ready';
  export let onChangeLang: (lang: LangMode) => void = () => {};
  export let onChangeTheme: (theme: ThemeMode) => void = () => {};
</script>

<footer id="SBar" class="h-8 bg-base-200 text-base-content border-t border-base-300 px-2 flex items-center gap-3" aria-label="SBar status bar">
  <span class="badge badge-outline">{versionId}</span>
  <span class="opacity-70">{status}</span>
  <span class="ml-auto opacity-70">RAM --</span>
  <span class="opacity-70">CPU --</span>
  <div class="join">
    <button type="button" class="btn btn-ghost join-item min-h-0 h-6 px-2 {lang === 'EN' ? 'btn-active' : ''}" onclick={() => onChangeLang('EN')}>EN</button>
    <button type="button" class="btn btn-ghost join-item min-h-0 h-6 px-2 {lang === 'RU' ? 'btn-active' : ''}" onclick={() => onChangeLang('RU')}>RU</button>
  </div>
  <select class="select select-bordered min-h-0 h-6 w-28" value={theme} aria-label="Theme" onchange={(event) => onChangeTheme(event.currentTarget.value as ThemeMode)}>
    <option value="system">System</option>
    <option value="dark">Dark</option>
    <option value="light">Light</option>
  </select>
</footer>
