# Layout overflow

Common fixes:
- flex parent: `min-height: 0`
- horizontal row: `min-width: 0`
- text: `overflow: hidden; text-overflow: ellipsis`
- page shell: avoid `height: 100vh` inside nested app unless intended

Do not:
- add random `!important`
- hide overflow on parent to mask bug
- set fixed pixel height without reason

Check small and large window.
