<script lang="ts">
	import { tooltip } from '$lib/stores/tooltip';
	import { scale } from 'svelte/transition';
</script>

{#if $tooltip.isVisible}
	<div
		class="absolute -translate-x-1/2 flex flex-col items-center z-10 will-change-transform"
		class:-translate-y-full={$tooltip.position === 'top'}
		style={`top: ${$tooltip.y}px; left: ${$tooltip.x}px;`}
		transition:scale={{ duration: 300 }}
	>
		{#if $tooltip.position === 'bottom'}
			<div
				class="w-0 h-0"
				style="border-width: 0 7px 7px 7px; border-color: transparent transparent black transparent;"
			/>
		{/if}

		<div class="p-2 rounded-md text-center text-xs uppercase bg-black text-white">
			{$tooltip.message}
		</div>

		{#if $tooltip.position === 'top'}
			<div
				class="w-0 h-0"
				style="border-width: 7px 7px 0 7px; border-color: black transparent transparent transparent;"
			/>
		{/if}
	</div>
{/if}
