# Z-index

Use layers, not random numbers.

Layer idea:
- base
- sticky
- dropdown
- popup
- modal
- toast
- tooltip

Rules:
- z-index comes from shared tokens
- popup creates clear stacking context
- avoid z-index inside feature CSS
- fix parent stacking context before raising number
