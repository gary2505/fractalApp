# Motion Rules

Motion is feedback, not decoration.

## Timing

```txt
Preferred duration: 150ms - 180ms
Hard cap: 300ms
```

Animations must never make the user wait.

## Easing

Use snappy responsive curves.

```txt
standard: cubic-bezier(0.16, 1, 0.3, 1)
emphasized: cubic-bezier(0.22, 1, 0.36, 1)
```

Avoid standard `ease-in` for interface elements because it feels slow at the start.

## Spring guidance

For spring-based UI:

```txt
stiffness: 400
damping: 30
```

## Blacklist

Do not animate:

```txt
keyboard shortcut actions
hotkey-triggered state jumps
critical error display
crash/safe recovery actions
bulk file operations progress state
```

## Tooltips

```txt
First hover can be slightly delayed.
Repeated hovers while tooltip system is warm must open instantly.
```

## Perceptual smoothing

Allowed:

```txt
small opacity crossfade
subtle backdrop blur
short transform under 180ms
```

Not allowed:

```txt
slow sliding panels
bouncy decorative animation
animation that blocks input
```
