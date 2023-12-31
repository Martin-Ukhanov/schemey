import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals: { supabase } }) => {
	const { data } = await supabase.from('colors').select('color');

	return json(data?.reverse().map((color) => color.color) ?? []);
};

export const POST: RequestHandler = async ({ request, locals: { supabase } }) => {
	const { color } = await request.json();
	const { error } = await supabase.from('colors').insert({ color: color });

	if (error) {
		return json({ success: false });
	}

	return json({ success: true });
};

export const DELETE: RequestHandler = async ({ request, locals: { supabase } }) => {
	const { color } = await request.json();
	const { error, count } = await supabase
		.from('colors')
		.delete({ count: 'exact' })
		.eq('color', color);

	if (error || count === 0) {
		return json({ success: false });
	}

	return json({ success: true });
};
