import { validColorPaletteSlug, slugToColorPalette } from '$lib/utils';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (({ params }) => {
	if (!validColorPaletteSlug(params.slug)) {
		throw error(404, { message: 'Page Not Found' });
	}

	return { colorPalette: slugToColorPalette(params.slug) };
}) satisfies PageLoad;
