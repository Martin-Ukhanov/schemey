<script lang="ts">
	export let color: 'white' | 'black';
</script>

{#if color === 'white'}
	<div class="absolute w-5 h-5 border-4 border-white/20 border-t-white rounded-full animate-spin" />
{:else}
	<div class="absolute w-5 h-5 border-4 border-black/20 border-t-black rounded-full animate-spin" />
{/if}
