export type ComponentCapability = {
  name: string;
  commands: string[];
};

export type ComponentHealthCheck = {
  entry: string;
  timeoutMs: number;
};

export type ComponentManifest = {
  id: string;
  version: string;
  apiVersion: 1;
  minCoreVersion: string;
  maxCoreVersion: string;
  path: string;
  entry: string;
  hashAlgo: 'sha256';
  hash: string;
  signature: string;
  publicKeyId: string;
  createdAt: string;
  capabilities: ComponentCapability[];
  healthCheck: ComponentHealthCheck;
};

export type AppManifest = {
  schema: 1;
  components: Record<string, ComponentManifest>;
};

export function isComponentManifest(value: unknown): value is ComponentManifest {
  if (!value || typeof value !== 'object') return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === 'string' &&
    typeof item.version === 'string' &&
    item.apiVersion === 1 &&
    typeof item.path === 'string' &&
    typeof item.entry === 'string' &&
    item.hashAlgo === 'sha256' &&
    typeof item.hash === 'string' &&
    Array.isArray(item.capabilities)
  );
}

export function isAppManifest(value: unknown): value is AppManifest {
  if (!value || typeof value !== 'object') return false;
  const item = value as Record<string, unknown>;
  return item.schema === 1 && typeof item.components === 'object' && item.components !== null;
}
