// 🔍 SEARCH: AI-agent-only debug logger — plain pipe text to .ai/bundles/llog.md
// CRITICAL for next agent: Never use serde_json for llog rows. Never write JSON.
// CRITICAL for next agent: Only meaningful checkpoints: start, finish, error, lock, retry, duplicate-run guard.

use std::fs::{self, File, OpenOptions};
use std::io::Write;
use std::path::PathBuf;
use std::sync::{Mutex, OnceLock};
use std::time::Instant;

struct LlogState {
    start: Instant,
    truncated: bool,
}

static LLSTATE: OnceLock<Mutex<LlogState>> = OnceLock::new();

fn llstate() -> &'static Mutex<LlogState> {
    LLSTATE.get_or_init(|| {
        Mutex::new(LlogState {
            start: Instant::now(),
            truncated: false,
        })
    })
}

/// Resolve repo root from src-tauri parent (CARGO_MANIFEST_DIR at build time).
fn repo_root() -> Option<PathBuf> {
    let manifest_dir = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
    manifest_dir.parent().map(|p| p.to_path_buf())
}

fn llog_path() -> Option<PathBuf> {
    repo_root().map(|r| r.join(".ai").join("bundles").join("llog.md"))
}

/// Truncate llog.md once per app start.
fn ensure_truncated() -> Result<(), String> {
    let mut state = llstate().lock().map_err(|_| "LLOG_LOCK".to_string())?;
    if state.truncated {
        return Ok(());
    }
    state.truncated = true;
    let path = llog_path().ok_or_else(|| "LLOG_NO_ROOT".to_string())?;
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent).map_err(|e| format!("LLOG_DIR: {e}"))?;
    }
    // Truncate by creating/overwriting with empty
    let mut f = File::create(&path).map_err(|e| format!("LLOG_CREATE: {e}"))?;
    f.flush().map_err(|e| format!("LLOG_FLUSH: {e}"))?;
    Ok(())
}

/// Sanitize a field: replace \n \r with spaces, replace | with /, trim leading/trailing whitespace.
fn sanitize(s: &str) -> String {
    s.chars()
        .map(|c| match c {
            '\n' | '\r' => ' ',
            '|' => '/',
            _ => c,
        })
        .collect::<String>()
        .trim()
        .to_string()
}

/// Validate component code: uppercase, 2 chars preferred, max 3.
fn validate_component(code: &str) -> Result<(), String> {
    if code.is_empty() || code.len() > 3 {
        return Err(format!("LLOG_BAD_COMPONENT: {code}"));
    }
    if !code.chars().all(|c| c.is_ascii_uppercase()) {
        return Err(format!("LLOG_BAD_COMPONENT: {code}"));
    }
    Ok(())
}

/// Validate event code: uppercase, 2 chars preferred, max 4.
fn validate_event(code: &str) -> Result<(), String> {
    if code.is_empty() || code.len() > 4 {
        return Err(format!("LLOG_BAD_EVENT: {code}"));
    }
    if !code.chars().all(|c| c.is_ascii_uppercase()) {
        return Err(format!("LLOG_BAD_EVENT: {code}"));
    }
    Ok(())
}

#[tauri::command]
pub fn llog_write(
    component: String,
    event: String,
    path: Option<String>,
    note: Option<String>,
) -> Result<(), String> {
    // Validate codes (return error in dev)
    validate_component(&component)?;
    validate_event(&event)?;

    ensure_truncated()?;

    let state = llstate().lock().map_err(|_| "LLOG_LOCK".to_string())?;
    let t_ms = state.start.elapsed().as_millis().min(u128::from(u64::MAX)) as u64;
    drop(state);

    let comp = sanitize(&component);
    let ev = sanitize(&event);
    let p = sanitize(&path.unwrap_or_default());
    let n = sanitize(&note.unwrap_or_default());

    let line = format!("{t_ms}|{comp}|{ev}|{p}|{n}");

    let file_path = llog_path().ok_or_else(|| "LLOG_NO_ROOT".to_string())?;
    let mut f = OpenOptions::new()
        .create(true)
        .append(true)
        .open(&file_path)
        .map_err(|e| format!("LLOG_OPEN: {e}"))?;
    writeln!(f, "{line}").map_err(|e| format!("LLOG_WRITE: {e}"))?;

    Ok(())
}
