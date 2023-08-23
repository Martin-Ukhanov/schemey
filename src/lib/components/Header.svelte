<script lang="ts">
	import { page } from '$app/stores';
	import { enhance, applyAction } from '$app/forms';
	import { addNotification } from '$lib/stores/notifications';
	import Loader from './Loader.svelte';
	import { signInModalOpen, signUpModalOpen } from '$lib/stores/auth';

	let loading = false;
</script>

<header class="h-16 p-2 flex justify-between items-center border-b-2 border-black">
	<a href="/" class="button-transparent-black text-2xl font-bold">ColorSchemes.io</a>
	<nav class="flex gap-x-2">
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
				<button class="button" disabled={loading}>
					<span class:opacity-0={loading}>Sign Out</span>
					{#if loading}
						<Loader />
					{/if}
				</button>
			</form>
		{:else}
			<button
				class="button-transparent-black"
				on:click={() => {
					$signInModalOpen = true;
				}}>Sign In</button
			>
			<button
				class="button"
				on:click={() => {
					$signUpModalOpen = true;
				}}>Sign Up</button
			>
		{/if}
	</nav>
</header>
