import { redirect } from '@sveltejs/kit';
import { generateColorScheme, colorSchemeToSlug } from '$lib/utils';
import type { PageLoad } from './$types';

export const load = (() => {
	throw redirect(
		308,
		`/generate/${colorSchemeToSlug(generateColorScheme(4, [0, 360, 0, 100, 0, 100]))}`
	);
}) satisfies PageLoad;
