<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { fade } from 'svelte/transition';
	import { stringToSlug } from '$lib/utils';
	import { showTooltip } from '$lib/actions/showTooltip';
	import { isSignInModalOpen, isSignUpModalOpen } from '$lib/stores/auth';
	import MenuIcon from './icons/MenuIcon.svelte';
	import XIcon from './icons/XIcon.svelte';

	let isMenuOpen = false;

	$: if (browser) {
		document.body.classList.toggle('no-scroll', isMenuOpen);
	}
</script>

{#if isMenuOpen}
	<div
		class="fixed top-0 left-0 w-full h-full sm:hidden z-20 bg-black/50"
		transition:fade={{ duration: 200 }}
	/>
{/if}

<header class="relative h-16 z-20">
	<nav
		class="w-full h-full p-2 flex justify-between overflow-x-auto border-b-2 bg-white border-black"
	>
		<a
			href="/"
			class="button h-full text-3xl font-bold text-lime-500"
			use:showTooltip={{ position: 'bottom', message: 'Home' }}
			on:click={() => {
				isMenuOpen = false;
			}}
		>
			Schemey
		</a>

		<div class="hidden sm:flex gap-x-2">
			{#if $page.data.session}
				{@const name = $page.data.session.user.user_metadata.name}

				<a href="/" class="button-primary">Upgrade</a>

				<a
					href={`/user/${stringToSlug(name)}`}
					class="button-border max-w-80"
					data-sveltekit-reload
					use:showTooltip={{ position: 'bottom', message: 'Profile' }}
				>
					<span class="truncate">{name.toUpperCase()}</span>
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
		</div>

		<button
			class="button h-full p-0 sm:hidden aspect-square"
			on:click={() => {
				isMenuOpen = !isMenuOpen;
			}}
		>
			{#if isMenuOpen}
				<XIcon />
			{:else}
				<MenuIcon />
			{/if}
		</button>
	</nav>

	<menu
		class="absolute top-full w-full h-16 p-2 grid sm:hidden -z-10 border-b-2 bg-white border-black transition-transform duration-200 overflow-x-auto"
		class:-translate-y-full={!isMenuOpen}
	>
		<nav class="flex justify-center gap-x-2">
			{#if $page.data.session}
				{@const name = $page.data.session.user.user_metadata.name}

				<a href="/" class="button-primary flex-1">Upgrade</a>

				<a
					href={`/user/${stringToSlug(name)}`}
					class="button-border flex-1 overflow-hidden"
					data-sveltekit-reload
					use:showTooltip={{ position: 'bottom', message: 'Profile' }}
					on:click={() => {
						isMenuOpen = false;
					}}
				>
					<div class="truncate">{name.toUpperCase()}</div>
				</a>
			{:else}
				<button
					class="button-border flex-1"
					on:click={() => {
						isMenuOpen = false;
						$isSignInModalOpen = true;
					}}
				>
					Sign In
				</button>

				<button
					class="button-primary flex-1"
					on:click={() => {
						isMenuOpen = false;
						$isSignUpModalOpen = true;
					}}
				>
					Sign Up
				</button>
			{/if}
		</nav>
	</menu>
</header>
