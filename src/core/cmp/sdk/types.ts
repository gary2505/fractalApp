export type ComponentId = string;

export type BridgeCommand =
  | 'core_info'
  | 'log_write'
  | 'log_read_last'
  | 'settings_load'
  | 'settings_apply_intent'
  | 'session_load'
  | 'session_save';

export type ComponentBridgeRequest<T = unknown> = {
  apiVersion: 1;
  traceId: string;
  componentId: ComponentId;
  command: BridgeCommand;
  payload: T;
};

export type ComponentBridgeResponse<T = unknown> = {
  ok: boolean;
  traceId: string;
  data?: T;
  error?: {
    kind: string;
    code: string;
    message: string;
    detail?: string;
  };
};

export type ComponentIntent<T = unknown> = {
  id: string;
  type: string;
  source: 'user' | 'ai' | 'system';
  componentId: string;
  workflowId: string;
  traceId: string;
  payload: T;
};

export type ComponentHealth = {
  ok: boolean;
  startupMs: number;
  loaded: boolean;
  rendered: boolean;
  bridgeConnected: boolean;
  permissionsValid: boolean;
  errors: string[];
};
