<script lang="ts">
	import { goto } from '$app/navigation';
	import { generateColorScheme, colorSchemeToSlug } from '$lib/utils';

	export let initialColorScheme: string[];

	let colorSchemes: string[][] = [initialColorScheme];
	let colorSchemeSize: number = colorSchemes[0].length;
	let colorSchemeIndex = 0;
	let lockedColors: (string | null)[] = new Array(colorSchemeSize).fill(null);

	function gotoColorScheme(): void {
		goto(`/generate/${colorSchemeToSlug(colorSchemes[colorSchemeIndex])}`);
	}

	function pushColorScheme(): void {
		const lockedColorsCount = lockedColors.filter((color) => color).length;
		const newColorScheme = [...lockedColors];
		const newColors = generateColorScheme(colorSchemeSize - lockedColorsCount);

		for (let i = 0; i < newColorScheme.length; i++) {
			if (!newColorScheme[i]) {
				newColorScheme[i] = <string>newColors.shift();
			}
		}

		colorSchemes = colorSchemes.slice(colorSchemeIndex);
		colorSchemes = [<string[]>newColorScheme, ...colorSchemes];
		colorSchemeIndex = 0;

		gotoColorScheme();
	}

	function undoColorScheme(): void {
		colorSchemeIndex =
			colorSchemeIndex < colorSchemes.length - 1 ? colorSchemeIndex + 1 : colorSchemeIndex;
		resetLockedColors();
		gotoColorScheme();
	}

	function redoColorScheme(): void {
		colorSchemeIndex = colorSchemeIndex > 0 ? colorSchemeIndex - 1 : colorSchemeIndex;
		resetLockedColors();
		gotoColorScheme();
	}

	function toggleLockedColor(index: number): void {
		lockedColors[index] = lockedColors[index] ? null : colorSchemes[colorSchemeIndex][index];
	}

	function resetLockedColors(): void {
		lockedColors = new Array(colorSchemeSize).fill(null);
	}

	function onChangeColorSchemeSize(): void {
		if (colorSchemeSize < colorSchemes[colorSchemeIndex].length) {
			colorSchemes = [colorSchemes[colorSchemeIndex].slice(0, colorSchemeSize)];
		} else {
			const newColorsCount = colorSchemeSize - colorSchemes[colorSchemeIndex].length;
			colorSchemes = [[...colorSchemes[colorSchemeIndex], ...generateColorScheme(newColorsCount)]];
		}

		colorSchemeIndex = 0;
		resetLockedColors();

		goto(`/generate/${colorSchemeToSlug(colorSchemes[colorSchemeIndex])}`);
	}
</script>

<menu class="fixed bottom-4 left-4 right-4 p-4 flex gap-4 rounded-lg bg-white">
	<button class="button" on:click={pushColorScheme}>Generate</button>
	<button class="button" on:click={undoColorScheme}>Undo</button>
	<button class="button" on:click={redoColorScheme}>Redo</button>
	<div class="w-8 h-8 bg-[var(--primary)]" />
	<div class="w-8 h-8 bg-[var(--primary-background)]" />
	{#if colorSchemes[colorSchemeIndex][2]}
		<div class="w-8 h-8 bg-[var(--secondary)]" />
	{/if}
	{#if colorSchemes[colorSchemeIndex][3]}
		<div class="w-8 h-8 bg-[var(--tertiary)]" />
	{/if}
	{#if colorSchemes[colorSchemeIndex][4]}
		<div class="w-8 h-8 bg-[var(--secondary-background)]" />
	{/if}
	<button
		class="button"
		on:click={() => {
			toggleLockedColor(0);
		}}
	>
		Lock Primary
	</button>
	<button
		class="button"
		on:click={() => {
			toggleLockedColor(2);
		}}
	>
		Lock Secondary
	</button>
	<button
		class="button"
		on:click={() => {
			toggleLockedColor(3);
		}}
	>
		Lock Tertiary
	</button>
	<button
		class="button"
		on:click={() => {
			toggleLockedColor(1);
		}}
	>
		Lock Background
	</button>
	<select class="text-black" bind:value={colorSchemeSize} on:change={onChangeColorSchemeSize}>
		<option value={2}>2</option>
		<option value={3}>3</option>
		<option value={4}>4</option>
		<option value={5}>5</option>
	</select>
</menu>
