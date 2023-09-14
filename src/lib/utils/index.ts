import Color from 'color';
import iwanthue, { type ColorSpace } from 'iwanthue';

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

export function contrastingColor(hex: string): '#000000' | '#ffffff' {
	return Color(hex).isLight() ? '#000000' : '#ffffff';
}

export function generateColorScheme(size: number, colorSpace: ColorSpace): string[] {
	return iwanthue(size, {
		clustering: 'force-vector',
		colorSpace: colorSpace
	});
}
