## Why

Tablerune needs a clear MVP foundation so DMs and players can run campaigns in one shared system instead of scattered notes, chats, and spreadsheets. Building this now establishes the core product loop and multi-tenant data model required for future real-time and advanced map features.

## What Changes

- Add authenticated user onboarding with profile setup for DM and player roles.
- Add campaign lifecycle management for DMs (create campaign, manage membership, invite players).
- Add character creation and maintenance for players (race, class/spec, health, story, decisions).
- Add campaign-level party tracking for DMs (player health and inventory visibility).
- Add map asset management for campaigns (upload and organize map files).
- Define authorization and tenancy boundaries across all core entities.

## Capabilities

### New Capabilities
- `user-auth-and-profiles`: Supabase-backed authentication and user profile lifecycle for Tablerune users.
- `campaign-and-membership-management`: Campaign creation, role assignment, invitation, and membership tracking.
- `character-and-inventory-management`: Player-owned character records, stats, story fields, and item tracking.
- `dm-party-state-tracking`: DM views and updates for party-wide health and inventory state.
- `campaign-map-management`: Campaign map upload, storage, and retrieval for DM and player access.

### Modified Capabilities
- None.

## Impact

- Affects SvelteKit app routes, server actions/loaders, and shared domain models.
- Introduces Supabase Auth, Postgres schema/RLS policies, and Storage buckets as core dependencies.
- Establishes Cloudflare deployment integration constraints for environment variables and server runtime behavior.
- Defines the baseline contracts that later real-time, map editing, and analytics features will extend.
