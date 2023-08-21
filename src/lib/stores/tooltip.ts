import { writable } from 'svelte/store';

type Tooltip = {
	visible: boolean;
	position: 'top' | 'bottom';
	x: number;
	y: number;
	message: string;
};

export const tooltip = writable(<Tooltip>{
	visible: false,
	position: 'top',
	x: 0,
	y: 0,
	message: ''
});
