import { bridgeInvoke } from '../bridge/bridge';

export type ComponentFile = {
  id: string;
  version: string;
  html: string;
};

export function readComponent(componentId: string): Promise<ComponentFile> {
  return bridgeInvoke<ComponentFile>('component_read', { componentId });
}
