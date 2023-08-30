<script lang="ts">
	import { notifications, dismissNotification } from '$lib/stores/notifications';
	import { contrastingColor } from '$lib/utils';
	import { scale } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import CheckSquareIcon from './icons/CheckSquareIcon.svelte';
	import XSquareIcon from './icons/XSquareIcon.svelte';
	import CopyIcon from './icons/CopyIcon.svelte';
	import UnlockedIcon from './icons/UnlockedIcon.svelte';
	import LockedIcon from './icons/LockedIcon.svelte';
	import SavedIcon from './icons/SavedIcon.svelte';
	import SaveIcon from './icons/SaveIcon.svelte';
</script>

<div class="fixed top-4 left-4 right-4 flex flex-col items-center gap-y-4 z-10 pointer-events-none">
	{#each $notifications as notification (notification.id)}
		{@const contrastColor = contrastingColor(notification.color)}
		<button
			class="button gap-x-2 !brightness-100 pointer-events-auto"
			style={`background-color: ${notification.color}; color: ${contrastColor}; fill: ${contrastColor};`}
			in:scale={{ duration: 300 }}
			out:scale={{ duration: 300 }}
			animate:flip={{ duration: 300 }}
			on:click={() => {
				dismissNotification(notification.id);
			}}
		>
			{#if notification.icon === 'check'}
				<CheckSquareIcon />
			{:else if notification.icon === 'x'}
				<XSquareIcon />
			{:else if notification.icon === 'copied'}
				<CopyIcon />
			{:else if notification.icon === 'unlocked'}
				<UnlockedIcon />
			{:else if notification.icon === 'locked'}
				<LockedIcon />
			{:else if notification.icon === 'saved'}
				<SavedIcon />
			{:else if notification.icon === 'unsaved'}
				<SaveIcon />
			{/if}

			<span class="text-center uppercase">{notification.message}</span>
		</button>
	{/each}
</div>
