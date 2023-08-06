<script lang="ts">
	import ColorPaletteGeneratorMenu from '$lib/components/ColorPaletteGeneratorMenu.svelte';

	let colorPaletteSize: 2 | 3 | 4;
</script>

<h1 class="text-5xl mb-4">Hello World</h1>
<div class="flex gap-4">
	<button class="button-primary">Click Me</button>
	{#if colorPaletteSize >= 3}
		<button class="button-secondary">Click Me</button>
	{/if}
	{#if colorPaletteSize >= 4}
		<button class="button-tertiary">Click Me</button>
	{/if}
</div>
<ColorPaletteGeneratorMenu bind:colorPaletteSize />
