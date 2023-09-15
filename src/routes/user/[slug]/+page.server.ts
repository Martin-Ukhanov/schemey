import { error, fail, redirect, type Actions } from '@sveltejs/kit';
import { stringToSlug, isValidEmail, isValidPassword } from '$lib/utils';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals: { getSession, supabase }, params, fetch }) => {
	const session = await getSession();

	if (!session || params.slug !== stringToSlug(session.user.user_metadata.name)) {
		throw error(404, 'Not Found');
	} else {
		const savedColorsResponse = await fetch('/api/colors', {
			method: 'GET'
		});
		const savedColors = await savedColorsResponse.json();

		const savedColorSchemesResponse = await fetch('/api/colorSchemes', {
			method: 'GET'
		});
		const savedColorSchemes = await savedColorSchemesResponse.json();

		const { error, count } = await supabase
			.from('user_deletion_requests')
			.select('*', { count: 'exact' });
		const isUserDeletionRequested = !(error || count === 0);

		return { savedColors, savedColorSchemes, isUserDeletionRequested };
	}
}) satisfies PageServerLoad;

export const actions = {
	updateName: async ({ request, locals: { getSession, supabase } }) => {
		const formData = await request.formData();
		const newName = (<string>formData.get('name')).trim();

		const session = await getSession();

		if (newName === session?.user.user_metadata.name) {
			return fail(500, { newNameErrorMessage: 'New Name Must be Different from Current Name' });
		} else if (newName.length < 4 || newName.length > 25) {
			return fail(500, { newNameErrorMessage: 'Name Must be 4-25 Characters Long' });
		}

		const { error } = await supabase.auth.updateUser({
			data: { name: newName }
		});

		if (error) {
			return fail(500, { updateNameErrorMessage: error.message });
		}

		await supabase.auth.refreshSession();

		throw redirect(303, `/user/${stringToSlug(newName)}`);
	},
	updateEmail: async ({ request, locals: { getSession, supabase }, url }) => {
		const formData = await request.formData();
		const newEmail = (<string>formData.get('email')).trim();

		const session = await getSession();

		if (newEmail === session?.user.email) {
			return fail(500, {
				newEmailErrorMessage: 'New Email Must be Different from Current Email'
			});
		} else if (!isValidEmail(newEmail)) {
			return fail(500, { newEmailErrorMessage: 'Please Enter a Valid Email' });
		}

		const { error } = await supabase.auth.updateUser(
			{ email: newEmail },
			{ emailRedirectTo: `${url.origin}?updatedEmail=true` }
		);

		if (error) {
			return fail(500, { updateEmailErrorMessage: error.message });
		}

		await supabase.auth.refreshSession();
	},
	updatePassword: async ({ request, locals: { getSession, supabase } }) => {
		const formData = await request.formData();
		const newPassword = <string>formData.get('newPassword');
		const confirmPassword = <string>formData.get('confirmPassword');

		if (newPassword !== confirmPassword) {
			return fail(500, { errorMessage: 'Passwords Do Not Match' });
		}

		const session = await getSession();

		if (newPassword === session?.user.user_metadata.password) {
			return fail(500, { errorMessage: 'New Password Must be Different from Current Password' });
		}

		if (!isValidPassword(newPassword)) {
			return fail(500, {
				errorMessage:
					'Password Must be at Least 6 Characters and Contain Only Letters, Numbers, and !#$^*'
			});
		}

		const { error } = await supabase.auth.updateUser({
			password: newPassword,
			data: { password: newPassword }
		});

		if (error) {
			return fail(500, { errorMessage: error.message });
		}

		await supabase.auth.refreshSession();
	},
	signOut: async ({ locals: { supabase } }) => {
		const { error } = await supabase.auth.signOut();

		if (error) {
			return fail(500);
		}

		throw redirect(303, '/');
	},
	requestUserDeletion: async ({ locals: { supabase } }) => {
		const { error } = await supabase.from('user_deletion_requests').insert({});

		if (error) {
			return fail(500);
		}
	},
	cancelUserDeletionRequest: async ({ locals: { getSession, supabase } }) => {
		const session = await getSession();
		const { error } = await supabase
			.from('user_deletion_requests')
			.delete()
			.eq('user_id', session?.user.id);

		if (error) {
			return fail(500);
		}
	}
} satisfies Actions;
