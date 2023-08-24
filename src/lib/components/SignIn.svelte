<script lang="ts">
	import { page } from '$app/stores';
	import { applyAction, enhance } from '$app/forms';
	import { slide } from 'svelte/transition';
	import { signInModalOpen, signUpModalOpen } from '$lib/stores/auth';
	import { addNotification } from '$lib/stores/notifications.js';
	import Loader from '$lib/components/Loader.svelte';

	export let redirect = $page.route.id ? $page.route.id.replace('[slug]', $page.params.slug) : '/';

	let emailErrorMessage: string | undefined;
	let passwordErrorMessage: string | undefined;

	let failureData: Record<string, unknown> | undefined;
	let loading = false;
</script>

<form
	method="post"
	action={`/auth/signin?redirect=${redirect}`}
	class="p-4 flex flex-col border-2 rounded-md border-black"
	use:enhance={({ formData, cancel }) => {
		emailErrorMessage = undefined;
		passwordErrorMessage = undefined;
		failureData = undefined;

		if (!formData.get('email')) {
			emailErrorMessage = 'Please enter your email.';
		}

		if (!formData.get('password')) {
			passwordErrorMessage = 'Please enter your password.';
		}

		if (emailErrorMessage || passwordErrorMessage) {
			cancel();
		} else {
			loading = true;
		}

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
	<label for="email" class="mb-4 flex flex-col">
		<span class="mb-2 font-bold uppercase">Email</span>

		<input
			type="text"
			name="email"
			id="email"
			placeholder="example@email.com"
			autocomplete="email"
			class="input"
			disabled={loading}
		/>

		{#if emailErrorMessage}
			<p class="error mt-2" transition:slide={{ duration: 300, axis: 'y' }}>
				{emailErrorMessage}
			</p>
		{/if}
	</label>

	<label for="password" class="mb-4 flex flex-col">
		<span class="mb-2 font-bold uppercase">Password</span>

		<input
			type="password"
			name="password"
			id="password"
			placeholder="••••••"
			autocomplete="current-password"
			class="input"
			disabled={loading}
		/>

		{#if passwordErrorMessage}
			<p class="error mt-2" transition:slide={{ duration: 300, axis: 'y' }}>
				{passwordErrorMessage}
			</p>
		{/if}
	</label>

	<div class="mb-4 flex flex-col">
		<button type="submit" class="button-primary" disabled={loading}>
			<span class:opacity-0={loading}>Sign In</span>
			{#if loading}
				<Loader />
			{/if}
		</button>

		{#if failureData?.message}
			<p class="error mt-2" transition:slide={{ duration: 300, axis: 'y' }}>
				{failureData.message}
			</p>
		{/if}
	</div>

	<p class="text-xs text-center uppercase">
		Don't have an account? <button
			class="link text-xs uppercase"
			on:click={() => {
				$signInModalOpen = false;
				$signUpModalOpen = true;
			}}
		>
			Sign Up
		</button>
	</p>
</form>
