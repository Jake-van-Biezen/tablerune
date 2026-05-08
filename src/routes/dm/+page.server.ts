import { error, fail, redirect } from '@sveltejs/kit';
import { listCampaignIdsByRole, requireCampaignRole } from '$lib/server/campaign-access';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(303, '/auth/sign-in');
	}

	if (locals.profile?.preferred_role !== 'dm') {
		throw redirect(303, '/app');
	}

	const campaignIds = await listCampaignIdsByRole(locals.supabase, locals.user.id, 'dm');

	if (!campaignIds.length) {
		return { campaigns: [], invitations: [], characters: [], inventoryItems: [], maps: [] };
	}

	const [
		{ data: campaigns, error: campaignsError },
		{ data: invitations, error: invitesError },
		{ data: characters, error: charactersError },
		{ data: inventoryItems, error: inventoryError },
		{ data: maps, error: mapsError }
	] = await Promise.all([
		locals.supabase
			.from('campaigns')
			.select('*')
			.in('id', campaignIds)
			.order('created_at', { ascending: false }),
		locals.supabase
			.from('campaign_invitations')
			.select('*')
			.in('campaign_id', campaignIds)
			.order('created_at', { ascending: false }),
		locals.supabase
			.from('characters')
			.select('*')
			.in('campaign_id', campaignIds)
			.order('created_at', { ascending: false }),
		locals.supabase
			.from('inventory_items')
			.select('*')
			.in('campaign_id', campaignIds)
			.order('created_at', { ascending: false }),
		locals.supabase
			.from('maps')
			.select('*')
			.in('campaign_id', campaignIds)
			.order('created_at', { ascending: false })
	]);

	if (campaignsError || invitesError || charactersError || inventoryError || mapsError) {
		throw error(500, 'Unable to load DM dashboard.');
	}

	return {
		campaigns: campaigns ?? [],
		invitations: invitations ?? [],
		characters: characters ?? [],
		inventoryItems: inventoryItems ?? [],
		maps: maps ?? []
	};
};

export const actions: Actions = {
	createCampaign: async ({ request, locals }) => {
		if (!locals.user) {
			throw redirect(303, '/auth/sign-in');
		}

		const formData = await request.formData();
		const name = String(formData.get('name') ?? '').trim();
		const description = String(formData.get('description') ?? '').trim();

		if (!name) {
			return fail(400, { message: 'Campaign name is required.' });
		}

		const { data: createdCampaign, error: campaignError } = await locals.supabase
			.from('campaigns')
			.insert({
				name,
				description,
				created_by: locals.user.id
			})
			.select('id')
			.single();

		if (campaignError || !createdCampaign) {
			return fail(400, { message: 'Unable to create campaign.' });
		}

		const { error: memberError } = await locals.supabase.from('campaign_members').insert({
			campaign_id: createdCampaign.id,
			user_id: locals.user.id,
			role: 'dm',
			invited_by: locals.user.id
		});

		if (memberError) {
			return fail(400, { message: 'Unable to attach DM membership to campaign.' });
		}

		return { success: 'Campaign created.' };
	},
	updateCampaign: async ({ request, locals }) => {
		if (!locals.user) {
			throw redirect(303, '/auth/sign-in');
		}

		const formData = await request.formData();
		const campaignId = String(formData.get('campaign_id') ?? '').trim();
		const name = String(formData.get('name') ?? '').trim();
		const description = String(formData.get('description') ?? '').trim();

		if (!campaignId || !name) {
			return fail(400, { message: 'Campaign update payload is invalid.' });
		}

		await requireCampaignRole(locals.supabase, locals.user.id, campaignId, ['dm']);

		const { error: updateError } = await locals.supabase
			.from('campaigns')
			.update({ name, description })
			.eq('id', campaignId);

		if (updateError) {
			return fail(400, { message: 'Unable to update campaign details.' });
		}

		return { success: 'Campaign updated.' };
	},
	issueInvite: async ({ request, locals }) => {
		if (!locals.user) {
			throw redirect(303, '/auth/sign-in');
		}

		const formData = await request.formData();
		const campaignId = String(formData.get('campaign_id') ?? '').trim();
		const invitedEmail = String(formData.get('invited_email') ?? '')
			.trim()
			.toLowerCase();

		if (!campaignId || !invitedEmail) {
			return fail(400, { message: 'Invite payload is invalid.' });
		}

		await requireCampaignRole(locals.supabase, locals.user.id, campaignId, ['dm']);

		const { error: inviteError } = await locals.supabase.from('campaign_invitations').insert({
			campaign_id: campaignId,
			invited_by: locals.user.id,
			invited_email: invitedEmail,
			role: 'player'
		});

		if (inviteError) {
			return fail(400, { message: 'Unable to create invitation.' });
		}

		return { success: `Invite created for ${invitedEmail}.` };
	},
	updatePartyState: async ({ request, locals }) => {
		if (!locals.user) {
			throw redirect(303, '/auth/sign-in');
		}

		const formData = await request.formData();
		const characterId = String(formData.get('character_id') ?? '').trim();
		const campaignId = String(formData.get('campaign_id') ?? '').trim();
		const currentHp = Number(formData.get('current_hp') ?? NaN);
		const maxHp = Number(formData.get('max_hp') ?? NaN);

		if (!characterId || !campaignId || Number.isNaN(currentHp) || Number.isNaN(maxHp)) {
			return fail(400, { message: 'Party update payload is invalid.' });
		}

		await requireCampaignRole(locals.supabase, locals.user.id, campaignId, ['dm']);

		const { error: updateError } = await locals.supabase
			.from('characters')
			.update({ current_hp: currentHp, max_hp: maxHp })
			.eq('id', characterId)
			.eq('campaign_id', campaignId);

		if (updateError) {
			return fail(400, { message: 'Unable to update party state.' });
		}

		return { success: 'Party state updated.' };
	},
	uploadMap: async ({ request, locals }) => {
		if (!locals.user) {
			throw redirect(303, '/auth/sign-in');
		}

		const formData = await request.formData();
		const campaignId = String(formData.get('campaign_id') ?? '').trim();
		const title = String(formData.get('title') ?? '').trim();
		const file = formData.get('map_file');

		if (!campaignId || !title || !(file instanceof File) || !file.size) {
			return fail(400, { message: 'Map upload payload is invalid.' });
		}

		await requireCampaignRole(locals.supabase, locals.user.id, campaignId, ['dm']);

		const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
		const storagePath = `${campaignId}/${Date.now()}-${safeName}`;
		const { error: uploadError } = await locals.supabase.storage
			.from('campaign-maps')
			.upload(storagePath, file, {
				upsert: true,
				contentType: file.type || 'application/octet-stream'
			});

		if (uploadError) {
			return fail(400, { message: 'Unable to upload map file.' });
		}

		const { error: mapError } = await locals.supabase.from('maps').insert({
			campaign_id: campaignId,
			title,
			storage_path: storagePath,
			uploaded_by: locals.user.id
		});

		if (mapError) {
			return fail(400, { message: 'Map uploaded but metadata save failed.' });
		}

		return { success: 'Map uploaded.' };
	}
};
