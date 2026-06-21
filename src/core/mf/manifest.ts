import { bridgeInvoke } from '../bridge/bridge';

export type Capability = {
  name: string;
  commands: string[];
};

export type ComponentManifest = {
  id: string;
  version: string;
  apiVersion: number;
  minCoreVersion: string;
  maxCoreVersion: string;
  path: string;
  entry: string;
  hashAlgo: 'sha256';
  hash: string;
  signature: string | null;
  publicKeyId: string | null;
  createdAt: string;
  capabilities: Capability[];
  healthCheck: {
    entry: string;
    timeoutMs: number;
  };
};

export type AppManifest = {
  schema: 1;
  components: Record<string, ComponentManifest>;
};

export function loadActiveManifest(): Promise<AppManifest> {
  return bridgeInvoke<AppManifest>('manifest_load_active');
}
