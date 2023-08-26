<script lang="ts">
	import { fade, fly, scale, type TransitionConfig } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';
	import theme from 'tailwindcss/defaultTheme';
	import XIcon from './icons/XIcon.svelte';

	export let title: string;
	export let isOpen = false;

	let windowWidth: number;
	let modalHeight: number;

	const dispatch = createEventDispatcher();

	function modalTransition(node: Element): TransitionConfig {
		return windowWidth < parseInt(theme.screens.sm)
			? fly(node, { y: modalHeight, opacity: 1, duration: 300 })
			: scale(node, { duration: 300 });
	}
</script>

<svelte:window bind:innerWidth={windowWidth} />

{#if isOpen}
	<div class="fixed top-0 left-0 w-full h-full z-10">
		<div
			class="absolute top-0 left-0 w-full h-full bg-black/50"
			transition:fade={{ duration: 300 }}
		/>

		<div
			class="absolute top-0 left-0 w-full h-full sm:p-4 grid items-end sm:items-center overflow-y-auto overscroll-none"
			in:modalTransition
			out:modalTransition
		>
			<div
				class="relative left-1/2 -translate-x-1/2 w-screen sm:w-96 p-4 flex flex-col gap-y-4 border-t-2 sm:border-2 sm:rounded-md bg-white border-black"
				bind:clientHeight={modalHeight}
			>
				<div class="relative flex justify-center items-center">
					<button
						class="button absolute left-0 p-0 border-none"
						on:click={() => {
							isOpen = false;
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
