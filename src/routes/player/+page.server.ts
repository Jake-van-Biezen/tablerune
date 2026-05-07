import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(303, '/auth/sign-in');
	}

	if (locals.profile?.preferred_role !== 'player') {
		throw redirect(303, '/app');
	}

	return {};
};
