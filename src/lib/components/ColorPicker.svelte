<script lang="ts">
	import { clamp, contrastingColor } from '$lib/utils';
	import { browser } from '$app/environment';
	import Color from 'color';

	export let hex: string;

	let colorPickerElement: HTMLButtonElement;
	let colorPickerWidth: number;
	let colorPickerHeight: number;
	let hueSliderWidth: number;

	let [h, s, v] = Color(hex).hsv().array();

	function moveColorPickerCursorMouse(e: MouseEvent): void {
		const setSaturationAndValue = (e: MouseEvent): void => {
			const rect = colorPickerElement.getBoundingClientRect();
			s = clamp(((e.clientX - rect.left) / colorPickerWidth) * 100, 0, 100);
			v = clamp(100 - ((e.clientY - rect.top) / colorPickerHeight) * 100, 0, 100);
		};

		setSaturationAndValue(e);

		if (browser) {
			document.onmousemove = (e) => {
				setSaturationAndValue(e);
			};

			document.onmouseup = () => {
				document.onmousemove = null;
				document.onmouseup = null;
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
				setSaturationAndValue(e);
			};

			document.ontouchend = () => {
				document.ontouchmove = null;
				document.ontouchend = null;
			};
		}
	}

	$: hex = Color.hsv([h, s, v]).hex();
</script>

<div class="flex-1 flex flex-col gap-y-4">
	<button
		class="relative w-full h-full border-3 rounded-md border-black group"
		style={`background: linear-gradient(#ffffff00, #000000ff), linear-gradient(0.25turn, #ffffffff, #00000000), hsl(${h}, 100%, 50%);`}
		bind:this={colorPickerElement}
		bind:clientWidth={colorPickerWidth}
		bind:clientHeight={colorPickerHeight}
		on:mousedown={moveColorPickerCursorMouse}
		on:touchstart={moveColorPickerCursorTouch}
	>
		<div
			class="absolute -translate-x-1/2 translate-y-1/2 w-8 h-8 border-3 rounded-full border-black cursor-grab group-active:cursor-grabbing"
			style={`bottom: ${v}%; left: ${s}%; background-color: ${hex};`}
		>
			<div class="w-full h-full border-3 rounded-full border-white">
				<div
					class="w-full h-full border-3 rounded-full border-black"
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
			class="appearance-none absolute w-full h-full bg-transparent cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:bg-transparent [&::-webkit-slider-thumb]:shadow-none [&::-webkit-slider-thumb]:cursor-grab group-active:[&::-webkit-slider-thumb]:cursor-grabbing"
			bind:value={h}
		/>

		<div
			class="h-5 border-3 rounded-md border-black"
			style="background: linear-gradient(to right, hsl(0,100%,50%), hsl(60,100%,50%), hsl(120,100%,50%), hsl(180,100%,50%), hsl(240,100%,50%), hsl(300,100%,50%),hsl(360,100%,50%));"
		/>

		<div
			class="absolute -top-[7px] -translate-x-1/2 w-8 h-8 border-3 rounded-full border-black pointer-events-none"
			style={`left: ${(h / 360) * (hueSliderWidth - 32) + 16}px;`}
		>
			<div class="w-full h-full border-3 rounded-full border-white">
				<div
					class="w-full h-full border-3 rounded-full border-black"
					style={`background-color: hsl(${h} 100% 50%);`}
				/>
			</div>
		</div>
	</div>

	<div
		class="h-16 flex justify-center items-center border-3 rounded-md border-black"
		style={`background: ${hex};`}
	>
		<span class="text-center" style={`color: ${contrastingColor(hex)}`}>{hex.toUpperCase()}</span>
	</div>
</div>
