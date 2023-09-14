<script lang="ts">
	import { page } from '$app/stores';
	import { applyAction, enhance } from '$app/forms';
	import { slide } from 'svelte/transition';
	import { isSignUpModalOpen, isSignInModalOpen } from '$lib/stores/auth';
	import { addNotification } from '$lib/stores/notifications.js';
	import Loader from '$lib/components/Loader.svelte';
	import { fail } from '@sveltejs/kit';

	export let redirect = !$page.error ? $page.url.pathname : '/';

	let nameErrorMessage: string | undefined;
	let emailErrorMessage: string | undefined;
	let passwordErrorMessage: string | undefined;

	let failureData: Record<string, unknown> | undefined;
	let isLoading = false;
</script>

<form
	method="post"
	action={`/auth/signup?redirect=${redirect}`}
	class="p-4 flex flex-col border-2 rounded-md border-black"
	use:enhance={({ formData, cancel }) => {
		nameErrorMessage = undefined;
		emailErrorMessage = undefined;
		passwordErrorMessage = undefined;
		failureData = undefined;

		const name = formData.get('name');
		const email = formData.get('email');
		const password = formData.get('password');

		if (!name) {
			nameErrorMessage = 'Please Enter Your Name';
		}

		if (!email) {
			emailErrorMessage = 'Please Enter Your Email';
		}

		if (!password) {
			passwordErrorMessage = 'Please Enter a Password.';
		}

		if (nameErrorMessage || emailErrorMessage || passwordErrorMessage) {
			cancel();
		} else {
			isLoading = true;
		}

		return async ({ update, result }) => {
			await update();

			if (result.type === 'redirect') {
				isLoading = false;
				$isSignUpModalOpen = false;

				await applyAction(result);

				addNotification('Successfully Signed Up', 'check');
			} else if (result.type === 'failure') {
				isLoading = false;
				failureData = result.data;
			}
		};
	}}
>
	<label for="name" class="mb-4 flex flex-col">
		<span class="mb-2 font-bold uppercase">Name</span>

		<input
			type="text"
			name="name"
			id="name"
			placeholder="John Doe"
			autocomplete="name"
			disabled={isLoading}
			class="input"
		/>

		{#if nameErrorMessage || failureData?.nameErrorMessage}
			<p class="error mt-2" transition:slide={{ duration: 200, axis: 'y' }}>
				{nameErrorMessage ?? failureData?.nameErrorMessage}
			</p>
		{/if}
	</label>

	<label for="email" class="mb-4 flex flex-col">
		<span class="mb-2 font-bold uppercase">Email</span>

		<input
			type="text"
			name="email"
			id="email"
			placeholder="example@email.com"
			autocomplete="email"
			disabled={isLoading}
			class="input"
		/>

		{#if emailErrorMessage || failureData?.emailErrorMessage}
			<p class="error mt-2" transition:slide={{ duration: 200, axis: 'y' }}>
				{emailErrorMessage ?? failureData?.emailErrorMessage}
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
			autocomplete="new-password"
			disabled={isLoading}
			class="input"
		/>

		{#if passwordErrorMessage || failureData?.passwordErrorMessage}
			<p class="error mt-2" transition:slide={{ duration: 200, axis: 'y' }}>
				{passwordErrorMessage ?? failureData?.passwordErrorMessage}
			</p>
		{/if}
	</label>

	<div class="mb-4 flex flex-col">
		<button type="submit" disabled={isLoading} class="button-primary">
			<span class:opacity-0={isLoading}>Sign Up</span>

			{#if isLoading}
				<Loader color="white" />
			{/if}
		</button>

		{#if failureData?.signUpErrorMessage}
			<p class="error mt-2" transition:slide={{ duration: 200, axis: 'y' }}>
				{failureData.signUpErrorMessage}
			</p>
		{/if}
	</div>

	<p class="text-xs text-center uppercase">
		Already have an account? <button
			class="link text-xs uppercase"
			on:click={() => {
				$isSignUpModalOpen = false;
				$isSignInModalOpen = true;
			}}
		>
			Sign In
		</button>
	</p>
</form>
