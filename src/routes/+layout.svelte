<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { invalidate, beforeNavigate } from '$app/navigation';
	import { isSignInModalOpen, isSignUpModalOpen, isSendMagicLinkModalOpen } from '$lib/stores/auth';
	import { addNotification, clearNotifications } from '$lib/stores/notifications';
	import Header from '$lib/components/Header.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import SignIn from '$lib/components/SignIn.svelte';
	import SignUp from '$lib/components/SignUp.svelte';
	import SendMagicLink from '$lib/components/SendMagicLink.svelte';
	import Tooltip from '$lib/components/Tooltip.svelte';
	import Notifications from '$lib/components/Notifications.svelte';

	export let data;

	let { supabase, session } = data;

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		if ($page.url.searchParams.has('type')) {
			const type = $page.url.searchParams.get('type');
			const success = $page.url.searchParams.get('success');

			if (type === 'magiclink') {
				if (success === 'true') {
					addNotification('Successfully Signed In', 'check');
				} else {
					addNotification('Sign In Failed', 'x');
				}
			} else if (type === 'email_change') {
				if (success === 'true') {
					addNotification('Successfully Updated Email', 'check');
				} else {
					addNotification('Failed to Update Email', 'x');
				}
			}
		} else if ($page.url.searchParams.has('auth_code_error')) {
			addNotification('Auth Code Error Occured', 'x');
		}

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

<Modal title="Send Magic Link" bind:isOpen={$isSendMagicLinkModalOpen}>
	<SendMagicLink />
</Modal>

<Tooltip />

<Notifications />
