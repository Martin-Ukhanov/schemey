<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let items: any[];
	export let selectedItem: any;

	const dispatch = createEventDispatcher();
</script>

<div class="flex flex-col overflow-y-auto">
	{#each items as item}
		<button
			class="button justify-start border-none text-left"
			class:brightness-80={item === selectedItem}
			on:click={() => {
				selectedItem = item;
				dispatch('click');
			}}
		>
			{item}
		</button>
	{/each}
</div>
