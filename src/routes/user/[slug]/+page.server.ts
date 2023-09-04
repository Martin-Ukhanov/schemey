import { error } from '@sveltejs/kit';
import { stringToSlug } from '$lib/utils';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals: { getSession }, params, fetch }) => {
	const session = await getSession();

	if (!session || params.slug !== stringToSlug(session.user.user_metadata.name)) {
		throw error(404, 'Not Found');
	} else {
		const savedColorsResponse = await fetch('/api/colors', {
			method: 'GET'
		});
		const savedColorsData = await savedColorsResponse.json();

		const savedColorSchemesResponse = await fetch('/api/colorSchemes', {
			method: 'GET'
		});
		const savedColorSchemesData = await savedColorSchemesResponse.json();

		return { savedColors: savedColorsData, savedColorSchemes: savedColorSchemesData };
	}
}) satisfies PageServerLoad;
