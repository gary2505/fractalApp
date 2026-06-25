<script lang="ts">
  type Props = {
    size?: number;
    title?: string;
  };

  let { size = 16, title = 'Close' }: Props = $props();
</script>

<svg
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  aria-hidden={title ? undefined : 'true'}
  role={title ? 'img' : undefined}
  xmlns="http://www.w3.org/2000/svg"
>
  {#if title}
    <title>{title}</title>
  {/if}
  <path
    d="M6.75 6.75 17.25 17.25M17.25 6.75 6.75 17.25"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>
