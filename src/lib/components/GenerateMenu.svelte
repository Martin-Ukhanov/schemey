<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { flip } from 'svelte/animate';
	import { generateColorScheme, colorSchemeToSlug, contrastingColor } from '$lib/utils';
	import { colorSpacePresets } from '$lib/stores/colorSpacePresets';
	import { addNotification } from '$lib/stores/notifications';
	import { scale, slide } from 'svelte/transition';
	import Modal from './Modal.svelte';
	import List from './List.svelte';
	import ColorPicker from './ColorPicker.svelte';
	import ArrowUpIcon from './icons/ArrowUpIcon.svelte';
	import ArrowDownIcon from './icons/ArrowDownIcon.svelte';
	import ArrowLeftIcon from './icons/ArrowLeftIcon.svelte';
	import ArrowRightIcon from './icons/ArrowRightIcon.svelte';
	import ResizeIcon from './icons/ResizeIcon.svelte';
	import GenerateIcon from './icons/GenerateIcon.svelte';
	import UndoIcon from './icons/UndoIcon.svelte';
	import RedoIcon from './icons/RedoIcon.svelte';
	import BookmarkIcon from './icons/BookmarkIcon.svelte';
	import XSquareIcon from './icons/XSquareIcon.svelte';
	import CopyIcon from './icons/CopyIcon.svelte';
	import LockedIcon from './icons/LockedIcon.svelte';
	import UnlockedIcon from './icons/UnlockedIcon.svelte';
	import PlusIcon from './icons/PlusIcon.svelte';

	type Color = {
		id: number;
		hex: string;
		locked: boolean;
	};

	export let initialColorScheme: string[];

	const MIN_COLOR_SCHEME_SIZE = 2;
	const MAX_COLOR_SCHEME_SIZE = 5;
	const MAX_COLOR_SCHEMES_LENGTH = 100;

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

	let originalColorPickerHex: string;
	let colorPickerColor: Color;
	let colorPickerModalOpen = false;

	function resizeMenuMouse(e: MouseEvent): void {
		let mouseY = e.y;

		if (browser) {
			document.onmousemove = (e) => {
				e.preventDefault();
				const dy = mouseY - e.y;
				mouseY = e.y;
				menuElement.style.height = parseInt(getComputedStyle(menuElement).height) + dy + 'px';
				document.body.style.cursor = 'grabbing';
			};

			document.onmouseup = (e) => {
				e.preventDefault();
				document.onmousemove = null;
				document.onmouseup = null;
				document.body.style.cursor = 'default';
			};
		}
	}

	function resizeMenuTouch(e: TouchEvent): void {
		let touchY = e.touches[0].clientY;

		if (browser) {
			document.ontouchmove = (e) => {
				e.preventDefault();
				const dy = touchY - e.touches[0].clientY;
				touchY = e.touches[0].clientY;
				menuElement.style.height = parseInt(getComputedStyle(menuElement).height) + dy + 'px';
			};

			document.ontouchend = (e) => {
				e.preventDefault();
				document.ontouchmove = null;
				document.ontouchend = null;
			};
		}
	}

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

	function newColorScheme(): Color[] {
		const currentColorScheme = colorSchemes[colorSchemeIndex];
		const newColorScheme = structuredClone(currentColorScheme);
		const lockedColorsCount = currentColorScheme.filter((color) => color.locked).length;
		const newColorsCount = currentColorScheme.length - lockedColorsCount;

		if (newColorsCount > 0) {
			const newColors = generateColorScheme(newColorsCount, $colorSpacePresets[colorSpace]);

			for (let i = 0; i < newColorScheme.length; i++) {
				if (!newColorScheme[i].locked) {
					newColorScheme[i].hex = <string>newColors.shift();
				}
			}
		}

		return newColorScheme;
	}

	function addColorScheme(colorScheme: Color[]): void {
		colorSchemes.splice(0, colorSchemeIndex);
		colorSchemes = [colorScheme, ...colorSchemes];
		colorSchemeIndex = 0;

		gotoColorScheme();
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

	function swapColors(index1: number, index2: number): void {
		const newColorScheme = structuredClone(colorSchemes[colorSchemeIndex]);
		[newColorScheme[index1], newColorScheme[index2]] = [
			newColorScheme[index2],
			newColorScheme[index1]
		];

		addColorScheme(newColorScheme);
	}

	function addColor(): void {
		const currentColorScheme = colorSchemes[colorSchemeIndex];

		if (currentColorScheme.length < MAX_COLOR_SCHEME_SIZE) {
			const newColorScheme = structuredClone(currentColorScheme);
			newColorScheme.push(
				...generateColorScheme(1, $colorSpacePresets[colorSpace]).map((color) => {
					return { id: uniqueColorId(), hex: color, locked: false };
				})
			);

			addColorScheme(newColorScheme);
		}
	}

	function removeColor(index: number): void {
		const currentColorScheme = colorSchemes[colorSchemeIndex];

		if (currentColorScheme.length > MIN_COLOR_SCHEME_SIZE) {
			const newColorScheme = structuredClone(currentColorScheme);
			newColorScheme.splice(index, 1);

			addColorScheme(newColorScheme);
		}
	}

	function toggleLockedColor(index: number): void {
		colorSchemes[colorSchemeIndex][index].locked = !colorSchemes[colorSchemeIndex][index].locked;
	}

	function colorPicker(): void {
		if (colorPickerColor.hex !== originalColorPickerHex) {
			const newColorScheme = structuredClone(colorSchemes[colorSchemeIndex]);
			colorPickerColor.hex = originalColorPickerHex;

			addColorScheme(newColorScheme);
		}
	}

	$: if (colorSchemes.length > MAX_COLOR_SCHEMES_LENGTH) {
		colorSchemes.splice(MAX_COLOR_SCHEMES_LENGTH, colorSchemes.length - MAX_COLOR_SCHEMES_LENGTH);
	}

	$: if (browser) {
		document.body.classList.toggle('no-scroll', menuOpen);
	}

	$: if (colorPickerColor) {
		colorSchemes = colorSchemes;
	}
</script>

{#if !menuOpen}
	<menu
		class="w-full flex border-b-3 z-10 bg-white border-black"
		transition:slide={{ duration: 300, axis: 'y' }}
	>
		<button
			class="button flex-1 border-none rounded-none"
			disabled={colorSchemes.length === 1 || colorSchemeIndex === colorSchemes.length - 1}
			on:click={undoColorScheme}
		>
			<UndoIcon />
		</button>

		<div class="w-[3px] bg-black" />

		<button
			class="button flex-1 border-none rounded-none"
			on:click={() => {
				addColorScheme(newColorScheme());
			}}
		>
			<GenerateIcon />
		</button>

		<div class="w-[3px] bg-black" />

		<button
			class="button flex-1 border-none rounded-none"
			disabled={colorSchemeIndex === 0}
			on:click={redoColorScheme}
		>
			<RedoIcon />
		</button>
	</menu>
{/if}

<menu
	class="fixed bottom-0 w-full h-[291px] min-h-[291px] max-h-[calc(100%-theme(height.32))] py-4 border-t-3 z-10 bg-white border-black transition-transform duration-300"
	class:translate-y-full={!menuOpen}
	bind:this={menuElement}
	bind:clientWidth={menuWidth}
>
	<div class="absolute bottom-full left-4 flex gap-x-2">
		<button
			class="button rounded-b-none"
			on:click={() => {
				menuOpen = !menuOpen;
			}}
		>
			{#if menuOpen}
				<ArrowDownIcon />
			{:else}
				<ArrowUpIcon />
			{/if}
		</button>

		{#if menuOpen}
			<button
				class="button rounded-b-none cursor-grab active:cursor-grabbing"
				transition:scale={{ duration: 300 }}
				on:mousedown|preventDefault={resizeMenuMouse}
				on:touchstart|preventDefault={resizeMenuTouch}
			>
				<ResizeIcon />
			</button>
		{/if}
	</div>

	<div
		class="w-full h-full px-4 flex flex-col sm:flex-row gap-4 overflow-y-auto sm:overflow-y-visible"
	>
		<div class="sm:w-40 flex flex-col gap-y-4">
			<button
				class="button"
				on:click={() => {
					colorSpaceModalOpen = true;
				}}
			>
				{colorSpace}
			</button>

			<button
				class="button flex-1"
				on:click={() => {
					addColorScheme(newColorScheme());
				}}
			>
				<GenerateIcon />
			</button>

			<div class="flex gap-x-4">
				<button
					class="button flex-1"
					disabled={colorSchemes.length === 1 || colorSchemeIndex === colorSchemes.length - 1}
					on:click={undoColorScheme}
				>
					<UndoIcon />
				</button>

				<button class="button flex-1" disabled={colorSchemeIndex === 0} on:click={redoColorScheme}>
					<RedoIcon />
				</button>
			</div>

			<button class="button">
				<BookmarkIcon />
			</button>
		</div>

		<div class="flex-1 flex flex-col sm:flex-row">
			<div class="flex-1 flex flex-col lg:flex-row gap-4 sm:max-lg:overflow-y-scroll">
				{#each colorSchemes[colorSchemeIndex] as color, index (color.id)}
					{@const colorSchemeLength = colorSchemes[colorSchemeIndex].length}
					{@const contrastColor = contrastingColor(color.hex)}

					<div
						class="flex-1 p-4 flex flex-row-reverse lg:flex-col justify-between items-center gap-4 border-3 overflow-x-auto overflow-y-hidden sm:overflow-x-visible sm:overflow-y-visible rounded-md border-black"
						style={`background-color: ${color.hex};`}
						in:scale={{ duration: 300 }}
						out:scale={{ duration: 300 }}
						animate:flip={{ duration: 300 }}
					>
						<div class="flex flex-row lg:flex-col">
							<div class="flex flex-col lg:flex-row justify-center items-center">
								{#key menuWidth < 1024}
									{#if colorSchemeLength > MIN_COLOR_SCHEME_SIZE}
										<button
											class={contrastColor === '#000000'
												? 'button-transparent-black'
												: 'button-transparent-white'}
											transition:slide={{ duration: 300, axis: menuWidth < 1024 ? 'y' : 'x' }}
											on:click={() => {
												removeColor(index);
											}}
										>
											<XSquareIcon />
										</button>
									{/if}
								{/key}

								<button
									class={contrastColor === '#000000'
										? 'button-transparent-black'
										: 'button-transparent-white'}
								>
									<BookmarkIcon />
								</button>
							</div>

							<div class="flex flex-col lg:flex-row">
								<button
									class={contrastColor === '#000000'
										? 'button-transparent-black'
										: 'button-transparent-white'}
									on:click={() => {
										navigator.clipboard.writeText(color.hex.toUpperCase());
										addNotification(`${color.hex} Copied`, 'copied', color.hex);
									}}
								>
									<CopyIcon />
								</button>

								<button
									class={contrastColor === '#000000'
										? 'button-transparent-black'
										: 'button-transparent-white'}
									on:click={() => {
										toggleLockedColor(index);
										addNotification(
											`${color.hex} ${color.locked ? 'Locked' : 'Unlocked'}`,
											color.locked ? 'locked' : 'unlocked',
											color.hex
										);
									}}
								>
									{#if color.locked}
										<LockedIcon />
									{:else}
										<UnlockedIcon />
									{/if}
								</button>
							</div>

							<div class="flex flex-col lg:flex-row">
								<button
									class={contrastColor === '#000000'
										? 'button-transparent-black'
										: 'button-transparent-white'}
									on:click={() => {
										const index2 = index - 1 < 0 ? colorSchemeLength - 1 : index - 1;
										swapColors(index, index2);
									}}
								>
									{#if menuWidth < 1024}
										<ArrowUpIcon />
									{:else}
										<ArrowLeftIcon />
									{/if}
								</button>

								<button
									class={contrastColor === '#000000'
										? 'button-transparent-black'
										: 'button-transparent-white'}
									on:click={() => {
										const index2 = index + 1 > colorSchemeLength - 1 ? 0 : index + 1;
										swapColors(index, index2);
									}}
								>
									{#if menuWidth < 1024}
										<ArrowDownIcon />
									{:else}
										<ArrowRightIcon />
									{/if}
								</button>
							</div>
						</div>

						<button
							class={contrastColor === '#000000'
								? 'button-transparent-black'
								: 'button-transparent-white'}
							on:click={() => {
								originalColorPickerHex = color.hex;
								colorPickerColor = color;
								colorPickerModalOpen = true;
							}}
						>
							<span class="text-xl">{color.hex}</span>
						</button>
					</div>
				{/each}
			</div>

			{#key menuWidth < 640}
				{#if colorSchemes[colorSchemeIndex].length < MAX_COLOR_SCHEME_SIZE}
					<button
						class="button mt-4 sm:mt-0 sm:ml-4"
						transition:slide={{ duration: 300, axis: menuWidth < 640 ? 'y' : 'x' }}
						on:click={addColor}
					>
						<PlusIcon />
					</button>
				{/if}
			{/key}
		</div>
	</div>
</menu>

<Modal title="Color Space" bind:open={colorSpaceModalOpen}>
	<List
		items={Object.keys($colorSpacePresets)}
		bind:selectedItem={colorSpace}
		on:click={() => {
			colorSpaceModalOpen = false;
		}}
	/>
</Modal>

<Modal title="Color Picker" bind:open={colorPickerModalOpen} on:close={colorPicker}>
	<ColorPicker bind:hex={colorPickerColor.hex} />
</Modal>
