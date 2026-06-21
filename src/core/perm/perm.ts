export type Permission =
  | 'core.info'
  | 'log.write'
  | 'log.readLast'
  | 'sess.load'
  | 'sess.save'
  | 'set.load'
  | 'set.save';

export type Capability = {
  name: string;
  commands: Permission[];
};

export function hasPermission(capabilities: Capability[], permission: Permission): boolean {
  return capabilities.some((capability) => capability.commands.includes(permission));
}
