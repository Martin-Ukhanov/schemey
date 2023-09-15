import { writable } from 'svelte/store';
import { v4 as uuid } from 'uuid';

type Icons = 'check' | 'x' | 'trash' | 'copied' | 'unlocked' | 'locked' | 'saved';

type Notification = {
	id: string;
	message: string;
	icon: Icons;
	color: string;
};

export const notifications = writable(<Notification[]>[]);

export function addNotification(message: string, icon: Icons, color = '#000000') {
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

export function dismissNotification(id: string) {
	notifications.update((values) => values.filter((value) => value.id !== id));
}

export function clearNotifications() {
	notifications.set([]);
}
