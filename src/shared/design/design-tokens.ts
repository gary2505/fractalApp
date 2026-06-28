// DaisyUI is the single source of truth for: spacing, font-size, radii,
// font-weight, line-height, borders, colors.
// This file owns ONLY what DaisyUI does NOT cover: z-index layers + motion curves.

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

export type UiZIndexKey = keyof typeof uiZIndex;
