import { writable } from 'svelte/store';
import { v4 as uuid } from 'uuid';

type Icons = 'check' | 'x' | 'copied' | 'unlocked' | 'locked';

type Notification = {
	id: string;
	message: string;
	icon: Icons;
	color: string;
};

export const notifications = writable(<Notification[]>[]);

export function addNotification(message: string, icon: Icons, color = '#000000'): void {
	const id = uuid();

	notifications.update((values) => {
		values.unshift({
			id: id,
			message: message,
			icon: icon,
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
