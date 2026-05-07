import type { EmailOtpType } from '@supabase/supabase-js';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	const tokenHash = event.url.searchParams.get('token_hash');
	const type = event.url.searchParams.get('type') as EmailOtpType | null;
	const next = event.url.searchParams.get('next') ?? '/app';

	if (tokenHash && type) {
		const { error } = await event.locals.supabase.auth.verifyOtp({
			type,
			token_hash: tokenHash
		});

		if (!error) {
			throw redirect(303, next.startsWith('/') ? next : '/app');
		}
	}

	throw redirect(303, '/auth/sign-in');
};
