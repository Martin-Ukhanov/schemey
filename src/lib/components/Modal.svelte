<script lang="ts">
	import { fade, scale } from 'svelte/transition';

	export let title: string;
	export let open = false;
</script>

{#if open}
	<div
		class="absolute top-0 left-0 w-full h-full bg-black/50"
		transition:fade={{ duration: 200 }}
	/>
	<div
		class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-80"
		transition:scale={{ duration: 200 }}
	>
		<div class="h-80 p-4 mx-4 flex flex-col gap-y-4 border-3 rounded-md bg-white border-black">
			<div class="relative flex justify-center items-center">
				<button
					class="button-transparent-black absolute left-0 p-0"
					on:click={() => {
						open = false;
					}}
				>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-8 fill-black">
						<path
							d="m16.192 6.344-4.243 4.242-4.242-4.242-1.414 1.414L10.535 12l-4.242 4.242 1.414 1.414 4.242-4.242 4.243 4.242 1.414-1.414L13.364 12l4.242-4.242z"
						/>
					</svg>
				</button>
				<div class="text-center text-xl font-bold text-black">{title}</div>
			</div>
			<slot />
		</div>
	</div>
{/if}
