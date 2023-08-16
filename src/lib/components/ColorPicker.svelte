<script lang="ts">
	import convert from 'color-convert';

	export let hex: string;

	let width: number;
	let height: number;

	let [h, s, v] = convert.hex.hsv(hex);

	$: hex = '#' + convert.hsv.hex([h, s, v]);
</script>

<button
	class="relative w-32 h-32"
	style={`background: linear-gradient(#ffffff00, #000000ff),
  linear-gradient(0.25turn, #ffffffff, #00000000), hsl(${h}, 100%, 50%);`}
	bind:clientWidth={width}
	bind:clientHeight={height}
	on:click={(e) => {
		s = Math.round((e.offsetX / width) * 100);
		v = 100 - Math.round((e.offsetY / height) * 100);
	}}
>
	<div
		class="absolute -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-white"
		style={`bottom: ${v}%; left: ${s}%`}
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
