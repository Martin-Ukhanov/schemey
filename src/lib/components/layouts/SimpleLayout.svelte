<script lang="ts">
	import { scale } from 'svelte/transition';
	import { flip } from 'svelte/animate';

	export let colorScheme: { id: string; hex: string }[];
</script>

<div class="flex-1 flex">
	{#each colorScheme as color (color.id)}
		<div
			in:scale={{ duration: 300 }}
			out:scale={{ duration: 300 }}
			animate:flip={{ duration: 300 }}
			class="flex-1"
			style={`background-color: ${color.hex}`}
		/>
	{/each}
</div>
