import { validatePath } from './restore';

export function testValidatePath(): boolean {
  return validatePath('/tmp') === '/tmp' && validatePath('\0bad') === null;
}
