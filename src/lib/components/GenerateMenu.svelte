<script lang="ts">
	import { goto } from '$app/navigation';
	import {
		COLOR_SPACE_PRESETS,
		generateColorScheme,
		colorSchemeToSlug,
		contrastingColor,
		copyToClipboard
	} from '$lib/utils';
	import { browser } from '$app/environment';
	import { crossfade, slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { flip } from 'svelte/animate';
	import Modal from './Modal.svelte';
	import List from './List.svelte';

	type Color = {
		id: number;
		hex: string;
		locked: boolean;
	};

	export let initialColorScheme: string[];

	const MIN_COLOR_SCHEME_SIZE = 2;
	const MAX_COLOR_SCHEME_SIZE = 5;

	let menuElement: HTMLMenuElement;
	let menuWidth: number;
	let menuOpen = true;
	let colorSpace = 'all';
	let colorSpaceModalOpen = false;
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

			colorSchemes.splice(0, colorSchemeIndex);
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

			colorSchemes.splice(0, colorSchemeIndex);
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
				duration: 200,
				easing: cubicOut,
				css: (t) => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`
			};
		}
	});

	$: if (browser) {
		document.body.classList.toggle('no-scroll', menuOpen);
	}
</script>

<menu
	class="fixed bottom-0 left-0 right-0 min-h-72 h-72 max-h-[calc(100%-theme(spacing.16))] py-4 border-t-3 bg-white border-black transition-transform duration-200"
	class:translate-y-full={!menuOpen}
	bind:this={menuElement}
	bind:clientWidth={menuWidth}
>
	<div class="absolute bottom-full left-4 flex gap-x-2">
		<button
			class="button rounded-b-none !brightness-100"
			on:click={() => {
				menuOpen = !menuOpen;
			}}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				class="w-8 fill-black"
				class:rotate-180={menuOpen}
			>
				<path
					d="M3 19h18a1.002 1.002 0 0 0 .823-1.569l-9-13c-.373-.539-1.271-.539-1.645 0l-9 13A.999.999 0 0 0 3 19z"
				/>
			</svg>
		</button>
		{#if menuOpen}
			<button
				class="button rounded-b-none !brightness-100"
				on:mousedown={(e) => {
					let mouseY = e.y;

					if (browser) {
						document.onmousemove = (e) => {
							const dy = mouseY - e.y;
							mouseY = e.y;
							menuElement.style.height = parseInt(getComputedStyle(menuElement).height) + dy + 'px';
						};

						document.onmouseup = () => {
							document.onmousemove = null;
							document.onmouseup = null;
						};
					}
				}}
				on:touchstart={(e) => {
					let touchY = e.touches[0].clientY;

					if (browser) {
						document.ontouchmove = (e) => {
							const dy = touchY - e.touches[0].clientY;
							touchY = e.touches[0].clientY;
							menuElement.style.height = parseInt(getComputedStyle(menuElement).height) + dy + 'px';
						};

						document.ontouchend = () => {
							document.ontouchmove = null;
							document.ontouchend = null;
						};
					}
				}}
			>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-8 fill-black">
					<path d="m7 17 5 5 5-5h-4V7h4l-5-5-5 5h4v10z" />
				</svg>
			</button>
		{/if}
	</div>
	<div class="w-full h-full px-4 flex flex-col sm:flex-row gap-4 overflow-y-auto">
		<div class="sm:w-40 h-full flex flex-col gap-y-4">
			<button
				class="button"
				on:click={() => {
					colorSpaceModalOpen = true;
				}}
			>
				{colorSpace}
			</button>
			<button class="button flex-1" on:click={addColorScheme}>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-8 fill-black">
					<path
						d="M7.08 11.25A4.84 4.84 0 0 1 8 9.05L4.43 5.49A9.88 9.88 0 0 0 2 11.25zM9.05 8a4.84 4.84 0 0 1 2.2-.91V2a9.88 9.88 0 0 0-5.76 2.43zm3.7-6v5A4.84 4.84 0 0 1 15 8l3.56-3.56A9.88 9.88 0 0 0 12.75 2zM8 15a4.84 4.84 0 0 1-.91-2.2H2a9.88 9.88 0 0 0 2.39 5.76zm3.25 1.92a4.84 4.84 0 0 1-2.2-.92l-3.56 3.57A9.88 9.88 0 0 0 11.25 22zM16 9.05a4.84 4.84 0 0 1 .91 2.2h5a9.88 9.88 0 0 0-2.39-5.76zM15 16a4.84 4.84 0 0 1-2.2.91v5a9.88 9.88 0 0 0 5.76-2.39zm1.92-3.25A4.84 4.84 0 0 1 16 15l3.56 3.56A9.88 9.88 0 0 0 22 12.75z"
					/>
				</svg>
			</button>
			<div class="flex gap-x-4">
				<button
					class="button flex-1"
					on:click={undoColorScheme}
					disabled={colorSchemes.length === 1 || colorSchemeIndex === colorSchemes.length - 1}
				>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-8 fill-black">
						<path
							d="M9 10h6c1.654 0 3 1.346 3 3s-1.346 3-3 3h-3v2h3c2.757 0 5-2.243 5-5s-2.243-5-5-5H9V5L4 9l5 4v-3z"
						/>
					</svg>
				</button>
				<button class="button flex-1" on:click={redoColorScheme} disabled={colorSchemeIndex === 0}>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-8 fill-black">
						<path
							d="M9 18h3v-2H9c-1.654 0-3-1.346-3-3s1.346-3 3-3h6v3l5-4-5-4v3H9c-2.757 0-5 2.243-5 5s2.243 5 5 5z"
						/>
					</svg>
				</button>
			</div>
			<button class="button">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-8 fill-black">
					<path
						d="M18 2H6c-1.103 0-2 .897-2 2v18l8-4.572L20 22V4c0-1.103-.897-2-2-2zm0 16.553-6-3.428-6 3.428V4h12v14.553z"
					/>
				</svg>
			</button>
		</div>
		<div class="flex-1 flex flex-col sm:flex-row">
			<div
				class="flex-1 sm:max-lg:pr-2 flex flex-col lg:flex-row gap-4 sm:max-lg:overflow-y-scroll"
			>
				{#each colorSchemes[colorSchemeIndex] as color, index (color.id)}
					{@const contrast = contrastingColor(color.hex)}
					<div
						class="flex-1 p-4 flex flex-row-reverse lg:flex-col justify-between items-center border-3 overflow-x-auto sm:overflow-x-visible rounded-md border-black transition-colors duration-200"
						style={`background-color: ${color.hex};`}
						in:receive={{ key: color.id }}
						out:send={{ key: color.id }}
						animate:flip={{ duration: 200 }}
					>
						<div class="flex flex-col">
							<div class="flex justify-center">
								{#if colorSchemes[colorSchemeIndex].length > MIN_COLOR_SCHEME_SIZE}
									<button
										class={contrast === '#000000'
											? 'button-transparent-black'
											: 'button-transparent-white'}
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
									class={contrast === '#000000'
										? 'button-transparent-black'
										: 'button-transparent-white'}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										class="w-8"
										style={`fill: ${contrast}`}
									>
										<path
											d="M18 2H6c-1.103 0-2 .897-2 2v18l8-4.572L20 22V4c0-1.103-.897-2-2-2zm0 16.553-6-3.428-6 3.428V4h12v14.553z"
										/>
									</svg>
								</button>
							</div>
							<div class="flex">
								<button
									class={contrast === '#000000'
										? 'button-transparent-black'
										: 'button-transparent-white'}
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
									class={contrast === '#000000'
										? 'button-transparent-black'
										: 'button-transparent-white'}
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
						</div>
						<button
							class={contrast === '#000000'
								? 'button-transparent-black'
								: 'button-transparent-white'}
							style={`color: ${contrast}`}
						>
							<span class="text-lg font-bold">{color.hex}</span>
						</button>
					</div>
				{/each}
			</div>
			{#key menuWidth < 640}
				{#if colorSchemes[colorSchemeIndex].length < MAX_COLOR_SCHEME_SIZE}
					<button
						class="button max-sm:mt-4 sm:ml-4"
						transition:slide={{ duration: 200, axis: menuWidth < 640 ? 'y' : 'x' }}
						on:click={addColor}
					>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-8 fill-black">
							<path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z" />
						</svg>
					</button>
				{/if}
			{/key}
		</div>
	</div>
</menu>
<Modal title="Color Space" bind:open={colorSpaceModalOpen}>
	<List items={Object.keys(COLOR_SPACE_PRESETS)} bind:selectedItem={colorSpace} />
</Modal>
