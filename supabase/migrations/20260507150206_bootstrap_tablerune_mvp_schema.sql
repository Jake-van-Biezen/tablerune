create extension if not exists pgcrypto with schema extensions;

do $$
begin
	if not exists (select 1 from pg_type where typname = 'campaign_role') then
		create type public.campaign_role as enum ('dm', 'player');
	end if;
end
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
	new.updated_at = timezone('utc', now());
	return new;
end;
$$;

create table if not exists public.profiles (
	user_id uuid primary key references auth.users (id) on delete cascade,
	display_name text not null default '',
	preferred_role public.campaign_role not null default 'player',
	created_at timestamptz not null default timezone('utc', now()),
	updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.campaigns (
	id uuid primary key default gen_random_uuid(),
	name text not null,
	description text not null default '',
	created_by uuid not null references public.profiles (user_id) on delete restrict,
	created_at timestamptz not null default timezone('utc', now()),
	updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.campaign_members (
	campaign_id uuid not null references public.campaigns (id) on delete cascade,
	user_id uuid not null references public.profiles (user_id) on delete cascade,
	role public.campaign_role not null,
	invited_by uuid references public.profiles (user_id) on delete set null,
	joined_at timestamptz not null default timezone('utc', now()),
	primary key (campaign_id, user_id)
);

create table if not exists public.characters (
	id uuid primary key default gen_random_uuid(),
	campaign_id uuid not null references public.campaigns (id) on delete cascade,
	player_user_id uuid not null references public.profiles (user_id) on delete cascade,
	name text not null,
	race text not null default '',
	class_spec text not null default '',
	current_hp integer not null default 0,
	max_hp integer not null default 0,
	background_story text not null default '',
	decision_summary text not null default '',
	metadata jsonb not null default '{}'::jsonb,
	created_at timestamptz not null default timezone('utc', now()),
	updated_at timestamptz not null default timezone('utc', now()),
	constraint characters_hp_non_negative check (current_hp >= 0 and max_hp >= 0),
	constraint characters_player_campaign_unique unique (campaign_id, player_user_id, name)
);

create table if not exists public.inventory_items (
	id uuid primary key default gen_random_uuid(),
	campaign_id uuid not null references public.campaigns (id) on delete cascade,
	character_id uuid not null references public.characters (id) on delete cascade,
	name text not null,
	quantity integer not null default 1,
	notes text not null default '',
	metadata jsonb not null default '{}'::jsonb,
	created_at timestamptz not null default timezone('utc', now()),
	updated_at timestamptz not null default timezone('utc', now()),
	constraint inventory_items_quantity_positive check (quantity > 0)
);

create table if not exists public.decision_logs (
	id uuid primary key default gen_random_uuid(),
	campaign_id uuid not null references public.campaigns (id) on delete cascade,
	character_id uuid references public.characters (id) on delete set null,
	created_by uuid not null references public.profiles (user_id) on delete cascade,
	decision_text text not null,
	metadata jsonb not null default '{}'::jsonb,
	created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.maps (
	id uuid primary key default gen_random_uuid(),
	campaign_id uuid not null references public.campaigns (id) on delete cascade,
	title text not null,
	storage_path text not null unique,
	uploaded_by uuid not null references public.profiles (user_id) on delete cascade,
	metadata jsonb not null default '{}'::jsonb,
	created_at timestamptz not null default timezone('utc', now()),
	updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists campaign_members_user_idx on public.campaign_members (user_id);
create index if not exists characters_campaign_idx on public.characters (campaign_id);
create index if not exists characters_player_idx on public.characters (player_user_id);
create index if not exists inventory_items_character_idx on public.inventory_items (character_id);
create index if not exists decision_logs_campaign_idx on public.decision_logs (campaign_id);
create index if not exists maps_campaign_idx on public.maps (campaign_id);

drop trigger if exists trg_profiles_set_updated_at on public.profiles;
create trigger trg_profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

drop trigger if exists trg_campaigns_set_updated_at on public.campaigns;
create trigger trg_campaigns_set_updated_at
before update on public.campaigns
for each row
execute function public.set_updated_at();

drop trigger if exists trg_characters_set_updated_at on public.characters;
create trigger trg_characters_set_updated_at
before update on public.characters
for each row
execute function public.set_updated_at();

drop trigger if exists trg_inventory_items_set_updated_at on public.inventory_items;
create trigger trg_inventory_items_set_updated_at
before update on public.inventory_items
for each row
execute function public.set_updated_at();

drop trigger if exists trg_maps_set_updated_at on public.maps;
create trigger trg_maps_set_updated_at
before update on public.maps
for each row
execute function public.set_updated_at();

grant usage on schema public to anon, authenticated, service_role;
grant select on table public.profiles to authenticated, service_role;
grant insert, update on table public.profiles to authenticated, service_role;
grant select, insert, update, delete on table public.campaigns to authenticated, service_role;
grant select, insert, update, delete on table public.campaign_members to authenticated, service_role;
grant select, insert, update, delete on table public.characters to authenticated, service_role;
grant select, insert, update, delete on table public.inventory_items to authenticated, service_role;
grant select, insert, update, delete on table public.decision_logs to authenticated, service_role;
grant select, insert, update, delete on table public.maps to authenticated, service_role;

alter table public.profiles enable row level security;
alter table public.campaigns enable row level security;
alter table public.campaign_members enable row level security;
alter table public.characters enable row level security;
alter table public.inventory_items enable row level security;
alter table public.decision_logs enable row level security;
alter table public.maps enable row level security;

create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (auth.uid() is not null and user_id = auth.uid());

create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (auth.uid() is not null and user_id = auth.uid());

create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (auth.uid() is not null and user_id = auth.uid())
with check (auth.uid() is not null and user_id = auth.uid());

create policy "campaigns_select_member"
on public.campaigns
for select
to authenticated
using (
	auth.uid() is not null
	and exists (
		select 1
		from public.campaign_members cm
		where cm.campaign_id = campaigns.id
			and cm.user_id = auth.uid()
	)
);

create policy "campaigns_insert_dm_owner"
on public.campaigns
for insert
to authenticated
with check (auth.uid() is not null and created_by = auth.uid());

create policy "campaigns_update_dm"
on public.campaigns
for update
to authenticated
using (
	auth.uid() is not null
	and exists (
		select 1
		from public.campaign_members cm
		where cm.campaign_id = campaigns.id
			and cm.user_id = auth.uid()
			and cm.role = 'dm'
	)
)
with check (
	auth.uid() is not null
	and exists (
		select 1
		from public.campaign_members cm
		where cm.campaign_id = campaigns.id
			and cm.user_id = auth.uid()
			and cm.role = 'dm'
	)
);

create policy "campaigns_delete_dm"
on public.campaigns
for delete
to authenticated
using (
	auth.uid() is not null
	and exists (
		select 1
		from public.campaign_members cm
		where cm.campaign_id = campaigns.id
			and cm.user_id = auth.uid()
			and cm.role = 'dm'
	)
);

create policy "campaign_members_select_member"
on public.campaign_members
for select
to authenticated
using (
	auth.uid() is not null
	and exists (
		select 1
		from public.campaign_members viewer
		where viewer.campaign_id = campaign_members.campaign_id
			and viewer.user_id = auth.uid()
	)
);

create policy "campaign_members_insert_dm"
on public.campaign_members
for insert
to authenticated
with check (
	auth.uid() is not null
	and (
		role = 'dm' and user_id = auth.uid()
		or exists (
			select 1
			from public.campaign_members cm
			where cm.campaign_id = campaign_members.campaign_id
				and cm.user_id = auth.uid()
				and cm.role = 'dm'
		)
	)
);

create policy "campaign_members_update_dm"
on public.campaign_members
for update
to authenticated
using (
	auth.uid() is not null
	and exists (
		select 1
		from public.campaign_members cm
		where cm.campaign_id = campaign_members.campaign_id
			and cm.user_id = auth.uid()
			and cm.role = 'dm'
	)
)
with check (
	auth.uid() is not null
	and exists (
		select 1
		from public.campaign_members cm
		where cm.campaign_id = campaign_members.campaign_id
			and cm.user_id = auth.uid()
			and cm.role = 'dm'
	)
);

create policy "campaign_members_delete_dm"
on public.campaign_members
for delete
to authenticated
using (
	auth.uid() is not null
	and exists (
		select 1
		from public.campaign_members cm
		where cm.campaign_id = campaign_members.campaign_id
			and cm.user_id = auth.uid()
			and cm.role = 'dm'
	)
);

create policy "characters_select_member"
on public.characters
for select
to authenticated
using (
	auth.uid() is not null
	and exists (
		select 1
		from public.campaign_members cm
		where cm.campaign_id = characters.campaign_id
			and cm.user_id = auth.uid()
	)
);

create policy "characters_insert_player_or_dm"
on public.characters
for insert
to authenticated
with check (
	auth.uid() is not null
	and exists (
		select 1
		from public.campaign_members cm
		where cm.campaign_id = characters.campaign_id
			and cm.user_id = auth.uid()
			and (cm.role = 'dm' or characters.player_user_id = auth.uid())
	)
);

create policy "characters_update_player_or_dm"
on public.characters
for update
to authenticated
using (
	auth.uid() is not null
	and exists (
		select 1
		from public.campaign_members cm
		where cm.campaign_id = characters.campaign_id
			and cm.user_id = auth.uid()
			and (cm.role = 'dm' or characters.player_user_id = auth.uid())
	)
)
with check (
	auth.uid() is not null
	and exists (
		select 1
		from public.campaign_members cm
		where cm.campaign_id = characters.campaign_id
			and cm.user_id = auth.uid()
			and (cm.role = 'dm' or characters.player_user_id = auth.uid())
	)
);

create policy "inventory_select_member"
on public.inventory_items
for select
to authenticated
using (
	auth.uid() is not null
	and exists (
		select 1
		from public.campaign_members cm
		where cm.campaign_id = inventory_items.campaign_id
			and cm.user_id = auth.uid()
	)
);

create policy "inventory_write_player_or_dm"
on public.inventory_items
for all
to authenticated
using (
	auth.uid() is not null
	and exists (
		select 1
		from public.characters c
		join public.campaign_members cm on cm.campaign_id = c.campaign_id
		where c.id = inventory_items.character_id
			and cm.user_id = auth.uid()
			and (cm.role = 'dm' or c.player_user_id = auth.uid())
	)
)
with check (
	auth.uid() is not null
	and exists (
		select 1
		from public.characters c
		join public.campaign_members cm on cm.campaign_id = c.campaign_id
		where c.id = inventory_items.character_id
			and cm.user_id = auth.uid()
			and (cm.role = 'dm' or c.player_user_id = auth.uid())
	)
);

create policy "decision_logs_select_member"
on public.decision_logs
for select
to authenticated
using (
	auth.uid() is not null
	and exists (
		select 1
		from public.campaign_members cm
		where cm.campaign_id = decision_logs.campaign_id
			and cm.user_id = auth.uid()
	)
);

create policy "decision_logs_insert_member"
on public.decision_logs
for insert
to authenticated
with check (
	auth.uid() is not null
	and created_by = auth.uid()
	and exists (
		select 1
		from public.campaign_members cm
		where cm.campaign_id = decision_logs.campaign_id
			and cm.user_id = auth.uid()
	)
);

create policy "maps_select_member"
on public.maps
for select
to authenticated
using (
	auth.uid() is not null
	and exists (
		select 1
		from public.campaign_members cm
		where cm.campaign_id = maps.campaign_id
			and cm.user_id = auth.uid()
	)
);

create policy "maps_insert_dm"
on public.maps
for insert
to authenticated
with check (
	auth.uid() is not null
	and uploaded_by = auth.uid()
	and exists (
		select 1
		from public.campaign_members cm
		where cm.campaign_id = maps.campaign_id
			and cm.user_id = auth.uid()
			and cm.role = 'dm'
	)
);

create policy "maps_update_dm"
on public.maps
for update
to authenticated
using (
	auth.uid() is not null
	and exists (
		select 1
		from public.campaign_members cm
		where cm.campaign_id = maps.campaign_id
			and cm.user_id = auth.uid()
			and cm.role = 'dm'
	)
)
with check (
	auth.uid() is not null
	and exists (
		select 1
		from public.campaign_members cm
		where cm.campaign_id = maps.campaign_id
			and cm.user_id = auth.uid()
			and cm.role = 'dm'
	)
);

create policy "maps_delete_dm"
on public.maps
for delete
to authenticated
using (
	auth.uid() is not null
	and exists (
		select 1
		from public.campaign_members cm
		where cm.campaign_id = maps.campaign_id
			and cm.user_id = auth.uid()
			and cm.role = 'dm'
	)
);

insert into storage.buckets (id, name, public)
values ('campaign-maps', 'campaign-maps', false)
on conflict (id) do nothing;

create policy "campaign_maps_select_member"
on storage.objects
for select
to authenticated
using (
	bucket_id = 'campaign-maps'
	and auth.uid() is not null
	and exists (
		select 1
		from public.campaign_members cm
		where cm.campaign_id = ((storage.foldername(name))[1])::uuid
			and cm.user_id = auth.uid()
	)
);

create policy "campaign_maps_insert_dm"
on storage.objects
for insert
to authenticated
with check (
	bucket_id = 'campaign-maps'
	and auth.uid() is not null
	and exists (
		select 1
		from public.campaign_members cm
		where cm.campaign_id = ((storage.foldername(name))[1])::uuid
			and cm.user_id = auth.uid()
			and cm.role = 'dm'
	)
);

create policy "campaign_maps_update_dm"
on storage.objects
for update
to authenticated
using (
	bucket_id = 'campaign-maps'
	and auth.uid() is not null
	and exists (
		select 1
		from public.campaign_members cm
		where cm.campaign_id = ((storage.foldername(name))[1])::uuid
			and cm.user_id = auth.uid()
			and cm.role = 'dm'
	)
)
with check (
	bucket_id = 'campaign-maps'
	and auth.uid() is not null
	and exists (
		select 1
		from public.campaign_members cm
		where cm.campaign_id = ((storage.foldername(name))[1])::uuid
			and cm.user_id = auth.uid()
			and cm.role = 'dm'
	)
);

create policy "campaign_maps_delete_dm"
on storage.objects
for delete
to authenticated
using (
	bucket_id = 'campaign-maps'
	and auth.uid() is not null
	and exists (
		select 1
		from public.campaign_members cm
		where cm.campaign_id = ((storage.foldername(name))[1])::uuid
			and cm.user_id = auth.uid()
			and cm.role = 'dm'
	)
);
