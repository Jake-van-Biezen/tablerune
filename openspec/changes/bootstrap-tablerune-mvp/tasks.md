## 1. Foundation and Platform Setup

- [ ] 1.1 Configure Supabase project settings, local environment variables, and Cloudflare deployment bindings for auth, database, and storage access.
- [ ] 1.2 Define initial database migrations for profiles, campaigns, memberships, characters, inventory items, decision logs, and maps.
- [ ] 1.3 Implement baseline RLS and storage policies tied to campaign membership and DM/player role checks.

## 2. Auth and Profile Flows

- [ ] 2.1 Implement SvelteKit authentication bootstrap using Supabase session handling for protected routes.
- [ ] 2.2 Implement profile creation on first login and profile retrieval for app-shell personalization.
- [ ] 2.3 Add role-aware navigation guards so DM-only and player-only surfaces are enforced.

## 3. Campaign and Membership Management

- [ ] 3.1 Implement DM campaign creation and campaign metadata management actions/endpoints.
- [ ] 3.2 Implement invitation issuance and acceptance flow that creates campaign member records with explicit roles.
- [ ] 3.3 Implement campaign authorization checks across route loaders and write actions using shared membership logic.

## 4. Character and Inventory Management

- [ ] 4.1 Implement player character creation/editing for race, class/spec, health, and narrative fields.
- [ ] 4.2 Implement inventory CRUD for player-owned characters within authorized campaigns.
- [ ] 4.3 Implement decision history capture and retrieval within character context.

## 5. DM Party State and Map Management

- [ ] 5.1 Implement DM party dashboard queries for campaign-wide character health and inventory summaries.
- [ ] 5.2 Implement DM-authorized updates to tracked party state with campaign-scoped validation.
- [ ] 5.3 Implement campaign map upload, listing, and retrieval flows using Supabase Storage policies.

## 6. UX Integration and Hardening

- [ ] 6.1 Build core shadcn-svelte UI screens for onboarding, campaign dashboard, character sheet, and map library.
- [ ] 6.2 Add integration tests for role authorization and key workflows (campaign creation, join, character updates, map access).
- [ ] 6.3 Add observability/error handling and rollout checks for Cloudflare deployment readiness.
