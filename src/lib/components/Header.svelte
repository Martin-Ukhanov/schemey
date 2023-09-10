<script lang="ts">
	import { page } from '$app/stores';
	import { enhance, applyAction } from '$app/forms';
	import { stringToSlug } from '$lib/utils';
	import { showTooltip } from '$lib/actions/showTooltip';
	import { isSignInModalOpen, isSignUpModalOpen } from '$lib/stores/auth';
	import { savedColorSchemes, savedColors } from '$lib/stores/user';
	import { addNotification } from '$lib/stores/notifications';
	import Loader from './Loader.svelte';
	import MenuIcon from './icons/MenuIcon.svelte';

	let isLoading = false;
</script>

<header class="h-16 p-2 flex justify-between border-b-2 border-black">
	<a
		href="/"
		class="button h-full text-3xl font-bold text-lime-500"
		use:showTooltip={{ position: 'bottom', message: 'Home' }}
	>
		Schemey
	</a>

	<nav class="hidden sm:flex gap-x-2">
		{#if $page.data.session}
			{@const username = $page.data.session.user.user_metadata.name}

			<a href="/" class="button-primary bg-white text-lime-500">Upgrade</a>

			<div class="w-0.5 mx-1 rounded-md bg-black" />

			<a
				href={`/user/${stringToSlug(username)}`}
				class="button-border aspect-square text-2xl font-normal"
				use:showTooltip={{ position: 'bottom', message: username }}
				data-sveltekit-reload
			>
				{username[0].toUpperCase()}
			</a>

			<form
				method="post"
				action={`/auth/signout?redirect=${
					$page.route.id ? (/^\/user\/?/.test($page.url.pathname) ? '/' : $page.url.pathname) : '/'
				}`}
				use:enhance={() => {
					isLoading = true;

					return async ({ update, result }) => {
						await update();

						if (result.type === 'redirect') {
							$savedColors = [];
							$savedColorSchemes = [];

							isLoading = false;

							await applyAction(result);

							addNotification('Successfully Signed Out', 'check');
						} else if (result.type === 'failure') {
							isLoading = false;
							addNotification('Sign Out Failed', 'x');
						}
					};
				}}
			>
				<button class="button-primary h-full" disabled={isLoading}>
					<span class:opacity-0={isLoading}>Sign Out</span>
					{#if isLoading}
						<Loader color="black" />
					{/if}
				</button>
			</form>
		{:else}
			<button
				class="button-border"
				on:click={() => {
					$isSignInModalOpen = true;
				}}
			>
				Sign In
			</button>

			<button
				class="button-primary"
				on:click={() => {
					$isSignUpModalOpen = true;
				}}
			>
				Sign Up
			</button>
		{/if}
	</nav>

	<button class="button h-full p-0 sm:hidden aspect-square">
		<MenuIcon />
	</button>
</header>
