import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Actions } from '@sveltejs/kit';

export const load = (() => {
	throw redirect(303, '/');
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ url, locals: { supabase, getSession } }) => {
		const session = await getSession();

		if (session) {
			const { error } = await supabase.auth.signOut();

			if (!error) {
				throw redirect(303, url.searchParams.get('redirect') ?? '/');
			}
		}

		return fail(500);
	}
};
