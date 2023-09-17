<script lang="ts">
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>Schemey | Error</title>
</svelte:head>

<div class="flex-1 flex flex-col justify-center items-center gap-y-2">
	<h1 class="text-center text-5xl sm:text-7xl font-bold text-primary">{$page.status}</h1>

	<p class="text-center text-lg sm:text-2xl uppercase font-bold">{$page.error?.message}</p>
</div>
