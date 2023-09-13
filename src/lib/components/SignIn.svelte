<script lang="ts">
	import { page } from '$app/stores';
	import { applyAction, enhance } from '$app/forms';
	import { slide } from 'svelte/transition';
	import { isSignInModalOpen, isSignUpModalOpen } from '$lib/stores/auth';
	import { savedColors, savedColorSchemes } from '$lib/stores/user';
	import { addNotification } from '$lib/stores/notifications.js';
	import Loader from '$lib/components/Loader.svelte';

	export let redirect = $page.route.id ? $page.url.pathname : '/';

	let emailErrorMessage: string | undefined;
	let passwordErrorMessage: string | undefined;

	let failureData: Record<string, unknown> | undefined;
	let isLoading = false;
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
			emailErrorMessage = 'Please Enter Your Email';
		}

		if (!formData.get('password')) {
			passwordErrorMessage = 'Please Enter Your Password';
		}

		if (emailErrorMessage || passwordErrorMessage) {
			cancel();
		} else {
			isLoading = true;
		}

		return async ({ update, result }) => {
			await update();

			if (result.type === 'redirect') {
				const savedColorsResponse = await fetch('/api/colors', {
					method: 'GET'
				});
				const savedColorsData = await savedColorsResponse.json();
				$savedColors = savedColorsData;

				const savedColorSchemesResponse = await fetch('/api/colorSchemes', {
					method: 'GET'
				});
				const savedColorSchemesData = await savedColorSchemesResponse.json();
				$savedColorSchemes = savedColorSchemesData;

				isLoading = false;
				$isSignInModalOpen = false;

				await applyAction(result);

				addNotification('Successfully Signed In', 'check');
			} else if (result.type === 'failure') {
				isLoading = false;
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
			disabled={isLoading}
			class="input"
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
			autocomplete="current-password"
			disabled={isLoading}
			class="input"
		/>

		{#if passwordErrorMessage}
			<p class="error mt-2" transition:slide={{ duration: 200, axis: 'y' }}>
				{passwordErrorMessage}
			</p>
		{/if}
	</label>

	<div class="mb-4 flex flex-col">
		<button type="submit" disabled={isLoading} class="button-primary">
			<span class:opacity-0={isLoading}>Sign In</span>

			{#if isLoading}
				<Loader color="white" />
			{/if}
		</button>

		{#if failureData?.message}
			<p class="error mt-2" transition:slide={{ duration: 200, axis: 'y' }}>
				{failureData.message}
			</p>
		{/if}
	</div>

	<p class="mb-2 text-xs text-center uppercase">
		Forgot your password? <button class="link text-xs uppercase">Reset</button>
	</p>

	<p class="text-xs text-center uppercase">
		Don't have an account? <button
			class="link text-xs uppercase"
			on:click={() => {
				$isSignInModalOpen = false;
				$isSignUpModalOpen = true;
			}}
		>
			Sign Up
		</button>
	</p>
</form>
