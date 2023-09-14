<script lang="ts">
	import { generateColorScheme } from '$lib/utils';
	import { colorSpacePresets } from '$lib/stores/colorSpacePresets';
	import { onMount } from 'svelte';
	import Loader from '$lib/components/Loader.svelte';

	let colorScheme = generateColorScheme(6, $colorSpacePresets['all']);
	let isLoading = false;

	onMount(() => {
		const interval = setInterval(() => {
			colorScheme = generateColorScheme(6, $colorSpacePresets['all']);
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	});
</script>

<svelte:head>
	<title>Schemey | Home</title>
</svelte:head>

<div class="absolute w-full h-full flex flex-col md:flex-row brightness-[0.3]">
	{#each colorScheme as color}
		<div class="flex-1" style={`background-color: ${color}`} />
	{/each}
</div>

<div class="flex-1 p-4 flex flex-col justify-center items-center z-10">
	<h1 class="mb-4 text-center text-5xl sm:text-7xl uppercase font-bold text-primary">Schemey</h1>

	<p class="mb-6 text-center text-lg sm:text-xl uppercase text-white">
		Create beautiful color schemes with the click of a button
	</p>

	<a
		href="/generate"
		class="button-primary"
		on:click={() => {
			isLoading = true;
		}}
	>
		<span class:opacity-0={isLoading}>Start Generating</span>

		{#if isLoading}
			<Loader color="white" />
		{/if}
	</a>
</div>
