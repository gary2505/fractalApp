<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';

  type Props = Omit<HTMLButtonAttributes, 'children'> & {
    label: string;
    danger?: boolean;
    children?: Snippet;
  };

  let {
    id,
    label,
    title = label,
    danger = false,
    disabled = false,
    class: className = '',
    children,
    ...restProps
  }: Props = $props();
</script>

<button
  {...restProps}
  {id}
  type="button"
  class="btn btn-ghost btn-sm btn-square h-8 min-h-8 w-8 rounded-md border border-transparent text-base-content/80 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary {danger
    ? 'hover:border-error/20 hover:bg-error/10 hover:text-error'
    : 'hover:border-base-300 hover:bg-base-200 hover:text-base-content'} {className}"
  aria-label={label}
  {title}
  {disabled}
>
  {@render children?.()}
</button>
