<script lang="ts">
	import { page } from '$app/stores';
	import { enhance, applyAction } from '$app/forms';
	import { addNotification } from '$lib/stores/notifications';
	import Loader from './Loader.svelte';

	let loading = false;

	$: route = $page.route.id ? $page.route.id.replace('[slug]', $page.params.slug) : '/';
</script>

<header class="h-16 p-2 flex justify-between items-center border-b-2 border-black">
	<a href="/" class="button-transparent-black text-2xl">ColorSchemes.io</a>
	<nav class="flex gap-x-2">
		{#if $page.data.session}
			<form
				method="post"
				action={`/auth/signout?redirect=${route}`}
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
			<a href={`/auth/signin?redirect=${route}`} class="button-transparent-black">Sign In</a>
			<a href={`/auth/signup?redirect=${route}`} class="button">Sign Up</a>
		{/if}
	</nav>
</header>
