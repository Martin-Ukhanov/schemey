<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';
	import XIcon from './icons/XIcon.svelte';

	export let title: string;
	export let open = false;

	const dispatch = createEventDispatcher();
</script>

{#if open}
	<div class="fixed top-0 left-0 w-full h-full z-10">
		<div
			class="absolute top-0 left-0 w-full h-full bg-black/50"
			transition:fade={{ duration: 300 }}
		/>

		<div
			class="absolute top-0 left-0 w-full h-full p-4 grid items-center overflow-y-auto overscroll-none"
		>
			<div
				class="relative left-1/2 -translate-x-1/2 w-full max-w-96 p-4 flex flex-col gap-y-4 border-2 rounded-md bg-white border-black"
				transition:scale={{ duration: 300 }}
			>
				<div class="relative flex justify-center items-center">
					<button
						class="button absolute left-0 p-0 border-none"
						on:click={() => {
							open = false;
							dispatch('close');
						}}
					>
						<XIcon />
					</button>

					<h2 class="text-center text-2xl font-bold uppercase text-black">{title}</h2>
				</div>

				<slot />
			</div>
		</div>
	</div>
{/if}
