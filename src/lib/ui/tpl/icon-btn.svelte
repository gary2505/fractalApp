<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    id?: string;
    label: string;
    title?: string;
    danger?: boolean;
    disabled?: boolean;
    onclick?: (event: MouseEvent) => void;
    children?: Snippet;
  };

  let {
    id,
    label,
    title = label,
    danger = false,
    disabled = false,
    onclick,
    children
  }: Props = $props();
</script>

<button
  {id}
  type="button"
  class="btn btn-ghost btn-sm btn-square min-h-8 h-8 w-8 rounded-md border border-transparent text-base-content/80 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary {danger
    ? 'hover:border-error/20 hover:bg-error/10 hover:text-error'
    : 'hover:border-base-300 hover:bg-base-200 hover:text-base-content'}"
  aria-label={label}
  {title}
  {disabled}
  onclick={onclick}
>
  {@render children?.()}
</button>
