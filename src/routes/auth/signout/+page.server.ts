import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Actions } from '@sveltejs/kit';

export const load = (async ({ locals: { getSession } }) => {
	const session = await getSession();

	if (session) {
		throw redirect(303, '/');
	}
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ locals: { supabase, getSession } }) => {
		const session = await getSession();

		if (session) {
			await supabase.auth.signOut();
		}
	}
};
