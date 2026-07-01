import type { BridgeCommand } from '../bridge/bridge';

const CORE_COMMANDS: ReadonlySet<BridgeCommand> = new Set([
  'init_app',
  'core_info',
  'app_data_status',
  'settings_load',
  'settings_save',
  'settings_apply_intent',
  'session_load',
  'session_save',
  'log_write',
  'log_read_last',
  'smart_log_write',
  'smart_log_read_last',
  'smart_log_clear',
  'smart_log_dir',
  'smart_log_rotate',
  'smart_log_run_event',
  'smart_log_error',
  'llog_write',
  'manifest_load_active',
  'component_read',
  'update_prepare_local',
  'update_verify_candidate',
  'update_switch_verified',
  'rollback_restore_prev',
  'health_check',
  'recovery_repair',
  'recovery_reset_manifest'
]);

const COMPONENT_COMMANDS: ReadonlySet<BridgeCommand> = new Set([
  'log_write',
  'log_read_last',
  'session_load',
  'session_save',
  'settings_load',
  'settings_save'
]);

export type PolicyResult = { ok: true } | { ok: false; reason: string };

export function checkPolicy(command: BridgeCommand, componentId: string): PolicyResult {
  if (componentId === 'core') {
    return CORE_COMMANDS.has(command) ? { ok: true } : block(command, componentId);
  }
  if (componentId === 'settings' && command === 'settings_apply_intent') return { ok: true };
  return COMPONENT_COMMANDS.has(command) ? { ok: true } : block(command, componentId);
}

function block(command: BridgeCommand, componentId: string): PolicyResult {
  return { ok: false, reason: `Policy blocked ${command} for ${componentId}` };
}
