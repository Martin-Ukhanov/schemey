<script lang="ts">
	import { generateColorPalette, colorPaletteToSlug } from '$lib/utils';
	import { goto } from '$app/navigation';

	export let initialColorPalette: string[];

	let colorPalettes: string[][] = [initialColorPalette];
	let colorPaletteSize: number = colorPalettes[0].length;
	let colorPaletteIndex = 0;
	let lockedColors: (string | null)[] = new Array(colorPaletteSize).fill(null);

	function gotoColorPalette(): void {
		goto(`/generate/${colorPaletteToSlug(colorPalettes[colorPaletteIndex])}`);
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

		gotoColorPalette();
	}

	function undoColorPalette(): void {
		colorPaletteIndex =
			colorPaletteIndex < colorPalettes.length - 1 ? colorPaletteIndex + 1 : colorPaletteIndex;
		resetLockedColors();
		gotoColorPalette();
	}

	function redoColorPalette(): void {
		colorPaletteIndex = colorPaletteIndex > 0 ? colorPaletteIndex - 1 : colorPaletteIndex;
		resetLockedColors();
		gotoColorPalette();
	}

	function toggleLockedColor(index: number): void {
		lockedColors[index] = lockedColors[index] ? null : colorPalettes[colorPaletteIndex][index];
	}

	function resetLockedColors(): void {
		lockedColors = new Array(colorPaletteSize).fill(null);
	}

	function onChangeColorPaletteSize(): void {
		if (colorPaletteSize < colorPalettes[colorPaletteIndex].length) {
			colorPalettes = [colorPalettes[colorPaletteIndex].slice(0, colorPaletteSize)];
		} else {
			const newColorsCount = colorPaletteSize - colorPalettes[colorPaletteIndex].length;
			colorPalettes = [
				[...colorPalettes[colorPaletteIndex], ...generateColorPalette(newColorsCount)]
			];
		}

		colorPaletteIndex = 0;
		resetLockedColors();

		goto(`/generate/${colorPaletteToSlug(colorPalettes[colorPaletteIndex])}`);
	}
</script>

<menu class="fixed bottom-4 left-4 right-4 p-4 flex gap-4 rounded-lg bg-white">
	<button class="button" on:click={pushColorPalette}>Generate</button>
	<button class="button" on:click={undoColorPalette}>Undo</button>
	<button class="button" on:click={redoColorPalette}>Redo</button>
	<div class="w-8 h-8 bg-[var(--primary)]" />
	<div class="w-8 h-8 bg-[var(--primary-background)]" />
	{#if colorPalettes[colorPaletteIndex][2]}
		<div class="w-8 h-8 bg-[var(--secondary)]" />
	{/if}
	{#if colorPalettes[colorPaletteIndex][3]}
		<div class="w-8 h-8 bg-[var(--tertiary)]" />
	{/if}
	{#if colorPalettes[colorPaletteIndex][4]}
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
			toggleLockedColor(3);
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
