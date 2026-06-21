import type { Intent } from '../../core/bind/intent';
import type { StatePatch } from '../../core/bind/patch';
import type { SettingsState } from './state';

export function makeSettingsIntent(
  state: SettingsState,
  traceId: string
): Intent<SettingsState> {
  return {
    id: traceId,
    type: 'settings.apply',
    source: 'user',
    componentId: 'settings',
    workflowId: 'settings',
    traceId,
    payload: state
  };
}

export function makeSettingsPatch(
  state: SettingsState,
  traceId: string
): StatePatch<SettingsState> {
  return {
    id: `PATCH-${traceId}`,
    type: 'settings.patch',
    workflowId: 'settings',
    traceId,
    beforeHash: '',
    afterHash: '',
    changes: state
  };
}
