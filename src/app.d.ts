import type { Session, SupabaseClient, User } from '@supabase/supabase-js';
import type { Database } from '$lib/types/database';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Platform {
			env: Env;
			cf: CfProperties;
			ctx: ExecutionContext;
		}

		interface Locals {
			supabase: SupabaseClient<Database>;
			session: Session | null;
			user: User | null;
			profile: Database['public']['Tables']['profiles']['Row'] | null;
		}

		interface PageData {
			session: Session | null;
			user: User | null;
			profile: Database['public']['Tables']['profiles']['Row'] | null;
		}
	}
}

export {};
