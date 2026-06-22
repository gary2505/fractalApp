# CSS scrollbar

Bug pattern:
- content grows but parent has no fixed height
- `overflow` is on wrong element
- flex child misses `min-height: 0`

Rules:
- scroll owner must have bounded height
- flex column child that scrolls needs `min-height: 0`
- use `overflow: auto`, not always `scroll`
- avoid nested scrollbars
- keep scrollbar on list body, not full page

Check:
- long list scrolls
- header stays visible if expected
- keyboard/page wheel works
