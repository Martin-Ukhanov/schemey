import { writable } from 'svelte/store';

type Notification = {
	id: number;
	message: string;
	color: string;
};

export const notifications = writable(<Notification[]>[]);

export function addNotification(message: string, color = '#ffffff'): void {
	let id: number;

	notifications.update((values) => {
		id = values.length !== 0 ? values[values.length - 1].id + 1 : 0;
		values.push({
			id: id,
			message: message,
			color: color
		});

		return values;
	});

	setTimeout(() => {
		dismissNotification(id);
	}, 3000);
}

function dismissNotification(id: number): void {
	notifications.update((values) => values.filter((value) => value.id !== id));
}
