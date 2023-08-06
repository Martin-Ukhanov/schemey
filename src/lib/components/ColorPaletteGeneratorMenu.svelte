<script lang="ts">
	import iwanthue, { type RGBColor } from 'iwanthue';
	import { browser } from '$app/environment';

	function hexToRgb(hex: string): RGBColor {
		const r = parseInt(hex.slice(1, 3), 16);
		const g = parseInt(hex.slice(3, 5), 16);
		const b = parseInt(hex.slice(5, 7), 16);

		return [r, g, b];
	}

	function rgbLuminance(rgb: RGBColor): number {
		return (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
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
		const lockedColorsCount = lockedColors.filter((color) => color).length;
		const newColorPalette = [...lockedColors];
		const newColors = generateColorPalette(4 - lockedColorsCount);

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
	}

	function redoColorPalette(): void {
		colorPaletteIndex = colorPaletteIndex > 0 ? colorPaletteIndex - 1 : colorPaletteIndex;
	}

	function toggleLockedColor(index: number): void {
		lockedColors[index] = lockedColors[index] ? null : colorPalette[index];
	}

	const lockedColors: (string | null)[] = [null, null, null, null];
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

		if (rgbLuminance(primaryRgb) <= 0.5) {
			root?.style.setProperty('--primary-text', '#ffffff');
		} else {
			root?.style.setProperty('--primary-text', '#000000');
		}

		if (rgbLuminance(secondaryRgb) <= 0.5) {
			root?.style.setProperty('--secondary-text', '#ffffff');
		} else {
			root?.style.setProperty('--secondary-text', '#000000');
		}

		if (rgbLuminance(tertiaryRgb) <= 0.5) {
			root?.style.setProperty('--tertiary-text', '#ffffff');
		} else {
			root?.style.setProperty('--tertiary-text', '#000000');
		}

		if (rgbLuminance(backgroundRgb) <= 0.5) {
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
	<button
		class="button"
		on:click={() => {
			toggleLockedColor(0);
		}}
	>
		Lock Primary
	</button>
</menu>
