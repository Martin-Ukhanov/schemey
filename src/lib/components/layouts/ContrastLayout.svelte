<script lang="ts">
	import { scale } from 'svelte/transition';
	import { flip } from 'svelte/animate';

	export let colorScheme: { id: string; hex: string }[];
</script>

<div class="flex-1 flex flex-col md:flex-row">
	{#each colorScheme as color, index1 (color.id)}
		<div
			class="flex-1 p-4 flex flex-row md:flex-col gap-4"
			style={`background-color: ${color.hex}`}
			in:scale={{ duration: 200 }}
			out:scale={{ duration: 200 }}
			animate:flip={{ duration: 200 }}
		>
			{#each colorScheme as color, index2 (color.id)}
				<div
					class="flex-1 rounded-full"
					class:hidden={index1 === index2}
					style={`background-color: ${color.hex}`}
					in:scale={{ duration: 200 }}
					out:scale={{ duration: 200 }}
					animate:flip={{ duration: 200 }}
				/>
			{/each}
		</div>
	{/each}
</div>
