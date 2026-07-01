<script lang="ts">
  import { clearSmartLogs } from '../core/log/smart-log-read';
  import { logAppRunEnd } from '../core/log/smart-log-app-flow';

  const railItems = [
    { id: 'file-explorer', label: 'Files' },
    { id: 'analysis', label: 'Search' },
    { id: 'review', label: 'Git' },
    { id: 'run', label: 'Run' },
    { id: 'settings', label: 'Set' }
  ];

  // --- Refresh workflow ---
  let showRefreshModal = $state(false);
  let fullResetChecked = $state(false);
  let isRefreshing = $state(false);

  function handleAppRefresh() {
    if (isRefreshing) return;
    fullResetChecked = false;
    showRefreshModal = true;
  }

  function handleRefreshCancel() {
    showRefreshModal = false;
    fullResetChecked = false;
  }

  async function handleQuickReload() {
    if (isRefreshing) return;
    isRefreshing = true;

    if (typeof window !== 'undefined') {
      (window as any).__FRACTALAPP_REFRESHING__ = true;
    }

    // 🔍 SEARCH: Write EN to mark clean end, then reload.
    // Rust ensure_run_started deletes old file on next boot.
    // CRITICAL for next agent: Do NOT clearSmartLogs here — EN must persist
    // into the file so next boot sees a clean end (not a crash).
    try { await logAppRunEnd(); } catch (_) { /* ignore */ }

    const url = new URL(window.location.href);
    url.searchParams.set('reload', Date.now().toString());
    window.location.replace(url.toString());
  }

  async function performFullReset() {
    isRefreshing = true;

    if (typeof window !== 'undefined') {
      (window as any).__FRACTALAPP_REFRESHING__ = true;
    }

    const prefixRE = /^fractalapp/i;
    const preserveKeys: string[] = [];

    // --- localStorage ---
    try {
      const keys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k) keys.push(k);
      }
      for (const key of keys) {
        if (preserveKeys.includes(key)) continue;
        if (prefixRE.test(key)) localStorage.removeItem(key);
      }
    } catch (_) { /* ignore */ }

    // --- sessionStorage ---
    try { sessionStorage?.clear(); } catch (_) { /* ignore */ }

    // --- Cache Storage ---
    try {
      if ('caches' in window) {
        const names = await caches.keys();
        for (const name of names) {
          if (prefixRE.test(name)) await caches.delete(name);
        }
      }
    } catch (_) { /* ignore */ }

    // --- IndexedDB ---
    try {
      const anyIDB: any = indexedDB as any;
      if (anyIDB?.databases) {
        const dbs = await anyIDB.databases();
        for (const db of dbs as Array<{ name?: string }>) {
          const name = db?.name;
          if (name && prefixRE.test(name)) {
            await new Promise<void>((resolve) => {
              const req = indexedDB.deleteDatabase(name);
              req.onsuccess = () => resolve();
              req.onerror = () => resolve();
              req.onblocked = () => resolve();
            });
          }
        }
      }
    } catch (_) { /* ignore */ }

    // --- Logs (app.jsonl) ---
    try { await clearSmartLogs('app'); } catch (_) { /* ignore */ }

    // Small delay to let logs flush
    await new Promise((r) => setTimeout(r, 50));

    if (typeof window !== 'undefined') {
      (window as any).__FRACTALAPP_REFRESHING__ = true;
    }

    const url = new URL(window.location.href);
    url.searchParams.set('refresh', Date.now().toString());
    window.location.replace(url.toString());
  }

  async function handleRefreshConfirm() {
    showRefreshModal = false;
    if (fullResetChecked) {
      await performFullReset();
    } else {
      await handleQuickReload();
    }
  }
</script>

<aside id="p0" class="w-16 bg-base-200 text-base-content border-r border-base-300 p-1 flex flex-col items-stretch gap-1" aria-label="P0 side rail">
  {#each railItems as item (item.id)}
    <button
      id="p0-rail-{item.id}"
      type="button"
      class="btn btn-ghost min-h-0 h-10 px-1 rounded-btn"
      title={item.label}
      aria-label={item.label}
    >
      {item.label}
    </button>
  {/each}
  <div class="mt-auto flex flex-col items-center gap-1">
    <button id="p0-log" type="button" class="icon-app-base" title="Log">
      <svg class="icon-app-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
    </button>
    <button id="p0-refresh" type="button" class="icon-app-base" title="Refresh" onclick={() => handleAppRefresh()}>
      <svg class="icon-app-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
    </button>
    <button id="p0-settings" type="button" class="icon-app-base" title="Settings">
      <svg class="icon-app-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
    </button>
  </div>
</aside>

<!-- Refresh Modal -->
{#if showRefreshModal}
  <div class="modal modal-open">
    <div class="modal-box">
      <h3 class="font-bold text-lg">Refresh app</h3>
      <p class="py-4">For UI issue use quick reload. Just press OK</p>

      <div class="form-control">
        <label class="label cursor-pointer flex items-center gap-0 justify-start">
          <input
            type="checkbox"
            class="checkbox checkbox-primary mr-0"
            bind:checked={fullResetChecked}
          />
          <span class="label-text px-2 py-1 rounded select-text"
            >Full Reset (clean all data and refresh)</span
          >
        </label>
      </div>

      {#if fullResetChecked}
        <div class="alert alert-warning mt-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <div>
            <h4 class="font-bold">FULL RESET</h4>
            <div class="text-sm">
              This will:<br />
              • Clear all fractalApp data (sessions, cache, settings)<br />
              • Preserve only theme and language<br />
              • Refresh the app
            </div>
          </div>
        </div>
      {/if}

      <div class="modal-action flex justify-end gap-2">
        <button class="btn" onclick={handleRefreshCancel}>Cancel</button>
        <button class="btn btn-primary" onclick={handleRefreshConfirm}> OK </button>
      </div>
    </div>
  </div>
{/if}
