<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { invalidate, beforeNavigate } from '$app/navigation';
	import { isSignInModalOpen, isSignUpModalOpen } from '$lib/stores/auth';
	import { clearNotifications } from '$lib/stores/notifications';
	import Header from '$lib/components/Header.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import SignIn from '$lib/components/SignIn.svelte';
	import SignUp from '$lib/components/SignUp.svelte';
	import Tooltip from '$lib/components/Tooltip.svelte';
	import Notifications from '$lib/components/Notifications.svelte';
	import type { LayoutData } from './$types';

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

<main class="relative h-[calc(100dvh-theme(height.16))] min-h-[323px] flex flex-col bg-white">
	<slot />
</main>

<Modal title="Sign In" bind:isOpen={$isSignInModalOpen}>
	<SignIn />
</Modal>

<Modal title="Sign Up" bind:isOpen={$isSignUpModalOpen}>
	<SignUp />
</Modal>

<Tooltip />

<Notifications />
