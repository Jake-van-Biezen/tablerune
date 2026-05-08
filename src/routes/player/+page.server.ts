import { error, fail, redirect } from '@sveltejs/kit';
import { listCampaignIdsByRole, requireCampaignRole } from '$lib/server/campaign-access';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(303, '/auth/sign-in');
	}

	if (locals.profile?.preferred_role !== 'player') {
		throw redirect(303, '/app');
	}

	const campaignIds = await listCampaignIdsByRole(locals.supabase, locals.user.id, 'player');

	if (!campaignIds.length) {
		return { campaigns: [], characters: [], inventoryItems: [], decisionLogs: [] };
	}

	const [
		{ data: campaigns, error: campaignsError },
		{ data: characters, error: charactersError },
		{ data: inventoryItems, error: inventoryError },
		{ data: decisionLogs, error: decisionsError }
	] = await Promise.all([
		locals.supabase
			.from('campaigns')
			.select('*')
			.in('id', campaignIds)
			.order('created_at', { ascending: false }),
		locals.supabase
			.from('characters')
			.select('*')
			.in('campaign_id', campaignIds)
			.eq('player_user_id', locals.user.id)
			.order('created_at', { ascending: false }),
		locals.supabase
			.from('inventory_items')
			.select('*')
			.in('campaign_id', campaignIds)
			.order('created_at', { ascending: false }),
		locals.supabase
			.from('decision_logs')
			.select('*')
			.in('campaign_id', campaignIds)
			.order('created_at', { ascending: false })
	]);

	if (campaignsError || charactersError || inventoryError || decisionsError) {
		throw error(500, 'Unable to load player dashboard.');
	}

	return {
		campaigns: campaigns ?? [],
		characters: characters ?? [],
		inventoryItems: inventoryItems ?? [],
		decisionLogs: decisionLogs ?? []
	};
};

export const actions: Actions = {
	createCharacter: async ({ request, locals }) => {
		if (!locals.user) {
			throw redirect(303, '/auth/sign-in');
		}

		const formData = await request.formData();
		const campaignId = String(formData.get('campaign_id') ?? '').trim();
		const name = String(formData.get('name') ?? '').trim();
		const race = String(formData.get('race') ?? '').trim();
		const classSpec = String(formData.get('class_spec') ?? '').trim();
		const currentHp = Number(formData.get('current_hp') ?? 0);
		const maxHp = Number(formData.get('max_hp') ?? 0);
		const backgroundStory = String(formData.get('background_story') ?? '').trim();
		const decisionSummary = String(formData.get('decision_summary') ?? '').trim();

		if (!campaignId || !name) {
			return fail(400, { message: 'Character payload is invalid.' });
		}

		await requireCampaignRole(locals.supabase, locals.user.id, campaignId, ['player']);

		const { error: characterError } = await locals.supabase.from('characters').insert({
			campaign_id: campaignId,
			player_user_id: locals.user.id,
			name,
			race,
			class_spec: classSpec,
			current_hp: currentHp,
			max_hp: maxHp,
			background_story: backgroundStory,
			decision_summary: decisionSummary
		});

		if (characterError) {
			return fail(400, { message: 'Unable to create character.' });
		}

		return { success: 'Character created.' };
	},
	updateCharacter: async ({ request, locals }) => {
		if (!locals.user) {
			throw redirect(303, '/auth/sign-in');
		}

		const formData = await request.formData();
		const characterId = String(formData.get('character_id') ?? '').trim();
		const campaignId = String(formData.get('campaign_id') ?? '').trim();
		const race = String(formData.get('race') ?? '').trim();
		const classSpec = String(formData.get('class_spec') ?? '').trim();
		const currentHp = Number(formData.get('current_hp') ?? 0);
		const maxHp = Number(formData.get('max_hp') ?? 0);
		const backgroundStory = String(formData.get('background_story') ?? '').trim();
		const decisionSummary = String(formData.get('decision_summary') ?? '').trim();

		if (!characterId || !campaignId) {
			return fail(400, { message: 'Character update payload is invalid.' });
		}

		await requireCampaignRole(locals.supabase, locals.user.id, campaignId, ['player']);

		const { error: updateError } = await locals.supabase
			.from('characters')
			.update({
				race,
				class_spec: classSpec,
				current_hp: currentHp,
				max_hp: maxHp,
				background_story: backgroundStory,
				decision_summary: decisionSummary
			})
			.eq('id', characterId)
			.eq('player_user_id', locals.user.id);

		if (updateError) {
			return fail(400, { message: 'Unable to update character.' });
		}

		return { success: 'Character updated.' };
	},
	addInventoryItem: async ({ request, locals }) => {
		if (!locals.user) {
			throw redirect(303, '/auth/sign-in');
		}

		const formData = await request.formData();
		const characterId = String(formData.get('character_id') ?? '').trim();
		const campaignId = String(formData.get('campaign_id') ?? '').trim();
		const name = String(formData.get('name') ?? '').trim();
		const quantity = Number(formData.get('quantity') ?? 1);
		const notes = String(formData.get('notes') ?? '').trim();

		if (!characterId || !campaignId || !name || Number.isNaN(quantity) || quantity < 1) {
			return fail(400, { message: 'Inventory payload is invalid.' });
		}

		await requireCampaignRole(locals.supabase, locals.user.id, campaignId, ['player']);

		const { error: inventoryError } = await locals.supabase.from('inventory_items').insert({
			campaign_id: campaignId,
			character_id: characterId,
			name,
			quantity,
			notes
		});

		if (inventoryError) {
			return fail(400, { message: 'Unable to add inventory item.' });
		}

		return { success: 'Inventory item added.' };
	},
	removeInventoryItem: async ({ request, locals }) => {
		if (!locals.user) {
			throw redirect(303, '/auth/sign-in');
		}

		const formData = await request.formData();
		const itemId = String(formData.get('item_id') ?? '').trim();

		if (!itemId) {
			return fail(400, { message: 'Inventory removal payload is invalid.' });
		}

		const { error: deleteError } = await locals.supabase
			.from('inventory_items')
			.delete()
			.eq('id', itemId);

		if (deleteError) {
			return fail(400, { message: 'Unable to remove inventory item.' });
		}

		return { success: 'Inventory item removed.' };
	},
	addDecision: async ({ request, locals }) => {
		if (!locals.user) {
			throw redirect(303, '/auth/sign-in');
		}

		const formData = await request.formData();
		const campaignId = String(formData.get('campaign_id') ?? '').trim();
		const characterId = String(formData.get('character_id') ?? '').trim();
		const decisionText = String(formData.get('decision_text') ?? '').trim();

		if (!campaignId || !decisionText) {
			return fail(400, { message: 'Decision payload is invalid.' });
		}

		await requireCampaignRole(locals.supabase, locals.user.id, campaignId, ['player']);

		const { error: decisionError } = await locals.supabase.from('decision_logs').insert({
			campaign_id: campaignId,
			character_id: characterId || null,
			created_by: locals.user.id,
			decision_text: decisionText
		});

		if (decisionError) {
			return fail(400, { message: 'Unable to save decision log entry.' });
		}

		return { success: 'Decision logged.' };
	}
};
