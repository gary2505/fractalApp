export type CommandName =
  | 'core.info'
  | 'log.write'
  | 'log.readLast'
  | 'sess.load'
  | 'sess.save'
  | 'set.load'
  | 'set.save'
  | 'health.check'
  | 'recovery.repair'
  | 'recovery.resetManifest';

export type CommandRequest = {
  apiVersion: 1;
  traceId: string;
  componentId: string;
  command: CommandName;
  payload: unknown;
};

export type CommandResult<T> = {
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
