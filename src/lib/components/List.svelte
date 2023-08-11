<script lang="ts">
	export let items: any[];
	export let selectedItem: any;
</script>

<div class="flex flex-col overflow-y-auto">
	{#each items as item}
		<button
			class="button mr-2 justify-start border-none text-left"
			class:brightness-80={item === selectedItem}
			on:click={() => {
				selectedItem = item;
			}}
		>
			{item}
		</button>
	{/each}
</div>
