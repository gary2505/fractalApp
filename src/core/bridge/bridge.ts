import { invoke } from '@tauri-apps/api/core';
import { checkPolicy } from '../policy/policy';
import { toError } from '../../shared/err/error';

export type BridgeCommand =
  | 'init_app'
  | 'core_info'
  | 'app_data_status'
  | 'settings_load'
  | 'settings_save'
  | 'settings_apply_intent'
  | 'session_load'
  | 'session_save'
  | 'log_write'
  | 'log_read_last'
  | 'smart_log_write'
  | 'smart_log_read_last'
  | 'smart_log_clear'
  | 'smart_log_dir'
  | 'smart_log_run_event'
  | 'manifest_load_active'
  | 'component_read'
  | 'update_prepare_local'
  | 'update_verify_candidate'
  | 'update_switch_verified'
  | 'rollback_restore_prev'
  | 'health_check'
  | 'recovery_repair'
  | 'recovery_reset_manifest';

export type BridgeMeta = {
  componentId?: string;
  traceId?: string;
};

export async function bridgeInvoke<T>(
  command: BridgeCommand,
  payload: Record<string, unknown> = {},
  meta: BridgeMeta = {}
): Promise<T> {
  const allowed = checkPolicy(command, meta.componentId ?? 'core');
  if (!allowed.ok) throw new Error(allowed.reason);
  try {
    return await invoke<T>(command, payload);
  } catch (error) {
    throw toError(error);
  }
}
