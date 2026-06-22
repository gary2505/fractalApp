# Svelte events

Rules:
- event handler is small
- heavy work goes to service/controller
- stop propagation only with reason
- prevent default only with reason
- debounce/throttle in shared helper

For click bugs:
- use shared click controller
- do not hardcode double-click speed per component
