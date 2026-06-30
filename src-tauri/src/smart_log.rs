use chrono::Utc;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::fs::{self, File, OpenOptions};
use std::io::{BufRead, BufReader, Write};
use std::path::{Path, PathBuf};

const APP_NAME: &str = "fractalApp";
const APP_FILE: &str = "app.jsonl";
const ISSUE_FILE: &str = "issue-current.jsonl";
const ERROR_FILE: &str = "error.jsonl";
const MAX_READ_LIMIT: usize = 1000;
const MAX_LINE_BYTES: usize = 16 * 1024;
const APP_ROTATE_BYTES: u64 = 5 * 1024 * 1024;
const ISSUE_ROTATE_BYTES: u64 = 2 * 1024 * 1024;
const ERROR_ROTATE_BYTES: u64 = 2 * 1024 * 1024;
const ROTATE_KEEP: usize = 5;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SmartLogInput {
    pub v: u8,
    pub ts: String,
    pub t: String,
    pub l: String,
    pub mode: String,
    pub kind: String,
    pub tag: String,
    pub id: String,
    pub sid: String,
    pub rid: String,
    pub span: u64,
    #[serde(default)]
    pub p: Option<u64>,
    pub a: String,
    pub e: String,
    pub m: String,
    #[serde(default)]
    pub c: Option<Value>,
    #[serde(default)]
    pub d: Option<Value>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SmartLogRow {
    pub v: u8,
    pub ts: String,
    pub t: String,
    pub l: String,
    pub mode: String,
    pub kind: String,
    pub tag: String,
    pub id: String,
    pub sid: String,
    pub rid: String,
    pub span: u64,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub p: Option<u64>,
    pub a: String,
    pub e: String,
    pub m: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub c: Option<Value>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub d: Option<Value>,
}

#[tauri::command]
pub fn smart_log_write(input: SmartLogInput) -> Result<(), String> {
    let row = normalize_row(input)?;
    let line = serde_json::to_string(&row).map_err(|e| format!("LOG_SERIALIZE: {e}"))?;
    if line.len() > MAX_LINE_BYTES {
        return Err("LOG_LINE_TOO_LARGE".to_string());
    }

    append_jsonl(APP_FILE, APP_ROTATE_BYTES, &line)?;

    if row.mode == "issue" {
        append_jsonl(ISSUE_FILE, ISSUE_ROTATE_BYTES, &line)?;
    }

    if row.l == "error" || row.l == "fatal" || row.kind == "error" || row.kind == "fatal" {
        append_jsonl(ERROR_FILE, ERROR_ROTATE_BYTES, &line)?;
    }

    Ok(())
}

#[tauri::command]
pub fn smart_log_read_last(file: String, limit: usize) -> Result<Vec<SmartLogRow>, String> {
    let filename = filename_for(&file)?;
    let path = log_dir()?.join(filename);
    if !path.exists() {
        return Ok(Vec::new());
    }

    let file = File::open(&path).map_err(|e| format!("LOG_OPEN: {e}"))?;
    let reader = BufReader::new(file);
    let safe_limit = limit.max(1).min(MAX_READ_LIMIT);
    let mut rows: Vec<SmartLogRow> = Vec::with_capacity(safe_limit);

    for line in reader.lines() {
        let line = line.map_err(|e| format!("LOG_READ: {e}"))?;
        if line.trim().is_empty() {
            continue;
        }
        if let Ok(row) = serde_json::from_str::<SmartLogRow>(&line) {
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
    let filename = filename_for(&file)?;
    let path = log_dir()?.join(filename);
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
    let filename = filename_for(&file)?;
    rotate_file(&log_dir()?.join(filename))
}

fn normalize_row(input: SmartLogInput) -> Result<SmartLogRow, String> {
    if input.v != 1 {
        return Err("LOG_BAD_VERSION".to_string());
    }

    let level = match input.l.as_str() {
        "trace" | "debug" | "info" | "warn" | "error" | "fatal" => input.l,
        _ => return Err("LOG_BAD_LEVEL".to_string()),
    };

    let mode = match input.mode.as_str() {
        "app" | "issue" => input.mode,
        _ => return Err("LOG_BAD_MODE".to_string()),
    };

    let tag = clip_ascii(&input.tag, 3).to_uppercase();
    if tag.len() < 2 {
        return Err("LOG_BAD_TAG".to_string());
    }

    Ok(SmartLogRow {
        v: 1,
        ts: if input.ts.is_empty() { Utc::now().to_rfc3339() } else { clip(&input.ts, 40) },
        t: clip(&input.t, 20),
        l: level,
        mode,
        kind: clip_code(&input.kind, 32),
        tag,
        id: clip_code(&input.id, 80),
        sid: clip_code(&input.sid, 64),
        rid: clip_code(&input.rid, 64),
        span: input.span,
        p: input.p,
        a: clip(&input.a, 64),
        e: clip_code(&input.e, 80),
        m: clip(&input.m, 160),
        c: input.c,
        d: input.d,
    })
}

fn append_jsonl(filename: &str, rotate_bytes: u64, line: &str) -> Result<(), String> {
    let dir = log_dir()?;
    let path = dir.join(filename);
    rotate_if_needed(&path, rotate_bytes)?;
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

fn filename_for(file: &str) -> Result<&'static str, String> {
    match file {
        "app" => Ok(APP_FILE),
        "issue" => Ok(ISSUE_FILE),
        "error" => Ok(ERROR_FILE),
        _ => Err("LOG_BAD_FILE".to_string()),
    }
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

fn clip(value: &str, max: usize) -> String {
    let clean: String = value
        .chars()
        .map(|c| if matches!(c, '\r' | '\n' | '\t') { ' ' } else { c })
        .collect();
    if clean.chars().count() <= max {
        return clean;
    }
    clean.chars().take(max).collect::<String>() + "…"
}

fn clip_ascii(value: &str, max: usize) -> String {
    value.chars().filter(|c| c.is_ascii_alphanumeric()).take(max).collect()
}

fn clip_code(value: &str, max: usize) -> String {
    value
        .chars()
        .filter(|c| c.is_ascii_alphanumeric() || matches!(c, '.' | '_' | '-' | ':'))
        .take(max)
        .collect()
}
