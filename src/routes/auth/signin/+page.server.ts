import { error, fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (() => {
	throw error(404, 'Not Found');
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ url, request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = (<string>formData.get('email')).trim();
		const password = <string>formData.get('password');

		const { error } = await supabase.auth.signInWithPassword({
			email: email,
			password: password
		});

		if (error) {
			return fail(500, { message: error.message });
		}

		throw redirect(303, url.searchParams.get('redirect') ?? '/');
	}
} satisfies Actions;
