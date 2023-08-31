import { writable } from 'svelte/store';

export const savedColors = writable<string[]>([]);
export const savedColorSchemes = writable<string[][]>([]);
