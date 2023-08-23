<script lang="ts">
	import { enhance } from '$app/forms';
	import { addNotification } from '$lib/stores/notifications.js';
	import Loader from '$lib/components/Loader.svelte';

	export let form;

	let loading = false;
</script>

<form
	method="post"
	class="flex flex-col gap-y-2"
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
	<input
		name="email"
		placeholder="example@email.com"
		value={form?.email ?? ''}
		class="p-2 border-2 border-black"
	/>
	<input type="password" name="password" placeholder="Password" class="p-2 border-2 border-black" />
	<button class="button" disabled={loading}>
		<span class:opacity-0={loading}>Sign In</span>
		{#if loading}
			<Loader />
		{/if}
	</button>
</form>

{#if form?.fail}
	<p class="text-red-600">{form.message}</p>
{/if}
