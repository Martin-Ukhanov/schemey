import Color from 'color';
import iwanthue, { type ColorSpace } from 'iwanthue';

export function clamp(num: number, min: number, max: number): number {
	return Math.min(Math.max(num, min), max);
}

export function isValidEmail(email: string): boolean {
	return /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(
		email
	);
}

export function isValidPassword(password: string): boolean {
	return /^[a-zA-Z0-9!#$^*]{6,}$/.test(password);
}

export function stringToSlug(s: string): string {
	return s
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, '')
		.replace(/[\s_-]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

export function validHex(hex: string): boolean {
	return /^#?[0-9a-fA-F]{6}$/.test(hex);
}

export function contrastingColor(hex: string): '#000000' | '#ffffff' {
	return Color(hex).isLight() ? '#000000' : '#ffffff';
}

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
	return /^([0-9a-fA-F]{6})(-[0-9a-fA-F]{6}){1,5}$/.test(slug);
}
