import { error, fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (() => {
	throw error(404, 'Not Found');
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ url, request, locals: { supabase } }) => {
		const formData = await request.formData();
		const name = <string>formData.get('name');
		const email = <string>formData.get('email');
		const password = <string>formData.get('password');

		const { error } = await supabase.auth.signUp({
			email: email,
			password: password,
			options: {
				data: {
					name: name
				}
			}
		});

		if (error) {
			return fail(500, { message: error.message });
		}

		throw redirect(303, url.searchParams.get('redirect') ?? '/');
	}
} satisfies Actions;
