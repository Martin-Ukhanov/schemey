<script lang="ts">
	import { page } from '$app/stores';
	import { enhance, applyAction } from '$app/forms';
	import { stringToSlug } from '$lib/utils';
	import { isSignInModalOpen, isSignUpModalOpen } from '$lib/stores/auth';
	import { savedColorSchemes, savedColors } from '$lib/stores/user';
	import { addNotification } from '$lib/stores/notifications';
	import Loader from './Loader.svelte';
	import MenuIcon from './icons/MenuIcon.svelte';

	let isLoading = false;
</script>

<header class="h-16 p-2 flex justify-between items-center border-b-2 border-black">
	<a href="/" class="button border-none text-2xl font-bold text-lime-500">Schemey</a>

	<nav class="hidden sm:flex items-center gap-x-2">
		{#if $page.data.session}
			{@const username = $page.data.session.user.user_metadata.name}

			<a href={`/user/${stringToSlug(username)}`} class="button w-10 h-10 text-2xl font-normal">
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
				<button class="button-primary" disabled={isLoading}>
					<span class:opacity-0={isLoading}>Sign Out</span>
					{#if isLoading}
						<Loader color="black" />
					{/if}
				</button>
			</form>
		{:else}
			<button
				class="button border-none"
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

	<button class="button block sm:hidden border-none">
		<MenuIcon />
	</button>
</header>
