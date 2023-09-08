import { readable } from 'svelte/store';
import type { ColorSpace } from 'iwanthue';

type ColorSpacePresets = {
	[key: string]: ColorSpace;
};

export const colorSpacePresets = readable(<ColorSpacePresets>{
	all: [0, 360, 0, 100, 0, 100],
	light: [0, 360, 15, 40, 70, 100],
	dark: [0, 360, 8, 40, 7, 40],
	pastel: [0, 360, 0, 30, 70, 100],
	shades: [0, 240, 0, 15, 0, 100],
	intense: [0, 360, 50, 100, 15, 80],
	red: [0, 50, 15, 100, 15, 100],
	blue: [220, 300, 15, 100, 15, 100],
	green: [100, 160, 15, 100, 15, 100],
	yellow: [60, 100, 15, 100, 15, 100],
	pink: [330, 360, 15, 100, 15, 100],
	purple: [290, 330, 0, 100, 0, 40],
	teal: [160, 220, 15, 100, 15, 100],
	earth: [20, 60, 20, 50, 35, 100],
	colorblind: [0, 360, 40, 70, 15, 85]
});
