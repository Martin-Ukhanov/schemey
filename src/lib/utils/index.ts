import convert from 'color-convert';
import type { RGB } from 'color-convert/conversions';
import iwanthue, { type ColorSpace } from 'iwanthue';

function rgbLuminance(rgb: RGB): number {
	return (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
}

export function contrastingColor(hex: string): '#000000' | '#ffffff' {
	return rgbLuminance(convert.hex.rgb(hex)) <= 0.5 ? '#ffffff' : '#000000';
}

type ColorSpacePresets = {
	[key: string]: ColorSpace;
};

export const COLOR_SPACE_PRESETS: ColorSpacePresets = {
	all: [0, 360, 0, 100, 0, 100],
	light: [0, 360, 15, 40, 70, 100],
	dark: [0, 360, 8, 40, 7, 40],
	pastel: [0, 360, 0, 30, 70, 100],
	shades: [0, 240, 0, 15, 0, 100],
	intense: [0, 360, 20, 100, 15, 80],
	red: [330, 20, 10, 100, 35, 100],
	blue: [220, 260, 8, 80, 0, 50],
	green: [90, 150, 10, 100, 35, 100],
	yellow: [60, 90, 10, 100, 35, 100],
	teal: [150, 200, 0, 100, 35, 100],
	purple: [290, 330, 0, 100, 0, 40],
	earth: [20, 60, 20, 50, 35, 100],
	colorblind: [0, 360, 40, 70, 15, 85]
};

export function generateColorScheme(size: number, colorSpace: ColorSpace): string[] {
	return iwanthue(size, {
		clustering: 'force-vector',
		colorSpace: colorSpace
	});
}

export function colorSchemeToSlug(colorScheme: string[]): string {
	let slug = '';

	for (let i = 0; i < colorScheme.length; i++) {
		slug += colorScheme[i].slice(1);

		if (i !== colorScheme.length - 1) {
			slug += '-';
		}
	}

	return slug;
}

export function slugToColorScheme(slug: string): string[] {
	return slug.split('-').map((color) => '#' + color);
}

export function validColorSchemeSlug(slug: string): boolean {
	return /^(?:[0-9a-fA-F]{6})(?:-[0-9a-fA-F]{6}){1,4}$/.test(slug);
}

export function copyToClipboard(s: string): void {
	navigator.clipboard.writeText(s);
}
