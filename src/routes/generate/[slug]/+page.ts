import { validColorSchemeSlug, slugToColorScheme } from '$lib/utils';
import { error } from '@sveltejs/kit';
import { goto } from '$app/navigation';
import type { PageLoad } from './$types';

export const load = (({ params, data }) => {
	const { slug } = params;

	if (!validColorSchemeSlug(slug)) {
		throw error(404, { message: 'Page Not Found' });
	}

	if (/[A-Z]/.test(slug)) {
		goto(`/generate/${slug.toLowerCase()}`);
	}

	return { currentColorScheme: slugToColorScheme(slug), ...data };
}) satisfies PageLoad;
