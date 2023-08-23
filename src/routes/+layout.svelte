<script lang="ts">
	import '../app.css';
	import type { LayoutData } from './$types';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import Header from '$lib/components/Header.svelte';
	import Tooltip from '$lib/components/Tooltip.svelte';
	import Notifications from '$lib/components/Notifications.svelte';

	export let data: LayoutData;

	let { supabase, session } = data;

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});

	$: ({ supabase, session } = data);
</script>

<Header />

<main class="min-h-[calc(100dvh-theme(height.16))] flex flex-col">
	<slot />
</main>

<Tooltip />

<Notifications />
