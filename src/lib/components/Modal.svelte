<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';
	import XIcon from './icons/XIcon.svelte';

	export let title: string;
	export let open = false;

	const dispatch = createEventDispatcher();
</script>

{#if open}
	<div
		class="absolute top-0 left-0 w-full h-full z-10 bg-black/50"
		transition:fade={{ duration: 300 }}
	/>

	<div
		class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-80 z-10"
		transition:scale={{ duration: 300 }}
	>
		<div class="h-80 p-4 mx-4 flex flex-col gap-y-4 border-3 rounded-md bg-white border-black">
			<div class="relative flex justify-center items-center">
				<button
					class="button-transparent-black absolute left-0 p-0"
					on:click={() => {
						open = false;
						dispatch('close');
					}}
				>
					<XIcon />
				</button>

				<div class="text-center text-lg uppercase text-black">{title}</div>
			</div>

			<slot />
		</div>
	</div>
{/if}
