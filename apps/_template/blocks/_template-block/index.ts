export const templateBlock = {
  id: '_template._template-block',
  name: 'Template Block',
  version: '0.1.0'
} as const;

export type TemplateBlock = typeof templateBlock;

export function getTemplateBlockStatus(): 'ready' {
  return 'ready';
}
