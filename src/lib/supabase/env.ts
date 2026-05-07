import { PUBLIC_SUPABASE_PUBLISHABLE_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';

const url = PUBLIC_SUPABASE_URL;
const publishableKey = PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url) {
	throw new Error('Missing PUBLIC_SUPABASE_URL.');
}

if (!publishableKey) {
	throw new Error('Missing PUBLIC_SUPABASE_PUBLISHABLE_KEY.');
}

export const supabaseUrl = url;
export const supabasePublishableKey = publishableKey;
