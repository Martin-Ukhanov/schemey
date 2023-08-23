<script lang="ts">
	import { enhance } from '$app/forms';
	import { slide } from 'svelte/transition';
	import { addNotification } from '$lib/stores/notifications.js';
	import Loader from '$lib/components/Loader.svelte';

	export let form;

	let loading = false;
</script>

<div class="p-4 flex-1 flex flex-col justify-center items-center gap-y-4">
	<h1 class="text-4xl text-center uppercase">Sign In</h1>
	<form
		method="post"
		class="w-full max-w-80 p-4 flex flex-col gap-y-4 border-2 rounded-md border-black"
		use:enhance={() => {
			loading = true;

			return async ({ update, result }) => {
				await update();

				loading = false;

				if (result.type === 'success') {
					addNotification(`Successfully Signed In`);
				}
			};
		}}
	>
		<label for="email" class="flex flex-col gap-y-2">
			<span class="text-lg uppercase">Email</span>
			<input
				type="text"
				name="email"
				id="email"
				placeholder="example@email.com"
				autocomplete="email"
				value={form?.email ?? ''}
				class="input"
				disabled={loading}
			/>
		</label>

		<label for="password" class="flex flex-col gap-y-2">
			<span class="text-lg uppercase">Password</span>
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

		{#if form?.failure}
			<p
				class="text-sm text-center uppercase text-red-600"
				transition:slide={{ duration: 300, axis: 'y' }}
			>
				{form.message}
			</p>
		{/if}
	</form>
</div>
