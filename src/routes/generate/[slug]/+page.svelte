<script lang="ts">
	import type { PageData } from './$types';
	import { browser } from '$app/environment';
	import { contrastingColor } from '$lib/utils';
	import GenerateMenu from '$lib/components/GenerateMenu.svelte';

	export let data: PageData;

	let colorScheme: string[];

	let primaryColor: string | null = null;
	let primaryBackgroundColor: string | null = null;
	let secondaryColor: string | null = null;
	let tertiaryColor: string | null = null;
	let secondaryBackgroundColor: string | null = null;

	$: {
		colorScheme = data.colorScheme;

		primaryColor = colorScheme[0];
		primaryBackgroundColor = colorScheme[1];
		secondaryColor = colorScheme[2];
		tertiaryColor = colorScheme[3];
		secondaryBackgroundColor = colorScheme[4];

		if (browser) {
			const root = <HTMLElement>document.querySelector(':root');

			root.style.setProperty('--primary', primaryColor);
			root.style.setProperty('--primary-text', contrastingColor(primaryColor));

			root.style.setProperty('--primary-background', primaryBackgroundColor);
			root.style.setProperty('--primary-background-text', contrastingColor(primaryBackgroundColor));

			if (secondaryColor) {
				root.style.setProperty('--secondary', secondaryColor);
				root.style.setProperty('--secondary-text', contrastingColor(secondaryColor));
			}

			if (tertiaryColor) {
				root.style.setProperty('--tertiary', tertiaryColor);
				root.style.setProperty('--tertiary-text', contrastingColor(tertiaryColor));
			}

			if (secondaryBackgroundColor) {
				root.style.setProperty('--secondary-background', secondaryBackgroundColor);
				root.style.setProperty(
					'--secondary-background-text',
					contrastingColor(secondaryBackgroundColor)
				);
			}
		}
	}
</script>

<h1 class="text-5xl mb-4">Hello World</h1>
<div class="flex gap-4">
	<button class="button-primary">Click Me</button>
	{#if secondaryColor}
		<button class="button-secondary">Click Me</button>
	{/if}
	{#if tertiaryColor}
		<button class="button-tertiary">Click Me</button>
	{/if}
</div>
<GenerateMenu initialColorScheme={colorScheme} />
