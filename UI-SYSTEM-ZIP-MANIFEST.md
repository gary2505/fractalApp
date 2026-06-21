# UI System ZIP Manifest

Purpose: add `block-ui-system` foundation files after `v1-base`.

This ZIP contains only new files. It does not modify existing files, package scripts, Core, manifests, or Fractal Apps.

Copy/extract into the project root, then run:

```txt
pnpm check
pnpm gate
```

Included layers:

```txt
docs/                         UI rules and AI-agent rules
src/shared/design/            design tokens and motion rules
src/shared/icons/             semantic icon registry
src/shared/messages/          EN/RU message registry
src/shared/hotkeys/           hotkey registry and conflict checks
src/shared/input/             adaptive click intent service
src/shared/ui/                first shared UI atoms/overlays
.ai/gates/                    standalone UI-system gate script
```

No existing files are required to be changed by this ZIP.
