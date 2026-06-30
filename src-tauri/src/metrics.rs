use serde::Serialize;
use std::{thread, time::Duration};
use tauri::{AppHandle, Emitter};
use sysinfo::{Disks, System};

#[derive(Serialize, Clone)]
pub struct DiskUsage {
    pub mount_point: String,
    pub used_percent: f32,
    pub total_bytes: u64,
    pub free_bytes: u64,
}

#[derive(Serialize, Clone)]
pub struct SystemMetrics {
    pub cpu_total: f32,
    pub mem_used: u64,
    pub mem_total: u64,
    pub disk_max: Option<DiskUsage>,
    pub all_disks: Vec<DiskUsage>,
}

/// CPU+RAM refresh interval (ms)
const CPU_MEM_INTERVAL_MS: u64 = 1000;
/// Disk refresh interval in ticks (every N ticks)
const DISK_INTERVAL_TICKS: u64 = 60;

pub fn start_metrics_loop(app: AppHandle) {
    thread::spawn(move || {
        let mut sys = System::new_all();
        let mut ticks: u64 = 0;
        let mut last_disk_max: Option<DiskUsage> = None;
        let mut last_all_disks: Vec<DiskUsage> = Vec::new();

        loop {
            // CPU + RAM
            sys.refresh_cpu_all();
            sys.refresh_memory();

            let cpu_total = sys.cpus().iter().map(|cpu| cpu.cpu_usage()).sum::<f32>()
                / sys.cpus().len() as f32;

            // sysinfo returns KiB – convert to bytes
            let mem_used = sys.used_memory() * 1024;
            let mem_total = sys.total_memory() * 1024;

            // Disk (every DISK_INTERVAL_TICKS ticks)
            if ticks % DISK_INTERVAL_TICKS == 0 {
                let disks = Disks::new_with_refreshed_list();

                let mut best: Option<DiskUsage> = None;
                let mut all: Vec<DiskUsage> = Vec::new();
                for disk in &disks {
                    let total = disk.total_space();
                    let free = disk.available_space();
                    if total == 0 {
                        continue;
                    }
                    let used_percent = ((total - free) as f32 / total as f32) * 100.0;
                    let mount_point = disk.mount_point().to_string_lossy().to_string();

                    let du = DiskUsage { mount_point: mount_point.clone(), used_percent, total_bytes: total, free_bytes: free };
                    all.push(du.clone());

                    match &best {
                        Some(current) if current.used_percent >= used_percent => {}
                        _ => { best = Some(du); }
                    }
                }
                last_disk_max = best;
                last_all_disks = all;
            }

            let metrics = SystemMetrics {
                cpu_total,
                mem_used,
                mem_total,
                disk_max: last_disk_max.clone(),
                all_disks: last_all_disks.clone(),
            };

            if app.emit("system://metrics", &metrics).is_err() {
                break;
            }

            ticks = ticks.wrapping_add(1);
            thread::sleep(Duration::from_millis(CPU_MEM_INTERVAL_MS));
        }
    });
}
