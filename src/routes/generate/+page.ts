import { redirect } from '@sveltejs/kit';
import { generateColorScheme, colorSchemeToSlug, COLOR_SPACE_PRESETS } from '$lib/utils';
import type { PageLoad } from './$types';

export const load = (() => {
	throw redirect(
		308,
		`/generate/${colorSchemeToSlug(generateColorScheme(3, COLOR_SPACE_PRESETS['all']))}`
	);
}) satisfies PageLoad;
