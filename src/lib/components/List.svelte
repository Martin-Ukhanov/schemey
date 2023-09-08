<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let items: any[];
	export let selectedItem: any;

	const dispatch = createEventDispatcher();
</script>

<div class="h-80 p-2 flex flex-col overflow-y-auto border-2 rounded-md border-black">
	{#each items as item}
		{#if item === selectedItem}
			<button
				class="button-primary justify-start text-left"
				on:click={() => {
					dispatch('click');
				}}
			>
				{item}
			</button>
		{:else}
			<button
				class="button justify-start text-left"
				on:click={() => {
					selectedItem = item;
					dispatch('click');
				}}
			>
				{item}
			</button>
		{/if}
	{/each}
</div>
