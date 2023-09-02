<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { scale, slide, type TransitionConfig } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { v4 as uuid } from 'uuid';
	import theme from 'tailwindcss/defaultTheme';
	import { generateColorScheme, colorSchemeToSlug, contrastingColor } from '$lib/utils';
	import { savedColors, savedColorSchemes } from '$lib/stores/user';
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
	import LibraryIcon from './icons/LibraryIcon.svelte';
	import SaveIcon from './icons/SaveIcon.svelte';
	import SavedIcon from './icons/SavedIcon.svelte';
	import GenerateIcon from './icons/GenerateIcon.svelte';
	import UndoIcon from './icons/UndoIcon.svelte';
	import RedoIcon from './icons/RedoIcon.svelte';
	import XSquareIcon from './icons/XSquareIcon.svelte';
	import CopyIcon from './icons/CopyIcon.svelte';
	import LockedIcon from './icons/LockedIcon.svelte';
	import UnlockedIcon from './icons/UnlockedIcon.svelte';
	import PlusIcon from './icons/PlusIcon.svelte';
	import ColorSchemeLibrary from './ColorSchemeLibrary.svelte';
	import { stringify } from 'postcss';

	type Color = {
		id: string;
		hex: string;
		isLocked: boolean;
	};

	export let initialColorScheme: string[];

	const MIN_COLOR_SCHEME_SIZE = 2;
	const MAX_COLOR_SCHEME_SIZE = 5;
	const MAX_COLOR_SCHEMES_LENGTH = 100;

	$savedColors = $page.data.savedColors ?? [];
	$savedColorSchemes = $page.data.savedColorSchemes ?? [];

	let menuElement: HTMLMenuElement;
	let menuWidth: number;
	let isMenuOpen = true;

	let isColorSchemeLibraryModalOpen = false;

	let currentColorSpace = 'all';
	let isColorSpaceModalOpen = false;

	let colorSchemes: Color[][] = [
		initialColorScheme.map((color) => {
			return { id: uuid(), hex: color, isLocked: false };
		})
	];
	let currentColorSchemeIndex = 0;

	let originalColorPickerHex: string;
	let colorPickerColor: Color;
	let isColorPickerModalOpen = false;

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

	function goToColorScheme(): void {
		goto(
			'/generate/' +
				colorSchemeToSlug(colorSchemes[currentColorSchemeIndex].map((color) => color.hex)),
			{ replaceState: true }
		);
	}

	function newColorScheme(): Color[] {
		const newColorScheme = structuredClone(currentColorScheme);
		const lockedColorsCount = currentColorScheme.filter((color) => color.isLocked).length;
		const newColorsCount = currentColorScheme.length - lockedColorsCount;

		if (newColorsCount > 0) {
			const newColors = generateColorScheme(newColorsCount, $colorSpacePresets[currentColorSpace]);

			for (let i = 0; i < newColorScheme.length; i++) {
				if (!newColorScheme[i].isLocked) {
					newColorScheme[i].hex = <string>newColors.shift();
				}
			}
		}

		return newColorScheme;
	}

	function existingColorScheme(colorScheme: string[]): Color[] {
		const newColorScheme = structuredClone(currentColorScheme);
		const colorCountDifference = newColorScheme.length - colorScheme.length;

		if (colorCountDifference > 0) {
			newColorScheme.splice(colorScheme.length, colorCountDifference);
		}

		for (let i = 0; i < colorScheme.length; i++) {
			if (newColorScheme[i]) {
				newColorScheme[i].hex = colorScheme[i];
				newColorScheme[i].isLocked = false;
			} else {
				newColorScheme.push({
					id: uuid(),
					hex: colorScheme[i],
					isLocked: false
				});
			}
		}

		return newColorScheme;
	}

	function addColorScheme(colorScheme: Color[]): void {
		colorSchemes.splice(0, currentColorSchemeIndex);
		colorSchemes = [colorScheme, ...colorSchemes];
		currentColorSchemeIndex = 0;

		goToColorScheme();
	}

	function undoColorScheme(): void {
		if (currentColorSchemeIndex < colorSchemes.length - 1) {
			currentColorSchemeIndex++;
			goToColorScheme();
		}
	}

	function redoColorScheme(): void {
		if (currentColorSchemeIndex > 0) {
			currentColorSchemeIndex--;
			goToColorScheme();
		}
	}

	async function toggleSaveColorScheme(colorScheme: string[]): Promise<void> {
		if ($page.data.session) {
			if (JSON.stringify($savedColorSchemes).includes(JSON.stringify(colorScheme))) {
				// Unsave color scheme
				const response = await fetch('/api/colorSchemes', {
					method: 'DELETE',
					body: JSON.stringify({ colorScheme: colorScheme }),
					headers: {
						'content-type': 'application/json'
					}
				});
				const data = await response.json();

				if (data.success) {
					$savedColorSchemes = $savedColorSchemes.filter(
						(savedColorScheme) => JSON.stringify(savedColorScheme) !== JSON.stringify(colorScheme)
					);
					addNotification('Color Scheme Deleted', 'check');
				} else {
					addNotification(`Failed to Delete Color Scheme`, 'x');
				}
			} else {
				// Save color scheme
				const response = await fetch('/api/colorSchemes', {
					method: 'POST',
					body: JSON.stringify({ colorScheme: colorScheme }),
					headers: {
						'content-type': 'application/json'
					}
				});
				const data = await response.json();

				if (data.success) {
					$savedColorSchemes = [...$savedColorSchemes, colorScheme];
					addNotification('Color Scheme Saved', 'check');
				} else {
					addNotification('Failed to Save Color Scheme', 'x');
				}
			}
		} else {
			$isSignInModalOpen = true;
		}
	}

	function addColor(): void {
		if (currentColorScheme.length < MAX_COLOR_SCHEME_SIZE) {
			const newColorScheme = structuredClone(currentColorScheme);
			newColorScheme.push(
				...generateColorScheme(1, $colorSpacePresets[currentColorSpace]).map((color) => {
					return { id: uuid(), hex: color, isLocked: false };
				})
			);

			addColorScheme(newColorScheme);
		}
	}

	function removeColor(index: number): void {
		if (currentColorScheme.length > MIN_COLOR_SCHEME_SIZE) {
			const newColorScheme = structuredClone(currentColorScheme);
			newColorScheme.splice(index, 1);

			addColorScheme(newColorScheme);
		}
	}

	function swapColors(index1: number, index2: number): void {
		const newColorScheme = structuredClone(currentColorScheme);
		[newColorScheme[index1], newColorScheme[index2]] = [
			newColorScheme[index2],
			newColorScheme[index1]
		];

		addColorScheme(newColorScheme);
	}

	function toggleLockedColor(index: number): void {
		currentColorScheme[index].isLocked = !currentColorScheme[index].isLocked;
	}

	async function toggleSaveColor(color: string): Promise<void> {
		if ($page.data.session) {
			if ($savedColors.includes(color)) {
				// Delete color
				const response = await fetch('/api/colors', {
					method: 'DELETE',
					body: JSON.stringify({ color: color }),
					headers: {
						'content-type': 'application/json'
					}
				});
				const data = await response.json();

				if (data.success) {
					$savedColors = $savedColors.filter((savedColor) => savedColor !== color);
					addNotification(`${color} Deleted`, 'check', color);
				} else {
					addNotification(`Failed to Delete ${color}`, 'x', color);
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
					$savedColors = [...$savedColors, color];
					addNotification(`${color} Saved`, 'check', color);
				} else {
					addNotification(`Failed to Save ${color}`, 'x', color);
				}
			}
		} else {
			$isSignInModalOpen = true;
		}
	}

	function colorPicker(): void {
		if (colorPickerColor.hex !== originalColorPickerHex) {
			const newColorScheme = structuredClone(currentColorScheme);
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

	$: currentColorScheme = colorSchemes[currentColorSchemeIndex];

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
				if (currentColorScheme.some((color) => !color.isLocked)) {
					addColorScheme(newColorScheme());
				}
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
			<div class="flex gap-x-4">
				<button
					class="button flex-1"
					use:showTooltip={{ position: 'top', message: 'Library' }}
					on:click={() => {
						isColorSchemeLibraryModalOpen = true;
					}}
				>
					<LibraryIcon />
				</button>

				<button
					class="button flex-1"
					use:showTooltip={{ position: 'top', message: 'Save Color Scheme' }}
					on:click={() => {
						toggleSaveColorScheme(currentColorScheme.map((color) => color.hex));
					}}
				>
					{#if JSON.stringify($savedColorSchemes).includes(JSON.stringify(currentColorScheme.map((color) => color.hex)))}
						<SavedIcon />
					{:else}
						<SaveIcon />
					{/if}
				</button>
			</div>

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
					if (currentColorScheme.some((color) => !color.isLocked)) {
						addColorScheme(newColorScheme());
					}
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
		</div>

		<div class="flex-1 flex flex-col sm:flex-row">
			<div
				class="flex-1 flex flex-col lg:flex-row gap-4 overflow-x-hidden sm:max-lg:overflow-y-auto"
			>
				{#each currentColorScheme as color, index (color.id)}
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
								{#if currentColorScheme.length > MIN_COLOR_SCHEME_SIZE}
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

								{#key $savedColors.includes(color.hex)}
									<button
										class={contrastColor === '#000000'
											? 'button-transparent-black'
											: 'button-transparent-white'}
										use:showTooltip={{
											position: 'top',
											message: $savedColors.includes(color.hex) ? 'Unsave Color' : 'Save Color'
										}}
										on:click={async () => {
											await toggleSaveColor(color.hex);
										}}
									>
										{#if $savedColors.includes(color.hex)}
											<SavedIcon />
										{:else}
											<SaveIcon />
										{/if}
									</button>
								{/key}
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

								{#key color.isLocked}
									<button
										class={contrastColor === '#000000'
											? 'button-transparent-black'
											: 'button-transparent-white'}
										use:showTooltip={{
											position: 'top',
											message: color.isLocked ? 'Unlock' : 'Lock'
										}}
										on:click={() => {
											toggleLockedColor(index);
											addNotification(
												`${color.hex} ${color.isLocked ? 'Locked' : 'Unlocked'}`,
												color.isLocked ? 'locked' : 'unlocked',
												color.hex
											);
										}}
									>
										{#if color.isLocked}
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
										const index2 = index - 1 < 0 ? currentColorScheme.length - 1 : index - 1;
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
										const index2 = index + 1 > currentColorScheme.length - 1 ? 0 : index + 1;
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
								isColorPickerModalOpen = true;
							}}
						>
							<span class="text-xl">{color.hex}</span>
						</button>
					</div>
				{/each}
			</div>

			{#if currentColorScheme.length < MAX_COLOR_SCHEME_SIZE}
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

<Modal title="Library" bind:isOpen={isColorSchemeLibraryModalOpen}>
	<ColorSchemeLibrary
		currentColorScheme={currentColorScheme.map((color) => color.hex)}
		on:selectColorScheme={(e) => {
			const { colorScheme } = e.detail;

			if (
				JSON.stringify(colorScheme) !== JSON.stringify(currentColorScheme.map((color) => color.hex))
			) {
				addColorScheme(existingColorScheme(colorScheme));
			}
		}}
	/>
</Modal>

<Modal title="Color Space" bind:isOpen={isColorSpaceModalOpen}>
	<List
		items={Object.keys($colorSpacePresets)}
		bind:selectedItem={currentColorSpace}
		on:click={() => {
			isColorSpaceModalOpen = false;
		}}
	/>
</Modal>

<Modal title="Color Picker" bind:isOpen={isColorPickerModalOpen} on:close={colorPicker}>
	<ColorPicker
		bind:hex={colorPickerColor.hex}
		on:close={() => {
			isColorPickerModalOpen = false;
		}}
	/>
</Modal>
