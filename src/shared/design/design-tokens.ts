export const uiSpacing = {
  none: '0px',
  micro: '4px',
  xs: '8px',
  sm: '12px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
  xxxl: '64px',
} as const;

export const uiFontSize = {
  xs: '12px',
  sm: '13px',
  md: '14px',
  lg: '16px',
  xl: '20px',
  xxl: '24px',
} as const;

export const uiLineHeight = {
  tight: '1.15',
  normal: '1.45',
  relaxed: '1.6',
} as const;

export const uiFontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export const uiRadius = {
  sm: '6px',
  md: '8px',
  lg: '12px',
  xl: '16px',
} as const;

export const uiBorder = {
  thin: '1px',
} as const;

export const uiZIndex = {
  base: 0,
  dropdown: 100,
  sticky: 200,
  popup: 500,
  modal: 800,
  snackbar: 900,
  tooltip: 1000,
  crash: 2000,
} as const;

export const uiMotion = {
  fastMs: 120,
  normalMs: 160,
  slowMs: 220,
  hardCapMs: 300,
  easeOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
  easeEmphasized: 'cubic-bezier(0.22, 1, 0.36, 1)',
  spring: {
    stiffness: 400,
    damping: 30,
  },
} as const;

export const uiSemanticColor = {
  surface: 'surface',
  surfaceMuted: 'surface-muted',
  text: 'text',
  textMuted: 'text-muted',
  border: 'border',
  primary: 'primary',
  success: 'success',
  warning: 'warning',
  error: 'error',
  info: 'info',
} as const;

export type UiSpacingKey = keyof typeof uiSpacing;
export type UiFontSizeKey = keyof typeof uiFontSize;
export type UiRadiusKey = keyof typeof uiRadius;
export type UiZIndexKey = keyof typeof uiZIndex;
