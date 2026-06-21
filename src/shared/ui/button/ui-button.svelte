<script lang="ts">
  import type { Snippet } from 'svelte';

  type UiButtonVariant = 'neutral' | 'primary' | 'ghost' | 'warning' | 'error' | 'success';
  type UiButtonSize = 'sm' | 'md' | 'lg';

  type Props = {
    variant?: UiButtonVariant;
    size?: UiButtonSize;
    type?: 'button' | 'submit' | 'reset';
    loading?: boolean;
    disabled?: boolean;
    selected?: boolean;
    ariaLabel?: string;
    onclick?: (event: MouseEvent) => void;
    children?: Snippet;
  };

  let {
    variant = 'neutral',
    size = 'md',
    type = 'button',
    loading = false,
    disabled = false,
    selected = false,
    ariaLabel,
    onclick,
    children,
  }: Props = $props();

  const variantClass = $derived({
    neutral: 'btn-neutral',
    primary: 'btn-primary',
    ghost: 'btn-ghost',
    warning: 'btn-warning',
    error: 'btn-error',
    success: 'btn-success',
  }[variant]);

  const sizeClass = $derived({
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg',
  }[size]);

  const className = $derived([
    'btn',
    variantClass,
    sizeClass,
    selected ? 'btn-active' : '',
  ].filter(Boolean).join(' '));
</script>

<button
  {type}
  class={className}
  aria-label={ariaLabel}
  aria-pressed={selected || undefined}
  disabled={disabled || loading}
  onclick={onclick}
>
  {#if loading}
    <span class="loading loading-spinner loading-xs" aria-hidden="true"></span>
  {/if}
  {@render children?.()}
</button>
