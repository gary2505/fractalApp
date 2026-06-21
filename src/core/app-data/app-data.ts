import { bridgeInvoke } from '../bridge/bridge';

export type AppDataStatus = {
  root: string;
  logsDir: string;
  settingsFile: string;
  sessionFile: string;
  manifestFile: string;
  componentRoot: string;
  rootExists: boolean;
  activeExists: boolean;
};

export function readAppDataStatus(): Promise<AppDataStatus> {
  return bridgeInvoke<AppDataStatus>('app_data_status');
}
