<script lang="ts">
	import { notifications } from '$lib/stores/notifications';
	import { contrastingColor } from '$lib/utils';
	import { fly, scale } from 'svelte/transition';
	import { flip } from 'svelte/animate';
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
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-8"
				><path
					d="M19 3H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zm-7.933 13.481-3.774-3.774 1.414-1.414 2.226 2.226 4.299-5.159 1.537 1.28-5.702 6.841z"
				/></svg
			>
			{notification.message}
		</div>
	{/each}
</div>
