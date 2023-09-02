<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { slide } from 'svelte/transition';
	import { showTooltip } from '$lib/actions/showTooltip';
	import { savedColorSchemes } from '$lib/stores/user';
	import { addNotification } from '$lib/stores/notifications';
	import TrashIcon from './icons/TrashIcon.svelte';

	export let currentColorScheme: string[];

	const dispatch = createEventDispatcher();

	async function deleteColorScheme(colorScheme: string[]): Promise<void> {
		const response = await fetch('/api/colorSchemes', {
			method: 'DELETE',
			body: JSON.stringify({ colorScheme: colorScheme }),
			headers: {
				'content-type': 'application/json'
			}
		});
		const data = await response.json();

		if (data.success) {
			$savedColorSchemes = $savedColorSchemes.filter(
				(savedColorScheme) => JSON.stringify(savedColorScheme) !== JSON.stringify(colorScheme)
			);
			addNotification('Color Scheme Deleted', 'check');
		} else {
			addNotification('Failed To Delete Color Scheme', 'x');
		}
	}
</script>

<div class="h-80 flex flex-col">
	<div
		class="relative flex-1 p-2 flex flex-col gap-y-2 overflow-y-auto border-2 rounded-md border-black"
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
					class="button relative min-h-16 p-0 overflow-hidden"
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

	{#if JSON.stringify($savedColorSchemes).includes(JSON.stringify(currentColorScheme))}
		<button
			class="button mt-2"
			transition:slide={{ axis: 'y', duration: 300 }}
			use:showTooltip={{ position: 'top', message: 'Delete Color Scheme' }}
			on:click={async () => {
				await deleteColorScheme(currentColorScheme);
			}}
		>
			<TrashIcon />
		</button>
	{/if}
</div>
