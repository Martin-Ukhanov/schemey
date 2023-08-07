<script lang="ts">
	import iwanthue, { type RGBColor } from 'iwanthue';
	import { browser } from '$app/environment';

	export let colorPaletteSize: 2 | 3 | 4 | 5;

	let colorPalettes: string[][] = [generateColorPalette(colorPaletteSize)];
	let colorPaletteIndex = 0;
	let lockedColors: (string | null)[] = new Array(colorPaletteSize).fill(null);

	function hexToRgb(hex: string): RGBColor {
		const r = parseInt(hex.slice(1, 3), 16);
		const g = parseInt(hex.slice(3, 5), 16);
		const b = parseInt(hex.slice(5, 7), 16);

		return [r, g, b];
	}

	function rgbLuminance(rgb: RGBColor): number {
		return (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
	}

	function resetColorPalettes(): void {
		colorPalettes = [generateColorPalette(colorPaletteSize)];
		colorPaletteIndex = 0;
		resetLockedColors();
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
	}

	function undoColorPalette(): void {
		colorPaletteIndex =
			colorPaletteIndex < colorPalettes.length - 1 ? colorPaletteIndex + 1 : colorPaletteIndex;
		resetLockedColors();
	}

	function redoColorPalette(): void {
		colorPaletteIndex = colorPaletteIndex > 0 ? colorPaletteIndex - 1 : colorPaletteIndex;
		resetLockedColors();
	}

	function toggleLockedColor(index: number): void {
		lockedColors[index] = lockedColors[index] ? null : colorPalette[index];
	}

	function resetLockedColors(): void {
		lockedColors = new Array(colorPaletteSize).fill(null);
	}

	$: colorPalette = colorPalettes[colorPaletteIndex];

	$: if (browser) {
		const root = <HTMLElement>document.querySelector(':root');

		const primaryColor = colorPalette[0];
		const primaryBackgroundColor = colorPalette[1];

		root?.style.setProperty('--primary', primaryColor);
		root?.style.setProperty('--primary-background', primaryBackgroundColor);

		if (rgbLuminance(hexToRgb(primaryColor)) <= 0.5) {
			root?.style.setProperty('--primary-text', '#ffffff');
		} else {
			root?.style.setProperty('--primary-text', '#000000');
		}

		if (rgbLuminance(hexToRgb(primaryBackgroundColor)) <= 0.5) {
			root?.style.setProperty('--primary-background-text', '#ffffff');
		} else {
			root?.style.setProperty('--primary-background-text', '#000000');
		}

		if (colorPalette[2]) {
			const secondaryColor = colorPalette[2];

			root?.style.setProperty('--secondary', secondaryColor);

			if (rgbLuminance(hexToRgb(secondaryColor)) <= 0.5) {
				root?.style.setProperty('--secondary-text', '#ffffff');
			} else {
				root?.style.setProperty('--secondary-text', '#000000');
			}
		}

		if (colorPalette[3]) {
			const tertiaryColor = colorPalette[3];

			root?.style.setProperty('--tertiary', tertiaryColor);

			if (rgbLuminance(hexToRgb(tertiaryColor)) <= 0.5) {
				root?.style.setProperty('--tertiary-text', '#ffffff');
			} else {
				root?.style.setProperty('--tertiary-text', '#000000');
			}
		}

		if (colorPalette[4]) {
			const secondaryBackgroundColor = colorPalette[4];

			root?.style.setProperty('--secondary-background', secondaryBackgroundColor);

			if (rgbLuminance(hexToRgb(secondaryBackgroundColor)) <= 0.5) {
				root?.style.setProperty('--secondary-background-text', '#ffffff');
			} else {
				root?.style.setProperty('--secondary-background-text', '#000000');
			}
		}
	}
</script>

<menu class="fixed bottom-4 left-4 right-4 p-4 flex gap-4 rounded-lg bg-white">
	<button class="button" on:click={pushColorPalette}>Generate</button>
	<button class="button" on:click={undoColorPalette}>Undo</button>
	<button class="button" on:click={redoColorPalette}>Redo</button>
	<div class="w-8 h-8 bg-[var(--primary)]" />
	{#if colorPaletteSize >= 3}
		<div class="w-8 h-8 bg-[var(--secondary)]" />
	{/if}
	{#if colorPaletteSize >= 4}
		<div class="w-8 h-8 bg-[var(--tertiary)]" />
	{/if}
	<div class="w-8 h-8 bg-[var(--primary-background)]" />
	{#if colorPaletteSize === 5}
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
	<select class="text-black" bind:value={colorPaletteSize} on:change={resetColorPalettes}>
		<option value={2}>2</option>
		<option value={3}>3</option>
		<option value={4}>4</option>
		<option value={5}>5</option>
	</select>
</menu>
