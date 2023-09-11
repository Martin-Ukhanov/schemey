<script lang="ts">
	import { page } from '$app/stores';
	import { enhance, applyAction } from '$app/forms';
	import { stringToSlug } from '$lib/utils';
	import { showTooltip } from '$lib/actions/showTooltip';
	import { isSignInModalOpen, isSignUpModalOpen } from '$lib/stores/auth';
	import { savedColorSchemes, savedColors } from '$lib/stores/user';
	import { addNotification } from '$lib/stores/notifications';
	import Loader from './Loader.svelte';
	import MenuIcon from './icons/MenuIcon.svelte';

	let isLoading = false;
</script>

<header class="h-16 p-2 flex justify-between border-b-2 border-black">
	<a
		href="/"
		class="button h-full text-3xl font-bold text-lime-500"
		use:showTooltip={{ position: 'bottom', message: 'Home' }}
	>
		Schemey
	</a>

	<nav class="hidden sm:flex gap-x-2">
		{#if $page.data.session}
			{@const name = $page.data.session.user.user_metadata.name}

			<a href="/" class="button-primary">Upgrade</a>

			<a
				href={`/user/${stringToSlug(name)}`}
				class="button-border aspect-square text-2xl font-normal"
				data-sveltekit-reload
			>
				{name[0].toUpperCase()}
			</a>
		{:else}
			<button
				class="button-border"
				on:click={() => {
					$isSignInModalOpen = true;
				}}
			>
				Sign In
			</button>

			<button
				class="button-primary"
				on:click={() => {
					$isSignUpModalOpen = true;
				}}
			>
				Sign Up
			</button>
		{/if}
	</nav>

	<button class="button h-full p-0 sm:hidden aspect-square">
		<MenuIcon />
	</button>
</header>
