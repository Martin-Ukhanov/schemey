import { error, fail, redirect, type Actions } from '@sveltejs/kit';
import { isValidPassword, stringToSlug } from '$lib/utils';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals: { getSession }, params, fetch }) => {
	const session = await getSession();

	if (!session || params.slug !== stringToSlug(session.user.user_metadata.name)) {
		throw error(404, 'Not Found');
	} else {
		const savedColorsResponse = await fetch('/api/colors', {
			method: 'GET'
		});
		const savedColorsData = await savedColorsResponse.json();

		const savedColorSchemesResponse = await fetch('/api/colorSchemes', {
			method: 'GET'
		});
		const savedColorSchemesData = await savedColorSchemesResponse.json();

		return { savedColors: savedColorsData, savedColorSchemes: savedColorSchemesData };
	}
}) satisfies PageServerLoad;

export const actions = {
	updateName: async ({ request, locals: { getSession, supabase } }) => {
		const formData = await request.formData();
		const newName = <string>formData.get('name');

		const session = await getSession();

		if (newName.trim() === session?.user.user_metadata.name) {
			return fail(500, { newNameErrorMessage: 'New Name Must be Different from Current Name' });
		} else if (newName.length < 4 || newName.length > 25) {
			return fail(500, { newNameErrorMessage: 'Name Must be 4-25 Characters Long' });
		}

		const { error } = await supabase.auth.updateUser({
			data: { name: newName.trim() }
		});

		if (error) {
			return fail(500, { updateNameErrorMessage: error.message });
		}

		await supabase.auth.refreshSession();

		throw redirect(303, `/user/${stringToSlug(newName)}`);
	},
	updatePassword: async ({ request, locals: { getSession, supabase } }) => {
		const formData = await request.formData();
		const currentPassword = <string>formData.get('currentPassword');
		const newPassword = <string>formData.get('newPassword');

		let currentPasswordErrorMessage: string | undefined;
		let newPasswordErrorMessage: string | undefined;
		let updatePasswordErrorMessage: string | undefined;

		const session = await getSession();

		if (session?.user.user_metadata.password !== currentPassword) {
			currentPasswordErrorMessage = 'Invalid Password';
		}

		if (!isValidPassword(newPassword)) {
			newPasswordErrorMessage =
				'Password Must be at Least 6 Characters and Contain Only Letters, Numbers, and !#$^*';
		}

		if (currentPassword === newPassword) {
			updatePasswordErrorMessage = 'New Password Should be Different from the Current Password';
		}

		if (currentPasswordErrorMessage || newPasswordErrorMessage || updatePasswordErrorMessage) {
			return fail(500, {
				currentPasswordErrorMessage,
				newPasswordErrorMessage,
				updatePasswordErrorMessage
			});
		}

		const { error } = await supabase.auth.updateUser({
			password: newPassword,
			data: { password: newPassword }
		});

		if (error) {
			return fail(500, { updatePasswordErrorMessage: error.message });
		}

		await supabase.auth.refreshSession();
	},
	signOut: async ({ locals: { supabase, getSession } }) => {
		const { error } = await supabase.auth.signOut();

		if (error) {
			return fail(500);
		}

		throw redirect(303, '/');
	}
	// deleteUser: async ({ locals: { supabase, getSession } }) => {
	// 	const session = await getSession();

	// 	const { error } = await supabase.from('user_deletion_requests').insert({});

	// 	if (error) {
	// 		return fail(500);
	// 	}

	// 	throw redirect(303, '/');
	// }
} satisfies Actions;
