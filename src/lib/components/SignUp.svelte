<script lang="ts">
	import { page } from '$app/stores';
	import { applyAction, enhance } from '$app/forms';
	import { slide } from 'svelte/transition';
	import { isSignUpModalOpen, isSignInModalOpen } from '$lib/stores/auth';
	import { addNotification } from '$lib/stores/notifications.js';
	import Loader from '$lib/components/Loader.svelte';

	export let redirect = $page.route.id ? $page.url.pathname : '/';

	let nameErrorMessage: string | undefined;
	let emailErrorMessage: string | undefined;
	let passwordErrorMessage: string | undefined;

	let failureData: Record<string, unknown> | undefined;
	let isLoading = false;

	function isValidEmail(email: FormDataEntryValue): boolean {
		return /^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/.test(<string>email);
	}
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
		} else if (name.length < 4 || name.length > 25) {
			nameErrorMessage = 'Name Must be Between 4 and 25 Characters';
		}

		if (!email) {
			emailErrorMessage = 'Please Enter Your Email';
		} else if (!isValidEmail(email)) {
			emailErrorMessage = 'Please Enter a Valid Email';
		}

		if (!password) {
			passwordErrorMessage = 'Please Enter a Password.';
		} else if (password.length < 6) {
			passwordErrorMessage = 'Password Must be Minimum 6 Characters';
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
			class="input"
			disabled={isLoading}
		/>

		{#if nameErrorMessage}
			<p class="error mt-2" transition:slide={{ duration: 200, axis: 'y' }}>
				{nameErrorMessage}
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
			class="input"
			disabled={isLoading}
		/>

		{#if emailErrorMessage}
			<p class="error mt-2" transition:slide={{ duration: 200, axis: 'y' }}>
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
			autocomplete="new-password"
			class="input"
			disabled={isLoading}
		/>

		{#if passwordErrorMessage}
			<p class="error mt-2" transition:slide={{ duration: 200, axis: 'y' }}>
				{passwordErrorMessage}
			</p>
		{/if}
	</label>

	<div class="mb-4 flex flex-col">
		<button type="submit" class="button-primary" disabled={isLoading}>
			<span class:opacity-0={isLoading}>Sign Up</span>
			{#if isLoading}
				<Loader color="black" />
			{/if}
		</button>

		{#if failureData?.message}
			<p class="error mt-2" transition:slide={{ duration: 200, axis: 'y' }}>
				{failureData.message}
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
