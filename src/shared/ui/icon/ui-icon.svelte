<script lang="ts">
  import { getUiIconPath, type UiIconName } from '../../icons';

  type UiIconSize = 'sm' | 'md' | 'lg';

  type Props = {
    name: UiIconName;
    size?: UiIconSize | number;
    title?: string;
    decorative?: boolean;
  };

  let { name, size = 'md', title, decorative = true }: Props = $props();

  const sizePx = $derived(typeof size === 'number' ? size : ({ sm: 16, md: 20, lg: 24 }[size]));
  const path = $derived(getUiIconPath(name));
</script>

<svg
  width={sizePx}
  height={sizePx}
  viewBox="0 0 24 24"
  fill="currentColor"
  aria-hidden={decorative ? 'true' : undefined}
  role={decorative ? undefined : 'img'}
>
  {#if title && !decorative}
    <title>{title}</title>
  {/if}
  <path d={path}></path>
</svg>
