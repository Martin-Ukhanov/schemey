<script lang="ts">
	import { page } from '$app/stores';
	import { enhance, applyAction } from '$app/forms';
	import { isSignInModalOpen, isSignUpModalOpen } from '$lib/stores/auth';
	import { savedColorSchemes, savedColors } from '$lib/stores/user';
	import { addNotification } from '$lib/stores/notifications';
	import Loader from './Loader.svelte';
	import MenuIcon from './icons/MenuIcon.svelte';

	let isLoading = false;
</script>

<header class="h-16 p-2 flex justify-between items-center border-b-2 border-black">
	<a href="/" class="button border-none text-xl sm:text-2xl font-bold text-lime-500">Schemey</a>

	<nav class="hidden sm:flex items-center gap-x-2">
		{#if $page.data.session}
			<a
				href="/"
				class="w-10 h-10 flex justify-center items-center rounded-full text-xl font-bold bg-black text-white"
			>
				{$page.data.session.user.user_metadata.name[0].toUpperCase()}
			</a>

			<form
				method="post"
				action={`/auth/signout?redirect=${
					$page.route.id ? $page.route.id.replace('[slug]', $page.params.slug) : '/'
				}`}
				use:enhance={() => {
					isLoading = true;

					return async ({ update, result }) => {
						await update();

						isLoading = false;

						if (result.type === 'redirect') {
							await applyAction(result);

							$savedColors = [];
							$savedColorSchemes = [];

							addNotification('Successfully Signed Out', 'check');
						} else if (result.type === 'failure') {
							addNotification('Sign Out Failed', 'x');
						}
					};
				}}
			>
				<button class="button-primary" disabled={isLoading}>
					<span class:opacity-0={isLoading}>Sign Out</span>
					{#if isLoading}
						<Loader />
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
