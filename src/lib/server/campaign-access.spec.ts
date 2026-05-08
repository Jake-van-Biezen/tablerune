import { describe, expect, it, vi } from 'vitest';
import { listCampaignIdsByRole, requireCampaignRole } from './campaign-access';

describe('campaign access helpers', () => {
	it('lists campaign ids for a user role filter', async () => {
		expect.hasAssertions();

		const secondEqMock = vi.fn().mockResolvedValue({
			data: [{ campaign_id: 'a' }, { campaign_id: 'b' }],
			error: null
		});
		const firstEqMock = vi.fn().mockReturnValue({ eq: secondEqMock });
		const selectMock = vi.fn().mockReturnValue({ eq: firstEqMock });
		const fromMock = vi.fn().mockReturnValue({ select: selectMock });
		const supabase = { from: fromMock } as never;

		const campaignIds = await listCampaignIdsByRole(supabase, 'user-1', 'player');
		expect(campaignIds).toEqual(['a', 'b']);
	});

	it('throws when user is missing required campaign role', async () => {
		expect.hasAssertions();

		const maybeSingleMock = vi.fn().mockResolvedValue({ data: null, error: null });
		const secondEqMock = vi.fn().mockReturnValue({ maybeSingle: maybeSingleMock });
		const firstEqMock = vi.fn().mockReturnValue({ eq: secondEqMock });
		const selectMock = vi.fn().mockReturnValue({ eq: firstEqMock });
		const fromMock = vi.fn().mockReturnValue({ select: selectMock });
		const supabase = { from: fromMock } as never;

		await expect(
			requireCampaignRole(supabase, 'user-1', 'campaign-1', ['dm'])
		).rejects.toMatchObject({ status: 403 });
	});
});
