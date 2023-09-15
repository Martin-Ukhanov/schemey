<script lang="ts">
	import { fade, fly, scale } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';
	import theme from 'tailwindcss/defaultTheme';
	import XIcon from './icons/XIcon.svelte';

	export let title: string;
	export let isOpen = false;

	let windowWidth: number;
	let modalHeight: number;

	const dispatch = createEventDispatcher();

	function modalTransition(element: Element) {
		return windowWidth < parseInt(theme.screens.sm)
			? fly(element, { y: modalHeight, duration: 200 })
			: scale(element, { duration: 200 });
	}
</script>

<svelte:window bind:innerWidth={windowWidth} />

{#if isOpen}
	<div class="fixed top-0 left-0 w-full h-full z-20">
		<div
			class="absolute top-0 left-0 w-full h-full bg-black/50"
			transition:fade={{ duration: 200 }}
		/>

		<div
			class="absolute top-0 left-0 w-full h-full sm:p-4 grid items-end sm:items-center overflow-y-auto overscroll-none"
			in:modalTransition
			out:modalTransition
		>
			<div
				class="relative left-1/2 -translate-x-1/2 w-screen sm:w-96 p-4 border-t-2 sm:border-2 sm:rounded-md bg-white border-black"
				bind:clientHeight={modalHeight}
			>
				<div class="relative mb-4 flex justify-between items-center gap-x-2">
					<button
						class="button p-0"
						on:click={() => {
							isOpen = false;
							dispatch('close');
						}}
					>
						<XIcon />
					</button>

					<h2 class="text-center text-2xl font-bold uppercase text-black">
						{title}
					</h2>

					<span class="w-9" />
				</div>

				<slot />
			</div>
		</div>
	</div>
{/if}
