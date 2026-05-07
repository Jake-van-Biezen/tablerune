import { createServerClient } from '@supabase/ssr';
import type { RequestEvent } from '@sveltejs/kit';
import { supabasePublishableKey, supabaseUrl } from '$lib/supabase/env';
import type { Database } from '$lib/types/database';

export function createServerSupabaseClient(event: RequestEvent) {
	return createServerClient<Database>(supabaseUrl, supabasePublishableKey, {
		cookies: {
			getAll: () => event.cookies.getAll(),
			setAll: (cookiesToSet) => {
				for (const { name, value, options } of cookiesToSet) {
					event.cookies.set(name, value, { ...options, path: '/' });
				}
			}
		}
	});
}
