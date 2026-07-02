<script lang="ts">
  const startItems = [
    { label: 'New File...', icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M12 18v-6M9 15h6' },
    { label: 'Open File...', icon: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2A2.5 2.5 0 0 0 4 4.5v15A2.5 2.5 0 0 0 6.5 22h13a2.5 2.5 0 0 0 2.5-2.5V6l-4-4H6.5zM10 2v6h6' },
    { label: 'Open Folder...', icon: 'M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2v11z' },
    { label: 'Clone Git Repository...', icon: 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22' },
    { label: 'Connect to...', icon: 'M5 12h14M12 5l7 7-7 7' },
    { label: 'Generate New Workspace...', icon: 'M12 4v16m8-8H4' }
  ];

  const recentItems: { path: string; label: string }[] = [
    { path: 'V:\\', label: 'fractalApp' }
  ];

  const walkthroughs = [
    { title: 'Learn about rust-ana...', badge: 'Updated' },
    { title: 'Get started with Claude Code', badge: '' },
    { title: 'Get Started with PowerShell', badge: '' },
    { title: 'More...', badge: '' }
  ];

  let showWelcomeOnStartup = $state(true);
</script>

<div class="flex items-center justify-center min-h-full bg-base-100 text-base-content p-8">
  <div class="flex gap-12 max-w-4xl w-full">
    <!-- Left column -->
    <div class="flex flex-col gap-8 flex-1">
      <!-- Heading -->
      <div>
        <h1 class="text-3xl font-bold">Fractal Studio Code</h1>
        <p class="text-base-content/60">Editing evolved</p>
      </div>

      <!-- Start -->
      <div>
        <h2 class="text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-2">Start</h2>
        <div class="flex flex-col gap-0.5">
          {#each startItems as item}
            <button type="button" class="btn btn-ghost btn-sm justify-start gap-3 px-2 h-9 font-normal text-sm">
              <svg class="w-4 h-4 shrink-0 text-base-content/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d={item.icon} />
              </svg>
              <span>{item.label}</span>
            </button>
          {/each}
        </div>
      </div>

      <!-- Recent -->
      {#if recentItems.length > 0}
        <div>
          <h2 class="text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-2">Recent</h2>
          <div class="flex flex-col gap-0.5">
            {#each recentItems as item}
              <button type="button" class="btn btn-ghost btn-sm justify-start gap-3 px-2 h-9 font-normal text-sm">
                <svg class="w-4 h-4 shrink-0 text-base-content/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-6l-2-2H5a2 2 0 0 0-2 2z" />
                </svg>
                <div class="flex flex-col items-start leading-tight">
                  <span class="text-sm">{item.label}</span>
                  <span class="text-xs text-base-content/40">{item.path}</span>
                </div>
              </button>
            {/each}
          </div>
        </div>
      {/if}
    </div>

    <!-- Right column -->
    <div class="flex flex-col gap-8 w-64">
      <!-- Walkthroughs -->
      <div>
        <h2 class="text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-2">Walkthroughs</h2>
        <div class="flex flex-col gap-1">
          {#each walkthroughs as w}
            <button type="button" class="btn btn-ghost btn-sm justify-start gap-2 px-2 h-9 font-normal text-sm">
              <svg class="w-4 h-4 shrink-0 text-base-content/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>{w.title}</span>
              {#if w.badge}
                <span class="badge badge-xs badge-accent">{w.badge}</span>
              {/if}
            </button>
          {/each}
        </div>
      </div>

      <!-- Show welcome page on startup -->
      <div class="flex items-center gap-2">
        <input type="checkbox" id="welcome-startup" class="checkbox checkbox-xs" bind:checked={showWelcomeOnStartup} />
        <label for="welcome-startup" class="text-xs text-base-content/60 cursor-pointer">Show welcome page on startup</label>
      </div>
    </div>
  </div>
</div>
