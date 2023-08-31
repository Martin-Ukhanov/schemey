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
	<nav class="hidden sm:flex gap-x-2">
		{#if $page.data.session}
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

							addNotification(`Successfully Signed Out`);
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
