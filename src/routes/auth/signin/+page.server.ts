import { redirect } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Actions } from '@sveltejs/kit';

export const load = (() => {
	throw redirect(303, '/');
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ url, request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

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
