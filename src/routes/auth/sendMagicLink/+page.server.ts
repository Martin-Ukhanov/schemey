import { error, fail, type Actions } from '@sveltejs/kit';
import { isValidEmail } from '$lib/utils';
import type { PageServerLoad } from './$types';

export const load = (() => {
	throw error(404, 'Not Found');
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = (<string>formData.get('email')).trim();

		if (!isValidEmail(email)) {
			return fail(500, { emailErrorMessage: 'Please Enter a Valid Email' });
		}

		const { error } = await supabase.auth.resetPasswordForEmail(email);

		if (error) {
			return fail(500, { resetPasswordErrorMessage: error.message });
		}
	}
} satisfies Actions;
