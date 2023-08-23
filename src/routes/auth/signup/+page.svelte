<script lang="ts">
	import { enhance } from '$app/forms';
	import { addNotification } from '$lib/stores/notifications.js';

	export let form;
</script>

<form
	method="post"
	class="flex flex-col gap-y-2"
	use:enhance={() => {
		return async ({ update, result }) => {
			await update();

			if (result.type === 'success') {
				addNotification(`Successfully Signed Up`);
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
	<button class="button">Sign up</button>
</form>

{#if form?.success === false}
	<p class="text-red-600">{form.message}</p>
{/if}
