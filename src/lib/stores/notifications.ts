import { writable } from 'svelte/store';

type Notification = {
	id: number;
	message: string;
	icon: 'check' | 'copied' | 'unlocked' | 'locked';
	color: string;
};

export const notifications = writable(<Notification[]>[]);

export function addNotification(message: string, icon = 'check', color = '#000000'): void {
	let id: number;

	notifications.update((values) => {
		id = values.length !== 0 ? values[0].id + 1 : 0;

		values.unshift({
			id: id,
			message: message,
			icon: <'check' | 'copied' | 'unlocked' | 'locked'>icon,
			color: color
		});

		return values;
	});

	setTimeout(() => {
		dismissNotification(id);
	}, 3000);
}

export function dismissNotification(id: number): void {
	notifications.update((values) => values.filter((value) => value.id !== id));
}

export function clearNotifications(): void {
	notifications.set([]);
}
