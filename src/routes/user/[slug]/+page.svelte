<script lang="ts">
	import { page } from '$app/stores';
	import { enhance, applyAction } from '$app/forms';
	import { scale, slide } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { contrastingColor } from '$lib/utils';
	import { showTooltip } from '$lib/actions/showTooltip';
	import {
		savedColors as savedColorsStore,
		savedColorSchemes as savedColorSchemesStore
	} from '$lib/stores/user';
	import { addNotification } from '$lib/stores/notifications';
	import TrashIcon from '$lib/components/icons/TrashIcon.svelte';
	import Loader from '$lib/components/Loader.svelte';

	export let data;

	type SavedColor = {
		hex: string;
		isDeleteLoading: boolean;
	};

	type SavedColorScheme = {
		colorScheme: string[];
		isDeleteLoading: boolean;
	};

	let activePage: 'colors' | 'colorSchemes' | 'account' = 'colors';
	let savedColors: SavedColor[] = data.savedColors.map((SavedColor: string) => {
		return { hex: SavedColor, isDeleteLoading: false };
	});
	let savedColorSchemes: SavedColorScheme[] = data.savedColorSchemes.map(
		(savedColorScheme: string[]) => {
			return { colorScheme: savedColorScheme, isDeleteLoading: false };
		}
	);

	let newNameErrorMessage: string | undefined;
	let updateNameFailureData: Record<string, unknown> | undefined;
	let isUpdateNameLoading = false;

	let newEmailErrorMessage: string | undefined;
	let updateEmailFailureData: Record<string, unknown> | undefined;
	let isUpdateEmailLoading = false;

	let newPasswordErrorMessage: string | undefined;
	let confirmPasswordErrorMessage: string | undefined;
	let updatePasswordFailureData: Record<string, unknown> | undefined;
	let isUpdatePasswordLoading = false;

	let isSignOutLoading = false;
	let isUserDeletionRequestLoading = false;

	async function deleteColor(color: string) {
		const response = await fetch('/api/colors', {
			method: 'DELETE',
			body: JSON.stringify({ color: color }),
			headers: {
				'content-type': 'application/json'
			}
		});
		const data = await response.json();

		if (data.success) {
			savedColors = savedColors.filter((savedColor) => savedColor.hex !== color);
			addNotification(`${color} Deleted`, 'trash', color);
		} else {
			addNotification(`Failed to Delete ${color}`, 'x', color);
		}
	}

	async function deleteColorScheme(colorScheme: string[]) {
		const response = await fetch('/api/colorSchemes', {
			method: 'DELETE',
			body: JSON.stringify({ colorScheme: colorScheme }),
			headers: {
				'content-type': 'application/json'
			}
		});
		const data = await response.json();

		if (data.success) {
			savedColorSchemes = savedColorSchemes.filter(
				(savedColorScheme) =>
					JSON.stringify(savedColorScheme.colorScheme) !== JSON.stringify(colorScheme)
			);
			addNotification('Color Scheme Deleted', 'trash');
		} else {
			addNotification('Failed to Delete Color Scheme', 'x');
		}
	}

	$: if (activePage !== 'account') {
		newNameErrorMessage = undefined;
		updateNameFailureData = undefined;

		newPasswordErrorMessage = undefined;
		confirmPasswordErrorMessage = undefined;
		updatePasswordFailureData = undefined;
	}
</script>

<svelte:head>
	<title>Schemey | {$page.data.session?.user.user_metadata.name}</title>
</svelte:head>

<nav class="p-4 flex flex-col sm:flex-row justify-center gap-2 sm:[&>button]:w-48">
	<button
		class={activePage === 'colors' ? 'button-primary' : 'button-border'}
		on:click={() => {
			activePage = 'colors';
		}}
	>
		Colors
	</button>

	<button
		class={activePage === 'colorSchemes' ? 'button-primary' : 'button-border'}
		on:click={() => {
			activePage = 'colorSchemes';
		}}
	>
		Color Schemes
	</button>

	<button
		class={activePage === 'account' ? 'button-primary' : 'button-border'}
		on:click={() => {
			activePage = 'account';
		}}
	>
		Account
	</button>
</nav>

<div class="flex-1 min-h-64 p-4 pt-0 flex flex-col">
	{#if activePage === 'colors'}
		<div
			class="relative h-full p-2 grid grid-cols-[repeat(auto-fit,minmax(theme(width.40),1fr))] auto-rows-28 gap-2 overflow-y-auto overscroll-none border-2 rounded-md border-black"
		>
			{#if savedColors.length === 0}
				<p
					class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center uppercase font-bold"
				>
					No Colors Saved
				</p>
			{:else}
				{#each savedColors as savedColor (savedColor.hex)}
					<div class="flex" out:scale={{ duration: 200 }} animate:flip={{ duration: 200 }}>
						<button
							class="flex-1 p-2 grid items-center border-2 rounded-l-md border-black cursor-pointer group"
							style={`background-color: ${savedColor.hex};`}
							use:showTooltip={{ position: 'top', message: 'Copy Hex' }}
							on:click={() => {
								navigator.clipboard.writeText(savedColor.hex.toUpperCase());
								addNotification(`${savedColor.hex} Copied`, 'copied', savedColor.hex);
							}}
						>
							<span
								class="scale-0 group-hover:scale-100 text-center font-bold uppercase transition-transform duration-200"
								style={`color: ${contrastingColor(savedColor.hex)};`}
							>
								{savedColor.hex}
							</span>
						</button>

						<button
							aria-label="Delete Color"
							class="button-border border-l-0 rounded-l-none"
							use:showTooltip={{ position: 'top', message: 'Delete Color' }}
							on:click={async () => {
								savedColor.isDeleteLoading = true;
								await deleteColor(savedColor.hex);
								savedColor.isDeleteLoading = false;
							}}
						>
							<div class:opacity-0={savedColor.isDeleteLoading}>
								<TrashIcon />
							</div>

							{#if savedColor.isDeleteLoading}
								<Loader color="black" />
							{/if}
						</button>
					</div>
				{/each}
			{/if}
		</div>
	{:else if activePage === 'colorSchemes'}
		<div
			class="relative h-full p-2 grid grid-cols-[repeat(auto-fit,minmax(theme(width.64),1fr))] auto-rows-28 gap-2 overflow-y-auto overscroll-none border-2 rounded-md border-black"
		>
			{#if savedColorSchemes.length === 0}
				<p
					class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center uppercase font-bold"
				>
					No Color Schemes Saved
				</p>
			{:else}
				{#each savedColorSchemes as savedColorScheme (savedColorScheme.colorScheme)}
					<div class="flex" out:scale={{ duration: 200 }} animate:flip={{ duration: 200 }}>
						<div
							class="flex-1 flex overflow-x-auto border-2 rounded-md rounded-r-none border-black"
						>
							{#each savedColorScheme.colorScheme as color}
								<button
									class="flex-grow basis-4 hover:basis-24 p-2 flex justify-center items-center overflow-x-hidden cursor-pointer transition-all duration-200 group"
									style={`background-color: ${color};`}
									use:showTooltip={{ position: 'top', message: 'Copy Hex' }}
									on:click={() => {
										navigator.clipboard.writeText(color.toUpperCase());
										addNotification(`${color} Copied`, 'copied', color);
									}}
								>
									<span
										class="scale-0 group-hover:scale-100 uppercase font-bold transition-all duration-200"
										style={`color: ${contrastingColor(color)}`}
									>
										{color}
									</span>
								</button>
							{/each}
						</div>

						<button
							aria-label="Delete Color Scheme"
							class="button-border border-l-0 rounded-l-none"
							use:showTooltip={{ position: 'top', message: 'Delete Color Scheme' }}
							on:click={async () => {
								savedColorScheme.isDeleteLoading = true;
								await deleteColorScheme(savedColorScheme.colorScheme);
								savedColorScheme.isDeleteLoading = false;
							}}
						>
							<div class:opacity-0={savedColorScheme.isDeleteLoading}>
								<TrashIcon />
							</div>

							{#if savedColorScheme.isDeleteLoading}
								<Loader color="black" />
							{/if}
						</button>
					</div>
				{/each}
			{/if}
		</div>
	{:else if activePage === 'account'}
		<div class="w-full max-w-3xl pb-4 self-center flex flex-col gap-4">
			<form
				method="post"
				action="?/updateName"
				class="flex-1 p-4 flex flex-col border-2 rounded-md border-black"
				use:enhance={({ formData, cancel }) => {
					newNameErrorMessage = undefined;
					updateNameFailureData = undefined;

					if (!formData.get('name')) {
						newNameErrorMessage = 'Please Enter a New Name';
						cancel();
					} else {
						isUpdateNameLoading = true;
					}

					return async ({ update, result }) => {
						await update();

						if (result.type === 'redirect') {
							await applyAction(result);
							isUpdateNameLoading = false;
							addNotification('Sucessfully Updated Name', 'check');
						} else if (result.type === 'failure') {
							isUpdateNameLoading = false;
							updateNameFailureData = result.data;
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
						value={$page.data.session?.user.user_metadata.name}
						autocomplete="name"
						class="input"
					/>

					{#if newNameErrorMessage || updateNameFailureData?.newNameErrorMessage}
						<p class="error mt-2" transition:slide={{ duration: 200, axis: 'y' }}>
							{newNameErrorMessage ?? updateNameFailureData?.newNameErrorMessage}
						</p>
					{/if}
				</label>

				<div class="flex flex-col">
					<button type="submit" disabled={isUpdateNameLoading} class="button-primary">
						<span class:opacity-0={isUpdateNameLoading}>Update Name</span>

						{#if isUpdateNameLoading}
							<Loader color="white" />
						{/if}
					</button>

					{#if updateNameFailureData?.updateNameErrorMessage}
						<p class="error mt-2" transition:slide={{ duration: 200, axis: 'y' }}>
							{updateNameFailureData.updateNameErrorMessage}
						</p>
					{/if}
				</div>
			</form>

			<form
				method="post"
				action="?/updateEmail"
				class="flex-1 p-4 flex flex-col border-2 rounded-md border-black"
				use:enhance={({ formData, cancel }) => {
					newEmailErrorMessage = undefined;
					updateEmailFailureData = undefined;

					if (!formData.get('email')) {
						newNameErrorMessage = 'Please Enter a New Email';
						cancel();
					} else {
						isUpdateEmailLoading = true;
					}

					return async ({ update, result }) => {
						await update();

						isUpdateEmailLoading = false;

						if (result.type === 'success') {
							addNotification('Confirmation Link Sent to New Email', 'check');
						} else if (result.type === 'failure') {
							updateEmailFailureData = result.data;
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
						value={$page.data.session?.user.new_email ?? $page.data.session?.user.email}
						autocomplete="email"
						class="input"
					/>

					{#if newEmailErrorMessage || updateEmailFailureData?.newEmailErrorMessage}
						<p class="error mt-2" transition:slide={{ duration: 200, axis: 'y' }}>
							{newEmailErrorMessage ?? updateEmailFailureData?.newEmailErrorMessage}
						</p>
					{/if}
				</label>

				<div class="flex flex-col">
					<button type="submit" disabled={isUpdateEmailLoading} class="button-primary">
						<span class:opacity-0={isUpdateEmailLoading}>Update Email</span>

						{#if isUpdateEmailLoading}
							<Loader color="white" />
						{/if}
					</button>

					{#if updateEmailFailureData?.updateEmailErrorMessage}
						<p class="error mt-2" transition:slide={{ duration: 200, axis: 'y' }}>
							{updateEmailFailureData.updateEmailErrorMessage}
						</p>
					{/if}
				</div>
			</form>

			<form
				method="post"
				action="?/updatePassword"
				class="flex-1 p-4 flex flex-col border-2 rounded-md border-black"
				use:enhance={({ formData, cancel }) => {
					newPasswordErrorMessage = undefined;
					confirmPasswordErrorMessage = undefined;
					updatePasswordFailureData = undefined;

					if (!formData.get('newPassword')) {
						newPasswordErrorMessage = 'Please Enter A New Password';
					}

					if (!formData.get('confirmPassword')) {
						confirmPasswordErrorMessage = 'Please Confirm New Password';
					}

					if (newPasswordErrorMessage || confirmPasswordErrorMessage) {
						cancel();
					} else {
						isUpdatePasswordLoading = true;
					}

					return async ({ update, result }) => {
						await update();

						if (result.type === 'success') {
							await applyAction(result);
							isUpdatePasswordLoading = false;
							addNotification('Sucessfully Updated Password', 'check');
						} else if (result.type === 'failure') {
							isUpdatePasswordLoading = false;
							updatePasswordFailureData = result.data;
						}
					};
				}}
			>
				<label for="new-password" class="mb-4 flex flex-col">
					<span class="mb-2 font-bold uppercase">New Password</span>

					<input
						type="password"
						name="newPassword"
						id="new-password"
						placeholder="••••••"
						autocomplete="new-password"
						class="input"
					/>

					{#if newPasswordErrorMessage}
						<p class="error mt-2" transition:slide={{ duration: 200, axis: 'y' }}>
							{newPasswordErrorMessage}
						</p>
					{/if}
				</label>

				<label for="confirm-password" class="mb-4 flex flex-col">
					<span class="mb-2 font-bold uppercase">Confirm Password</span>

					<input
						type="password"
						name="confirmPassword"
						id="confirm-password"
						placeholder="••••••"
						autocomplete="new-password"
						class="input"
					/>

					{#if confirmPasswordErrorMessage}
						<p class="error mt-2" transition:slide={{ duration: 200, axis: 'y' }}>
							{confirmPasswordErrorMessage}
						</p>
					{/if}
				</label>

				<div class="flex flex-col">
					<button type="submit" disabled={isUpdatePasswordLoading} class="button-primary">
						<span class:opacity-0={isUpdatePasswordLoading}>Update Password</span>

						{#if isUpdatePasswordLoading}
							<Loader color="white" />
						{/if}
					</button>

					{#if updatePasswordFailureData?.errorMessage}
						<p class="error mt-2" transition:slide={{ duration: 200, axis: 'y' }}>
							{updatePasswordFailureData.errorMessage}
						</p>
					{/if}
				</div>
			</form>

			<div class="flex flex-col gap-y-2">
				<form
					method="post"
					action="?/signOut"
					use:enhance={() => {
						isSignOutLoading = true;

						return async ({ update, result }) => {
							await update();

							if (result.type === 'redirect') {
								$savedColorsStore = [];
								$savedColorSchemesStore = [];

								isSignOutLoading = false;

								await applyAction(result);

								addNotification('Successfully Signed Out', 'check');
							} else if (result.type === 'failure') {
								isSignOutLoading = false;
								addNotification('Sign Out Failed', 'x');
							}
						};
					}}
				>
					<button type="submit" disabled={isSignOutLoading} class="button-border w-full">
						<span class:opacity-0={isSignOutLoading}>Sign Out</span>

						{#if isSignOutLoading}
							<Loader color="black" />
						{/if}
					</button>
				</form>

				<form
					method="post"
					action={data.isUserDeletionRequested
						? '?/cancelUserDeletionRequest'
						: '?/requestUserDeletion'}
					use:enhance={() => {
						isUserDeletionRequestLoading = true;

						return async ({ update, result }) => {
							await update();

							isUserDeletionRequestLoading = false;

							if (result.type === 'success') {
								addNotification(
									data.isUserDeletionRequested
										? 'Successfully Requested Account Deletion'
										: 'Successfully Canceled Account Deletion',
									'check'
								);
							} else if (result.type === 'failure') {
								addNotification(
									data.isUserDeletionRequested
										? 'Account Deletion Request Failed'
										: 'Cancel Account Deletion Failed',
									'x'
								);
							}
						};
					}}
				>
					<button
						type="submit"
						disabled={isUserDeletionRequestLoading}
						class="button-primary w-full bg-red-500 border-red-500"
					>
						<span class:opacity-0={isUserDeletionRequestLoading}>
							{#if data.isUserDeletionRequested}
								Cancel Account Deletion
							{:else}
								Request Account Deletion
							{/if}
						</span>

						{#if isUserDeletionRequestLoading}
							<Loader color="white" />
						{/if}
					</button>
				</form>
			</div>
		</div>
	{/if}
</div>
