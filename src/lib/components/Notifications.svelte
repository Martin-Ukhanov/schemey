<script lang="ts">
	import { notifications } from '$lib/stores/notifications';
	import { contrastingColor } from '$lib/utils';
	import { fly, scale } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import CheckSquareIcon from './icons/CheckSquareIcon.svelte';
</script>

<div class="fixed top-4 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-y-4">
	{#each $notifications as notification (notification.id)}
		{@const contrastColor = contrastingColor(notification.color)}
		<div
			class="p-4 flex items-center gap-x-2 border-3 rounded-md border-black"
			style={`background-color: ${notification.color}; color: ${contrastColor}; fill: ${contrastColor};`}
			in:fly={{ duration: 300, y: '-100%' }}
			out:scale={{ duration: 300 }}
			animate:flip={{ duration: 300 }}
		>
			<CheckSquareIcon />
			{notification.message}
		</div>
	{/each}
</div>
