import type { BridgeClient } from './bridge-client';
import type { BridgeCommand, ComponentIntent } from './types';
import { makeCmpId, makeCmpTraceId } from './id';

export function createIntent<T>(input: Omit<ComponentIntent<T>, 'id' | 'traceId'>): ComponentIntent<T> {
  return {
    ...input,
    id: makeCmpId(),
    traceId: makeCmpTraceId('INT'),
  };
}

export function sendIntent<T>(bridge: BridgeClient, command: BridgeCommand, intent: ComponentIntent<T>) {
  return bridge.invoke(command, { intent });
}
