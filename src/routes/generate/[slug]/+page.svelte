<script lang="ts">
	import type { PageData } from './$types';
	import { contrastingColor } from '$lib/utils';
	import GenerateMenu from '$lib/components/GenerateMenu.svelte';

	export let data: PageData;

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
		const { colorScheme } = data;

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

<div class="h-screen flex">
	<div class="flex-1" style={`background-color: ${primaryBackgroundColor};`} />
	{#if secondaryBackgroundColor}
		<div class="flex-1" style={`background-color: ${secondaryBackgroundColor};`} />
	{/if}
	<div
		class="absolute w-full h-full p-4 flex flex-col justify-center items-center gap-y-4 text-center"
	>
		<h1 class="text-8xl" style={`color: ${primaryColor};`}>Primary</h1>
		{#if secondaryColor}
			<h2 class="text-6xl" style={`color: ${secondaryColor};`}>Secondary</h2>
		{/if}
		{#if tertiaryColor}
			<h3 class="text-5xl" style={`color: ${tertiaryColor};`}>Tertiary</h3>
		{/if}
	</div>
</div>

<GenerateMenu initialColorScheme={data.colorScheme} />
