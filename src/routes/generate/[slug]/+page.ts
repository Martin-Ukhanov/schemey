import { validColorPaletteSlug, slugToColorPalette } from '$lib/utils';
import { error } from '@sveltejs/kit';
import { goto } from '$app/navigation';
import type { PageLoad } from './$types';

export const load = (({ params }) => {
	const { slug } = params;

	if (!validColorPaletteSlug(slug)) {
		throw error(404, { message: 'Page Not Found' });
	}

	if (/[A-Z]/.test(slug)) {
		goto(`/generate/${slug.toLowerCase()}`);
	}

	return { colorPalette: slugToColorPalette(params.slug) };
}) satisfies PageLoad;
