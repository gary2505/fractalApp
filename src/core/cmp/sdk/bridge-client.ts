import type { BridgeCommand, ComponentBridgeRequest, ComponentBridgeResponse } from './types';
import { makeCmpTraceId } from './id';

export type BridgeClient = {
  invoke<T>(command: BridgeCommand, payload?: unknown): Promise<T>;
};

export function createBridgeClient(componentId: string): BridgeClient {
  return {
    invoke<T>(command: BridgeCommand, payload: unknown = {}) {
      const traceId = makeCmpTraceId();
      const request: ComponentBridgeRequest = {
        apiVersion: 1,
        traceId,
        componentId,
        command,
        payload,
      };
      return sendBridgeRequest<T>(request);
    },
  };
}

function sendBridgeRequest<T>(request: ComponentBridgeRequest): Promise<T> {
  return new Promise((resolve, reject) => {
    const onMessage = (event: MessageEvent<ComponentBridgeResponse<T>>) => {
      const response = event.data;
      if (!response || response.traceId !== request.traceId) return;
      window.removeEventListener('message', onMessage);
      if (response.ok) resolve(response.data as T);
      else reject(response.error ?? new Error('bridge request failed'));
    };
    window.addEventListener('message', onMessage);
    window.parent.postMessage({ kind: 'core-bridge', request }, '*');
  });
}
