import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

const signInErrorMessage = 'Unable to sign in with those credentials.';
const signUpErrorMessage = 'Unable to sign up with that email/password.';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (locals.user) {
		throw redirect(303, '/app');
	}

	return {
		next: url.searchParams.get('next') ?? '/app'
	};
};

export const actions: Actions = {
	signIn: async ({ request, locals, url }) => {
		const formData = await request.formData();
		const email = String(formData.get('email') ?? '').trim();
		const password = String(formData.get('password') ?? '');
		const next = String(formData.get('next') ?? '/app');

		if (!email || !password) {
			return fail(400, { message: signInErrorMessage });
		}

		const { error } = await locals.supabase.auth.signInWithPassword({ email, password });

		if (error) {
			return fail(400, { message: signInErrorMessage });
		}

		const safeTarget = next.startsWith('/') ? next : '/app';
		throw redirect(303, safeTarget);
	},
	signUp: async ({ request, locals, url }) => {
		const formData = await request.formData();
		const email = String(formData.get('email') ?? '').trim();
		const password = String(formData.get('password') ?? '');
		const displayName = String(formData.get('display_name') ?? '').trim();
		const next = String(formData.get('next') ?? '/app');

		if (!email || !password) {
			return fail(400, { message: signUpErrorMessage });
		}

		const { error } = await locals.supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					display_name: displayName
				},
				emailRedirectTo: `${url.origin}/auth/confirm?next=${encodeURIComponent(next)}`
			}
		});

		if (error) {
			return fail(400, { message: signUpErrorMessage });
		}

		return {
			message:
				'Sign-up successful. If email confirmations are enabled, confirm your email to continue.'
		};
	},
	signOut: async ({ locals }) => {
		const { error } = await locals.supabase.auth.signOut();

		if (error) {
			return fail(400, { message: 'Unable to sign out right now.' });
		}

		throw redirect(303, '/');
	}
};
