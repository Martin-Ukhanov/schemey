<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import Tooltip from '$lib/components/Tooltip.svelte';
	import Notifications from '$lib/components/Notifications.svelte';
</script>

<Header />

<main class="min-h-[calc(100dvh-theme(height.16))] flex flex-col">
	<slot />
</main>

<Tooltip />

<Notifications />
