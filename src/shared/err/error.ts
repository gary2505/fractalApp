export type ErrorKind =
  | 'CoreError'
  | 'ManifestError'
  | 'BridgeError'
  | 'PolicyError'
  | 'PermissionError'
  | 'ComponentError'
  | 'WorkflowError'
  | 'BindingError'
  | 'UpdateError'
  | 'RollbackError'
  | 'StorageError'
  | 'PatchError'
  | 'HealthError'
  | 'RecoveryError';

export type AppError = {
  kind: ErrorKind;
  code: string;
  message: string;
  detail?: string;
};

export function toError(value: unknown): Error {
  if (value instanceof Error) return value;
  if (typeof value === 'object' && value && 'message' in value) {
    return new Error(String((value as { message: unknown }).message));
  }
  return new Error(String(value));
}
