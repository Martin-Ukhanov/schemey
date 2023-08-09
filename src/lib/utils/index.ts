import iwanthue, { type RGBColor } from 'iwanthue';

function hexToRgb(hex: string): RGBColor {
	const r = parseInt(hex.slice(1, 3), 16);
	const g = parseInt(hex.slice(3, 5), 16);
	const b = parseInt(hex.slice(5, 7), 16);

	return [r, g, b];
}

function rgbLuminance(rgb: RGBColor): number {
	return (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
}

export function contrastingColor(hex: string): '#000000' | '#ffffff' {
	return rgbLuminance(hexToRgb(hex)) <= 0.5 ? '#ffffff' : '#000000';
}

export function generateColorPalette(size: number): string[] {
	return iwanthue(size, {
		clustering: 'force-vector',
		colorSpace: [0, 360, 0, 100, 0, 100]
	});
}

export function colorPaletteToSlug(colorPalette: string[]): string {
	let slug = '';

	for (let i = 0; i < colorPalette.length; i++) {
		slug += colorPalette[i].slice(1);

		if (i !== colorPalette.length - 1) {
			slug += '-';
		}
	}

	return slug;
}

export function slugToColorPalette(slug: string): string[] {
	return slug.split('-').map((color) => '#' + color);
}

export function validColorPaletteSlug(slug: string) {
	return /^(?:[0-9a-fA-F]{6})(?:-[0-9a-fA-F]{6}){1,4}$/.test(slug);
}
