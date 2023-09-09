<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { showTooltip } from '$lib/actions/showTooltip';
	import { savedColorSchemes } from '$lib/stores/user';

	export let currentColorScheme: string[];

	const dispatch = createEventDispatcher();
</script>

<div
	class="h-80 p-2 flex flex-col gap-y-2 overflow-y-auto overscroll-none border-2 rounded-md border-black"
>
	{#if $savedColorSchemes.length === 0}
		<p
			class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center uppercase font-bold text-black"
		>
			No Color Schemes Saved
		</p>
	{:else}
		{#each $savedColorSchemes as colorScheme}
			<button
				class="button-border min-h-28 p-0 overflow-hidden !brightness-100"
				use:showTooltip={{ position: 'top', message: colorScheme.join(' ') }}
				on:click={() => {
					dispatch('selectColorScheme', {
						colorScheme: colorScheme
					});
				}}
			>
				{#each colorScheme as color}
					<div class="w-full h-full" style={`background-color: ${color};`} />
				{/each}

				{#if JSON.stringify(colorScheme).includes(JSON.stringify(currentColorScheme))}
					<div
						class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 border-2 rounded-full bg-white border-black"
					/>
				{/if}
			</button>
		{/each}
	{/if}
</div>
