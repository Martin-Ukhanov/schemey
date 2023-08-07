<script lang="ts">
	import iwanthue, { type RGBColor } from 'iwanthue';
	import { goto } from '$app/navigation';

	export let colorPaletteSize: 2 | 3 | 4 | 5;

	let colorPalettes: string[][] = [generateColorPalette(colorPaletteSize)];
	let colorPaletteIndex = 0;
	let lockedColors: (string | null)[] = new Array(colorPaletteSize).fill(null);

	function colorPaletteToSlug(colorPalette: string[]): string {
		let slug = '';

		for (let i = 0; i < colorPalette.length; i++) {
			slug += colorPalette[i].slice(1);

			if (i !== colorPalette.length - 1) {
				slug += '-';
			}
		}

		return slug;
	}

	function generateColorPalette(size: number): string[] {
		return iwanthue(size, {
			clustering: 'force-vector',
			colorSpace: [0, 360, 0, 100, 0, 100]
		});
	}

	function pushColorPalette(): void {
		const lockedColorsCount = lockedColors.filter((color) => color).length;
		const newColorPalette = [...lockedColors];
		const newColors = generateColorPalette(colorPaletteSize - lockedColorsCount);

		for (let i = 0; i < newColorPalette.length; i++) {
			if (!newColorPalette[i]) {
				newColorPalette[i] = <string>newColors.shift();
			}
		}

		colorPalettes = colorPalettes.slice(colorPaletteIndex);
		colorPalettes = [<string[]>newColorPalette, ...colorPalettes];
		colorPaletteIndex = 0;

		goto(`/generate/${colorPaletteToSlug(colorPalette)}`);
	}

	function undoColorPalette(): void {
		colorPaletteIndex =
			colorPaletteIndex < colorPalettes.length - 1 ? colorPaletteIndex + 1 : colorPaletteIndex;
		resetLockedColors();

		goto(`/generate/${colorPaletteToSlug(colorPalette)}`);
	}

	function redoColorPalette(): void {
		colorPaletteIndex = colorPaletteIndex > 0 ? colorPaletteIndex - 1 : colorPaletteIndex;
		resetLockedColors();

		goto(`/generate/${colorPaletteToSlug(colorPalette)}`);
	}

	function toggleLockedColor(index: number): void {
		lockedColors[index] = lockedColors[index] ? null : colorPalette[index];
	}

	function resetLockedColors(): void {
		lockedColors = new Array(colorPaletteSize).fill(null);
	}

	function onChangeColorPaletteSize(): void {
		if (colorPaletteSize < colorPalette.length) {
			colorPalettes = [colorPalette.slice(0, colorPaletteSize)];
		} else {
			const newColorsCount = colorPaletteSize - colorPalette.length;
			colorPalettes = [[...colorPalette, ...generateColorPalette(newColorsCount)]];
		}

		colorPaletteIndex = 0;
		resetLockedColors();
	}

	$: colorPalette = colorPalettes[colorPaletteIndex];
</script>

<menu class="fixed bottom-4 left-4 right-4 p-4 flex gap-4 rounded-lg bg-white">
	<button class="button" on:click={pushColorPalette}>Generate</button>
	<button class="button" on:click={undoColorPalette}>Undo</button>
	<button class="button" on:click={redoColorPalette}>Redo</button>
	<div class="w-8 h-8 bg-[var(--primary)]" />
	{#if colorPalette[2]}
		<div class="w-8 h-8 bg-[var(--secondary)]" />
	{/if}
	{#if colorPalette[3]}
		<div class="w-8 h-8 bg-[var(--tertiary)]" />
	{/if}
	<div class="w-8 h-8 bg-[var(--primary-background)]" />
	{#if colorPalette[4]}
		<div class="w-8 h-8 bg-[var(--secondary-background)]" />
	{/if}
	<button
		class="button"
		on:click={() => {
			toggleLockedColor(0);
		}}
	>
		Lock Primary
	</button>
	<button
		class="button"
		on:click={() => {
			toggleLockedColor(2);
		}}
	>
		Lock Secondary
	</button>
	<button
		class="button"
		on:click={() => {
			toggleLockedColor(2);
		}}
	>
		Lock Tertiary
	</button>
	<button
		class="button"
		on:click={() => {
			toggleLockedColor(1);
		}}
	>
		Lock Background
	</button>
	<select class="text-black" bind:value={colorPaletteSize} on:change={onChangeColorPaletteSize}>
		<option value={2}>2</option>
		<option value={3}>3</option>
		<option value={4}>4</option>
		<option value={5}>5</option>
	</select>
</menu>
