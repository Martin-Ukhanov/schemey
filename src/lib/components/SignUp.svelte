<script lang="ts">
	import { page } from '$app/stores';
	import { applyAction, enhance } from '$app/forms';
	import { slide } from 'svelte/transition';
	import { signUpModalOpen, signInModalOpen } from '$lib/stores/auth';
	import { addNotification } from '$lib/stores/notifications.js';
	import Loader from '$lib/components/Loader.svelte';

	export let redirect = $page.route.id ? $page.route.id.replace('[slug]', $page.params.slug) : '/';

	let nameErrorMessage: string | undefined;
	let emailErrorMessage: string | undefined;
	let passwordErrorMessage: string | undefined;

	let failureData: Record<string, unknown> | undefined;
	let loading = false;

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
		} else if (name.length > 20) {
			nameErrorMessage = 'Name Must be Maximum 20 Characters';
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
			loading = true;
		}

		return async ({ update, result }) => {
			await update();

			loading = false;

			if (result.type === 'redirect') {
				await applyAction(result);
				$signUpModalOpen = false;
				addNotification(`Successfully Signed Up`);
			} else if (result.type === 'failure') {
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
			disabled={loading}
		/>

		{#if nameErrorMessage}
			<p class="error mt-2" transition:slide={{ duration: 300, axis: 'y' }}>
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
			autocomplete="new-password"
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
			<span class:opacity-0={loading}>Sign Up</span>
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
		Already have an account? <button
			class="link text-xs uppercase"
			on:click={() => {
				$signUpModalOpen = false;
				$signInModalOpen = true;
			}}
		>
			Sign In
		</button>
	</p>
</form>
