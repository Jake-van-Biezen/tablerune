import { error } from '@sveltejs/kit';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { CampaignRole, Database } from '$lib/types/database';

export async function listCampaignIdsByRole(
	supabase: SupabaseClient<Database>,
	userId: string,
	role?: CampaignRole
) {
	let query = supabase.from('campaign_members').select('campaign_id').eq('user_id', userId);
	if (role) {
		query = query.eq('role', role);
	}

	const { data, error: memberError } = await query;

	if (memberError) {
		throw error(500, 'Unable to load campaign memberships.');
	}

	return (data ?? []).map((row) => row.campaign_id);
}

export async function requireCampaignRole(
	supabase: SupabaseClient<Database>,
	userId: string,
	campaignId: string,
	allowedRoles: CampaignRole[]
) {
	const { data, error: memberError } = await supabase
		.from('campaign_members')
		.select('role')
		.eq('campaign_id', campaignId)
		.eq('user_id', userId)
		.maybeSingle();

	if (memberError) {
		throw error(500, 'Unable to verify campaign membership.');
	}

	if (!data || !allowedRoles.includes(data.role)) {
		throw error(403, 'You do not have access to this campaign.');
	}
}
