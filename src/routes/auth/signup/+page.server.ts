import { error, fail, redirect, type Actions } from '@sveltejs/kit';
import { isValidEmail, isValidPassword } from '$lib/utils';
import type { PageServerLoad } from './$types';

export const load = (() => {
	throw error(404, 'Not Found');
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ url, request, locals: { supabase } }) => {
		const formData = await request.formData();
		const name = (<string>formData.get('name')).trim();
		const email = <string>formData.get('email');
		const password = <string>formData.get('password');

		let nameErrorMessage: string | undefined;
		let emailErrorMessage: string | undefined;
		let passwordErrorMessage: string | undefined;

		if (name.length < 4 || name.length > 25) {
			nameErrorMessage = 'Name Must be 4-25 Characters Long';
		}

		if (!isValidEmail(email)) {
			emailErrorMessage = 'Please Enter a Valid Email';
		}

		if (!isValidPassword(password)) {
			passwordErrorMessage =
				'Password Must be at Least 6 Characters and Contain Only Letters, Numbers, and !#$^*';
		}

		if (nameErrorMessage || emailErrorMessage || passwordErrorMessage) {
			return fail(500, { nameErrorMessage, emailErrorMessage, passwordErrorMessage });
		}

		const { error } = await supabase.auth.signUp({
			email: email,
			password: password,
			options: {
				data: {
					password: password,
					name: name
				}
			}
		});

		if (error) {
			return fail(500, { signUpErrorMessage: error.message });
		}

		throw redirect(303, url.searchParams.get('redirect') ?? '/');
	}
} satisfies Actions;
