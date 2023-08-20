<script lang="ts">
	import type { PageData } from './$types';
	import { contrastingColor } from '$lib/utils';
	import GenerateMenu from '$lib/components/GenerateMenu.svelte';

	type Color = {
		hex: string;
		contrast: string;
	};

	export let data: PageData;

	let background: Color;
	let accent1: Color;
	let accent2: Color | null;
	let accent3: Color | null;
	let accent4: Color | null;

	$: {
		const { colorScheme } = data;

		background = { hex: colorScheme[0], contrast: contrastingColor(colorScheme[0]) };
		accent1 = { hex: colorScheme[1], contrast: contrastingColor(colorScheme[1]) };
		colorScheme[2]
			? (accent2 = { hex: colorScheme[2], contrast: contrastingColor(colorScheme[2]) })
			: (accent2 = null);
		colorScheme[3]
			? (accent3 = { hex: colorScheme[3], contrast: contrastingColor(colorScheme[3]) })
			: (accent3 = null);
		colorScheme[4]
			? (accent4 = { hex: colorScheme[4], contrast: contrastingColor(colorScheme[4]) })
			: (accent4 = null);
	}
</script>

<div
	class="flex-1 flex flex-col"
	style={`background-color: ${background.hex}; color: ${background.contrast};`}
>
	<GenerateMenu initialColorScheme={data.colorScheme} />

	<div class="w-full h-24 flex">
		<div class="flex-1" style={`background-color: ${accent1.hex};`} />
		{#if accent2}
			<div class="flex-1" style={`background-color: ${accent2.hex};`} />
		{/if}
		{#if accent3}
			<div class="flex-1" style={`background-color: ${accent3.hex};`} />
		{/if}
		{#if accent4}
			<div class="flex-1" style={`background-color: ${accent4.hex};`} />
		{/if}
	</div>

	<div class="flex-1 p-4 flex flex-col justify-center items-center gap-y-8 overflow-x-hidden">
		<div class="flex flex-col gap-y-4 text-center">
			<h1
				class="text-4xl xxs:text-5xl xs:text-6xl sm:text-7xl uppercase"
				style={`color: ${accent1.hex};`}
			>
				Primary
			</h1>
			{#if accent2}
				<h2
					class="text-4xl xxs:text-5xl xs:text-6xl sm:text-7xl uppercase"
					style={`color: ${accent2.hex};`}
				>
					Secondary
				</h2>
			{/if}
			{#if accent3}
				<h3
					class="text-4xl xxs:text-5xl xs:text-6xl sm:text-7xl uppercase"
					style={`color: ${accent3.hex};`}
				>
					Tertiary
				</h3>
			{/if}
			{#if accent4}
				<h4
					class="text-4xl xxs:text-5xl xs:text-6xl sm:text-7xl uppercase"
					style={`color: ${accent4.hex};`}
				>
					Quaternary
				</h4>
			{/if}
		</div>

		<div class="flex flex-col sm:flex-row justify-center gap-4">
			<div class="h-16 flex justify-center gap-x-4">
				<button
					class="button w-[136px] border-none"
					style={`background-color: ${accent1.hex}; color: ${accent1.contrast};`}
				>
					Primary
				</button>
				{#if accent2}
					<button
						class="button w-[136px] border-none"
						style={`background-color: ${accent2.hex}; color: ${accent2.contrast};`}
					>
						Secondary
					</button>
				{/if}
			</div>

			<div class="h-16 flex justify-center gap-x-4">
				{#if accent3}
					<button
						class="button w-[136px] border-none"
						style={`background-color: ${accent3.hex}; color: ${accent3.contrast};`}
					>
						Tertiary
					</button>
				{/if}
				{#if accent4}
					<button
						class="button w-[136px] border-none"
						style={`background-color: ${accent4.hex}; color: ${accent4.contrast};`}
					>
						Quaternary
					</button>
				{/if}
			</div>
		</div>
	</div>

	<div class="w-full h-24 flex">
		<div class="flex-1" style={`background-color: ${accent1.hex};`} />
		{#if accent2}
			<div class="flex-1" style={`background-color: ${accent2.hex};`} />
		{/if}
		{#if accent3}
			<div class="flex-1" style={`background-color: ${accent3.hex};`} />
		{/if}
		{#if accent4}
			<div class="flex-1" style={`background-color: ${accent4.hex};`} />
		{/if}
	</div>
</div>
