import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals: { supabase } }) => {
	const { data } = await supabase.from('color_schemes').select('color_scheme');

	return json(data?.map((colorScheme) => colorScheme.color_scheme) ?? []);
};

export const POST: RequestHandler = async ({ request, locals: { supabase } }) => {
	const { colorScheme } = await request.json();

	const { error } = await supabase.from('color_schemes').insert({ color_scheme: colorScheme });

	if (error) {
		return json({ success: false });
	}

	return json({ success: true });
};
