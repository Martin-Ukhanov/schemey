<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import type { RGBColor } from 'iwanthue';
	import GenerateMenu from '$lib/components/GenerateMenu.svelte';

	let colorPalette: string[];

	function hexToRgb(hex: string): RGBColor {
		const r = parseInt(hex.slice(1, 3), 16);
		const g = parseInt(hex.slice(3, 5), 16);
		const b = parseInt(hex.slice(5, 7), 16);

		return [r, g, b];
	}

	function rgbLuminance(rgb: RGBColor): number {
		return (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
	}

	function contrastingTextColor(hex: string): '#000000' | '#ffffff' {
		return rgbLuminance(hexToRgb(hex)) <= 0.5 ? '#ffffff' : '#000000';
	}

	$: {
		colorPalette = $page.url.pathname
			.slice(10)
			.split('-')
			.map((color) => '#' + color);

		const primaryColor = colorPalette[0];
		const primaryBackgroundColor = colorPalette[1];
		const secondaryColor = colorPalette[2];
		const tertiaryColor = colorPalette[3];
		const secondaryBackgroundColor = colorPalette[4];

		if (browser) {
			const root = <HTMLElement>document.querySelector(':root');

			root.style.setProperty('--primary', primaryColor);
			root.style.setProperty('--primary-text', contrastingTextColor(primaryColor));

			root.style.setProperty('--primary-background', primaryBackgroundColor);
			root.style.setProperty(
				'--primary-background-text',
				contrastingTextColor(primaryBackgroundColor)
			);

			if (secondaryColor) {
				root.style.setProperty('--secondary', secondaryColor);
				root.style.setProperty('--secondary-text', contrastingTextColor(secondaryColor));
			}

			if (tertiaryColor) {
				root.style.setProperty('--tertiary', tertiaryColor);
				root.style.setProperty('--tertiary-text', contrastingTextColor(tertiaryColor));
			}

			if (secondaryBackgroundColor) {
				root.style.setProperty('--secondary-background', secondaryBackgroundColor);
				root.style.setProperty(
					'--secondary-background-text',
					contrastingTextColor(secondaryBackgroundColor)
				);
			}
		}
	}
</script>

<h1 class="text-5xl mb-4">Hello World</h1>
<div class="flex gap-4">
	<button class="button-primary">Click Me</button>
	{#if colorPalette[2]}
		<button class="button-secondary">Click Me</button>
	{/if}
	{#if colorPalette[3]}
		<button class="button-tertiary">Click Me</button>
	{/if}
</div>
<GenerateMenu />
