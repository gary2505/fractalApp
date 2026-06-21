<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { bridgeInvoke, type BridgeCommand } from '../core/bridge/bridge';
  import { readComponent } from '../core/cmp/cmp';
  import type { AppSettings } from '../core/set/settings';
  import { writeLog } from '../core/log/log';
  import { t } from '../core/i18n/i18n';

  export let componentId: string;
  export let reloadKey = 0;
  export let onSettingsChanged: (settings: AppSettings) => void = () => {};

  type ComponentMsg = {
    source?: string;
    type?: string;
    requestId?: string;
    command?: BridgeCommand;
    payload?: Record<string, unknown>;
    ok?: boolean;
  };
  type SettingsResult = { settings?: AppSettings };

  let loadedKey = -1;
  let loadedComponent = '';
  let frameEl: HTMLIFrameElement | null = null;
  let html = '';
  let error = '';
  let health = 'loading';

  function onMessage(event: MessageEvent) {
    const data = event.data as ComponentMsg;
    if (data.source !== 'fractal.component') return;
    if (event.source !== frameEl?.contentWindow) return;
    if (data.type === 'health.ready' && data.ok) markReady();
    if (data.type === 'bridge.invoke') void runBridge(data, event.source as Window);
  }

  function markReady() {
    health = 'ok';
    void writeLog({
      id: 'cmp.load.ok',
      level: 'info',
      componentId,
      msg: `${componentId} component loaded`
    });
  }

  async function runBridge(data: ComponentMsg, target: Window) {
    const requestId = data.requestId ?? '';
    try {
      if (!data.command) throw new Error('missing bridge command');
      const result = await bridgeInvoke<SettingsResult>(data.command, data.payload ?? {}, {
        componentId,
        traceId: getTraceId(data.payload)
      });
      if (data.command === 'settings_apply_intent' && result.settings) {
        onSettingsChanged(result.settings);
      }
      reply(target, requestId, true, result);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      reply(target, requestId, false, undefined, msg);
    }
  }

  function reply(target: Window, requestId: string, ok: boolean, data?: unknown, error?: string) {
    target.postMessage({ source: 'fractal.core', type: 'bridge.response', requestId, ok, data, error }, '*');
  }

  function getTraceId(payload?: Record<string, unknown>) {
    const intent = payload?.intent as { traceId?: string } | undefined;
    return intent?.traceId;
  }

  async function loadComponent() {
    html = '';
    error = '';
    health = 'loading';
    try {
      const component = await readComponent(componentId);
      html = component.html;
    } catch (err) {
      error = err instanceof Error ? err.message : String(err);
      health = 'error';
      await writeLog({ id: 'cmp.load.err', level: 'error', componentId, msg: error });
    }
  }

  $: if (reloadKey !== loadedKey || componentId !== loadedComponent) {
    loadedKey = reloadKey;
    loadedComponent = componentId;
    void loadComponent();
  }

  onMount(() => window.addEventListener('message', onMessage));
  onDestroy(() => window.removeEventListener('message', onMessage));
</script>

<div class="flex h-full min-h-96 flex-col gap-3">
  <div class="flex items-center justify-between gap-2">
    <h2 class="text-sm font-semibold">{$t('component.host')}</h2>
    <span class="badge" class:badge-success={health === 'ok'} class:badge-error={health === 'error'}>
      {health}
    </span>
  </div>

  {#if error}
    <div class="alert alert-error text-sm">{error}</div>
  {:else if html}
    <iframe
      bind:this={frameEl}
      title={componentId}
      class="min-h-0 flex-1 rounded-box border border-base-300 bg-base-100"
      sandbox="allow-scripts"
      srcdoc={html}
    ></iframe>
  {:else}
    <div class="skeleton min-h-96 w-full"></div>
  {/if}
</div>
