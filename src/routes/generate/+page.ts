import { redirect } from '@sveltejs/kit';
import { get } from 'svelte/store';
import { generateColorScheme, stringToSlug } from '$lib/utils';
import { colorSpacePresets } from '$lib/stores/colorSpacePresets';
import type { PageLoad } from './$types';

export const load = (() => {
	throw redirect(
		303,
		`/generate/${stringToSlug(generateColorScheme(3, get(colorSpacePresets)['all']).join(' '))}`
	);
}) satisfies PageLoad;
