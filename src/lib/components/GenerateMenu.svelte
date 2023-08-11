<script lang="ts">
	import { goto } from '$app/navigation';
	import {
		COLOR_SPACE_PRESETS,
		generateColorScheme,
		colorSchemeToSlug,
		contrastingColor,
		copyToClipboard
	} from '$lib/utils';
	import { crossfade, slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { flip } from 'svelte/animate';

	type Color = {
		id: number;
		hex: string;
		locked: boolean;
	};

	export let initialColorScheme: string[];

	const MIN_COLOR_SCHEME_SIZE = 2;
	const MAX_COLOR_SCHEME_SIZE = 5;

	let open = true;
	let colorSpace = 'all';
	let currentColorId = 0;
	let colorSchemes: Color[][] = [
		initialColorScheme.map((color) => {
			return { id: uniqueColorId(), hex: color, locked: false };
		})
	];
	let colorSchemeIndex = 0;

	function uniqueColorId(): number {
		const colorId = currentColorId;
		currentColorId++;
		return colorId;
	}

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
			const newColors = generateColorScheme(newColorsCount, COLOR_SPACE_PRESETS[colorSpace]);

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
				...generateColorScheme(1, COLOR_SPACE_PRESETS[colorSpace]).map((color) => {
					return { id: uniqueColorId(), hex: color, locked: false };
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

	const [send, receive] = crossfade({
		fallback(node) {
			const style = getComputedStyle(node);
			const transform = style.transform === 'none' ? '' : style.transform;

			return {
				duration: 150,
				easing: cubicOut,
				css: (t) => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`
			};
		}
	});
</script>

<menu
	class="fixed bottom-0 left-0 right-0 h-72 p-4 flex justify-center border-t-3 bg-white border-black transition-transform duration-150"
	class:translate-y-full={!open}
>
	<button
		class="button p-2 absolute bottom-full border-b-0 rounded-b-none !brightness-100"
		on:click={() => {
			open = !open;
		}}
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			class="w-8 fill-black"
			class:rotate-180={open}
		>
			<path
				d="M3 19h18a1.002 1.002 0 0 0 .823-1.569l-9-13c-.373-.539-1.271-.539-1.645 0l-9 13A.999.999 0 0 0 3 19z"
			/>
		</svg>
	</button>
	<div class=" mr-4 flex gap-x-4">
		<button class="button" on:click={addColorScheme}>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-8 fill-black">
				<path
					d="M10 11H7.101l.001-.009a4.956 4.956 0 0 1 .752-1.787 5.054 5.054 0 0 1 2.2-1.811c.302-.128.617-.226.938-.291a5.078 5.078 0 0 1 2.018 0 4.978 4.978 0 0 1 2.525 1.361l1.416-1.412a7.036 7.036 0 0 0-2.224-1.501 6.921 6.921 0 0 0-1.315-.408 7.079 7.079 0 0 0-2.819 0 6.94 6.94 0 0 0-1.316.409 7.04 7.04 0 0 0-3.08 2.534 6.978 6.978 0 0 0-1.054 2.505c-.028.135-.043.273-.063.41H2l4 4 4-4zm4 2h2.899l-.001.008a4.976 4.976 0 0 1-2.103 3.138 4.943 4.943 0 0 1-1.787.752 5.073 5.073 0 0 1-2.017 0 4.956 4.956 0 0 1-1.787-.752 5.072 5.072 0 0 1-.74-.61L7.05 16.95a7.032 7.032 0 0 0 2.225 1.5c.424.18.867.317 1.315.408a7.07 7.07 0 0 0 2.818 0 7.031 7.031 0 0 0 4.395-2.945 6.974 6.974 0 0 0 1.053-2.503c.027-.135.043-.273.063-.41H22l-4-4-4 4z"
				/>
			</svg>
		</button>
		<button class="button" on:click={undoColorScheme}>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-8 fill-black">
				<path
					d="M9 10h6c1.654 0 3 1.346 3 3s-1.346 3-3 3h-3v2h3c2.757 0 5-2.243 5-5s-2.243-5-5-5H9V5L4 9l5 4v-3z"
				/>
			</svg>
		</button>
		<button class="button" on:click={redoColorScheme}>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-8 fill-black">
				<path
					d="M9 18h3v-2H9c-1.654 0-3-1.346-3-3s1.346-3 3-3h6v3l5-4-5-4v3H9c-2.757 0-5 2.243-5 5s2.243 5 5 5z"
				/>
			</svg>
		</button>
	</div>
	<div class="flex-1 flex gap-4">
		{#each colorSchemes[colorSchemeIndex] as color, index (color.id)}
			{@const contrast = contrastingColor(color.hex)}
			<div
				class="flex-1 p-4 flex flex-col justify-between items-center border-3 rounded-md border-black transition-colors duration-150"
				style={`background-color: ${color.hex};`}
				in:receive={{ key: color.id }}
				out:send={{ key: color.id }}
				animate:flip={{ duration: 150 }}
			>
				<div>
					{#if colorSchemes[colorSchemeIndex].length > MIN_COLOR_SCHEME_SIZE}
						<button
							class={contrast === '#000000'
								? 'button-transparent-black'
								: 'button-transparent-white'}
							style={`color: ${contrast}`}
							on:click={() => {
								removeColor(index);
							}}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								class="w-8"
								style={`fill: ${contrast}`}
							>
								<path
									d="M21 5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5zm-4.793 9.793-1.414 1.414L12 13.414l-2.793 2.793-1.414-1.414L10.586 12 7.793 9.207l1.414-1.414L12 10.586l2.793-2.793 1.414 1.414L13.414 12l2.793 2.793z"
								/>
							</svg>
						</button>
					{/if}
					<button
						class={contrast === '#000000' ? 'button-transparent-black' : 'button-transparent-white'}
						on:click={() => {
							copyToClipboard(color.hex.toUpperCase());
						}}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							class="w-8"
							style={`fill: ${contrast}`}
						>
							<path
								d="M14 8H4c-1.103 0-2 .897-2 2v10c0 1.103.897 2 2 2h10c1.103 0 2-.897 2-2V10c0-1.103-.897-2-2-2z"
							/>
							<path
								d="M20 2H10a2 2 0 0 0-2 2v2h8a2 2 0 0 1 2 2v8h2a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"
							/>
						</svg>
					</button>
					<button
						class={contrast === '#000000' ? 'button-transparent-black' : 'button-transparent-white'}
						on:click={() => {
							toggleLockedColor(index);
						}}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							class="w-8"
							style={`fill: ${contrast}`}
						>
							{#if color.locked}
								<path
									d="M20 12c0-1.103-.897-2-2-2h-1V7c0-2.757-2.243-5-5-5S7 4.243 7 7v3H6c-1.103 0-2 .897-2 2v8c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-8zM9 7c0-1.654 1.346-3 3-3s3 1.346 3 3v3H9V7z"
								/>
							{:else}
								<path
									d="M17 8V7c0-2.757-2.243-5-5-5S7 4.243 7 7v3H6c-1.103 0-2 .897-2 2v8c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-8c0-1.103-.897-2-2-2H9V7c0-1.654 1.346-3 3-3s3 1.346 3 3v1h2z"
								/>
							{/if}
						</svg>
					</button>
				</div>
				<button
					class={contrast === '#000000' ? 'button-transparent-black' : 'button-transparent-white'}
					style={`color: ${contrast}`}
				>
					<span class="text-lg font-bold">{color.hex}</span>
				</button>
			</div>
		{/each}
	</div>
	{#if colorSchemes[colorSchemeIndex].length < MAX_COLOR_SCHEME_SIZE}
		<button class="button ml-4" transition:slide={{ duration: 150, axis: 'x' }} on:click={addColor}>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-8 fill-black">
				<path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z" />
			</svg>
		</button>
	{/if}
</menu>
