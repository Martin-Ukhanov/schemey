<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { scale, slide } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { v4 as uuid } from 'uuid';
	import theme from 'tailwindcss/defaultTheme';
	import { stringToSlug, generateColorScheme, contrastingColor } from '$lib/utils';
	import { savedColors, savedColorSchemes } from '$lib/stores/user';
	import { isSignInModalOpen } from '$lib/stores/auth';
	import { colorSpacePresets } from '$lib/stores/colorSpacePresets';
	import { isResizingMenu } from '$lib/stores/generateMenu';
	import { addNotification } from '$lib/stores/notifications';
	import { showTooltip } from '$lib/actions/showTooltip';
	import SimpleLayout from '$lib/components/layouts/SimpleLayout.svelte';
	import GridLayout from '$lib/components/layouts/GridLayout.svelte';
	import ContrastLayout from '$lib/components/layouts/ContrastLayout.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import List from '$lib/components/List.svelte';
	import ColorPicker from '$lib/components/ColorPicker.svelte';
	import ArrowUpIcon from '$lib/components/icons/ArrowUpIcon.svelte';
	import ArrowDownIcon from '$lib/components/icons/ArrowDownIcon.svelte';
	import ArrowLeftIcon from '$lib/components/icons/ArrowLeftIcon.svelte';
	import ArrowRightIcon from '$lib/components/icons/ArrowRightIcon.svelte';
	import ResizeIcon from '$lib/components/icons/ResizeIcon.svelte';
	import LibraryIcon from '$lib/components/icons/LibraryIcon.svelte';
	import SaveIcon from '$lib/components/icons/SaveIcon.svelte';
	import SavedIcon from '$lib/components/icons/SavedIcon.svelte';
	import GenerateIcon from '$lib/components/icons/GenerateIcon.svelte';
	import UndoIcon from '$lib/components/icons/UndoIcon.svelte';
	import RedoIcon from '$lib/components/icons/RedoIcon.svelte';
	import XSquareIcon from '$lib/components/icons/XSquareIcon.svelte';
	import CopyIcon from '$lib/components/icons/CopyIcon.svelte';
	import LockedIcon from '$lib/components/icons/LockedIcon.svelte';
	import UnlockedIcon from '$lib/components/icons/UnlockedIcon.svelte';
	import PlusIcon from '$lib/components/icons/PlusIcon.svelte';
	import ColorSchemeLibrary from '$lib/components/ColorSchemeLibrary.svelte';
	import Loader from '$lib/components/Loader.svelte';

	export let data;

	type Color = {
		id: string;
		hex: string;
		isLocked: boolean;
		isToggleSaveLoading: boolean;
	};

	const MIN_COLOR_SCHEME_SIZE = 2;
	const MAX_COLOR_SCHEME_SIZE = 6;
	const MAX_COLOR_SCHEMES_HISTORY_LENGTH = 100;

	$savedColors = $page.data.savedColors ?? [];
	$savedColorSchemes = $page.data.savedColorSchemes ?? [];

	let menuElement: HTMLMenuElement;
	let menuWidth: number;
	let isMenuOpen = true;

	const LAYOUTS = [SimpleLayout, ContrastLayout, GridLayout];
	let currentLayoutIndex = 0;

	let isColorSchemeLibraryModalOpen = false;
	let isToggleSaveColorSchemeLoading = false;

	let currentColorSpace = 'all';
	let isColorSpaceModalOpen = false;

	let colorSchemes: Color[][] = [
		data.initialColorScheme.map((color) => {
			return { id: uuid(), hex: color, isLocked: false, isToggleSaveLoading: false };
		})
	];
	let currentColorSchemeIndex = 0;

	let originalColorPickerHex: string;
	let colorPickerColor: Color;
	let isColorPickerModalOpen = false;

	function resizeMenuMouse(e: MouseEvent) {
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

	function resizeMenuTouch(e: TouchEvent) {
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

	function goToColorScheme() {
		goto(
			'/generate/' +
				stringToSlug(colorSchemes[currentColorSchemeIndex].map((color) => color.hex).join(' ')),
			{ replaceState: true, noScroll: true }
		);
	}

	function newColorScheme() {
		const newColorScheme = structuredClone(currentColorScheme);
		const lockedColorsCount = currentColorScheme.filter((color) => color.isLocked).length;
		const newColorsCount = currentColorScheme.length - lockedColorsCount;

		if (newColorsCount > 0) {
			const newColors = generateColorScheme(newColorsCount, $colorSpacePresets[currentColorSpace]);

			for (let i = 0; i < newColorScheme.length; i++) {
				if (!newColorScheme[i].isLocked) {
					newColorScheme[i].hex = <string>newColors.shift();
				}

				newColorScheme[i].isToggleSaveLoading = false;
			}
		}

		return newColorScheme;
	}

	function existingColorScheme(colorScheme: string[]) {
		const newColorScheme = structuredClone(currentColorScheme);
		const colorCountDifference = newColorScheme.length - colorScheme.length;

		if (colorCountDifference > 0) {
			newColorScheme.splice(colorScheme.length, colorCountDifference);
		}

		for (let i = 0; i < colorScheme.length; i++) {
			if (newColorScheme[i]) {
				newColorScheme[i].hex = colorScheme[i];
				newColorScheme[i].isLocked = false;
				newColorScheme[i].isToggleSaveLoading = false;
			} else {
				newColorScheme.push({
					id: uuid(),
					hex: colorScheme[i],
					isLocked: false,
					isToggleSaveLoading: false
				});
			}
		}

		return newColorScheme;
	}

	function addColorScheme(colorScheme: Color[]) {
		colorSchemes.splice(0, currentColorSchemeIndex);
		colorSchemes = [colorScheme, ...colorSchemes];
		currentColorSchemeIndex = 0;
		isToggleSaveColorSchemeLoading = false;

		goToColorScheme();
	}

	function undoColorScheme() {
		if (currentColorSchemeIndex < colorSchemes.length - 1) {
			currentColorSchemeIndex++;
			goToColorScheme();
		}
	}

	function redoColorScheme() {
		if (currentColorSchemeIndex > 0) {
			currentColorSchemeIndex--;
			goToColorScheme();
		}
	}

	async function toggleSaveColorScheme(colorScheme: string[]) {
		if ($page.data.session) {
			if (JSON.stringify($savedColorSchemes).includes(JSON.stringify(colorScheme))) {
				// Delete color scheme
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
					addNotification('Color Scheme Deleted', 'trash');
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
					$savedColorSchemes = [colorScheme, ...$savedColorSchemes];
					addNotification('Color Scheme Saved', 'saved');
				} else {
					addNotification('Failed to Save Color Scheme', 'x');
				}
			}
		} else {
			$isSignInModalOpen = true;
		}
	}

	function addColor() {
		if (currentColorScheme.length < MAX_COLOR_SCHEME_SIZE) {
			const newColorScheme = structuredClone(currentColorScheme);
			newColorScheme.push(
				...generateColorScheme(1, $colorSpacePresets[currentColorSpace]).map((color) => {
					return { id: uuid(), hex: color, isLocked: false, isToggleSaveLoading: false };
				})
			);

			addColorScheme(newColorScheme);
		}
	}

	function removeColor(index: number) {
		if (currentColorScheme.length > MIN_COLOR_SCHEME_SIZE) {
			const newColorScheme = structuredClone(currentColorScheme);
			newColorScheme.splice(index, 1);

			addColorScheme(newColorScheme);
		}
	}

	function swapColors(index1: number, index2: number) {
		const newColorScheme = structuredClone(currentColorScheme);
		[newColorScheme[index1], newColorScheme[index2]] = [
			newColorScheme[index2],
			newColorScheme[index1]
		];

		addColorScheme(newColorScheme);
	}

	function toggleLockedColor(index: number) {
		currentColorScheme[index].isLocked = !currentColorScheme[index].isLocked;
	}

	async function toggleSaveColor(color: string) {
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
					addNotification(`${color} Deleted`, 'trash', color);
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
					$savedColors = [color, ...$savedColors];
					addNotification(`${color} Saved`, 'saved', color);
				} else {
					addNotification(`Failed to Save ${color}`, 'x', color);
				}
			}
		} else {
			$isSignInModalOpen = true;
		}
	}

	function colorPicker() {
		if (colorPickerColor.hex !== originalColorPickerHex) {
			const newColorScheme = structuredClone(currentColorScheme);
			colorPickerColor.hex = originalColorPickerHex;

			addColorScheme(newColorScheme);
		}
	}

	function removeColorButtonTransition(element: Element) {
		return slide(element, {
			axis: menuWidth < parseInt(theme.screens.lg) ? 'y' : 'x',
			duration: 200
		});
	}

	function addColorButtonTransition(element: Element) {
		return slide(element, {
			axis: menuWidth < parseInt(theme.screens.sm) ? 'y' : 'x',
			duration: 200
		});
	}

	onMount(() => {
		document.body.classList.add('no-scroll');

		return () => {
			document.body.classList.remove('no-scroll');
		};
	});

	$: currentColorScheme = colorSchemes[currentColorSchemeIndex];

	$: if (colorSchemes.length > MAX_COLOR_SCHEMES_HISTORY_LENGTH) {
		colorSchemes.splice(
			MAX_COLOR_SCHEMES_HISTORY_LENGTH,
			colorSchemes.length - MAX_COLOR_SCHEMES_HISTORY_LENGTH
		);
	}

	$: if (colorPickerColor) {
		colorSchemes = colorSchemes;
	}
</script>

<svelte:head>
	<title>Schemey | Generate</title>
</svelte:head>

{#if !isMenuOpen}
	<menu class="w-full flex" transition:slide={{ axis: 'y', duration: 200 }}>
		<button
			aria-label="Layout"
			class="button-border flex-1 border-t-0 border-l-0 rounded-none"
			use:showTooltip={{ position: 'bottom', message: 'Layout' }}
			on:click={() => {
				currentLayoutIndex = currentLayoutIndex === 0 ? LAYOUTS.length - 1 : currentLayoutIndex - 1;
			}}
		>
			<ArrowLeftIcon />
		</button>

		<button
			aria-label="Undo"
			disabled={colorSchemes.length === 1 || currentColorSchemeIndex === colorSchemes.length - 1}
			class="button-border flex-1 border-t-0 border-x-0 rounded-none"
			use:showTooltip={{ position: 'bottom', message: 'Undo' }}
			on:click={undoColorScheme}
		>
			<UndoIcon />
		</button>

		<button
			aria-label="Generate"
			class="button-border flex-1 border-t-0 rounded-none"
			use:showTooltip={{ position: 'bottom', message: 'Generate' }}
			on:click={() => {
				if (currentColorScheme.some((color) => !color.isLocked)) {
					addColorScheme(newColorScheme());
				}
			}}
		>
			<GenerateIcon />
		</button>

		<button
			aria-label="Redo"
			disabled={currentColorSchemeIndex === 0}
			class="button-border flex-1 border-t-0 border-x-0 rounded-none"
			use:showTooltip={{ position: 'bottom', message: 'Redo' }}
			on:click={redoColorScheme}
		>
			<RedoIcon />
		</button>

		<button
			aria-label="Layout"
			class="button-border flex-1 border-t-0 border-r-0 rounded-none"
			use:showTooltip={{ position: 'bottom', message: 'Layout' }}
			on:click={() => {
				currentLayoutIndex = currentLayoutIndex === LAYOUTS.length - 1 ? 0 : currentLayoutIndex + 1;
			}}
		>
			<ArrowRightIcon />
		</button>
	</menu>
{/if}

<svelte:component
	this={LAYOUTS[currentLayoutIndex]}
	colorScheme={currentColorScheme.map((color) => {
		return { id: color.id, hex: color.hex };
	})}
/>

<menu
	class="absolute bottom-0 w-full h-[266px] min-h-[266px] max-h-[calc(100%-theme(height.14))] py-4 border-t-2 z-10 bg-white border-black transition-transform duration-200"
	class:translate-y-full={!isMenuOpen}
	bind:this={menuElement}
	bind:clientWidth={menuWidth}
>
	<div class="absolute bottom-full left-2 flex gap-x-2">
		{#key isMenuOpen}
			<button
				aria-label={isMenuOpen ? 'Close' : 'Open'}
				class="button-border rounded-b-none"
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
				aria-label="Resize"
				class="button-border rounded-b-none cursor-grab active:cursor-grabbing"
				transition:scale={{ duration: 200 }}
				use:showTooltip={{ position: 'top', message: 'Resize' }}
				on:mousedown|preventDefault={resizeMenuMouse}
				on:touchstart|preventDefault={resizeMenuTouch}
			>
				<ResizeIcon />
			</button>
		{/if}
	</div>

	<div
		class="w-full h-full px-4 flex flex-col sm:flex-row gap-4 overflow-y-auto sm:overflow-y-visible overscroll-none"
	>
		<div class="sm:w-36 flex flex-col gap-y-2">
			<div class="flex gap-x-2">
				<button
					aria-label="Library"
					class="button-border flex-1"
					use:showTooltip={{ position: 'top', message: 'Library' }}
					on:click={() => {
						if ($page.data.session) {
							isColorSchemeLibraryModalOpen = true;
						} else {
							$isSignInModalOpen = true;
						}
					}}
				>
					<LibraryIcon />
				</button>

				{#key JSON.stringify($savedColorSchemes).includes(JSON.stringify(currentColorScheme.map((color) => color.hex)))}
					<button
						aria-label={JSON.stringify($savedColorSchemes).includes(
							JSON.stringify(currentColorScheme.map((color) => color.hex))
						)
							? 'Delete Color Scheme'
							: 'Save Color Scheme'}
						disabled={isToggleSaveColorSchemeLoading}
						class="button-border flex-1"
						use:showTooltip={{
							position: 'top',
							message: JSON.stringify($savedColorSchemes).includes(
								JSON.stringify(currentColorScheme.map((color) => color.hex))
							)
								? 'Delete Color Scheme'
								: 'Save Color Scheme'
						}}
						on:click={async () => {
							isToggleSaveColorSchemeLoading = true;
							await toggleSaveColorScheme(currentColorScheme.map((color) => color.hex));
							isToggleSaveColorSchemeLoading = false;
						}}
					>
						<div class:opacity-0={isToggleSaveColorSchemeLoading}>
							{#if JSON.stringify($savedColorSchemes).includes(JSON.stringify(currentColorScheme.map((color) => color.hex)))}
								<SavedIcon />
							{:else}
								<SaveIcon />
							{/if}
						</div>

						{#if isToggleSaveColorSchemeLoading}
							<Loader color="black" />
						{/if}
					</button>
				{/key}
			</div>

			<button
				class="button-border"
				use:showTooltip={{ position: 'top', message: 'Color Space' }}
				on:click={() => {
					isColorSpaceModalOpen = true;
				}}
			>
				{currentColorSpace}
			</button>

			<button
				aria-label="Generate"
				class="button-border flex-1"
				use:showTooltip={{ position: 'top', message: 'Generate' }}
				on:click={() => {
					if (currentColorScheme.some((color) => !color.isLocked)) {
						addColorScheme(newColorScheme());
					}
				}}
			>
				<GenerateIcon />
			</button>

			<div class="flex gap-x-2">
				<button
					aria-label="Generate"
					disabled={colorSchemes.length === 1 ||
						currentColorSchemeIndex === colorSchemes.length - 1}
					class="button-border flex-1"
					use:showTooltip={{ position: 'top', message: 'Undo' }}
					on:click={undoColorScheme}
				>
					<UndoIcon />
				</button>

				<button
					aria-label="Redo"
					disabled={currentColorSchemeIndex === 0}
					class="button-border flex-1"
					use:showTooltip={{ position: 'top', message: 'Redo' }}
					on:click={redoColorScheme}
				>
					<RedoIcon />
				</button>
			</div>
		</div>

		<div class="flex-1 flex flex-col sm:flex-row sm:overflow-x-hidden">
			<div
				class="flex-1 flex flex-col lg:flex-row gap-2 overflow-x-hidden sm:max-lg:overflow-y-auto"
			>
				{#each currentColorScheme as color, index (color.id)}
					{@const contrastColor = contrastingColor(color.hex)}

					<div
						class="flex-1 p-2 flex flex-row-reverse lg:flex-col justify-between items-center gap-2 border-2 overflow-x-auto overflow-y-hidden sm:overflow-visible rounded-md border-black"
						style={`background-color: ${color.hex};`}
						in:scale={{ duration: 200 }}
						out:scale={{ duration: 200 }}
						animate:flip={{ duration: 200 }}
					>
						<div class="flex flex-row lg:flex-col">
							<div class="flex flex-col lg:flex-row justify-center items-center">
								{#if currentColorScheme.length > MIN_COLOR_SCHEME_SIZE}
									<button
										aria-label="Remove"
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
										aria-label={$savedColors.includes(color.hex) ? 'Delete Color' : 'Save Color'}
										disabled={color.isToggleSaveLoading}
										class={contrastColor === '#000000'
											? 'button-transparent-black'
											: 'button-transparent-white'}
										use:showTooltip={{
											position: 'top',
											message: $savedColors.includes(color.hex) ? 'Delete Color' : 'Save Color'
										}}
										on:click={async () => {
											color.isToggleSaveLoading = true;
											await toggleSaveColor(color.hex);
											color.isToggleSaveLoading = false;
										}}
									>
										<div class:opacity-0={color.isToggleSaveLoading}>
											{#if $savedColors.includes(color.hex)}
												<SavedIcon />
											{:else}
												<SaveIcon />
											{/if}
										</div>

										{#if color.isToggleSaveLoading}
											<Loader color={contrastColor === '#ffffff' ? 'white' : 'black'} />
										{/if}
									</button>
								{/key}
							</div>

							<div class="flex flex-col lg:flex-row">
								<button
									aria-label="Copy Hex"
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
										aria-label={color.isLocked ? 'Unlock' : 'Lock'}
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
								{#key menuWidth < parseInt(theme.screens.lg)}
									<button
										aria-label={menuWidth < parseInt(theme.screens.lg) ? 'Shift Up' : 'Shift Left'}
										class={contrastColor === '#000000'
											? 'button-transparent-black'
											: 'button-transparent-white'}
										use:showTooltip={{
											position: 'top',
											message: menuWidth < parseInt(theme.screens.lg) ? 'Shift Up' : 'Shift Left'
										}}
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
								{/key}

								{#key menuWidth < parseInt(theme.screens.lg)}
									<button
										aria-label={menuWidth < parseInt(theme.screens.lg)
											? 'Shift Down'
											: 'Shift Right'}
										class={contrastColor === '#000000'
											? 'button-transparent-black'
											: 'button-transparent-white'}
										use:showTooltip={{
											position: 'top',
											message: menuWidth < parseInt(theme.screens.lg) ? 'Shift Down' : 'Shift Right'
										}}
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
								{/key}
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
					aria-label="Add Color"
					class="button-border mt-2 sm:mt-0 sm:ml-2"
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

			isColorSchemeLibraryModalOpen = false;
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
			colorPicker();
			isColorPickerModalOpen = false;
		}}
	/>
</Modal>
