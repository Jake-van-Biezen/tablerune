create table if not exists public.campaign_invitations (
	id uuid primary key default gen_random_uuid(),
	campaign_id uuid not null references public.campaigns (id) on delete cascade,
	invited_by uuid not null references public.profiles (user_id) on delete cascade,
	invited_email text not null,
	role public.campaign_role not null default 'player',
	token text not null unique default encode(gen_random_bytes(24), 'hex'),
	expires_at timestamptz not null default (timezone('utc', now()) + interval '7 days'),
	accepted_by uuid references public.profiles (user_id) on delete set null,
	accepted_at timestamptz,
	created_at timestamptz not null default timezone('utc', now())
);

create index if not exists campaign_invitations_campaign_idx
	on public.campaign_invitations (campaign_id);
create index if not exists campaign_invitations_email_idx
	on public.campaign_invitations (lower(invited_email));

grant select, insert, update, delete
	on table public.campaign_invitations
	to authenticated, service_role;

alter table public.campaign_invitations enable row level security;

create policy "campaign_invitations_select_dm_or_invitee"
on public.campaign_invitations
for select
to authenticated
using (
	auth.uid() is not null
	and (
		exists (
			select 1
			from public.campaign_members cm
			where cm.campaign_id = campaign_invitations.campaign_id
				and cm.user_id = auth.uid()
				and cm.role = 'dm'
		)
		or (
			accepted_at is null
			and expires_at > timezone('utc', now())
			and lower(invited_email) = lower(auth.jwt()->>'email')
		)
	)
);

create policy "campaign_invitations_insert_dm"
on public.campaign_invitations
for insert
to authenticated
with check (
	auth.uid() is not null
	and invited_by = auth.uid()
	and exists (
		select 1
		from public.campaign_members cm
		where cm.campaign_id = campaign_invitations.campaign_id
			and cm.user_id = auth.uid()
			and cm.role = 'dm'
	)
);

create policy "campaign_invitations_update_dm_or_invitee"
on public.campaign_invitations
for update
to authenticated
using (
	auth.uid() is not null
	and (
		exists (
			select 1
			from public.campaign_members cm
			where cm.campaign_id = campaign_invitations.campaign_id
				and cm.user_id = auth.uid()
				and cm.role = 'dm'
		)
		or (
			accepted_at is null
			and expires_at > timezone('utc', now())
			and lower(invited_email) = lower(auth.jwt()->>'email')
		)
	)
)
with check (
	auth.uid() is not null
	and (
		exists (
			select 1
			from public.campaign_members cm
			where cm.campaign_id = campaign_invitations.campaign_id
				and cm.user_id = auth.uid()
				and cm.role = 'dm'
		)
		or (
			accepted_by = auth.uid()
			and accepted_at is not null
			and lower(invited_email) = lower(auth.jwt()->>'email')
		)
	)
);

create policy "campaign_invitations_delete_dm"
on public.campaign_invitations
for delete
to authenticated
using (
	auth.uid() is not null
	and exists (
		select 1
		from public.campaign_members cm
		where cm.campaign_id = campaign_invitations.campaign_id
			and cm.user_id = auth.uid()
			and cm.role = 'dm'
	)
);

drop policy if exists "campaign_members_insert_dm" on public.campaign_members;

create policy "campaign_members_insert_dm_or_invited_player"
on public.campaign_members
for insert
to authenticated
with check (
	auth.uid() is not null
	and (
		(role = 'dm' and user_id = auth.uid())
		or exists (
			select 1
			from public.campaign_members cm
			where cm.campaign_id = campaign_members.campaign_id
				and cm.user_id = auth.uid()
				and cm.role = 'dm'
		)
		or (
			role = 'player'
			and user_id = auth.uid()
			and exists (
				select 1
				from public.campaign_invitations ci
				where ci.campaign_id = campaign_members.campaign_id
					and ci.role = campaign_members.role
					and ci.accepted_at is null
					and ci.expires_at > timezone('utc', now())
					and lower(ci.invited_email) = lower(auth.jwt()->>'email')
			)
		)
	)
);
