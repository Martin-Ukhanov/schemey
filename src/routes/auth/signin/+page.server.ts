import { redirect } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Actions } from '@sveltejs/kit';

export const load = (async ({ url, locals: { getSession } }) => {
	const session = await getSession();

	if (session) {
		throw redirect(303, url.searchParams.get('redirect') ?? '/');
	}
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		const { error } = await supabase.auth.signInWithPassword({
			email: email,
			password: password
		});

		if (error) {
			return fail(500, { fail: true, message: error.message, email: email });
		}
	}
};
