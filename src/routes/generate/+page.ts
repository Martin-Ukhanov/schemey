import { redirect } from '@sveltejs/kit';
import { generateColorScheme, colorSchemeToSlug } from '$lib/utils';
import type { PageLoad } from './$types';

export const load = (() => {
	throw redirect(308, `/generate/${colorSchemeToSlug(generateColorScheme(3))}`);
}) satisfies PageLoad;
