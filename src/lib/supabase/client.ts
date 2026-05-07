import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import { supabasePublishableKey, supabaseUrl } from '$lib/supabase/env';
import type { Database } from '$lib/types/database';

let browserClient: SupabaseClient<Database> | undefined;

export function createBrowserSupabaseClient() {
	if (!browserClient) {
		browserClient = createBrowserClient<Database>(supabaseUrl, supabasePublishableKey);
	}

	return browserClient;
}
