<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let items: any[];
	export let selectedItem: any;

	const dispatch = createEventDispatcher();
</script>

<div class="p-2 flex flex-col overflow-y-auto border-3 rounded-md border-black">
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
