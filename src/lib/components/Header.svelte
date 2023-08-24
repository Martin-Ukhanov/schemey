<script lang="ts">
	import { page } from '$app/stores';
	import { enhance, applyAction } from '$app/forms';
	import { addNotification } from '$lib/stores/notifications';
	import { signInModalOpen, signUpModalOpen } from '$lib/stores/auth';
	import Loader from './Loader.svelte';
	import MenuIcon from './icons/MenuIcon.svelte';

	let loading = false;
</script>

<header class="h-16 p-2 flex justify-between items-center border-b-2 border-black">
	<a href="/" class="button border-none text-xl sm:text-2xl font-bold text-lime-500">
		ColorSchemes.io
	</a>
	<nav class="hidden sm:flex gap-x-2">
		{#if $page.data.session}
			<form
				method="post"
				action={`/auth/signout?redirect=${
					$page.route.id ? $page.route.id.replace('[slug]', $page.params.slug) : '/'
				}`}
				use:enhance={() => {
					loading = true;

					return async ({ update, result }) => {
						await update();

						loading = false;

						if (result.type === 'redirect') {
							await applyAction(result);
							addNotification(`Successfully Signed Out`);
						}
					};
				}}
			>
				<button class="button-primary" disabled={loading}>
					<span class:opacity-0={loading}>Sign Out</span>
					{#if loading}
						<Loader />
					{/if}
				</button>
			</form>
		{:else}
			<button
				class="button border-none"
				on:click={() => {
					$signInModalOpen = true;
				}}>Sign In</button
			>
			<button
				class="button-primary"
				on:click={() => {
					$signUpModalOpen = true;
				}}>Sign Up</button
			>
		{/if}
	</nav>
	<button class="button block sm:hidden border-none">
		<MenuIcon />
	</button>
</header>
