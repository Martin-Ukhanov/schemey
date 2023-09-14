<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { afterNavigate } from '$app/navigation';
	import { fade } from 'svelte/transition';
	import { stringToSlug } from '$lib/utils';
	import { showTooltip } from '$lib/actions/showTooltip';
	import { isSignInModalOpen, isSignUpModalOpen } from '$lib/stores/auth';
	import Loader from './Loader.svelte';
	import MenuIcon from './icons/MenuIcon.svelte';
	import XIcon from './icons/XIcon.svelte';

	let isMenuOpen = false;
	let isProfileLoading = false;
	let isGenerateLoading = false;

	afterNavigate(() => {
		isMenuOpen = false;
		isProfileLoading = false;
		isGenerateLoading = false;
	});

	$: generatePath =
		/^\/generate\//.test(<string>$page.route.id) && !$page.error ? $page.url.pathname : '/generate';

	$: if (browser) {
		document.body.classList.toggle('no-scroll', isMenuOpen);
	}
</script>

{#if isMenuOpen}
	<button
		class="fixed top-0 left-0 w-full h-full sm:hidden z-20 bg-black/50 cursor-default"
		transition:fade={{ duration: 200 }}
		on:click={() => {
			isMenuOpen = false;
		}}
	/>
{/if}

<header class="relative h-16 z-20">
	<nav
		class="w-full h-full p-2 flex justify-between overflow-x-auto border-b-2 bg-white border-black"
	>
		<a
			href="/"
			class="button h-full text-3xl font-bold text-primary"
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

				<a
					href={generatePath}
					class="button-primary"
					on:click={() => {
						isGenerateLoading = true;
					}}
				>
					<span class:opacity-0={isGenerateLoading}>Generate</span>

					{#if isGenerateLoading}
						<Loader color="white" />
					{/if}
				</a>

				<a
					href={`/user/${stringToSlug(name)}`}
					class="button-border max-w-80"
					use:showTooltip={{ position: 'bottom', message: 'Profile' }}
					on:click={() => {
						isProfileLoading = true;
					}}
				>
					<span class="truncate" class:opacity-0={isProfileLoading}>{name.toUpperCase()}</span>

					{#if isProfileLoading}
						<Loader color="black" />
					{/if}
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
			aria-label={isMenuOpen ? 'Close' : 'Open'}
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

				<a
					href={generatePath}
					class="button-primary flex-1"
					on:click={() => {
						isGenerateLoading = true;
					}}
				>
					<span class:opacity-0={isGenerateLoading}>Generate</span>

					{#if isGenerateLoading}
						<Loader color="white" />
					{/if}
				</a>

				<a
					href={`/user/${stringToSlug(name)}`}
					class="button-border flex-1 overflow-hidden"
					use:showTooltip={{ position: 'bottom', message: 'Profile' }}
					on:click={() => {
						isProfileLoading = true;
					}}
				>
					<span class="truncate" class:opacity-0={isProfileLoading}>{name.toUpperCase()}</span>

					{#if isProfileLoading}
						<Loader color="black" />
					{/if}
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
