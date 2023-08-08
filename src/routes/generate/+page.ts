import { redirect } from '@sveltejs/kit';
import { generateColorPalette, colorPaletteToSlug } from '$lib/utils';
import type { PageLoad } from './$types';

export const load = (() => {
	throw redirect(308, `/generate/${colorPaletteToSlug(generateColorPalette(3))}`);
}) satisfies PageLoad;
