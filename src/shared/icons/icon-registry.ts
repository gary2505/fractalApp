export const uiIconPaths = {
  save: 'M5 3h12l2 2v16H5V3Zm3 2v6h8V5H8Zm0 14h8v-5H8v5Z',
  close: 'M6.4 5 5 6.4 10.6 12 5 17.6 6.4 19 12 13.4 17.6 19 19 17.6 13.4 12 19 6.4 17.6 5 12 10.6 6.4 5Z',
  settings: 'M19.4 13.5a7.8 7.8 0 0 0 .1-1.5 7.8 7.8 0 0 0-.1-1.5l2-1.5-2-3.5-2.4 1a8 8 0 0 0-2.6-1.5L14 2h-4l-.4 3a8 8 0 0 0-2.6 1.5l-2.4-1-2 3.5 2 1.5a7.8 7.8 0 0 0-.1 1.5c0 .5 0 1 .1 1.5l-2 1.5 2 3.5 2.4-1a8 8 0 0 0 2.6 1.5l.4 3h4l.4-3a8 8 0 0 0 2.6-1.5l2.4 1 2-3.5-2-1.5ZM12 15.5A3.5 3.5 0 1 1 12 8a3.5 3.5 0 0 1 0 7.5Z',
  folder: 'M3 6h7l2 2h9v10.5A2.5 2.5 0 0 1 18.5 21h-13A2.5 2.5 0 0 1 3 18.5V6Z',
  file: 'M6 2h8l4 4v16H6V2Zm7 1.5V7h3.5L13 3.5Z',
  warning: 'M12 3 2 21h20L12 3Zm1 14h-2v2h2v-2Zm0-7h-2v6h2v-6Z',
  error: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 15h-2v-2h2v2Zm0-4h-2V7h2v6Z',
  rollback: 'M8 7h7.5A5.5 5.5 0 1 1 10 12.5h2A3.5 3.5 0 1 0 15.5 9H8v4L3 8l5-5v4Z',
  health: 'M12 21s-7-4.4-9.2-9.8C.8 6.3 4.1 2.5 8.4 4.1A6.5 6.5 0 0 1 12 7a6.5 6.5 0 0 1 3.6-2.9c4.3-1.6 7.6 2.2 5.6 7.1C19 16.6 12 21 12 21Z',
  theme: 'M12 2a10 10 0 1 0 10 10c0-.6-.1-1.2-.2-1.8A7 7 0 0 1 12 2Z',
  language: 'M4 5h9v2H9.8a14 14 0 0 1-1.7 4 12 12 0 0 0 2.6 2.2l-1 1.7A14 14 0 0 1 7 12.6a13.8 13.8 0 0 1-3.2 3.1l-1-1.7A12 12 0 0 0 5.8 11 12 12 0 0 1 4.4 8h2a8.6 8.6 0 0 0 .7 1.5A10 10 0 0 0 7.7 7H4V5Zm11 4h2l4 10h-2.1l-.8-2h-4.2l-.8 2H11l4-10Zm-.3 6h2.6L16 11.6 14.7 15Z',
} as const;

export type UiIconName = keyof typeof uiIconPaths;

export function getUiIconPath(name: UiIconName): string {
  return uiIconPaths[name];
}

export function isUiIconName(value: string): value is UiIconName {
  return value in uiIconPaths;
}
