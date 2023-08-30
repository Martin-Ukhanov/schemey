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
		const { currentColorScheme } = data;

		background = { hex: currentColorScheme[0], contrast: contrastingColor(currentColorScheme[0]) };
		primary = { hex: currentColorScheme[1], contrast: contrastingColor(currentColorScheme[1]) };
		currentColorScheme[2]
			? (secondary = {
					hex: currentColorScheme[2],
					contrast: contrastingColor(currentColorScheme[2])
			  })
			: (secondary = null);
		currentColorScheme[3]
			? (tertiary = {
					hex: currentColorScheme[3],
					contrast: contrastingColor(currentColorScheme[3])
			  })
			: (tertiary = null);
		currentColorScheme[4]
			? (quaternary = {
					hex: currentColorScheme[4],
					contrast: contrastingColor(currentColorScheme[4])
			  })
			: (quaternary = null);
	}
</script>

<div
	class="flex-1 flex flex-col"
	style={`background-color: ${background.hex}; color: ${background.contrast};`}
>
	<GenerateMenu initialColorScheme={data.currentColorScheme} />

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

	<div class="flex-1 p-4 grid grid-rows-1 items-center overflow-x-auto overscroll-none">
		<div class="flex flex-col gap-y-8">
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
