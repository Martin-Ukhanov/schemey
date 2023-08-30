import type { PageServerLoad } from './$types';

export const load = (async ({ locals: { getSession }, fetch }) => {
	const session = await getSession();

	if (session) {
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
