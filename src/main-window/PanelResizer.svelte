<!--
FILE: src/main-window/PanelResizer.svelte
PURPOSE: Drag handle between two panels. Updates panel width via callback.
-->
<script lang="ts">
	interface Props {
		direction?: 'vertical' | 'horizontal';
		onResize: (delta: number) => void;
		onDoubleClick?: () => void;
	}

	let { direction = 'vertical', onResize, onDoubleClick }: Props = $props();

	let dragging = $state(false);
	let resizerEl: HTMLDivElement | null = $state(null);
	let lastPos = $state(0);

	function handlePointerDown(e: PointerEvent) {
		if (e.button !== 0) return;
		e.preventDefault();
		dragging = true;
		lastPos = direction === 'vertical' ? e.clientX : e.clientY;
		resizerEl?.setPointerCapture(e.pointerId);
		document.body.style.cursor = direction === 'vertical' ? 'col-resize' : 'row-resize';
		document.body.style.userSelect = 'none';
	}

	function handlePointerMove(e: PointerEvent) {
		if (!dragging) return;
		const currentPos = direction === 'vertical' ? e.clientX : e.clientY;
		const delta = currentPos - lastPos;
		if (delta !== 0) {
			lastPos = currentPos;
			onResize(delta);
		}
	}

	function handlePointerUp(e: PointerEvent) {
		if (!dragging) return;
		dragging = false;
		lastPos = 0;
		resizerEl?.releasePointerCapture(e.pointerId);
		document.body.style.cursor = '';
		document.body.style.userSelect = '';
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="panel-resizer {direction === 'vertical' ? 'w-1 cursor-col-resize' : 'h-1 cursor-row-resize'}
		shrink-0 bg-(--v3-surface) hover:bg-(--v3-accent-underline)/40 active:bg-(--v3-accent-underline)/60 transition-colors
		{dragging ? 'bg-(--v3-accent-underline)/60' : ''}"
	bind:this={resizerEl}
	onpointerdown={handlePointerDown}
	onpointermove={handlePointerMove}
	onpointerup={handlePointerUp}
	onpointercancel={handlePointerUp}
	ondblclick={onDoubleClick}
	role="separator"
	aria-orientation={direction === 'vertical' ? 'vertical' : 'horizontal'}
	aria-label="Resize panel"
></div>
