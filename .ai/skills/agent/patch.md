# Agent patch rules

Use small patches.

Rules:
- One task = one fix.
- Do not redesign.
- Do not add unrelated files.
- Do not rename public APIs unless task requires it.
- Prefer edit over rewrite.
- Keep existing style unless it is broken.
- Stop after patch + smallest check.

Before edit:
- Read router.
- Read only needed skills.
- Inspect exact files.
- Report missing foundation instead of inventing it.

Forbidden:
- whole-repo scan by default
- full code echo in answer
- cargo clean unless user asks
