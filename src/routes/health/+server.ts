import { json } from '@sveltejs/kit';
import { supabasePublishableKey, supabaseUrl } from '$lib/supabase/env';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
	const checks = {
		supabaseUrlConfigured: Boolean(supabaseUrl),
		supabasePublishableKeyConfigured: Boolean(supabasePublishableKey)
	};

	const healthy = Object.values(checks).every(Boolean);

	return json(
		{
			status: healthy ? 'ok' : 'degraded',
			requestId: locals.requestId,
			checks
		},
		{ status: healthy ? 200 : 503 }
	);
};
