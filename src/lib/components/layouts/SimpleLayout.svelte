<script lang="ts">
	import { scale } from 'svelte/transition';
	import { flip } from 'svelte/animate';

	export let colorScheme: { id: string; hex: string }[];
</script>

<div class="flex-1 flex flex-col md:flex-row">
	{#each colorScheme as color (color.id)}
		<div
			in:scale={{ duration: 200 }}
			out:scale={{ duration: 200 }}
			animate:flip={{ duration: 200 }}
			class="flex-1"
			style={`background-color: ${color.hex};`}
		/>
	{/each}
</div>
