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
		<h1 class="text-8xl" style={`color: ${primaryColor};`}>Primary Color</h1>
		{#if secondaryColor}
			<h2 class="text-6xl" style={`color: ${secondaryColor};`}>Secondary Color</h2>
		{/if}
		{#if tertiaryColor}
			<h3 class="text-5xl" style={`color: ${tertiaryColor};`}>Tertiary Color</h3>
		{/if}
		<div class="mt-2 flex flex-col items-center gap-y-4">
			<button
				class="button border-none"
				style={`background-color: ${primaryColor}; color: ${primaryContrastColor};`}
			>
				Primary Color
			</button>
			{#if secondaryColor}
				<button
					class="button border-none"
					style={`background-color: ${secondaryColor}; color: ${secondaryContrastColor};`}
				>
					Secondary Color
				</button>
			{/if}
			{#if tertiaryColor}
				<button
					class="button border-none"
					style={`background-color: ${tertiaryColor}; color: ${tertiaryContrastColor};`}
				>
					Tertiary Color
				</button>
			{/if}
		</div>
	</div>
</div>

<GenerateMenu initialColorScheme={data.colorScheme} />
