<script lang="ts">
	import type { PageData } from './$types';
	import { contrastingColor } from '$lib/utils';
	import GenerateMenu from '$lib/components/GenerateMenu.svelte';

	export let data: PageData;

	let colorScheme: string[];

	let primaryBackgroundColor: string | null = null;
	let primaryColor: string | null = null;
	let secondaryColor: string | null = null;
	let tertiaryColor: string | null = null;
	let secondaryBackgroundColor: string | null = null;

	let primaryBackgroundContrastColor: string | null = null;
	let primaryContrastColor: string | null = null;
	let secondaryContrastColor: string | null = null;
	let tertiaryContrastColor: string | null = null;
	let secondaryBackgroundContrastColor: string | null = null;

	$: {
		colorScheme = data.colorScheme;

		primaryBackgroundColor = colorScheme[0];
		primaryColor = colorScheme[1];
		secondaryColor = colorScheme[2];
		tertiaryColor = colorScheme[3];
		secondaryBackgroundColor = colorScheme[4];

		primaryBackgroundContrastColor = contrastingColor(primaryBackgroundColor);
		primaryContrastColor = contrastingColor(primaryColor);
		secondaryContrastColor = secondaryColor ? contrastingColor(secondaryColor) : null;
		tertiaryContrastColor = tertiaryColor ? contrastingColor(tertiaryColor) : null;
		secondaryBackgroundContrastColor = secondaryBackgroundColor
			? contrastingColor(secondaryBackgroundColor)
			: null;
	}
</script>

<div
	class="h-screen transition-colors duration-150"
	style={`background-color: ${primaryBackgroundColor}; color: ${primaryBackgroundContrastColor}`}
>
	<h1 class="text-5xl mb-4">Hello World</h1>
	<div class="flex gap-4">
		<button
			class="button border-none"
			style={`background-color: ${primaryColor}; color: ${primaryContrastColor}`}
		>
			Click Me
		</button>
		{#if secondaryColor}
			<button
				class="button border-none"
				style={`background-color: ${secondaryColor}; color: ${secondaryContrastColor}`}
			>
				Click Me
			</button>
		{/if}
		{#if tertiaryColor}
			<button
				class="button border-none"
				style={`background-color: ${tertiaryColor}; color: ${tertiaryContrastColor}`}
			>
				Click Me
			</button>
		{/if}
	</div>
</div>
<GenerateMenu initialColorScheme={colorScheme} />
