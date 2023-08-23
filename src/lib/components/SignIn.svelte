<script lang="ts">
	import { page } from '$app/stores';
	import { applyAction, enhance } from '$app/forms';
	import { slide } from 'svelte/transition';
	import { signInModalOpen } from '$lib/stores/auth';
	import { addNotification } from '$lib/stores/notifications.js';
	import Loader from '$lib/components/Loader.svelte';

	export let redirect = $page.route.id ? $page.route.id.replace('[slug]', $page.params.slug) : '/';

	let failureData: Record<string, unknown> | undefined;
	let loading = false;
</script>

<form
	method="post"
	action={`/auth/signin?redirect=${redirect}`}
	class="p-4 flex flex-col gap-y-4 border-2 rounded-md border-black"
	use:enhance={() => {
		loading = true;

		return async ({ update, result }) => {
			await update();

			loading = false;

			if (result.type === 'redirect') {
				await applyAction(result);
				$signInModalOpen = false;
				addNotification(`Successfully Signed In`);
			} else if (result.type === 'failure') {
				failureData = result.data;
			}
		};
	}}
>
	<label for="email" class="flex flex-col gap-y-2">
		<span class="font-bold uppercase">Email</span>
		<input
			type="text"
			name="email"
			id="email"
			placeholder="example@email.com"
			autocomplete="email"
			class="input"
			disabled={loading}
		/>
	</label>

	<label for="password" class="flex flex-col gap-y-2">
		<span class="font-bold uppercase">Password</span>
		<input
			type="password"
			name="password"
			id="password"
			placeholder="••••••"
			autocomplete="current-password"
			class="input"
			disabled={loading}
		/>
	</label>

	<button type="submit" class="button" disabled={loading}>
		<span class:opacity-0={loading}>Sign In</span>
		{#if loading}
			<Loader />
		{/if}
	</button>

	{#if failureData?.message}
		<p
			class="text-sm text-center uppercase text-red-600"
			transition:slide={{ duration: 300, axis: 'y' }}
		>
			{failureData.message}
		</p>
	{/if}
</form>
