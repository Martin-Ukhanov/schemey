<script lang="ts">
	import { notifications, dismissNotification } from '$lib/stores/notifications';
	import { contrastingColor } from '$lib/utils';
	import { scale } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import CheckSquareIcon from './icons/CheckSquareIcon.svelte';
	import XSquareIcon from './icons/XSquareIcon.svelte';
	import TrashIcon from './icons/TrashIcon.svelte';
	import CopyIcon from './icons/CopyIcon.svelte';
	import UnlockedIcon from './icons/UnlockedIcon.svelte';
	import LockedIcon from './icons/LockedIcon.svelte';
	import SavedIcon from './icons/SavedIcon.svelte';
</script>

<div
	class="fixed top-[5px] left-4 right-4 flex flex-col items-center gap-y-2 z-20 pointer-events-none"
>
	{#each $notifications as notification (notification.id)}
		{@const contrastColor = contrastingColor(notification.color)}
		<button
			class="button-border gap-x-2 pointer-events-auto !brightness-100"
			style={`background-color: ${notification.color}; color: ${contrastColor}; fill: ${contrastColor};`}
			in:scale={{ duration: 200 }}
			out:scale={{ duration: 200 }}
			animate:flip={{ duration: 200 }}
			on:click={() => {
				dismissNotification(notification.id);
			}}
		>
			{#if notification.icon === 'check'}
				<CheckSquareIcon />
			{:else if notification.icon === 'x'}
				<XSquareIcon />
			{:else if notification.icon === 'trash'}
				<TrashIcon />
			{:else if notification.icon === 'copied'}
				<CopyIcon />
			{:else if notification.icon === 'unlocked'}
				<UnlockedIcon />
			{:else if notification.icon === 'locked'}
				<LockedIcon />
			{:else if notification.icon === 'saved'}
				<SavedIcon />
			{/if}

			<span class="text-center uppercase">{notification.message}</span>
		</button>
	{/each}
</div>
