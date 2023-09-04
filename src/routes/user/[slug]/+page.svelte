<script lang="ts">
	import { page } from '$app/stores';
	import { scale } from 'svelte/transition';
	import { contrastingColor } from '$lib/utils';
	import { showTooltip } from '$lib/actions/showTooltip';
	import { addNotification } from '$lib/stores/notifications';
	import CopyIcon from '$lib/components/icons/CopyIcon.svelte';
	import TrashIcon from '$lib/components/icons/TrashIcon.svelte';

	let activePage: 'colors' | 'colorSchemes' | 'account' = 'colors';

	const { savedColors, savedColorSchemes } = $page.data;

	let selectedColor = savedColors[0];
	let SelectedColorScheme = savedColorSchemes[0];
</script>

<div class="flex-1 p-4 flex flex-col gap-y-4">
	<h1 class="text-4xl text-center uppercase font-bold">
		{$page.data.session?.user.user_metadata.name}
	</h1>

	<nav class="w-full flex flex-col sm:flex-row justify-center gap-2 self-center sm:[&>button]:w-44">
		<button
			class={activePage === 'colors' ? 'button-primary' : 'button'}
			on:click={() => {
				activePage = 'colors';
			}}
		>
			Colors
		</button>
		<button
			class={activePage === 'colorSchemes' ? 'button-primary' : 'button'}
			on:click={() => {
				activePage = 'colorSchemes';
			}}
		>
			Color Schemes
		</button>
		<button
			class={activePage === 'account' ? 'button-primary' : 'button'}
			on:click={() => {
				activePage = 'account';
			}}
		>
			Account
		</button>
	</nav>

	{#if activePage === 'colors'}
		<div class="flex-1 w-full max-w-4xl self-center flex flex-col gap-y-2">
			<div
				class="flex-1 p-2 grid gap-2 overflow-y-auto border-2 rounded-md border-black"
				style="grid-template-columns: repeat(auto-fill, minmax(50px, 1fr)); grid-auto-rows: min-content;"
			>
				{#each savedColors as color (color)}
					{@const contrastColor = contrastingColor(color)}

					<button
						class="button aspect-square"
						style={`background-color: ${color};`}
						use:showTooltip={{ position: 'top', message: color }}
						on:click={() => {
							selectedColor = color;
						}}
					>
						{#if color === selectedColor}
							<div
								class="w-3 h-3 border-2 rounded-full bg-white border-black"
								transition:scale={{ duration: 300 }}
							/>
						{/if}
					</button>
				{/each}
			</div>

			<div class="flex gap-x-2">
				<button
					class="button flex-1"
					use:showTooltip={{ position: 'top', message: 'Copy Hex' }}
					on:click={() => {
						navigator.clipboard.writeText(selectedColor.toUpperCase());
						addNotification(`${selectedColor} Copied`, 'copied', selectedColor);
					}}
				>
					<CopyIcon />
				</button>

				<button class="button flex-1">
					<TrashIcon />
				</button>
			</div>
		</div>
	{/if}
</div>
