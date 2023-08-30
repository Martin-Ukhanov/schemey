<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { scale, slide, type TransitionConfig } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { v4 as uuid } from 'uuid';
	import theme from 'tailwindcss/defaultTheme';
	import { generateColorScheme, colorSchemeToSlug, contrastingColor } from '$lib/utils';
	import { isSignInModalOpen } from '$lib/stores/auth';
	import { colorSpacePresets } from '$lib/stores/colorSpacePresets';
	import { isResizingMenu } from '$lib/stores/generateMenu';
	import { addNotification } from '$lib/stores/notifications';
	import { showTooltip } from '$lib/actions/showTooltip';
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
	import SaveIcon from './icons/SaveIcon.svelte';
	import SavedIcon from './icons/SavedIcon.svelte';
	import XSquareIcon from './icons/XSquareIcon.svelte';
	import CopyIcon from './icons/CopyIcon.svelte';
	import LockedIcon from './icons/LockedIcon.svelte';
	import UnlockedIcon from './icons/UnlockedIcon.svelte';
	import PlusIcon from './icons/PlusIcon.svelte';

	type Color = {
		id: string;
		hex: string;
		locked: boolean;
	};

	export let initialColorScheme: string[];

	const MIN_COLOR_SCHEME_SIZE = 2;
	const MAX_COLOR_SCHEME_SIZE = 5;
	const MAX_COLOR_SCHEMES_LENGTH = 100;

	let savedColors: string[] = $page.data.savedColors ?? [];
	let savedColorSchemes: string[][] = $page.data.savedColorSchemes ?? [];

	let menuElement: HTMLMenuElement;
	let menuWidth: number;
	let isMenuOpen = true;

	let currentColorSpace = 'all';
	let isColorSpaceModalOpen = false;

	let colorSchemes: Color[][] = [
		initialColorScheme.map((color) => {
			return { id: uuid(), hex: color, locked: false };
		})
	];
	let currentColorSchemeIndex = 0;

	let originalColorPickerHex: string;
	let colorPickerColor: Color;
	let colorPickerModalOpen = false;

	function resizeMenuMouse(e: MouseEvent): void {
		$isResizingMenu = true;
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
				$isResizingMenu = false;
				document.onmousemove = null;
				document.onmouseup = null;
				document.body.style.cursor = 'default';
			};
		}
	}

	function resizeMenuTouch(e: TouchEvent): void {
		$isResizingMenu = true;
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
				$isResizingMenu = false;
				document.ontouchmove = null;
				document.ontouchend = null;
			};
		}
	}

	function gotoColorScheme(): void {
		goto(
			'/generate/' +
				colorSchemeToSlug(colorSchemes[currentColorSchemeIndex].map((color) => color.hex)),
			{ replaceState: true }
		);
	}

	function newColorScheme(): Color[] {
		const currentColorScheme = colorSchemes[currentColorSchemeIndex];
		const newColorScheme = structuredClone(currentColorScheme);
		const lockedColorsCount = currentColorScheme.filter((color) => color.locked).length;
		const newColorsCount = currentColorScheme.length - lockedColorsCount;

		if (newColorsCount > 0) {
			const newColors = generateColorScheme(newColorsCount, $colorSpacePresets[currentColorSpace]);

			for (let i = 0; i < newColorScheme.length; i++) {
				if (!newColorScheme[i].locked) {
					newColorScheme[i].hex = <string>newColors.shift();
				}
			}
		}

		return newColorScheme;
	}

	function addColorScheme(colorScheme: Color[]): void {
		colorSchemes.splice(0, currentColorSchemeIndex);
		colorSchemes = [colorScheme, ...colorSchemes];
		currentColorSchemeIndex = 0;

		gotoColorScheme();
	}

	function undoColorScheme(): void {
		if (currentColorSchemeIndex < colorSchemes.length - 1) {
			currentColorSchemeIndex++;
			gotoColorScheme();
		}
	}

	function redoColorScheme(): void {
		if (currentColorSchemeIndex > 0) {
			currentColorSchemeIndex--;
			gotoColorScheme();
		}
	}

	async function saveColorScheme(colorScheme: string[]): Promise<void> {
		const response = await fetch('/api/colorSchemes', {
			method: 'POST',
			body: JSON.stringify({ colorScheme: colorScheme }),
			headers: {
				'content-type': 'application/json'
			}
		});
		const data = await response.json();

		if (data.success) {
			addNotification('Color Scheme Saved', 'saved');
		} else {
			addNotification('Failed To Save Color Scheme');
		}
	}

	function addColor(): void {
		const currentColorScheme = colorSchemes[currentColorSchemeIndex];

		if (currentColorScheme.length < MAX_COLOR_SCHEME_SIZE) {
			const newColorScheme = structuredClone(currentColorScheme);
			newColorScheme.push(
				...generateColorScheme(1, $colorSpacePresets[currentColorSpace]).map((color) => {
					return { id: uuid(), hex: color, locked: false };
				})
			);

			addColorScheme(newColorScheme);
		}
	}

	function removeColor(index: number): void {
		const currentColorScheme = colorSchemes[currentColorSchemeIndex];

		if (currentColorScheme.length > MIN_COLOR_SCHEME_SIZE) {
			const newColorScheme = structuredClone(currentColorScheme);
			newColorScheme.splice(index, 1);

			addColorScheme(newColorScheme);
		}
	}

	function swapColors(index1: number, index2: number): void {
		const newColorScheme = structuredClone(colorSchemes[currentColorSchemeIndex]);
		[newColorScheme[index1], newColorScheme[index2]] = [
			newColorScheme[index2],
			newColorScheme[index1]
		];

		addColorScheme(newColorScheme);
	}

	function toggleLockedColor(index: number): void {
		colorSchemes[currentColorSchemeIndex][index].locked =
			!colorSchemes[currentColorSchemeIndex][index].locked;
	}

	async function toggleSaveColor(color: string): Promise<void> {
		if ($page.data.session) {
			if (savedColors.includes(color)) {
				// Unsave color
				const response = await fetch('/api/colors', {
					method: 'DELETE',
					body: JSON.stringify({ color: color }),
					headers: {
						'content-type': 'application/json'
					}
				});
				const data = await response.json();

				if (data.success) {
					savedColors = savedColors.filter((color) => color !== color);
					addNotification(`${color} Unsaved`, 'unsaved', color);
				} else {
					addNotification(`Failed To Save ${color}`, 'x', color);
				}
			} else {
				// Save color
				const response = await fetch('/api/colors', {
					method: 'POST',
					body: JSON.stringify({ color: color }),
					headers: {
						'content-type': 'application/json'
					}
				});
				const data = await response.json();

				if (data.success) {
					savedColors = [...savedColors, color];
					addNotification(`${color} Saved`, 'saved', color);
				} else {
					addNotification(`Failed To Save ${color}`, 'x', color);
				}
			}
		} else {
			$isSignInModalOpen = true;
		}
	}

	function colorPicker(): void {
		if (colorPickerColor.hex !== originalColorPickerHex) {
			const newColorScheme = structuredClone(colorSchemes[currentColorSchemeIndex]);
			colorPickerColor.hex = originalColorPickerHex;

			addColorScheme(newColorScheme);
		}
	}

	function removeColorButtonTransition(element: Element): TransitionConfig {
		return slide(element, {
			axis: menuWidth < parseInt(theme.screens.lg) ? 'y' : 'x',
			duration: 300
		});
	}

	function addColorButtonTransition(element: Element): TransitionConfig {
		return slide(element, {
			axis: menuWidth < parseInt(theme.screens.sm) ? 'y' : 'x',
			duration: 300
		});
	}

	$: if (colorSchemes.length > MAX_COLOR_SCHEMES_LENGTH) {
		colorSchemes.splice(MAX_COLOR_SCHEMES_LENGTH, colorSchemes.length - MAX_COLOR_SCHEMES_LENGTH);
	}

	$: if (colorPickerColor) {
		colorSchemes = colorSchemes;
	}

	$: if (browser) {
		document.body.classList.toggle('no-scroll', isMenuOpen);
	}
</script>

{#if !isMenuOpen}
	<menu class="w-full flex bg-white" transition:slide={{ duration: 300, axis: 'y' }}>
		<button
			class="button w-1/4 border-t-0 border-x-0 rounded-none"
			disabled={colorSchemes.length === 1 || currentColorSchemeIndex === colorSchemes.length - 1}
			use:showTooltip={{ position: 'bottom', message: 'Undo' }}
			on:click={undoColorScheme}
		>
			<UndoIcon />
		</button>

		<div class="w-0.5 bg-black" />

		<button
			class="button w-1/2 border-t-0 border-x-0 rounded-none"
			use:showTooltip={{ position: 'bottom', message: 'Generate' }}
			on:click={() => {
				addColorScheme(newColorScheme());
			}}
		>
			<GenerateIcon />
		</button>

		<div class="w-0.5 bg-black" />

		<button
			class="button w-1/4 border-t-0 border-x-0 rounded-none"
			disabled={currentColorSchemeIndex === 0}
			use:showTooltip={{ position: 'bottom', message: 'Redo' }}
			on:click={redoColorScheme}
		>
			<RedoIcon />
		</button>
	</menu>
{/if}

<menu
	class="fixed bottom-0 w-full h-[291px] min-h-[291px] max-h-[calc(100%-theme(height.32))] py-4 border-t-2 z-10 bg-white border-black transition-transform duration-300"
	class:translate-y-full={!isMenuOpen}
	bind:this={menuElement}
	bind:clientWidth={menuWidth}
>
	<div class="absolute bottom-full left-4 flex gap-x-2">
		{#key isMenuOpen}
			<button
				class="button rounded-b-none"
				use:showTooltip={{ position: 'top', message: isMenuOpen ? 'Close' : 'Open' }}
				on:click={() => {
					isMenuOpen = !isMenuOpen;
				}}
			>
				{#if isMenuOpen}
					<ArrowDownIcon />
				{:else}
					<ArrowUpIcon />
				{/if}
			</button>
		{/key}

		{#if isMenuOpen}
			<button
				class="button rounded-b-none cursor-grab active:cursor-grabbing"
				transition:scale={{ duration: 300 }}
				use:showTooltip={{ position: 'top', message: 'Resize' }}
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
				use:showTooltip={{ position: 'top', message: 'Change Color Space' }}
				on:click={() => {
					isColorSpaceModalOpen = true;
				}}
			>
				{currentColorSpace}
			</button>

			<button
				class="button flex-1"
				use:showTooltip={{ position: 'top', message: 'Generate' }}
				on:click={() => {
					addColorScheme(newColorScheme());
				}}
			>
				<GenerateIcon />
			</button>

			<div class="flex gap-x-4">
				<button
					class="button flex-1"
					disabled={colorSchemes.length === 1 ||
						currentColorSchemeIndex === colorSchemes.length - 1}
					use:showTooltip={{ position: 'top', message: 'Undo' }}
					on:click={undoColorScheme}
				>
					<UndoIcon />
				</button>

				<button
					class="button flex-1"
					disabled={currentColorSchemeIndex === 0}
					use:showTooltip={{ position: 'top', message: 'Redo' }}
					on:click={redoColorScheme}
				>
					<RedoIcon />
				</button>
			</div>

			<button
				class="button"
				use:showTooltip={{ position: 'top', message: 'Save Color Scheme' }}
				on:click={() => {
					saveColorScheme(colorSchemes[currentColorSchemeIndex].map((color) => color.hex));
				}}
			>
				<SaveIcon />
			</button>
		</div>

		<div class="flex-1 flex flex-col sm:flex-row">
			<div
				class="flex-1 flex flex-col lg:flex-row gap-4 overflow-x-hidden sm:max-lg:overflow-y-auto"
			>
				{#each colorSchemes[currentColorSchemeIndex] as color, index (color.id)}
					{@const colorSchemeLength = colorSchemes[currentColorSchemeIndex].length}
					{@const contrastColor = contrastingColor(color.hex)}

					<div
						class="flex-1 p-4 flex flex-row-reverse lg:flex-col justify-between items-center gap-4 border-2 overflow-x-auto overflow-y-hidden sm:overflow-visible rounded-md border-black"
						style={`background-color: ${color.hex};`}
						in:scale={{ duration: 300 }}
						out:scale={{ duration: 300 }}
						animate:flip={{ duration: 300 }}
					>
						<div class="flex flex-row lg:flex-col">
							<div class="flex flex-col lg:flex-row justify-center items-center">
								{#if colorSchemeLength > MIN_COLOR_SCHEME_SIZE}
									<button
										class={contrastColor === '#000000'
											? 'button-transparent-black'
											: 'button-transparent-white'}
										in:removeColorButtonTransition
										out:removeColorButtonTransition
										use:showTooltip={{ position: 'top', message: 'Remove' }}
										on:click={() => {
											removeColor(index);
										}}
									>
										<XSquareIcon />
									</button>
								{/if}

								<button
									class={contrastColor === '#000000'
										? 'button-transparent-black'
										: 'button-transparent-white'}
									use:showTooltip={{ position: 'top', message: 'Save Color' }}
									on:click={async () => {
										await toggleSaveColor(color.hex);
									}}
								>
									{#if savedColors.includes(color.hex)}
										<SavedIcon />
									{:else}
										<SaveIcon />
									{/if}
								</button>
							</div>

							<div class="flex flex-col lg:flex-row">
								<button
									class={contrastColor === '#000000'
										? 'button-transparent-black'
										: 'button-transparent-white'}
									use:showTooltip={{ position: 'top', message: 'Copy Hex' }}
									on:click={() => {
										navigator.clipboard.writeText(color.hex.toUpperCase());
										addNotification(`${color.hex} Copied`, 'copied', color.hex);
									}}
								>
									<CopyIcon />
								</button>

								{#key color.locked}
									<button
										class={contrastColor === '#000000'
											? 'button-transparent-black'
											: 'button-transparent-white'}
										use:showTooltip={{ position: 'top', message: color.locked ? 'Unlock' : 'Lock' }}
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
								{/key}
							</div>

							<div class="flex flex-col lg:flex-row">
								<button
									class={contrastColor === '#000000'
										? 'button-transparent-black'
										: 'button-transparent-white'}
									use:showTooltip={{ position: 'top', message: 'Shift Left' }}
									on:click={() => {
										const index2 = index - 1 < 0 ? colorSchemeLength - 1 : index - 1;
										swapColors(index, index2);
									}}
								>
									<div class="lg:hidden">
										<ArrowUpIcon />
									</div>

									<div class="hidden lg:block">
										<ArrowLeftIcon />
									</div>
								</button>

								<button
									class={contrastColor === '#000000'
										? 'button-transparent-black'
										: 'button-transparent-white'}
									use:showTooltip={{ position: 'top', message: 'Shift Right' }}
									on:click={() => {
										const index2 = index + 1 > colorSchemeLength - 1 ? 0 : index + 1;
										swapColors(index, index2);
									}}
								>
									<div class="lg:hidden">
										<ArrowDownIcon />
									</div>

									<div class="hidden lg:block">
										<ArrowRightIcon />
									</div>
								</button>
							</div>
						</div>

						<button
							class={contrastColor === '#000000'
								? 'button-transparent-black'
								: 'button-transparent-white'}
							use:showTooltip={{ position: 'top', message: 'Color Picker' }}
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

			{#if colorSchemes[currentColorSchemeIndex].length < MAX_COLOR_SCHEME_SIZE}
				<button
					class="button mt-4 sm:mt-0 sm:ml-4"
					in:addColorButtonTransition
					out:addColorButtonTransition
					use:showTooltip={{ position: 'top', message: 'Add Color' }}
					on:click={addColor}
				>
					<PlusIcon />
				</button>
			{/if}
		</div>
	</div>
</menu>

<Modal title="Color Space" bind:isOpen={isColorSpaceModalOpen}>
	<List
		items={Object.keys($colorSpacePresets)}
		bind:selectedItem={currentColorSpace}
		on:click={() => {
			isColorSpaceModalOpen = false;
		}}
	/>
</Modal>

<Modal title="Color Picker" bind:isOpen={colorPickerModalOpen} on:close={colorPicker}>
	<ColorPicker bind:hex={colorPickerColor.hex} />
</Modal>
