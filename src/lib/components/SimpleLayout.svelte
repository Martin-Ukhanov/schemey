<script lang="ts">
	export let colorScheme: string[];
</script>

<div class="flex-1 flex">
	{#each colorScheme as color}
		<div class="flex-1" style={`background-color: ${color}`} />
	{/each}
</div>
