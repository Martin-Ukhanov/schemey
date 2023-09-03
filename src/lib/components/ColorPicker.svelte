<script lang="ts">
	import Color from 'color';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { createEventDispatcher } from 'svelte';
	import { scale } from 'svelte/transition';
	import { clamp, contrastingColor, validHex } from '$lib/utils';
	import { showTooltip } from '$lib/actions/showTooltip';
	import { savedColors } from '$lib/stores/user';
	import { isSignInModalOpen } from '$lib/stores/auth';
	import LibraryIcon from './icons/LibraryIcon.svelte';
	import ReturnIcon from './icons/ReturnIcon.svelte';

	export let hex: string;

	const dispatch = createEventDispatcher();

	let isSavedColorsOpen = false;

	let colorPickerElement: HTMLButtonElement;
	let colorPickerWidth: number;
	let colorPickerHeight: number;
	let hueSliderWidth: number;
	let hexInput: string;

	let [h, s, v] = Color(hex).hsv().array();

	const [originH, originS, originV] = [h, s, v];

	function moveColorPickerCursorMouse(e: MouseEvent): void {
		const setSaturationAndValue = (e: MouseEvent): void => {
			const rect = colorPickerElement.getBoundingClientRect();
			s = clamp(((e.clientX - rect.left) / colorPickerWidth) * 100, 0, 100);
			v = clamp(100 - ((e.clientY - rect.top) / colorPickerHeight) * 100, 0, 100);
		};

		setSaturationAndValue(e);

		if (browser) {
			document.onmousemove = (e) => {
				e.preventDefault();
				setSaturationAndValue(e);
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

	function moveColorPickerCursorTouch(e: TouchEvent): void {
		const setSaturationAndValue = (e: TouchEvent): void => {
			const rect = colorPickerElement.getBoundingClientRect();
			s = clamp(((e.touches[0].clientX - rect.left) / colorPickerWidth) * 100, 0, 100);
			v = clamp(100 - ((e.touches[0].clientY - rect.top) / colorPickerHeight) * 100, 0, 100);
		};

		setSaturationAndValue(e);

		if (browser) {
			document.ontouchmove = (e) => {
				e.preventDefault();
				setSaturationAndValue(e);
			};

			document.ontouchend = () => {
				e.preventDefault();
				document.ontouchmove = null;
				document.ontouchend = null;
			};
		}
	}

	function handleHexInput(): void {
		if (validHex(hexInput)) {
			if (hexInput[0] !== '#') {
				hexInput = '#' + hexInput;
			}

			[h, s, v] = Color(hexInput).hsv().array();
		}
	}

	function hexInputUnfocus(): void {
		if (!validHex(hexInput)) {
			hexInput = hex;
		}
	}

	$: {
		hex = Color.hsv([h, s, v]).hex().toLowerCase();
		hexInput = hex;
	}

	$: contrastColor = contrastingColor(hex);
</script>

{#if isSavedColorsOpen}
	<div class="h-80 flex flex-col gap-y-2">
		<div
			class="relative flex-1 p-2 grid grid-cols-5 gap-2 overflow-y-auto border-2 rounded-md border-black"
			style="grid-auto-rows: min-content;"
		>
			{#if $savedColors.length === 0}
				<p
					class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center uppercase font-bold text-black"
				>
					No Colors Saved
				</p>
			{:else}
				{#each $savedColors as color (color)}
					<button
						class="button aspect-square"
						style={`background-color: ${color};`}
						use:showTooltip={{ position: 'top', message: color }}
						on:click={() => {
							hex = color;
							[h, s, v] = Color(hex).hsv().array();

							isSavedColorsOpen = false;
						}}
					>
						{#if color === hex}
							<div class="w-3 h-3 border-2 rounded-full bg-white border-black" />
						{/if}
					</button>
				{/each}
			{/if}
		</div>

		<button
			class="button"
			use:showTooltip={{ position: 'top', message: 'Return' }}
			on:click={() => {
				isSavedColorsOpen = false;
			}}
		>
			<ReturnIcon />
		</button>
	</div>
{:else}
	<div class="h-80 flex flex-col gap-y-4">
		<button
			class="flex-1 relative border-2 rounded-md border-black group"
			style={`background: linear-gradient(#ffffff00, #000000ff), linear-gradient(0.25turn, #ffffffff, #00000000), hsl(${h}, 100%, 50%);`}
			bind:this={colorPickerElement}
			bind:clientWidth={colorPickerWidth}
			bind:clientHeight={colorPickerHeight}
			on:mousedown|preventDefault={moveColorPickerCursorMouse}
			on:touchstart|preventDefault={moveColorPickerCursorTouch}
		>
			{#if Math.round(originH) === Math.round(h)}
				<div
					class="absolute -translate-x-1/2 translate-y-1/2 w-3 h-3 border-2 rounded-full bg-white border-black"
					style={`bottom: ${originV}%; left: ${originS}%;`}
					transition:scale={{ duration: 300 }}
				/>
			{/if}

			<div
				class="absolute -translate-x-1/2 translate-y-1/2 w-6 h-6 border-2 rounded-full border-black cursor-grab group-active:cursor-grabbing"
				style={`bottom: ${v}%; left: ${s}%; background-color: ${hex};`}
			>
				<div class="w-full h-full border-4 rounded-full border-white">
					<div
						class="w-full h-full border-2 rounded-full border-black"
						style={`background-color: ${hex};`}
					/>
				</div>
			</div>
		</button>

		<div class="relative group" bind:clientWidth={hueSliderWidth}>
			<input
				type="range"
				min="0"
				max="360"
				step="1"
				class="appearance-none absolute w-full h-full outline-none bg-transparent cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-transparent [&::-webkit-slider-thumb]:shadow-none [&::-webkit-slider-thumb]:cursor-grab group-active:[&::-webkit-slider-thumb]:cursor-grabbing"
				bind:value={h}
			/>

			<div
				class="h-4 border-2 rounded-full border-black"
				style="background: linear-gradient(to right, hsl(0,100%,50%), hsl(60,100%,50%), hsl(120,100%,50%), hsl(180,100%,50%), hsl(240,100%,50%), hsl(300,100%,50%),hsl(360,100%,50%));"
			/>

			<div
				class="absolute top-1/2 translate-x-1/2 -translate-y-1/2 w-3 h-3 border-2 rounded-full bg-white border-black pointer-events-none"
				style={`left: ${(originH / 360) * (hueSliderWidth - 24)}px;`}
			/>

			<div
				class="absolute top-1/2 -translate-y-1/2 w-6 h-6 border-2 rounded-full border-black pointer-events-none"
				style={`left: ${(h / 360) * (hueSliderWidth - 24)}px;`}
			>
				<div class="w-full h-full border-4 rounded-full border-white">
					<div
						class="w-full h-full border-2 rounded-full border-black"
						style={`background-color: hsl(${h} 100% 50%);`}
					/>
				</div>
			</div>
		</div>

		<div class="flex gap-x-2">
			<input
				type="text"
				name="hex"
				placeholder="#000000"
				class="input flex-1 text-lg text-center font-bold uppercase !brightness-100"
				class:placeholder-transparent-white={contrastColor === '#ffffff'}
				class:placeholder-transparent-black={contrastColor === '#000000'}
				style={`background-color: ${hex}; color: ${contrastColor};`}
				bind:value={hexInput}
				on:input={handleHexInput}
				on:focusout={hexInputUnfocus}
			/>

			<button
				class="button"
				use:showTooltip={{ position: 'top', message: 'Library' }}
				on:click={() => {
					if ($page.data.session) {
						isSavedColorsOpen = true;
					} else {
						dispatch('close');
						$isSignInModalOpen = true;
					}
				}}
			>
				<LibraryIcon />
			</button>
		</div>
	</div>
{/if}
