import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (() => {
	throw redirect(308, '/generate/ffffff-000000-ff00ff');
}) satisfies PageServerLoad;
