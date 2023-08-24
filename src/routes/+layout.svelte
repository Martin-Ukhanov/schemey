<script lang="ts">
	import '../app.css';
	import type { LayoutData } from './$types';
	import { invalidate, beforeNavigate } from '$app/navigation';
	import { onMount } from 'svelte';
	import Header from '$lib/components/Header.svelte';
	import Tooltip from '$lib/components/Tooltip.svelte';
	import Notifications from '$lib/components/Notifications.svelte';
	import { clearNotifications } from '$lib/stores/notifications';
	import Modal from '$lib/components/Modal.svelte';
	import SignIn from '$lib/components/SignIn.svelte';
	import { signInModalOpen, signUpModalOpen } from '$lib/stores/auth';
	import SignUp from '$lib/components/SignUp.svelte';

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

	beforeNavigate((navigation) => {
		if (navigation.from?.route.id !== navigation.to?.route.id) {
			clearNotifications();
		}
	});

	$: ({ supabase, session } = data);
</script>

<Header />

<main class="min-h-[calc(100dvh-theme(height.16))] flex flex-col">
	<slot />
</main>

<Modal title="Sign In" bind:open={$signInModalOpen}>
	<SignIn />
</Modal>

<Modal title="Sign Up" bind:open={$signUpModalOpen}>
	<SignUp />
</Modal>

<Tooltip />

<Notifications />
