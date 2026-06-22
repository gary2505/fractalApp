# Error handling

Rules:
- return typed result when possible
- log with scope and operation
- user message comes from message registry
- keep developer detail separate from user text

Do not:
- swallow errors
- show raw stack to user
- hardcode warning text in component
- throw for expected user flow
