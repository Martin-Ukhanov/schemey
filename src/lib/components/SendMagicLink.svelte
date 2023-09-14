<script lang="ts">
	import { enhance } from '$app/forms';
	import { slide } from 'svelte/transition';
	import { isSendMagicLinkModalOpen } from '$lib/stores/auth';
	import { addNotification } from '$lib/stores/notifications.js';
	import Loader from '$lib/components/Loader.svelte';

	let emailErrorMessage: string | undefined;
	let failureData: Record<string, unknown> | undefined;
	let isLoading = false;
</script>

<form
	method="post"
	action="/auth/sendMagicLink"
	class="p-4 flex flex-col border-2 rounded-md border-black"
	use:enhance={({ formData, cancel }) => {
		emailErrorMessage = undefined;
		failureData = undefined;

		if (!formData.get('email')) {
			emailErrorMessage = 'Please Enter the Email Associated with your Account';
			cancel();
		} else {
			isLoading = true;
		}

		return async ({ update, result }) => {
			await update();

			isLoading = false;

			if (result.type === 'success') {
				$isSendMagicLinkModalOpen = false;
				addNotification('Magic Link Sent', 'check');
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
			disabled={isLoading}
			class="input"
		/>

		{#if emailErrorMessage || failureData?.emailErrorMessage}
			<p class="error mt-2" transition:slide={{ duration: 200, axis: 'y' }}>
				{emailErrorMessage ?? failureData?.emailErrorMessage}
			</p>
		{/if}
	</label>

	<div class="flex flex-col">
		<button type="submit" disabled={isLoading} class="button-primary">
			<span class:opacity-0={isLoading}>Send Magic Link</span>

			{#if isLoading}
				<Loader color="white" />
			{/if}
		</button>

		{#if failureData?.resetPasswordErrorMessage}
			<p class="error mt-2" transition:slide={{ duration: 200, axis: 'y' }}>
				{failureData.resetPasswordErrorMessage}
			</p>
		{/if}
	</div>
</form>
