<script lang="ts">
	import { goto } from '$app/navigation';
	import uniqid from 'uniqid';
	import { generateColorScheme, colorSchemeToSlug } from '$lib/utils';
	import { slide } from 'svelte/transition';

	type Color = {
		id: string;
		hex: string;
		locked: boolean;
	};

	export let initialColorScheme: string[];

	const MIN_COLOR_SCHEME_SIZE = 2;
	const MAX_COLOR_SCHEME_SIZE = 5;

	let colorSchemes: Color[][] = [
		initialColorScheme.map((color) => {
			return { id: uniqid(), hex: color, locked: false };
		})
	];
	let colorSchemeIndex = 0;

	function gotoColorScheme(): void {
		goto(
			`/generate/${colorSchemeToSlug(colorSchemes[colorSchemeIndex].map((color) => color.hex))}`
		);
	}

	function addColorScheme(): void {
		const currentColorScheme = colorSchemes[colorSchemeIndex];
		const lockedColorsCount = currentColorScheme.filter((color) => color.locked).length;
		const newColorsCount = currentColorScheme.length - lockedColorsCount;

		if (newColorsCount > 0) {
			const newColorScheme = structuredClone(currentColorScheme);
			const newColors = generateColorScheme(newColorsCount);

			for (let i = 0; i < newColorScheme.length; i++) {
				if (!newColorScheme[i].locked) {
					newColorScheme[i].hex = <string>newColors.shift();
				}
			}

			colorSchemes.splice(0, colorSchemeIndex);
			colorSchemes = [newColorScheme, ...colorSchemes];

			colorSchemeIndex = 0;

			gotoColorScheme();
		}
	}

	function undoColorScheme(): void {
		if (colorSchemeIndex < colorSchemes.length - 1) {
			colorSchemeIndex++;
			gotoColorScheme();
		}
	}

	function redoColorScheme(): void {
		if (colorSchemeIndex > 0) {
			colorSchemeIndex--;
			gotoColorScheme();
		}
	}

	function addColor(): void {
		const currentColorScheme = colorSchemes[colorSchemeIndex];

		if (currentColorScheme.length < MAX_COLOR_SCHEME_SIZE) {
			const newColorScheme = structuredClone(currentColorScheme);

			newColorScheme.push(
				...generateColorScheme(1).map((color) => {
					return { id: uniqid(), hex: color, locked: false };
				})
			);
			colorSchemes = [newColorScheme, ...colorSchemes];

			colorSchemeIndex = 0;

			gotoColorScheme();
		}
	}

	function removeColor(index: number): void {
		const currentColorScheme = colorSchemes[colorSchemeIndex];

		if (currentColorScheme.length > MIN_COLOR_SCHEME_SIZE) {
			const newColorScheme = structuredClone(currentColorScheme);

			newColorScheme.splice(index, 1);
			colorSchemes = [newColorScheme, ...colorSchemes];

			colorSchemeIndex = 0;

			gotoColorScheme();
		}
	}

	function toggleLockedColor(index: number): void {
		colorSchemes[colorSchemeIndex][index].locked = !colorSchemes[colorSchemeIndex][index].locked;
	}
</script>

<menu class="fixed bottom-4 left-4 right-4 p-4 flex gap-4 rounded-lg bg-white">
	<button class="button" on:click={addColorScheme}>Generate</button>
	<button class="button" on:click={undoColorScheme}>Undo</button>
	<button class="button" on:click={redoColorScheme}>Redo</button>
	<div class="flex">
		{#each colorSchemes[colorSchemeIndex] as color, index (color.id)}
			<div
				class="p-8 mx-2 rounded-lg"
				style={`background-color: ${color.hex};`}
				transition:slide={{ duration: 300, axis: 'x' }}
			>
				{#if colorSchemes[colorSchemeIndex].length > MIN_COLOR_SCHEME_SIZE}
					<button
						class="button"
						on:click={() => {
							removeColor(index);
						}}
					>
						X
					</button>
				{/if}
				<button
					class="button"
					on:click={() => {
						toggleLockedColor(index);
					}}
				>
					{colorSchemes[colorSchemeIndex][index].locked ? 'Unlock' : 'Lock'}
				</button>
			</div>
		{/each}
	</div>
	{#if colorSchemes[colorSchemeIndex].length < MAX_COLOR_SCHEME_SIZE}
		<button class="button" on:click={addColor}>+</button>
	{/if}
</menu>
