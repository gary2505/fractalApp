// 🔍 SEARCH: "system-metrics-module" — receives system://metrics events from Rust backend
import { writable, derived, type Readable } from 'svelte/store';
import { listen } from '@tauri-apps/api/event';

type RawDisk = {
  mount_point: string;
  used_percent: number;
  total_bytes: number;
  free_bytes: number;
};

type RawPayload = {
  cpu_total: number;
  mem_used: number;
  mem_total: number;
  disk_max: RawDisk | null;
  all_disks: RawDisk[];
};

type Sample = {
  cpu: number;
  ramUsed: number;
  ramTotal: number;
  ts: number;
};

const samples = writable<Sample[]>([]);

let latestDisk: RawDisk | null = null;
let latestAllDisks: RawDisk[] = [];
let initialized = false;
let unlistenPromise: Promise<() => void> | null = null;

export function enableSystemMetrics(): void {
  if (initialized) return;
  initialized = true;

  unlistenPromise = listen<RawPayload>('system://metrics', (event) => {
    const payload = event.payload;
    const now = Date.now();

    samples.update((list) => {
      const next: Sample[] = [
        ...list,
        { cpu: payload.cpu_total, ramUsed: payload.mem_used, ramTotal: payload.mem_total, ts: now }
      ];
      const cutoff = now - 10_000; // keep last 10 sec
      return next.filter((s) => s.ts >= cutoff);
    });

    latestDisk = payload.disk_max;
    latestAllDisks = payload.all_disks;
  });
}

export function disableSystemMetrics(): void {
  if (!initialized) return;
  initialized = false;
  samples.set([]);
  latestDisk = null;
  latestAllDisks = [];
  if (unlistenPromise) {
    unlistenPromise.then((unlisten) => unlisten());
    unlistenPromise = null;
  }
}

export type AveragedMetrics = {
  cpuAvg: number;
  ramPercent: number;
  disk: RawDisk | null;
  allDisks: RawDisk[];
};

export const averagedMetrics: Readable<AveragedMetrics | null> = derived(samples, ($samples) => {
  if ($samples.length === 0) return null;

  const cpuAvg = $samples.reduce((sum, s) => sum + s.cpu, 0) / $samples.length;
  const last = $samples[$samples.length - 1];
  if (!last) return null;
  const ramPercent = last.ramTotal > 0 ? (last.ramUsed / last.ramTotal) * 100 : 0;

  return { cpuAvg, ramPercent, disk: latestDisk, allDisks: latestAllDisks };
});
