import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { EmailOtpType } from '@supabase/supabase-js';

export const GET: RequestHandler = async (event) => {
	const {
		url,
		locals: { supabase }
	} = event;
	const token_hash = <string>url.searchParams.get('token_hash');
	const type = <EmailOtpType>url.searchParams.get('type');

	if (token_hash && type) {
		const { error } = await supabase.auth.verifyOtp({ token_hash, type });

		if (!error) {
			throw redirect(303, `/?type=${type}&success=true`);
		} else {
			throw redirect(303, `/?type=${type}&success=false`);
		}
	}

	throw redirect(303, '/?auth_code_error');
};
