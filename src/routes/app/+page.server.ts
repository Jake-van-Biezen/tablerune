import { fail } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(303, '/auth/sign-in');
	}

	return {
		profile: locals.profile
	};
};

export const actions: Actions = {
	setRole: async ({ request, locals }) => {
		if (!locals.user) {
			throw redirect(303, '/auth/sign-in');
		}

		const formData = await request.formData();
		const preferredRole = String(formData.get('preferred_role') ?? '');
		const nextRole = preferredRole === 'dm' ? 'dm' : preferredRole === 'player' ? 'player' : null;

		if (!nextRole) {
			return fail(400, { message: 'Invalid role selected.' });
		}

		const { error } = await locals.supabase
			.from('profiles')
			.update({ preferred_role: nextRole })
			.eq('user_id', locals.user.id);

		if (error) {
			return fail(400, { message: 'Unable to update role preference.' });
		}

		throw redirect(303, nextRole === 'dm' ? '/dm' : '/player');
	}
};
