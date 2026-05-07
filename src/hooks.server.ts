import { redirect, type Handle } from '@sveltejs/kit';
import { createServerSupabaseClient } from '$lib/supabase/server';

const authRoutes = ['/auth/sign-in', '/auth/confirm'];
const protectedPrefixes = ['/app', '/dm', '/player'];

export const handle: Handle = async ({ event, resolve }) => {
	const supabase = createServerSupabaseClient(event);
	event.locals.supabase = supabase;

	const {
		data: { user }
	} = await supabase.auth.getUser();

	event.locals.user = user;
	event.locals.session = null;
	event.locals.profile = null;

	if (user) {
		const { data: sessionData } = await supabase.auth.getSession();
		event.locals.session = sessionData.session;

		const { data: existingProfile } = await supabase
			.from('profiles')
			.select('*')
			.eq('user_id', user.id)
			.maybeSingle();

		if (existingProfile) {
			event.locals.profile = existingProfile;
		} else {
			const { data: createdProfile } = await supabase
				.from('profiles')
				.insert({
					user_id: user.id,
					display_name: user.user_metadata?.display_name ?? user.email ?? '',
					preferred_role: 'player'
				})
				.select('*')
				.single();

			event.locals.profile = createdProfile ?? null;
		}
	}

	const path = event.url.pathname;
	const isProtectedPath = protectedPrefixes.some((prefix) => path.startsWith(prefix));
	const isAuthRoute = authRoutes.some((route) => path.startsWith(route));

	if (isProtectedPath && !event.locals.user) {
		const redirectUrl = new URL('/auth/sign-in', event.url);
		redirectUrl.searchParams.set('next', path);
		throw redirect(303, redirectUrl.toString());
	}

	if (event.locals.user && isAuthRoute) {
		throw redirect(303, '/app');
	}

	if (path.startsWith('/dm') && event.locals.profile?.preferred_role !== 'dm') {
		throw redirect(303, '/app');
	}

	if (path.startsWith('/player') && event.locals.profile?.preferred_role !== 'player') {
		throw redirect(303, '/app');
	}

	return resolve(event);
};
