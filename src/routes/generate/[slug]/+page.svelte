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
	let primary: Color;
	let secondary: Color | null;
	let tertiary: Color | null;
	let quaternary: Color | null;

	$: {
		const { colorScheme } = data;

		background = { hex: colorScheme[0], contrast: contrastingColor(colorScheme[0]) };
		primary = { hex: colorScheme[1], contrast: contrastingColor(colorScheme[1]) };
		colorScheme[2]
			? (secondary = { hex: colorScheme[2], contrast: contrastingColor(colorScheme[2]) })
			: (secondary = null);
		colorScheme[3]
			? (tertiary = { hex: colorScheme[3], contrast: contrastingColor(colorScheme[3]) })
			: (tertiary = null);
		colorScheme[4]
			? (quaternary = { hex: colorScheme[4], contrast: contrastingColor(colorScheme[4]) })
			: (quaternary = null);
	}
</script>

<div
	class="flex-1 flex flex-col"
	style={`background-color: ${background.hex}; color: ${background.contrast};`}
>
	<GenerateMenu initialColorScheme={data.colorScheme} />

	<div class="w-full h-16 flex">
		<div class="flex-1" style={`background-color: ${primary.hex};`} />
		{#if secondary}
			<div class="flex-1" style={`background-color: ${secondary.hex};`} />
		{/if}
		{#if tertiary}
			<div class="flex-1" style={`background-color: ${tertiary.hex};`} />
		{/if}
		{#if quaternary}
			<div class="flex-1" style={`background-color: ${quaternary.hex};`} />
		{/if}
	</div>

	<div class="flex-1 p-4 flex flex-col justify-center items-center gap-y-8 overflow-x-hidden">
		<div class="flex flex-col gap-y-4 text-center">
			<h1
				class="text-5xl xs:text-6xl sm:text-7xl font-bold uppercase"
				style={`color: ${primary.hex};`}
			>
				Primary
			</h1>
			{#if secondary}
				<h2
					class="text-5xl xs:text-6xl sm:text-7xl font-bold uppercase"
					style={`color: ${secondary.hex};`}
				>
					Secondary
				</h2>
			{/if}
			{#if tertiary}
				<h3
					class="text-5xl xs:text-6xl sm:text-7xl font-bold uppercase"
					style={`color: ${tertiary.hex};`}
				>
					Tertiary
				</h3>
			{/if}
			{#if quaternary}
				<h4
					class="text-5xl xs:text-6xl sm:text-7xl font-bold uppercase"
					style={`color: ${quaternary.hex};`}
				>
					Quaternary
				</h4>
			{/if}
		</div>

		<div class="flex flex-col sm:flex-row justify-center gap-4">
			<div class="h-12 flex justify-center gap-x-4">
				<div
					class="button w-[136px] border-none !brightness-100 cursor-default"
					style={`background-color: ${primary.hex}; color: ${primary.contrast};`}
				>
					Primary
				</div>

				{#if secondary}
					<div
						class="button w-[136px] border-none !brightness-100 cursor-default"
						style={`background-color: ${secondary.hex}; color: ${secondary.contrast};`}
					>
						Secondary
					</div>
				{/if}
			</div>

			{#if tertiary}
				<div class="h-12 flex justify-center gap-x-4">
					<div
						class="button w-[136px] border-none !brightness-100 cursor-default"
						style={`background-color: ${tertiary.hex}; color: ${tertiary.contrast};`}
					>
						Tertiary
					</div>
					{#if quaternary}
						<div
							class="button w-[136px] border-none !brightness-100 cursor-default"
							style={`background-color: ${quaternary.hex}; color: ${quaternary.contrast};`}
						>
							Quaternary
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</div>

	<div class="w-full h-16 flex">
		<div class="flex-1" style={`background-color: ${primary.hex};`} />
		{#if secondary}
			<div class="flex-1" style={`background-color: ${secondary.hex};`} />
		{/if}
		{#if tertiary}
			<div class="flex-1" style={`background-color: ${tertiary.hex};`} />
		{/if}
		{#if quaternary}
			<div class="flex-1" style={`background-color: ${quaternary.hex};`} />
		{/if}
	</div>
</div>
