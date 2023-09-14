import { error } from '@sveltejs/kit';
import { goto } from '$app/navigation';
import type { PageLoad } from './$types';

export const load = (({ params, data }) => {
	const { slug } = params;

	if (!/^([0-9a-fA-F]{6})(-[0-9a-fA-F]{6}){1,5}$/.test(slug)) {
		throw error(404, { message: 'Page Not Found' });
	}

	if (/[A-Z]/.test(slug)) {
		goto(`/generate/${slug.toLowerCase()}`);
	}

	return { initialColorScheme: slug.split('-').map((color) => '#' + color), ...data };
}) satisfies PageLoad;
