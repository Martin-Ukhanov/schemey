<script lang="ts">
	import { scale } from 'svelte/transition';
	import { flip } from 'svelte/animate';

	export let colorScheme: { id: string; hex: string }[];

	let grid: { id: string; hex: string }[][] = [];

	$: if (colorScheme) {
		grid = [];

		for (let i = 0; i < colorScheme.length; i++) {
			grid.push(structuredClone(colorScheme));

			colorScheme.push(<{ id: string; hex: string }>colorScheme.shift());
		}
	}
</script>

<div class="flex-1 flex">
	{#each grid as section (section[0].id)}
		<div
			class="flex-1 flex flex-col"
			in:scale={{ duration: 200 }}
			out:scale={{ duration: 200 }}
			animate:flip={{ duration: 200 }}
		>
			{#each section as color (color.id)}
				<div
					class="flex-1"
					style={`background-color: ${color.hex};`}
					in:scale={{ duration: 200 }}
					out:scale={{ duration: 200 }}
					animate:flip={{ duration: 200 }}
				/>
			{/each}
		</div>
	{/each}
</div>
