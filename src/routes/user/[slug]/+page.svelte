<script lang="ts">
	import { page } from '$app/stores';
	import { scale } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { contrastingColor } from '$lib/utils';
	import { showTooltip } from '$lib/actions/showTooltip';
	import { addNotification } from '$lib/stores/notifications';
	import CopyIcon from '$lib/components/icons/CopyIcon.svelte';
	import TrashIcon from '$lib/components/icons/TrashIcon.svelte';
	import Loader from '$lib/components/Loader.svelte';

	type SavedColor = {
		hex: string;
		isDeleteLoading: boolean;
	};

	type SavedColorScheme = {
		colorScheme: string[];
		isDeleteLoading: boolean;
	};

	let activePage: 'colors' | 'colorSchemes' | 'account' = 'colors';
	let savedColors: SavedColor[] = $page.data.savedColors.map((SavedColor: string) => {
		return { hex: SavedColor, isDeleteLoading: false };
	});
	let savedColorSchemes: SavedColorScheme[] = $page.data.savedColorSchemes.map(
		(savedColorScheme: string[]) => {
			return { colorScheme: savedColorScheme, isDeleteLoading: false };
		}
	);

	async function deleteColor(color: string): Promise<void> {
		const response = await fetch('/api/colors', {
			method: 'DELETE',
			body: JSON.stringify({ color: color }),
			headers: {
				'content-type': 'application/json'
			}
		});
		const data = await response.json();

		if (data.success) {
			savedColors = savedColors.filter((savedColor) => savedColor.hex !== color);
			addNotification(`${color} Deleted`, 'trash', color);
		} else {
			addNotification(`Failed to Delete ${color}`, 'x', color);
		}
	}

	async function deleteColorScheme(colorScheme: string[]): Promise<void> {
		const response = await fetch('/api/colorSchemes', {
			method: 'DELETE',
			body: JSON.stringify({ colorScheme: colorScheme }),
			headers: {
				'content-type': 'application/json'
			}
		});
		const data = await response.json();

		if (data.success) {
			savedColorSchemes = savedColorSchemes.filter(
				(savedColorScheme) =>
					JSON.stringify(savedColorScheme.colorScheme) !== JSON.stringify(colorScheme)
			);
			addNotification('Color Scheme Deleted', 'trash');
		} else {
			addNotification('Failed to Delete Color Scheme', 'x');
		}
	}
</script>

<nav class="h-44 sm:h-20 p-4 flex flex-col sm:flex-row justify-center gap-2 sm:[&>button]:w-48">
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

<div
	class="h-[calc(100dvh-theme(height.60))] sm:h-[calc(100dvh-theme(height.36))] min-h-64 p-4 pt-0 w-full self-center"
>
	{#if activePage === 'colors'}
		<div
			class="h-full p-2 grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(theme(width.60),1fr))] auto-rows-[theme(height.24)] gap-2 overflow-y-auto border-2 rounded-md border-black"
		>
			{#each savedColors as savedColor (savedColor.hex)}
				{@const contrastColor = contrastingColor(savedColor.hex)}

				<div class="flex" transition:scale={{ duration: 300 }} animate:flip={{ duration: 300 }}>
					<button
						class="flex-1 p-2 grid items-center overflow-x-auto border-2 rounded-l-md border-black cursor-pointer group"
						style={`background-color: ${savedColor.hex};`}
						use:showTooltip={{ position: 'top', message: 'Copy Hex' }}
						on:click={() => {
							navigator.clipboard.writeText(savedColor.hex.toUpperCase());
							addNotification(`${savedColor.hex} Copied`, 'copied', savedColor.hex);
						}}
					>
						<span
							class="scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-100 text-center text-xl font-bold uppercase transition-all duration-300"
							style={`color: ${contrastColor};`}
						>
							{savedColor.hex}
						</span>
					</button>

					<button
						class="button border-l-0 rounded-l-none"
						use:showTooltip={{ position: 'top', message: 'Delete Color' }}
						on:click={async () => {
							savedColor.isDeleteLoading = true;
							await deleteColor(savedColor.hex);
							savedColor.isDeleteLoading = false;
						}}
					>
						<div class:opacity-0={savedColor.isDeleteLoading}>
							<TrashIcon />
						</div>
						{#if savedColor.isDeleteLoading}
							<Loader color={contrastColor === '#ffffff' ? 'white' : 'black'} />
						{/if}
					</button>
				</div>
			{/each}
		</div>
	{:else if activePage === 'colorSchemes'}
		<div
			class="h-full p-2 grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(theme(width.96),1fr))] auto-rows-[theme(height.36)] gap-2 overflow-y-auto border-2 rounded-md border-black"
		>
			{#each savedColorSchemes as savedColorScheme (savedColorScheme.colorScheme)}
				<div class="flex" transition:scale={{ duration: 300 }} animate:flip={{ duration: 300 }}>
					<div class="flex-1 flex overflow-x-auto border-2 rounded-md rounded-r-none border-black">
						{#each savedColorScheme.colorScheme as color}
							{@const contrastColor = contrastingColor(color)}

							<button
								class="flex-grow basis-4 hover:basis-28 p-2 grid items-center overflow-x-hidden hover:overflow-x-auto cursor-pointer transition-all duration-300 group"
								style={`background-color: ${color};`}
								use:showTooltip={{ position: 'top', message: 'Copy Hex' }}
								on:click={() => {
									navigator.clipboard.writeText(color.toUpperCase());
									addNotification(`${color} Copied`, 'copied', color);
								}}
							>
								<span
									class="scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-100 text-center uppercase text-xl font-bold transition-all duration-300"
									style={`color: ${contrastColor}`}
								>
									{color}
								</span>
							</button>
						{/each}
					</div>

					<button
						class="button border-l-0 rounded-l-none"
						use:showTooltip={{ position: 'top', message: 'Delete Color Scheme' }}
						on:click={async () => {
							savedColorScheme.isDeleteLoading = true;
							await deleteColorScheme(savedColorScheme.colorScheme);
							savedColorScheme.isDeleteLoading = false;
						}}
					>
						<div class:opacity-0={savedColorScheme.isDeleteLoading}>
							<TrashIcon />
						</div>

						{#if savedColorScheme.isDeleteLoading}
							<Loader color="black" />
						{/if}
					</button>
				</div>
			{/each}
		</div>
	{:else if activePage === 'account'}
		<h1 class="text-4xl text-center uppercase font-bold overflow-x-auto">
			{$page.data.session?.user.user_metadata.name}
		</h1>
	{/if}
</div>
