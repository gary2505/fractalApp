# Fractal block

A block is small and replaceable.

Block must define:
- goal
- allowed files
- forbidden files
- install rule
- rollback rule
- smallest check

Block should not:
- change Core without reason
- mix UI + native + provider logic
- create skeletons without real use
