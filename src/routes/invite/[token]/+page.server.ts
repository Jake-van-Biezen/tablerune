import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params, url }) => {
	if (!locals.user) {
		const redirectUrl = new URL('/auth/sign-in', url);
		redirectUrl.searchParams.set('next', `/invite/${params.token}`);
		throw redirect(303, redirectUrl.toString());
	}

	const { data: invitation } = await locals.supabase
		.from('campaign_invitations')
		.select('*')
		.eq('token', params.token)
		.maybeSingle();

	return {
		token: params.token,
		invitation
	};
};

export const actions: Actions = {
	accept: async ({ locals, params }) => {
		if (!locals.user) {
			throw redirect(303, '/auth/sign-in');
		}

		const { data: invitation, error: inviteError } = await locals.supabase
			.from('campaign_invitations')
			.select('*')
			.eq('token', params.token)
			.maybeSingle();

		if (inviteError || !invitation) {
			return fail(400, { message: 'Invitation not found.' });
		}

		if (invitation.accepted_at) {
			return fail(400, { message: 'This invitation has already been accepted.' });
		}

		if (new Date(invitation.expires_at).getTime() < Date.now()) {
			return fail(400, { message: 'This invitation has expired.' });
		}

		const { error: memberError } = await locals.supabase.from('campaign_members').upsert(
			{
				campaign_id: invitation.campaign_id,
				user_id: locals.user.id,
				role: invitation.role,
				invited_by: invitation.invited_by
			},
			{ onConflict: 'campaign_id,user_id' }
		);

		if (memberError) {
			return fail(400, { message: 'Unable to join campaign from invitation.' });
		}

		const { error: updateError } = await locals.supabase
			.from('campaign_invitations')
			.update({
				accepted_at: new Date().toISOString(),
				accepted_by: locals.user.id
			})
			.eq('id', invitation.id);

		if (updateError) {
			return fail(400, {
				message: 'Joined campaign, but invitation could not be marked accepted.'
			});
		}

		throw redirect(303, '/app');
	}
};
