# Copilot instructions

Use the shortest working path.

Small fix:
- search exact files first
- read max 1 skill only if needed
- make the smallest patch
- run the smallest check
- stop

Big feature:
- use the matching `plan/*.md`
- read max 1-3 listed skills
- patch in small steps

If lost:
- add a temporary tracer
- inspect actual state
- compare expected vs actual
- patch
- remove temporary tracer before done

Never:
- scan the whole repo by default
- redesign unless asked
- bypass Core-Web boundaries
- add hardcoded UI text
- create long names or repeated folders

Done format:
- Changed
- Checked
- Proof
- Not checked
