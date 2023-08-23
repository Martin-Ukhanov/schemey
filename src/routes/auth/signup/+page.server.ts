import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import type { Actions } from '@sveltejs/kit';

export const load = (async ({ url, locals: { getSession } }) => {
	const session = await getSession();

	if (session) {
		throw redirect(303, '/');
	}

	return { url: url.origin };
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		const { error } = await supabase.auth.signUp({
			email,
			password
		});

		if (error) {
			return fail(500, { message: error.message, success: false, email });
		}
	}
};
