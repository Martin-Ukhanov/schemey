<script lang="ts">
	import '../app.css';
	import Notifications from '$lib/components/Notifications.svelte';
</script>

<main class="min-h-screen">
	<slot />
</main>

<Notifications />
