<script lang="ts">
	import type { PageData } from './$types';
	import { browser } from '$app/environment';
	import { contrastingColor } from '$lib/utils';
	import GenerateMenu from '$lib/components/GenerateMenu.svelte';

	export let data: PageData;

	let colorScheme: string[];

	$: {
		colorScheme = data.colorScheme;

		const primaryColor = colorScheme[0];
		const primaryBackgroundColor = colorScheme[1];
		const secondaryColor = colorScheme[2];
		const tertiaryColor = colorScheme[3];
		const secondaryBackgroundColor = colorScheme[4];

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
	{#if colorScheme[2]}
		<button class="button-secondary">Click Me</button>
	{/if}
	{#if colorScheme[3]}
		<button class="button-tertiary">Click Me</button>
	{/if}
</div>
<GenerateMenu initialColorScheme={colorScheme} />
