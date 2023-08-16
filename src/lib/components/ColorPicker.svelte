<script lang="ts">
	import { browser } from '$app/environment';
	import convert from 'color-convert';

	export let hex: string;

	let canvas: HTMLButtonElement;
	let width: number;
	let height: number;

	let [h, s, v] = convert.hex.hsv(hex);

	function pickColorMouse(e: MouseEvent): void {
		const rect = canvas.getBoundingClientRect();

		s = Math.min(Math.max(Math.round(((e.clientX - rect.left) / width) * 100), 0), 100);
		v = Math.min(Math.max(100 - Math.round(((e.clientY - rect.top) / height) * 100), 0), 100);

		if (browser) {
			document.onmousemove = (e) => {
				s = Math.min(Math.max(Math.round(((e.clientX - rect.left) / width) * 100), 0), 100);
				v = Math.min(Math.max(100 - Math.round(((e.clientY - rect.top) / height) * 100), 0), 100);
			};

			document.onmouseup = () => {
				document.onmousemove = null;
				document.onmouseup = null;
			};
		}
	}

	$: hex = '#' + convert.hsv.hex([h, s, v]);
</script>

<button
	class="relative w-32 h-32"
	style={`background: linear-gradient(#ffffff00, #000000ff),
  linear-gradient(0.25turn, #ffffffff, #00000000), hsl(${h}, 100%, 50%);`}
	bind:this={canvas}
	bind:clientWidth={width}
	bind:clientHeight={height}
	on:mousedown={pickColorMouse}
>
	<div
		class="absolute -translate-x-1/2 translate-y-1/2 w-5 h-5 border-4 rounded-full border-white"
		style={`bottom: ${v}%; left: ${s}%; background-color: ${hex}`}
	/>
</button>
<div class="w-8 h-8" style={`background: ${hex};`} />
<input
	type="range"
	min="0"
	max="360"
	step="1"
	class="appearance-none w-48 h-3 rounded-full"
	style="background: linear-gradient(to right, hsl(0,100%,50%), hsl(60,100%,50%), hsl(120,100%,50%), hsl(180,100%,50%), hsl(240,100%,50%), hsl(300,100%,50%),hsl(360,100%,50%));"
	bind:value={h}
/>

<style>
	input[type='range']::-webkit-slider-thumb {
		@apply appearance-none w-5 h-5 border-4 border-solid rounded-full border-white;
	}
</style>
