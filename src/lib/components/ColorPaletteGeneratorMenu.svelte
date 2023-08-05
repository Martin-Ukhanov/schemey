<script lang="ts">
	import iwanthue from 'iwanthue';
	import { browser } from '$app/environment';

	function hexToRgb(hex: string): [r: number, g: number, b: number] {
		const r = parseInt(hex.slice(1, 3), 16);
		const g = parseInt(hex.slice(3, 5), 16);
		const b = parseInt(hex.slice(5, 7), 16);

		return [r, g, b];
	}

	function rgbLuminance(r: number, g: number, b: number): number {
		return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
	}

	function generateColorPalette(count: number): string[] {
		return iwanthue(count, {
			clustering: 'force-vector',
			colorSpace: [0, 360, 0, 100, 0, 100],
			colorFilter: (rgb) => {
				lockedColors.forEach((color) => {
					if (color) {
						const rgb2 = hexToRgb(color);

						if (
							Math.abs(rgb[0] - rgb2[0]) + Math.abs(rgb[1] - rgb2[1]) + Math.abs(rgb[2] - rgb2[2]) <
							50
						) {
							return false;
						}
					}
				});

				return true;
			}
		});
	}

	function pushColorPalette(): void {
		colorPalettes = colorPalettes.slice(colorPaletteIndex);
		colorPalettes = [generateColorPalette(4), ...colorPalettes];
		colorPaletteIndex = 0;
	}

	function undoColorPalette(): void {
		colorPaletteIndex =
			colorPaletteIndex < colorPalettes.length - 1 ? colorPaletteIndex + 1 : colorPaletteIndex;
	}

	function redoColorPalette(): void {
		colorPaletteIndex = colorPaletteIndex > 0 ? colorPaletteIndex - 1 : colorPaletteIndex;
	}

	function lockColor(index: number): void {
		lockedColors[index] = colorPalette[index];
	}

	const lockedColors: (string | null)[] = [];
	let colorPalettes: string[][] = [generateColorPalette(4)];
	let colorPaletteIndex = 0;

	$: colorPalette = colorPalettes[colorPaletteIndex];

	$: if (browser) {
		const root: HTMLElement | null = document.querySelector(':root');

		root?.style.setProperty('--primary', colorPalette[0]);
		root?.style.setProperty('--secondary', colorPalette[1]);
		root?.style.setProperty('--tertiary', colorPalette[2]);
		root?.style.setProperty('--background', colorPalette[3]);

		const primaryRgb = hexToRgb(colorPalette[0]);
		const secondaryRgb = hexToRgb(colorPalette[1]);
		const tertiaryRgb = hexToRgb(colorPalette[2]);
		const backgroundRgb = hexToRgb(colorPalette[3]);

		if (rgbLuminance(primaryRgb[0], primaryRgb[1], primaryRgb[2]) <= 0.5) {
			root?.style.setProperty('--primary-text', '#ffffff');
		} else {
			root?.style.setProperty('--primary-text', '#000000');
		}

		if (rgbLuminance(secondaryRgb[0], secondaryRgb[1], secondaryRgb[2]) <= 0.5) {
			root?.style.setProperty('--secondary-text', '#ffffff');
		} else {
			root?.style.setProperty('--secondary-text', '#000000');
		}

		if (rgbLuminance(tertiaryRgb[0], tertiaryRgb[1], tertiaryRgb[2]) <= 0.5) {
			root?.style.setProperty('--tertiary-text', '#ffffff');
		} else {
			root?.style.setProperty('--tertiary-text', '#000000');
		}

		if (rgbLuminance(backgroundRgb[0], backgroundRgb[1], backgroundRgb[2]) <= 0.5) {
			root?.style.setProperty('--background-text', '#ffffff');
		} else {
			root?.style.setProperty('--background-text', '#000000');
		}
	}
</script>

<menu class="fixed bottom-4 left-4 right-4 p-4 flex gap-4 rounded-lg bg-gray-100">
	<button class="button" on:click={pushColorPalette}>Generate</button>
	<button class="button" on:click={undoColorPalette}>Undo</button>
	<button class="button" on:click={redoColorPalette}>Redo</button>
	<div class="w-8 h-8 bg-[var(--primary)]" />
	<div class="w-8 h-8 bg-[var(--secondary)]" />
	<div class="w-8 h-8 bg-[var(--tertiary)]" />
	<div class="w-8 h-8 bg-[var(--background)]" />
</menu>
