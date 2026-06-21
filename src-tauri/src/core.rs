use chrono::Utc;
use serde::{Deserialize, Serialize};
use serde_json::{json, Map, Value};
use sha2::{Digest, Sha256};
use std::fs::{self, OpenOptions};
use std::io::Write;
use std::path::{Path, PathBuf};

const APP_NAME: &str = "fractalApp";
const APP_VERSION: &str = env!("CARGO_PKG_VERSION");
const WELCOME_HTML: &str = include_str!("../../cmp/welcome/1.0.0/index.html");
const WELCOME_HTML_101: &str = include_str!("../../cmp/welcome/1.0.1/index.html");
const EXPLORER_HTML: &str = include_str!("../../cmp/explorer/1.0.0/index.html");
const EDITOR_HTML: &str = include_str!("../../cmp/editor/1.0.0/index.html");
const CHAT_HTML: &str = include_str!("../../cmp/chat/1.0.0/index.html");
const TERMINAL_HTML: &str = include_str!("../../cmp/terminal/1.0.0/index.html");
const SETTINGS_HTML: &str = include_str!("../../cmp/settings/1.0.0/index.html");
const SETTINGS_HTML_101: &str = include_str!("../../cmp/settings/1.0.1/index.html");

const LOG_IDS: &[&str] = &[
  "core.boot.ok",
  "core.boot.err",
  "state.next",
  "mf.load.ok",
  "mf.load.err",
  "mf.validate.ok",
  "mf.validate.err",
  "bridge.cmd.ok",
  "bridge.cmd.err",
  "policy.allow",
  "policy.block",
  "cmp.load.ok",
  "cmp.load.err",
  "bind.intent.recv",
  "bind.intent.block",
  "bind.flow.ok",
  "bind.flow.err",
  "bind.patch.ok",
  "bind.render.ok",
  "bind.audit.ok",
  "rl.sess.load.ok",
  "rl.sess.save.ok",
  "rl.path.restore.ok",
  "update.prepare.ok",
  "update.hash.ok",
  "update.hash.err",
  "update.signature.ok",
  "update.signature.err",
  "update.health.ok",
  "update.health.err",
  "update.switch.ok",
  "rollback.ok",
  "rollback.err",
  "ai.patch.plan",
  "ai.patch.diff",
  "ai.patch.apply.ok",
  "ai.patch.apply.err",
  "ai.patch.gate.ok",
  "ai.patch.gate.err",
  "appdata.status.ok",
  "health.check.ok",
  "health.check.err",
  "recovery.repair.ok",
  "recovery.repair.err",
  "recovery.reset.ok",
  "recovery.reset.err",
];

#[derive(Clone, Copy)]
struct ComponentSeed {
  id: &'static str,
  version: &'static str,
  html: &'static str,
}

#[derive(Debug, Serialize)]
struct AppError {
  kind: String,
  code: String,
  message: String,
  detail: Option<String>,
}

impl AppError {
  fn storage(code: &str, message: &str, detail: impl ToString) -> Self {
    Self { kind: "StorageError".into(), code: code.into(), message: message.into(), detail: Some(detail.to_string()) }
  }

  fn manifest(code: &str, message: &str, detail: impl ToString) -> Self {
    Self { kind: "ManifestError".into(), code: code.into(), message: message.into(), detail: Some(detail.to_string()) }
  }
}

type AppResult<T> = Result<T, AppError>;

#[derive(Debug, Serialize)]
struct CoreInfo {
  app_name: String,
  version: String,
  app_data_dir: String,
  platform: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct AppDataStatus {
  root: String,
  logs_dir: String,
  settings_file: String,
  session_file: String,
  manifest_file: String,
  component_root: String,
  root_exists: bool,
  active_exists: bool,
}

#[derive(Debug, Serialize, Deserialize)]
struct Settings {
  theme: String,
  lang: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct Session {
  #[serde(rename = "lastPath")]
  last_path: Option<String>,
  #[serde(rename = "updatedAt")]
  updated_at: Option<String>,
}

#[derive(Debug, Deserialize)]
struct LogInput {
  id: String,
  level: String,
  #[serde(default, rename = "traceId")]
  trace_id: Option<String>,
  #[serde(default, rename = "workflowId")]
  workflow_id: Option<String>,
  #[serde(default, rename = "componentId")]
  component_id: Option<String>,
  #[serde(default, rename = "sessionId")]
  session_id: Option<String>,
  msg: String,
  #[serde(default)]
  data: Option<Value>,
}

#[derive(Debug, Serialize, Deserialize)]
struct LogRow {
  time: String,
  id: String,
  level: String,
  #[serde(rename = "traceId")]
  trace_id: Option<String>,
  #[serde(rename = "workflowId")]
  workflow_id: Option<String>,
  #[serde(rename = "componentId")]
  component_id: Option<String>,
  #[serde(rename = "sessionId")]
  session_id: Option<String>,
  msg: String,
  data: Option<Value>,
}

#[derive(Debug, Serialize)]
struct ComponentFile {
  id: String,
  version: String,
  html: String,
}

#[derive(Debug, Serialize)]
struct HealthItem {
  id: String,
  label: String,
  level: String,
  message: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct HealthReport {
  ok: bool,
  checked_at: String,
  root: String,
  items: Vec<HealthItem>,
}

#[derive(Debug, Serialize)]
struct UpdateStep {
  ok: bool,
  message: String,
  #[serde(rename = "activeVersion")]
  active_version: Option<String>,
  #[serde(rename = "candidateVersion")]
  candidate_version: Option<String>,
}

#[derive(Debug, Deserialize)]
struct BindingIntent {
  id: String,
  #[serde(rename = "type")]
  intent_type: String,
  source: String,
  #[serde(rename = "componentId")]
  component_id: String,
  #[serde(rename = "workflowId")]
  workflow_id: String,
  #[serde(rename = "traceId")]
  trace_id: String,
  payload: Value,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct StatePatch {
  id: String,
  #[serde(rename = "type")]
  patch_type: String,
  workflow_id: String,
  trace_id: String,
  before_hash: String,
  after_hash: String,
  changes: Value,
}

#[derive(Debug, Serialize)]
struct SettingsApplyResult {
  settings: Settings,
  patch: StatePatch,
}

pub fn run() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
      init_app,
      core_info,
      app_data_status,
      settings_load,
      settings_save,
      settings_apply_intent,
      session_load,
      session_save,
      log_write,
      log_read_last,
      manifest_load_active,
      component_read,
      update_prepare_local,
      update_verify_candidate,
      update_switch_verified,
      rollback_restore_prev,
      health_check,
      recovery_repair,
      recovery_reset_manifest
    ])
    .run(tauri::generate_context!())
    .expect("failed to run fractalApp");
}

#[tauri::command]
fn init_app() -> AppResult<CoreInfo> {
  ensure_app_data()?;
  seed_components()?;
  seed_manifest()?;
  write_known_log("core.boot.ok", "info", "app data initialized")?;
  core_info()
}

#[tauri::command]
fn core_info() -> AppResult<CoreInfo> {
  let dir = app_data_dir()?;
  Ok(CoreInfo {
    app_name: APP_NAME.into(),
    version: APP_VERSION.into(),
    app_data_dir: dir.to_string_lossy().to_string(),
    platform: std::env::consts::OS.into(),
  })
}

#[tauri::command]
fn app_data_status() -> AppResult<AppDataStatus> {
  let root = app_data_dir()?;
  let status = AppDataStatus {
    root: root.to_string_lossy().to_string(),
    logs_dir: root.join("logs").to_string_lossy().to_string(),
    settings_file: root.join("set/settings.json").to_string_lossy().to_string(),
    session_file: root.join("sess/session.json").to_string_lossy().to_string(),
    manifest_file: root.join("mf/active.json").to_string_lossy().to_string(),
    component_root: root.join("cmp").to_string_lossy().to_string(),
    root_exists: root.exists(),
    active_exists: root.join("mf/active.json").exists(),
  };
  write_known_log("appdata.status.ok", "debug", "app data status read")?;
  Ok(status)
}


#[tauri::command]
fn health_check() -> AppResult<HealthReport> {
  let report = build_health_report()?;
  let log_id = if report.ok { "health.check.ok" } else { "health.check.err" };
  write_known_log(log_id, if report.ok { "info" } else { "warn" }, "health check completed")?;
  Ok(report)
}

#[tauri::command]
fn recovery_repair() -> AppResult<HealthReport> {
  ensure_app_data()?;
  seed_components()?;
  seed_manifest()?;
  let settings_path = app_data_dir()?.join("set/settings.json");
  if !settings_path.exists() {
    atomic_write_json(&settings_path, &default_settings())?;
  }
  let session_path = app_data_dir()?.join("sess/session.json");
  if !session_path.exists() {
    atomic_write_json(&session_path, &default_session())?;
  }
  let log_path = app_data_dir()?.join("logs/app.jsonl");
  if !log_path.exists() {
    write_text(&log_path, "")?;
  }
  write_known_log("recovery.repair.ok", "warn", "app-data repair completed")?;
  build_health_report()
}

#[tauri::command]
fn recovery_reset_manifest() -> AppResult<HealthReport> {
  ensure_app_data()?;
  seed_components()?;
  let root = app_data_dir()?;
  atomic_write_json(&root.join("mf/active.json"), &manifest_from_seeds(active_component_seeds())?)?;
  atomic_write_json(&root.join("mf/prev.json"), &empty_manifest())?;
  atomic_write_json(&root.join("mf/candidate.json"), &empty_manifest())?;
  atomic_write_json(&root.join("mf/verified.json"), &empty_manifest())?;
  write_known_log("recovery.reset.ok", "warn", "manifest reset completed")?;
  build_health_report()
}

#[tauri::command]
fn settings_load() -> AppResult<Settings> {
  let path = app_data_dir()?.join("set/settings.json");
  if !path.exists() {
    let settings = default_settings();
    atomic_write_json(&path, &settings)?;
    return Ok(settings);
  }
  match read_json(&path) {
    Ok(settings) => Ok(settings),
    Err(_) => Ok(default_settings()),
  }
}

#[tauri::command]
fn settings_save(settings: Settings) -> AppResult<()> {
  validate_settings(&settings)?;
  let path = app_data_dir()?.join("set/settings.json");
  atomic_write_json(&path, &settings)
}

#[tauri::command]
fn settings_apply_intent(intent: BindingIntent) -> AppResult<SettingsApplyResult> {
  if intent.intent_type != "settings.apply" || intent.component_id != "settings" {
    write_binding_log("bind.intent.block", &intent, "settings intent blocked")?;
    return Err(AppError::manifest("BAD_INTENT", "invalid settings intent", &intent.intent_type));
  }
  write_binding_log("bind.intent.recv", &intent, "settings intent received")?;
  let before = settings_load()?;
  let settings = Settings {
    theme: json_str(&intent.payload, "theme", &before.theme),
    lang: json_str(&intent.payload, "lang", &before.lang),
  };
  validate_settings(&settings)?;
  atomic_write_json(&app_data_dir()?.join("set/settings.json"), &settings)?;
  write_binding_log("bind.flow.ok", &intent, "settings flow ok")?;
  let patch = make_settings_patch(&intent, &before, &settings)?;
  write_binding_log("bind.patch.ok", &intent, "settings patch ok")?;
  write_binding_log("bind.audit.ok", &intent, "settings audit ok")?;
  Ok(SettingsApplyResult { settings, patch })
}

#[tauri::command]
fn session_load() -> AppResult<Session> {
  let path = app_data_dir()?.join("sess/session.json");
  if !path.exists() {
    let session = default_session();
    atomic_write_json(&path, &session)?;
    return Ok(session);
  }
  match read_json(&path) {
    Ok(session) => Ok(session),
    Err(_) => Ok(default_session()),
  }
}

#[tauri::command]
fn session_save(session: Session) -> AppResult<()> {
  let path = app_data_dir()?.join("sess/session.json");
  atomic_write_json(&path, &session)
}

#[tauri::command]
fn log_write(input: LogInput) -> AppResult<()> {
  if !LOG_IDS.contains(&input.id.as_str()) {
    return Err(AppError::manifest("LOG_ID_UNKNOWN", "unknown log id", input.id));
  }
  let row = LogRow {
    time: Utc::now().to_rfc3339(),
    id: input.id,
    level: input.level,
    trace_id: input.trace_id,
    workflow_id: input.workflow_id,
    component_id: input.component_id,
    session_id: input.session_id,
    msg: input.msg,
    data: input.data,
  };
  let path = app_data_dir()?.join("logs/app.jsonl");
  if let Some(parent) = path.parent() {
    fs::create_dir_all(parent).map_err(|e| AppError::storage("LOG_DIR", "cannot create log dir", e))?;
  }
  let mut file = OpenOptions::new()
    .create(true)
    .append(true)
    .open(path)
    .map_err(|e| AppError::storage("LOG_OPEN", "cannot open log file", e))?;
  let line = serde_json::to_string(&row)
    .map_err(|e| AppError::storage("LOG_SERIALIZE", "cannot serialize log row", e))?;
  writeln!(file, "{line}").map_err(|e| AppError::storage("LOG_WRITE", "cannot write log", e))?;
  Ok(())
}

#[tauri::command]
fn log_read_last(limit: usize) -> AppResult<Vec<LogRow>> {
  let path = app_data_dir()?.join("logs/app.jsonl");
  if !path.exists() {
    return Ok(Vec::new());
  }
  let content = fs::read_to_string(path)
    .map_err(|e| AppError::storage("LOG_READ", "cannot read logs", e))?;
  let mut rows: Vec<LogRow> = content
    .lines()
    .rev()
    .take(limit.min(200))
    .filter_map(|line| serde_json::from_str::<LogRow>(line).ok())
    .collect();
  rows.reverse();
  Ok(rows)
}

#[tauri::command]
fn manifest_load_active() -> AppResult<Value> {
  let path = app_data_dir()?.join("mf/active.json");
  read_json(&path)
}

#[tauri::command]
fn component_read(component_id: String) -> AppResult<ComponentFile> {
  let manifest: Value = manifest_load_active()?;
  let component = manifest
    .get("components")
    .and_then(|value| value.get(&component_id))
    .ok_or_else(|| AppError::manifest("CMP_NOT_FOUND", "component not found", &component_id))?;
  let version = component.get("version").and_then(Value::as_str).unwrap_or("unknown");
  let rel_path = component.get("path").and_then(Value::as_str).unwrap_or_default();
  let entry = component.get("entry").and_then(Value::as_str).unwrap_or("index.html");
  let expected_hash = component.get("hash").and_then(Value::as_str).unwrap_or_default();
  let file_path = app_data_dir()?.join(rel_path).join(entry);
  let html = fs::read_to_string(&file_path)
    .map_err(|e| AppError::storage("CMP_READ", "cannot read component", e))?;
  let actual_hash = sha256_hex(html.as_bytes());
  if actual_hash != expected_hash {
    return Err(AppError::manifest("CMP_HASH", "component hash mismatch", actual_hash));
  }
  Ok(ComponentFile { id: component_id, version: version.into(), html })
}

#[tauri::command]
fn update_prepare_local() -> AppResult<UpdateStep> {
  ensure_app_data()?;
  seed_candidate_component()?;
  seed_candidate_manifest()?;
  write_known_log("update.prepare.ok", "info", "local candidate prepared")?;
  Ok(UpdateStep {
    ok: true,
    message: "candidate welcome 1.0.1 prepared".into(),
    active_version: active_version().ok(),
    candidate_version: Some("1.0.1".into()),
  })
}

#[tauri::command]
fn update_verify_candidate() -> AppResult<UpdateStep> {
  let root = app_data_dir()?;
  let candidate_path = root.join("mf/candidate.json");
  let manifest: Value = read_json(&candidate_path)?;
  verify_manifest_component(&manifest, "welcome", true)?;
  atomic_write_json(&root.join("mf/verified.json"), &manifest)?;
  write_known_log("update.hash.ok", "info", "candidate hash verified")?;
  write_known_log("update.signature.ok", "info", "local signature accepted")?;
  write_known_log("update.health.ok", "info", "candidate health verified")?;
  Ok(UpdateStep {
    ok: true,
    message: "candidate verified and written to verified.json".into(),
    active_version: active_version().ok(),
    candidate_version: manifest_version(&manifest, "welcome"),
  })
}

#[tauri::command]
fn update_switch_verified() -> AppResult<UpdateStep> {
  let root = app_data_dir()?;
  let active_path = root.join("mf/active.json");
  let prev_path = root.join("mf/prev.json");
  let verified_path = root.join("mf/verified.json");
  let active: Value = read_json(&active_path)?;
  let verified: Value = read_json(&verified_path)?;
  if manifest_version(&verified, "welcome").is_none() {
    return Err(AppError::manifest(
      "NO_VERIFIED",
      "no verified candidate; run Prepare and Verify first",
      "mf/verified.json",
    ));
  }
  verify_manifest_component(&verified, "welcome", true)?;
  atomic_write_json(&prev_path, &active)?;
  atomic_write_json(&active_path, &verified)?;
  atomic_write_json(&verified_path, &empty_manifest())?;
  write_known_log("update.switch.ok", "info", "verified manifest switched to active")?;
  Ok(UpdateStep {
    ok: true,
    message: "active manifest switched to verified candidate".into(),
    active_version: manifest_version(&verified, "welcome"),
    candidate_version: None,
  })
}

#[tauri::command]
fn rollback_restore_prev() -> AppResult<UpdateStep> {
  let root = app_data_dir()?;
  let prev_path = root.join("mf/prev.json");
  let active_path = root.join("mf/active.json");
  let candidate_path = root.join("mf/candidate.json");
  let verified_path = root.join("mf/verified.json");
  let prev: Value = read_json(&prev_path)?;
  if manifest_version(&prev, "welcome").is_none() {
    return Err(AppError::manifest("NO_PREV", "no previous active manifest", "mf/prev.json"));
  }
  verify_manifest_component(&prev, "welcome", false)?;
  atomic_write_json(&active_path, &prev)?;
  atomic_write_json(&candidate_path, &empty_manifest())?;
  atomic_write_json(&verified_path, &empty_manifest())?;
  write_known_log("rollback.ok", "warn", "previous manifest restored")?;
  Ok(UpdateStep {
    ok: true,
    message: "previous active manifest restored and pending candidate cleared".into(),
    active_version: manifest_version(&prev, "welcome"),
    candidate_version: None,
  })
}


fn build_health_report() -> AppResult<HealthReport> {
  let root = app_data_dir()?;
  let mut items = Vec::new();
  check_path(&mut items, &root, "root", "app-data root", true);
  for rel in ["logs", "set", "sess", "mf", "cmp"] {
    check_path(&mut items, &root.join(rel), rel, rel, true);
  }
  check_json_file(&mut items, &root.join("set/settings.json"), "settings", "settings.json");
  check_json_file(&mut items, &root.join("sess/session.json"), "session", "session.json");
  for name in ["active", "prev", "candidate", "verified"] {
    check_json_file(&mut items, &root.join(format!("mf/{name}.json")), name, &format!("{name}.json"));
  }
  match read_json::<Value>(&root.join("mf/active.json")) {
    Ok(manifest) => check_active_components(&mut items, &root, &manifest),
    Err(err) => push_item(&mut items, "active.parse", "active manifest", "err", &err.message),
  }
  let ok = items.iter().all(|item| item.level != "err");
  Ok(HealthReport {
    ok,
    checked_at: Utc::now().to_rfc3339(),
    root: root.to_string_lossy().to_string(),
    items,
  })
}

fn check_active_components(items: &mut Vec<HealthItem>, root: &Path, manifest: &Value) {
  let Some(map) = manifest.get("components").and_then(Value::as_object) else {
    push_item(items, "mf.components", "components", "err", "active manifest has no components map");
    return;
  };
  for (id, component) in map {
    let rel_path = component.get("path").and_then(Value::as_str).unwrap_or_default();
    let entry = component.get("entry").and_then(Value::as_str).unwrap_or("index.html");
    let expected_hash = component.get("hash").and_then(Value::as_str).unwrap_or_default();
    let file = root.join(rel_path).join(entry);
    match fs::read(&file) {
      Ok(bytes) => {
        let actual_hash = sha256_hex(&bytes);
        if actual_hash == expected_hash {
          push_item(items, &format!("cmp.{id}"), id, "ok", "component hash ok");
        } else {
          push_item(items, &format!("cmp.{id}"), id, "err", "component hash mismatch");
        }
      }
      Err(_) => push_item(items, &format!("cmp.{id}"), id, "err", "component file missing"),
    }
  }
}

fn check_path(items: &mut Vec<HealthItem>, path: &Path, id: &str, label: &str, must_be_dir: bool) {
  let ok = if must_be_dir { path.is_dir() } else { path.exists() };
  if ok {
    push_item(items, id, label, "ok", "exists");
  } else {
    push_item(items, id, label, "err", "missing");
  }
}

fn check_json_file(items: &mut Vec<HealthItem>, path: &Path, id: &str, label: &str) {
  match fs::read_to_string(path) {
    Ok(text) => match serde_json::from_str::<Value>(&text) {
      Ok(_) => push_item(items, id, label, "ok", "valid json"),
      Err(_) => push_item(items, id, label, "err", "invalid json"),
    },
    Err(_) => push_item(items, id, label, "err", "missing"),
  }
}

fn push_item(items: &mut Vec<HealthItem>, id: &str, label: &str, level: &str, message: &str) {
  items.push(HealthItem {
    id: id.into(),
    label: label.into(),
    level: level.into(),
    message: message.into(),
  });
}

fn app_data_dir() -> AppResult<PathBuf> {
  let base = dirs::data_dir()
    .or_else(|| std::env::current_dir().ok())
    .ok_or_else(|| AppError::storage("DATA_DIR", "cannot resolve app data dir", "no data dir"))?;
  Ok(base.join(APP_NAME))
}

fn ensure_app_data() -> AppResult<()> {
  let root = app_data_dir()?;
  for dir in [
    "logs",
    "set",
    "sess",
    "mf",
    "cmp/welcome/1.0.0",
    "cmp/welcome/1.0.1",
    "cmp/explorer/1.0.0",
    "cmp/editor/1.0.0",
    "cmp/chat/1.0.0",
    "cmp/terminal/1.0.0",
    "cmp/settings/1.0.0",
    "cmp/settings/1.0.1",
  ] {
    fs::create_dir_all(root.join(dir))
      .map_err(|e| AppError::storage("DIR_CREATE", "cannot create app data dir", e))?;
  }
  Ok(())
}

fn seed_components() -> AppResult<()> {
  for seed in active_component_seeds() {
    seed_component_file(seed)?;
  }
  Ok(())
}

fn seed_component_file(seed: ComponentSeed) -> AppResult<()> {
  let path = app_data_dir()?.join(component_rel_path(seed.id, seed.version)).join("index.html");
  if !path.exists() {
    write_text(&path, seed.html)?;
  }
  Ok(())
}

fn seed_manifest() -> AppResult<()> {
  let root = app_data_dir()?;
  for name in ["prev.json", "candidate.json", "verified.json"] {
    let path = root.join("mf").join(name);
    if !path.exists() {
      atomic_write_json(&path, &empty_manifest())?;
    }
  }
  let active_path = root.join("mf/active.json");
  if !active_path.exists() {
    atomic_write_json(&active_path, &manifest_from_seeds(active_component_seeds())?)?;
    return Ok(());
  }
  migrate_active_manifest(&active_path)
}

fn migrate_active_manifest(active_path: &Path) -> AppResult<()> {
  let mut manifest: Value = read_json(active_path)?;
  let Some(root_obj) = manifest.as_object_mut() else {
    atomic_write_json(active_path, &manifest_from_seeds(active_component_seeds())?)?;
    return Ok(());
  };
  root_obj.entry("schema").or_insert(json!(1));
  let components = root_obj
    .entry("components")
    .or_insert_with(|| Value::Object(Map::new()));
  let Some(map) = components.as_object_mut() else {
    *components = Value::Object(Map::new());
    let Some(map) = components.as_object_mut() else { return Ok(()); };
    for seed in active_component_seeds() {
      map.insert(seed.id.into(), manifest_component(seed)?);
    }
    atomic_write_json(active_path, &manifest)?;
    return Ok(());
  };
  let mut changed = false;
  for seed in active_component_seeds() {
    let current_version = map
      .get(seed.id)
      .and_then(|value| value.get("version"))
      .and_then(Value::as_str);
    if !map.contains_key(seed.id) || should_upgrade_seed(seed.id, current_version, seed.version) {
      map.insert(seed.id.into(), manifest_component(seed)?);
      changed = true;
    }
  }
  if changed {
    atomic_write_json(active_path, &manifest)?;
  }
  Ok(())
}

fn seed_candidate_component() -> AppResult<()> {
  let path = app_data_dir()?.join("cmp/welcome/1.0.1/index.html");
  write_text(&path, WELCOME_HTML_101)
}

fn seed_candidate_manifest() -> AppResult<()> {
  let root = app_data_dir()?;
  let mut active: Value = read_json(&root.join("mf/active.json"))?;
  let candidate = ComponentSeed { id: "welcome", version: "1.0.1", html: WELCOME_HTML_101 };
  let Some(map) = active.get_mut("components").and_then(Value::as_object_mut) else {
    return Err(AppError::manifest("BAD_MANIFEST", "active manifest has no components", "active.json"));
  };
  map.insert("welcome".into(), manifest_component(candidate)?);
  atomic_write_json(&root.join("mf/candidate.json"), &active)
}

fn manifest_from_seeds(seeds: Vec<ComponentSeed>) -> AppResult<Value> {
  let mut map = Map::new();
  for seed in seeds {
    map.insert(seed.id.into(), manifest_component(seed)?);
  }
  Ok(json!({ "schema": 1, "components": map }))
}

fn manifest_component(seed: ComponentSeed) -> AppResult<Value> {
  let path = component_rel_path(seed.id, seed.version);
  let file = app_data_dir()?.join(&path).join("index.html");
  let bytes = fs::read(&file).map_err(|e| AppError::storage("CMP_HASH_READ", "cannot hash component", e))?;
  Ok(json!({
    "id": seed.id,
    "version": seed.version,
    "apiVersion": 1,
    "minCoreVersion": "0.5.0",
    "maxCoreVersion": "0.x",
    "path": path,
    "entry": "index.html",
    "hashAlgo": "sha256",
    "hash": sha256_hex(&bytes),
    "signature": "local-dev-signature",
    "publicKeyId": "local-dev-key",
    "createdAt": Utc::now().to_rfc3339(),
    "capabilities": capabilities_for(seed.id),
    "healthCheck": { "entry": "index.html", "timeoutMs": 3000 }
  }))
}

fn capabilities_for(component_id: &str) -> Value {
  match component_id {
    "settings" => json!([
      { "name": "settings", "commands": ["settings_load", "settings_save", "settings_apply_intent"] },
      { "name": "log", "commands": ["log.write", "log.readLast"] }
    ]),
    _ => json!([
      { "name": "log", "commands": ["log.write", "log.readLast"] }
    ]),
  }
}

fn should_upgrade_seed(id: &str, current: Option<&str>, next: &str) -> bool {
  id == "settings" && current != Some(next)
}

fn active_component_seeds() -> Vec<ComponentSeed> {
  vec![
    ComponentSeed { id: "welcome", version: "1.0.0", html: WELCOME_HTML },
    ComponentSeed { id: "explorer", version: "1.0.0", html: EXPLORER_HTML },
    ComponentSeed { id: "editor", version: "1.0.0", html: EDITOR_HTML },
    ComponentSeed { id: "chat", version: "1.0.0", html: CHAT_HTML },
    ComponentSeed { id: "terminal", version: "1.0.0", html: TERMINAL_HTML },
    ComponentSeed { id: "settings", version: "1.0.1", html: SETTINGS_HTML_101 },
  ]
}

fn component_rel_path(id: &str, version: &str) -> String {
  format!("cmp/{id}/{version}")
}

fn empty_manifest() -> Value {
  json!({ "schema": 1, "components": {} })
}

fn verify_manifest_component(manifest: &Value, component_id: &str, require_signature: bool) -> AppResult<()> {
  let component = manifest
    .get("components")
    .and_then(|value| value.get(component_id))
    .ok_or_else(|| AppError::manifest("CMP_NOT_FOUND", "component not found", component_id))?;
  if component.get("apiVersion").and_then(Value::as_i64) != Some(1) {
    return Err(AppError::manifest("BAD_API", "unsupported component api", component_id));
  }
  let signature = component.get("signature").and_then(Value::as_str).unwrap_or_default();
  if require_signature && signature.is_empty() {
    write_known_log("update.signature.err", "error", "candidate signature missing")?;
    return Err(AppError::manifest("BAD_SIGNATURE", "missing signature", component_id));
  }
  let rel_path = component.get("path").and_then(Value::as_str).unwrap_or_default();
  let entry = component.get("entry").and_then(Value::as_str).unwrap_or("index.html");
  let expected_hash = component.get("hash").and_then(Value::as_str).unwrap_or_default();
  let file_path = app_data_dir()?.join(rel_path).join(entry);
  let html = fs::read_to_string(&file_path)
    .map_err(|e| AppError::storage("CMP_READ", "cannot read component", e))?;
  let actual_hash = sha256_hex(html.as_bytes());
  if actual_hash != expected_hash {
    write_known_log("update.hash.err", "error", "candidate hash mismatch")?;
    return Err(AppError::manifest("CMP_HASH", "component hash mismatch", actual_hash));
  }
  if !html.contains("health.ready") {
    write_known_log("update.health.err", "error", "candidate health marker missing")?;
    return Err(AppError::manifest("BAD_HEALTH", "health marker missing", component_id));
  }
  Ok(())
}

fn manifest_version(manifest: &Value, component_id: &str) -> Option<String> {
  manifest
    .get("components")
    .and_then(|value| value.get(component_id))
    .and_then(|value| value.get("version"))
    .and_then(Value::as_str)
    .map(str::to_string)
}

fn active_version() -> AppResult<String> {
  let active: Value = manifest_load_active()?;
  manifest_version(&active, "welcome")
    .ok_or_else(|| AppError::manifest("NO_ACTIVE", "active component missing", "welcome"))
}

fn write_known_log(id: &str, level: &str, msg: &str) -> AppResult<()> {
  log_write(LogInput {
    id: id.into(),
    level: level.into(),
    trace_id: None,
    workflow_id: None,
    component_id: Some("core".into()),
    session_id: None,
    msg: msg.into(),
    data: None,
  })
}

fn json_str(value: &Value, key: &str, fallback: &str) -> String {
  value.get(key).and_then(Value::as_str).unwrap_or(fallback).to_string()
}

fn make_settings_patch(intent: &BindingIntent, before: &Settings, after: &Settings) -> AppResult<StatePatch> {
  let before_json = serde_json::to_value(before)
    .map_err(|e| AppError::storage("PATCH_BEFORE", "cannot hash before settings", e))?;
  let after_json = serde_json::to_value(after)
    .map_err(|e| AppError::storage("PATCH_AFTER", "cannot hash after settings", e))?;
  Ok(StatePatch {
    id: format!("PATCH-{}", intent.id),
    patch_type: "settings.patch".into(),
    workflow_id: intent.workflow_id.clone(),
    trace_id: intent.trace_id.clone(),
    before_hash: sha256_hex(before_json.to_string().as_bytes()),
    after_hash: sha256_hex(after_json.to_string().as_bytes()),
    changes: after_json,
  })
}

fn write_binding_log(id: &str, intent: &BindingIntent, msg: &str) -> AppResult<()> {
  log_write(LogInput {
    id: id.into(),
    level: "info".into(),
    trace_id: Some(intent.trace_id.clone()),
    workflow_id: Some(intent.workflow_id.clone()),
    component_id: Some(intent.component_id.clone()),
    session_id: None,
    msg: msg.into(),
    data: Some(json!({ "source": intent.source, "intent": intent.intent_type })),
  })
}

fn default_settings() -> Settings {
  Settings { theme: "system".into(), lang: "en".into() }
}

fn default_session() -> Session {
  Session { last_path: None, updated_at: None }
}

fn validate_settings(settings: &Settings) -> AppResult<()> {
  let themes = ["light", "dark", "system"];
  let langs = ["en", "es", "zh", "ru", "ja"];
  if !themes.contains(&settings.theme.as_str()) {
    return Err(AppError::manifest("BAD_THEME", "invalid theme", &settings.theme));
  }
  if !langs.contains(&settings.lang.as_str()) {
    return Err(AppError::manifest("BAD_LANG", "invalid language", &settings.lang));
  }
  Ok(())
}

fn read_json<T: for<'de> Deserialize<'de>>(path: &Path) -> AppResult<T> {
  let text = fs::read_to_string(path)
    .map_err(|e| AppError::storage("JSON_READ", "cannot read json file", e))?;
  serde_json::from_str(&text)
    .map_err(|e| AppError::storage("JSON_PARSE", "cannot parse json file", e))
}

fn atomic_write_json<T: Serialize>(path: &Path, value: &T) -> AppResult<()> {
  let text = serde_json::to_string_pretty(value)
    .map_err(|e| AppError::storage("JSON_SERIALIZE", "cannot serialize json", e))?;
  write_text(path, &text)
}

fn write_text(path: &Path, text: &str) -> AppResult<()> {
  if let Some(parent) = path.parent() {
    fs::create_dir_all(parent).map_err(|e| AppError::storage("DIR_CREATE", "cannot create parent", e))?;
  }
  let tmp = path.with_extension("tmp");
  fs::write(&tmp, text).map_err(|e| AppError::storage("TMP_WRITE", "cannot write tmp", e))?;
  if path.exists() {
    fs::remove_file(path).map_err(|e| AppError::storage("OLD_REMOVE", "cannot replace file", e))?;
  }
  fs::rename(&tmp, path).map_err(|e| AppError::storage("TMP_RENAME", "cannot move tmp", e))?;
  Ok(())
}

fn sha256_hex(bytes: &[u8]) -> String {
  let mut hasher = Sha256::new();
  hasher.update(bytes);
  hex::encode(hasher.finalize())
}
