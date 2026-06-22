# List UI

Rules:
- virtualize large lists
- keep header separate from scroll body
- stable row height when possible
- selected row is visible
- keyboard navigation works
- empty/loading/error states are explicit

Do not:
- render 10k DOM rows
- mix selection state with hover state
