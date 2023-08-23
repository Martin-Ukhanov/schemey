import { writable } from 'svelte/store';
import { v4 as uuid } from 'uuid';

type Notification = {
	id: string;
	message: string;
	icon: 'check' | 'copied' | 'unlocked' | 'locked';
	color: string;
};

export const notifications = writable(<Notification[]>[]);

export function addNotification(message: string, icon = 'check', color = '#000000'): void {
	const id = uuid();

	notifications.update((values) => {
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

export function dismissNotification(id: string): void {
	notifications.update((values) => values.filter((value) => value.id !== id));
}

export function clearNotifications(): void {
	notifications.set([]);
}
