use chrono::{Datelike, TimeZone, Utc};
use serde::Deserialize;
use serde_json::{json, Value};
use std::fs::{self, File, OpenOptions};
use std::io::{BufRead, BufReader, Write};
use std::path::{Path, PathBuf};
use std::sync::{Mutex, OnceLock};
use std::time::Instant;

const APP_NAME: &str = "fractalApp";
const APP_RUN_FILE: &str = "app-run.jsonl";
const APP_CRASH_PREV_FILE: &str = "app-crash-prev.jsonl";
const ISSUE_FILE: &str = "issue-current.jsonl";
const ERROR_PREFIX: &str = "error";
const CRITICAL_PREFIX: &str = "critical";
const FATAL_PREFIX: &str = "fatal";
const MAX_READ_LIMIT: usize = 1000;
const MAX_LINE_BYTES: usize = 8 * 1024;
const ISSUE_ROTATE_BYTES: u64 = 2 * 1024 * 1024;
const ROTATE_KEEP: usize = 3;

#[derive(Debug, Clone, Deserialize)]
#[allow(dead_code)]
pub struct SmartLogInput {
    pub v: u8,
    #[serde(default)]
    pub ts: String,
    #[serde(default)]
    pub t: String,
    pub l: String,
    pub mode: String,
    pub kind: String,
    pub tag: String,
    pub id: String,
    #[serde(default)]
    pub sid: String,
    #[serde(default)]
    pub rid: String,
    #[serde(default)]
    pub span: u64,
    #[serde(default)]
    pub p: Option<u64>,
    #[serde(default)]
    pub a: String,
    pub e: String,
    #[serde(default)]
    pub m: String,
    #[serde(default)]
    pub c: Option<Value>,
    #[serde(default)]
    pub d: Option<Value>,
}

#[derive(Debug)]
struct RuntimeState {
    initialized: bool,
    start: Option<Instant>,
    start_iso: String,
    main: String,
    mode: String,
    last_sig: String,
    last_ms: u64,
    ended: bool,
}

impl Default for RuntimeState {
    fn default() -> Self {
        Self {
            initialized: false,
            start: None,
            start_iso: String::new(),
            main: "unknown".into(),
            mode: "dev".into(),
            last_sig: String::new(),
            last_ms: 0,
            ended: false,
        }
    }
}

static RUNTIME: OnceLock<Mutex<RuntimeState>> = OnceLock::new();

#[tauri::command]
pub fn smart_log_write(input: SmartLogInput) -> Result<(), String> {
    if input.v != 1 && input.v != 2 {
        return Err("LOG_BAD_VERSION".into());
    }

    // smart_log_write is now only for issue/error mode events
    // App-run events must use smart_log_run_event
    if input.mode != "issue" && !is_error_event(&input) {
        return Err("LOG_USE_RUN_EVENT".into());
    }

    let mut state = runtime().lock().map_err(|_| "LOG_LOCK".to_string())?;
    ensure_run_started(&mut state)?;

    let ms = elapsed_ms(&state);

    if input.mode == "issue" {
        write_issue_row(ms, &input)?;
    }

    if is_error_event(&input) {
        let (bucket, error_id) = upsert_error(&input)?;
        let ev = if bucket == FATAL_PREFIX { "fatal" } else { "err" };
        return append_deduped(&mut state, ms, json!([ms, ev, error_id]));
    }

    Ok(())
}

#[tauri::command]
pub fn smart_log_run_event(ev: String, value: Option<Value>) -> Result<(), String> {
    let mut state = runtime().lock().map_err(|_| "LOG_LOCK".to_string())?;
    ensure_run_started(&mut state)?;

    let ms = elapsed_ms(&state);

    if ev == "run.end" || ev == "end" {
        if !state.ended {
            append_app_row(&json!(["END", ms]))?;
            state.ended = true;
        }
        return Ok(());
    }

    match ev.as_str() {
        "boot" => {
            // boot may carry main/mode metadata from frontend
            if let Some(obj) = value.as_ref().and_then(|v| v.as_object()) {
                if let Some(main) = obj.get("main").or_else(|| obj.get("mainVersion")).and_then(Value::as_str) {
                    state.main = main.to_string();
                }
                if let Some(mode) = obj.get("mode").and_then(Value::as_str) {
                    state.mode = mode.to_string();
                }
            }
            return append_deduped(&mut state, ms, json!([ms, "boot"]));
        }
        "p0" | "p1" | "term" | "ai" => {
            let v = match &value {
                Some(v) => value_to_i64(v),
                None => None,
            };
            if let Some(num) = v {
                return append_deduped(&mut state, ms, json!([ms, ev.as_str(), num]));
            }
            return Ok(());
        }
        "main" => {
            let to = value
                .as_ref()
                .and_then(|v| v.as_str())
                .map(|s| s.to_string())
                .or_else(|| {
                    value
                        .as_ref()
                        .and_then(|v| v.as_object())
                        .and_then(|obj| obj.get("to").or_else(|| obj.get("main")))
                        .and_then(Value::as_str)
                        .map(|s| s.to_string())
                });
            if let Some(to) = to {
                if to == state.main {
                    return Ok(());
                }
                state.main = to.clone();
                return append_deduped(&mut state, ms, json!([ms, "main", to]));
            }
            return Ok(());
        }
        "err" | "fatal" => {
            if let Some(id) = value.as_ref().and_then(|v| v.as_str()) {
                return append_deduped(&mut state, ms, json!([ms, ev.as_str(), id]));
            }
            return Ok(());
        }
        "trace" => {
            if let Some(id) = value.as_ref().and_then(|v| v.as_str()) {
                return append_deduped(&mut state, ms, json!([ms, "trace", id]));
            }
            return Ok(());
        }
        _ => {
            // Unknown event types are ignored silently
            return Ok(());
        }
    }
}

#[tauri::command]
pub fn smart_log_read_last(file: String, limit: usize) -> Result<Vec<Value>, String> {
    let safe_limit = limit.max(1).min(MAX_READ_LIMIT);
    let path = read_path_for(&file)?;
    if !path.exists() {
        return Ok(Vec::new());
    }

    if file == "error" || file == "critical" || file == "fatal" {
        let value: Value = read_json_or_empty(&path)?;
        return Ok(vec![value]);
    }

    let file = File::open(&path).map_err(|e| format!("LOG_OPEN: {e}"))?;
    let reader = BufReader::new(file);
    let mut rows: Vec<Value> = Vec::with_capacity(safe_limit);

    for line in reader.lines() {
        let line = line.map_err(|e| format!("LOG_READ: {e}"))?;
        if line.trim().is_empty() {
            continue;
        }
        if let Ok(row) = serde_json::from_str::<Value>(&line) {
            rows.push(row);
            if rows.len() > safe_limit {
                rows.remove(0);
            }
        }
    }

    Ok(rows)
}

#[tauri::command]
pub fn smart_log_clear(file: String) -> Result<(), String> {
    let path = read_path_for(&file)?;
    if path.exists() {
        fs::remove_file(path).map_err(|e| format!("LOG_CLEAR: {e}"))?;
    }
    Ok(())
}

#[tauri::command]
pub fn smart_log_dir() -> Result<String, String> {
    Ok(log_dir()?.to_string_lossy().to_string())
}

#[tauri::command]
pub fn smart_log_rotate(file: String) -> Result<(), String> {
    rotate_file(&read_path_for(&file)?)
}

fn runtime() -> &'static Mutex<RuntimeState> {
    RUNTIME.get_or_init(|| Mutex::new(RuntimeState::default()))
}

fn ensure_run_started(state: &mut RuntimeState) -> Result<(), String> {
    if state.initialized {
        return Ok(());
    }

    let dir = log_dir()?;
    let run_path = dir.join(APP_RUN_FILE);
    if run_path.exists() {
        if previous_run_ended(&run_path)? {
            fs::remove_file(&run_path).map_err(|e| format!("LOG_RESET: {e}"))?;
        } else {
            let crash_path = dir.join(APP_CRASH_PREV_FILE);
            if crash_path.exists() {
                fs::remove_file(&crash_path).map_err(|e| format!("LOG_CRASH_REMOVE: {e}"))?;
            }
            fs::rename(&run_path, &crash_path).map_err(|e| format!("LOG_CRASH_RENAME: {e}"))?;
        }
    }

    let issue_path = dir.join(ISSUE_FILE);
    if issue_path.exists() {
        fs::remove_file(issue_path).map_err(|e| format!("ISSUE_RESET: {e}"))?;
    }

    let now = Utc::now();
    state.initialized = true;
    state.ended = false;
    state.start = Some(Instant::now());
    state.start_iso = now.to_rfc3339_opts(chrono::SecondsFormat::Millis, true);
    state.main = "unknown".into();
    state.mode = "dev".into();

    let header = json!([
        "H",
        2,
        state.start_iso,
        APP_NAME,
        state.main,
        state.mode,
        ["ms", "ev", "v"]
    ]);
    append_app_row(&header)
}

fn previous_run_ended(path: &Path) -> Result<bool, String> {
    let file = File::open(path).map_err(|e| format!("LOG_OPEN: {e}"))?;
    let reader = BufReader::new(file);
    let mut last = String::new();
    for line in reader.lines() {
        let line = line.map_err(|e| format!("LOG_READ: {e}"))?;
        if !line.trim().is_empty() {
            last = line;
        }
    }
    Ok(last.starts_with("[\"END\"") || last.starts_with("[\"end\""))
}

fn elapsed_ms(state: &RuntimeState) -> u64 {
    state
        .start
        .map(|start| start.elapsed().as_millis().min(u128::from(u64::MAX)) as u64)
        .unwrap_or(0)
}

fn append_deduped(state: &mut RuntimeState, ms: u64, row: Value) -> Result<(), String> {
    let line = serde_json::to_string(&row).map_err(|e| format!("LOG_SERIALIZE: {e}"))?;
    if line.len() > MAX_LINE_BYTES {
        return Err("LOG_LINE_TOO_LARGE".into());
    }
    if state.last_sig == line && ms.saturating_sub(state.last_ms) <= 2000 {
        return Ok(());
    }
    state.last_sig = line.clone();
    state.last_ms = ms;
    append_line(APP_RUN_FILE, &line)
}

fn append_app_row(row: &Value) -> Result<(), String> {
    let line = serde_json::to_string(row).map_err(|e| format!("LOG_SERIALIZE: {e}"))?;
    if line.len() > MAX_LINE_BYTES {
        return Err("LOG_LINE_TOO_LARGE".into());
    }
    append_line(APP_RUN_FILE, &line)
}

fn write_issue_row(ms: u64, input: &SmartLogInput) -> Result<(), String> {
    let row = json!([ms, compact_code(&input.e, 24), compact_code(&input.rid, 32)]);
    let line = serde_json::to_string(&row).map_err(|e| format!("ISSUE_SERIALIZE: {e}"))?;
    rotate_if_needed(&log_dir()?.join(ISSUE_FILE), ISSUE_ROTATE_BYTES)?;
    append_line(ISSUE_FILE, &line)
}

fn is_error_event(input: &SmartLogInput) -> bool {
    matches!(input.l.as_str(), "error" | "fatal") || matches!(input.kind.as_str(), "error" | "fatal")
}

fn upsert_error(input: &SmartLogInput) -> Result<(&'static str, String), String> {
    let bucket = error_bucket(input);
    let error_id = error_id(input, bucket);
    let path = monthly_error_path(bucket)?;
    let now_min = month_minute_now();
    let m0 = month_start_iso();

    let mut root = read_json_or_empty(&path)?;
    if !root.is_object() {
        root = json!({});
    }
    let obj = root.as_object_mut().ok_or_else(|| "ERROR_INDEX_BAD_ROOT".to_string())?;
    obj.insert("v".into(), json!(2));
    obj.insert("m0".into(), json!(m0));
    obj.insert("h".into(), json!(["ds", "dl", "n", "where", "msg", "file", "line", "fn", "maxPerMin"]));

    let where_code = compact_code(&input.kind, 24);
    let msg = compact_msg(&input.m, 96);
    let file = string_from_data(input.d.as_ref(), &["fileName", "file"]).unwrap_or_else(|| "unknown".into());
    let line = number_from_data(input.d.as_ref(), &["lineNumber", "line"]).unwrap_or(0);
    let fn_name = string_from_data(input.d.as_ref(), &["fn", "function", "functionName"]).unwrap_or_else(|| "unknown".into());

    let next = match obj.get(&error_id).and_then(Value::as_array) {
        Some(prev) if prev.len() >= 9 => {
            let ds = prev.first().and_then(Value::as_i64).unwrap_or(now_min);
            let last = prev.get(1).and_then(Value::as_i64).unwrap_or(now_min);
            let n = prev.get(2).and_then(Value::as_i64).unwrap_or(0) + 1;
            let old_max = prev.get(8).and_then(Value::as_i64).unwrap_or(1);
            let max_per_min = if last == now_min { old_max + 1 } else { old_max.max(1) };
            json!([ds, now_min, n, where_code, msg, file, line, fn_name, max_per_min])
        }
        _ => json!([now_min, now_min, 1, where_code, msg, file, line, fn_name, 1]),
    };

    obj.insert(error_id.clone(), next);
    atomic_write_json(&path, &root)?;
    Ok((bucket, error_id))
}

fn error_bucket(input: &SmartLogInput) -> &'static str {
    if input.l == "fatal" || input.kind == "fatal" {
        return FATAL_PREFIX;
    }
    if string_from_data(input.d.as_ref(), &["severity", "level"]).as_deref() == Some("critical") {
        return CRITICAL_PREFIX;
    }
    ERROR_PREFIX
}

fn error_id(input: &SmartLogInput, bucket: &str) -> String {
    if let Some(id) = string_from_data(input.d.as_ref(), &["errorId", "id"]) {
        return compact_error_id(&id, bucket);
    }
    compact_error_id(&input.id, bucket)
}

fn compact_error_id(value: &str, bucket: &str) -> String {
    let prefix = match bucket {
        FATAL_PREFIX => "F_",
        CRITICAL_PREFIX => "C_",
        _ => "E_",
    };
    let mut out = String::from(prefix);
    let mut last_us = false;
    for ch in value.chars() {
        let next = if ch.is_ascii_alphanumeric() { ch.to_ascii_uppercase() } else { '_' };
        if next == '_' {
            if !last_us && !out.ends_with('_') {
                out.push('_');
            }
            last_us = true;
        } else {
            out.push(next);
            last_us = false;
        }
        if out.len() >= 64 {
            break;
        }
    }
    out.trim_end_matches('_').to_string()
}

fn monthly_error_path(bucket: &str) -> Result<PathBuf, String> {
    let now = Utc::now();
    Ok(log_dir()?.join(format!("{bucket}-{:04}-{:02}.json", now.year(), now.month())))
}

fn month_start_iso() -> String {
    let now = Utc::now();
    Utc.with_ymd_and_hms(now.year(), now.month(), 1, 0, 0, 0)
        .single()
        .unwrap_or(now)
        .to_rfc3339_opts(chrono::SecondsFormat::Secs, true)
}

fn month_minute_now() -> i64 {
    let now = Utc::now();
    let start = Utc
        .with_ymd_and_hms(now.year(), now.month(), 1, 0, 0, 0)
        .single()
        .unwrap_or(now);
    (now - start).num_minutes()
}

fn read_path_for(file: &str) -> Result<PathBuf, String> {
    let dir = log_dir()?;
    match file {
        "app" | "run" => Ok(dir.join(APP_RUN_FILE)),
        "issue" => Ok(dir.join(ISSUE_FILE)),
        "error" => monthly_error_path(ERROR_PREFIX),
        "critical" => monthly_error_path(CRITICAL_PREFIX),
        "fatal" => monthly_error_path(FATAL_PREFIX),
        _ => Err("LOG_BAD_FILE".into()),
    }
}

fn append_line(filename: &str, line: &str) -> Result<(), String> {
    let path = log_dir()?.join(filename);
    let mut file = OpenOptions::new()
        .create(true)
        .append(true)
        .open(&path)
        .map_err(|e| format!("LOG_OPEN: {e}"))?;
    writeln!(file, "{line}").map_err(|e| format!("LOG_WRITE: {e}"))?;
    Ok(())
}

fn log_dir() -> Result<PathBuf, String> {
    let base = dirs::data_dir()
        .or_else(dirs::config_dir)
        .or_else(|| std::env::current_dir().ok())
        .ok_or_else(|| "LOG_DIR_UNRESOLVED".to_string())?;
    let dir = base.join(APP_NAME).join("logs");
    fs::create_dir_all(&dir).map_err(|e| format!("LOG_DIR_CREATE: {e}"))?;
    Ok(dir)
}

fn read_json_or_empty(path: &Path) -> Result<Value, String> {
    if !path.exists() {
        return Ok(json!({}));
    }
    let text = fs::read_to_string(path).map_err(|e| format!("JSON_READ: {e}"))?;
    if text.trim().is_empty() {
        return Ok(json!({}));
    }
    serde_json::from_str(&text).map_err(|e| format!("JSON_PARSE: {e}"))
}

fn atomic_write_json(path: &Path, value: &Value) -> Result<(), String> {
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent).map_err(|e| format!("JSON_DIR: {e}"))?;
    }
    let text = serde_json::to_string(value).map_err(|e| format!("JSON_SERIALIZE: {e}"))?;
    let tmp = path.with_extension("tmp");
    fs::write(&tmp, text).map_err(|e| format!("JSON_TMP_WRITE: {e}"))?;
    if path.exists() {
        fs::remove_file(path).map_err(|e| format!("JSON_OLD_REMOVE: {e}"))?;
    }
    fs::rename(&tmp, path).map_err(|e| format!("JSON_RENAME: {e}"))?;
    Ok(())
}

fn rotate_if_needed(path: &Path, max_bytes: u64) -> Result<(), String> {
    if path.metadata().map(|m| m.len()).unwrap_or(0) < max_bytes {
        return Ok(());
    }
    rotate_file(path)
}

fn rotate_file(path: &Path) -> Result<(), String> {
    if !path.exists() {
        return Ok(());
    }
    for index in (1..=ROTATE_KEEP).rev() {
        let from = if index == 1 {
            path.to_path_buf()
        } else {
            path.with_extension(format!("jsonl.{}", index - 1))
        };
        let to = path.with_extension(format!("jsonl.{index}"));
        if from.exists() {
            if to.exists() {
                fs::remove_file(&to).map_err(|e| format!("LOG_ROTATE_REMOVE: {e}"))?;
            }
            fs::rename(&from, &to).map_err(|e| format!("LOG_ROTATE_RENAME: {e}"))?;
        }
    }
    Ok(())
}

fn string_from_data(data: Option<&Value>, keys: &[&str]) -> Option<String> {
    let obj = data?.as_object()?;
    for key in keys {
        if let Some(value) = obj.get(*key).and_then(Value::as_str) {
            if !value.is_empty() {
                return Some(compact_msg(value, 80));
            }
        }
    }
    None
}

fn number_from_data(data: Option<&Value>, keys: &[&str]) -> Option<i64> {
    let obj = data?.as_object()?;
    for key in keys {
        if let Some(value) = obj.get(*key).and_then(Value::as_i64) {
            return Some(value);
        }
    }
    None
}

fn compact_msg(value: &str, max: usize) -> String {
    let clean: String = value
        .chars()
        .map(|c| if matches!(c, '\r' | '\n' | '\t') { ' ' } else { c })
        .take(max)
        .collect();
    clean
}

fn compact_code(value: &str, max: usize) -> String {
    value
        .chars()
        .filter(|c| c.is_ascii_alphanumeric() || matches!(c, '.' | '_' | '-' | ':'))
        .take(max)
        .collect()
}

fn value_to_i64(value: &Value) -> Option<i64> {
    match value {
        Value::Number(n) => n.as_i64(),
        Value::Bool(b) => Some(if *b { 1 } else { 0 }),
        Value::String(s) => s.parse::<i64>().ok(),
        _ => None,
    }
}
