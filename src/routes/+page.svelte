<script lang="ts">
	import { browser } from '$app/environment';
	import iwanthue from 'iwanthue';

	function hexToRgb(hex: string) {
		const r = parseInt(hex.slice(1, 3), 16);
		const g = parseInt(hex.slice(3, 5), 16);
		const b = parseInt(hex.slice(5, 7), 16);

		return [r, g, b];
	}

	function rgbLuminance(r: number, g: number, b: number) {
		return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
	}

	const no = ['#26d215'];

	function newPalette() {
		const palette = iwanthue(3, {
			clustering: 'force-vector',
			colorSpace: [0, 360, 0, 100, 0, 100],
			colorFilter: (rgb) => {
				no.forEach((color) => {
					const rgb2 = hexToRgb(color);

					if (
						Math.abs(rgb[0] - rgb2[0]) + Math.abs(rgb[1] - rgb2[1]) + Math.abs(rgb[2] - rgb2[2]) <
						50
					) {
						return false;
					}
				});

				return true;
			}
		});

		if (browser) {
			const root: HTMLElement | null = document.querySelector(':root');

			root?.style.setProperty('--primary', palette[0]);
			root?.style.setProperty('--secondary', palette[1]);
			root?.style.setProperty('--background', palette[2]);

			const primaryRgb = hexToRgb(palette[0]);
			const secondaryRgb = hexToRgb(palette[1]);
			const backgroundRgb = hexToRgb(palette[2]);

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

			if (rgbLuminance(backgroundRgb[0], backgroundRgb[1], backgroundRgb[2]) <= 0.5) {
				root?.style.setProperty('--background-text', '#ffffff');
			} else {
				root?.style.setProperty('--background-text', '#000000');
			}
		}
	}
</script>

<h1 class="text-5xl mb-4">Hello World</h1>
<div class="flex gap-4">
	<button class="button-primary" on:click={newPalette}>Click Me</button>
	<button class="button-secondary" on:click={newPalette}>Click Me</button>
</div>
