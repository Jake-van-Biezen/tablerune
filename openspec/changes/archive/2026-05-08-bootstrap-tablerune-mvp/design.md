## Context

Tablerune is being introduced as a greenfield SvelteKit product deployed on Cloudflare with Supabase as the backend platform. The MVP must support two primary roles (DM and player), isolate campaign data across tenants, and provide a usable baseline for campaign operations (characters, inventory, health, and maps). The project also adopts shadcn-svelte as the UI system, so reusable primitives and consistent interaction patterns are expected from the start.

## Goals / Non-Goals

**Goals:**
- Establish a secure, role-aware architecture for DMs and players using Supabase Auth and Postgres RLS.
- Define campaign, membership, character, inventory, and map data contracts that support MVP gameplay workflows.
- Provide a SvelteKit route and service structure that can scale to realtime features later without major rewrites.
- Keep Cloudflare deployment and environment constraints explicit in the design.

**Non-Goals:**
- Implementing live collaborative map editing or token movement.
- Shipping advanced automation (dice engines, combat rules enforcement, AI narration).
- Supporting offline-first synchronization in the MVP.
- Designing final visual branding beyond shadcn-svelte-based component usage.

## Decisions

1. **Multi-tenant access model via campaign membership + RLS**
   - Decision: Use `campaign_members` as the canonical authorization relation, with role values (`dm`, `player`) and RLS policies for every campaign-bound table.
   - Rationale: Keeps all access checks data-driven and enforceable at the database boundary.
   - Alternatives considered:
     - Server-only authorization checks in SvelteKit: rejected because it is easier to bypass via direct API access and harder to audit.
     - Per-table ad hoc ownership columns without membership joins: rejected due to duplicated logic and weaker role semantics.

2. **Normalized core schema with flexible extension fields**
   - Decision: Use relational tables for core gameplay entities (`campaigns`, `characters`, `inventory_items`, `maps`) and allow optional JSON metadata for future expansion.
   - Rationale: Enables strong querying/reporting for DM dashboards while preserving flexibility for custom campaign needs.
   - Alternatives considered:
     - Fully schemaless JSON documents: rejected due to weak constraints and difficult aggregate queries (party summaries, health rollups).

3. **Supabase Storage for map assets**
   - Decision: Store map files in Supabase Storage with bucket policies tied to campaign membership.
   - Rationale: Keeps binary asset storage separate from relational data while reusing auth context.
   - Alternatives considered:
     - Storing map blobs in Postgres: rejected due to size/performance concerns.
     - Third-party object storage abstraction now: rejected to reduce MVP integration complexity.

4. **SvelteKit server-first data access**
   - Decision: Place write operations in SvelteKit server actions/endpoints and use shared domain services for validation/authorization composition.
   - Rationale: Keeps privileged behavior centralized and easier to test; aligns with Cloudflare runtime constraints.
   - Alternatives considered:
     - Direct client writes for most entities: rejected because policy complexity and failure handling become fragmented across views.

## Risks / Trade-offs

- **[Policy complexity growth]** As entities grow, RLS policies can become hard to reason about → **Mitigation:** standardize ownership predicates around `campaign_members` and codify policy naming conventions.
- **[Schema rigidity for custom tabletop systems]** Relational modeling may feel restrictive for uncommon rulesets → **Mitigation:** include optional metadata JSON columns where customization pressure is expected.
- **[Cloudflare runtime differences]** Some Node-oriented dependencies may not behave identically on workers → **Mitigation:** keep server dependencies minimal and verify runtime compatibility before adoption.
- **[Invite abuse or stale links]** Invitation flows can be abused without expiration/role checks → **Mitigation:** use signed, expiring invite records and validate campaign role constraints at acceptance time.

## Migration Plan

1. Create Supabase schema migrations for core entities and role enums.
2. Add RLS policies and storage bucket policies before exposing write routes.
3. Implement SvelteKit auth/session bootstrap and protected route groups.
4. Roll out campaign and character workflows behind feature-complete server actions.
5. Deploy to Cloudflare with environment configuration for Supabase URL/keys.
6. Rollback strategy: disable new routes and revert to previous migration batch if policy or schema defects are found.

## Open Questions

- Should invite acceptance require an existing account before viewing campaign metadata?
- Should DM edit rights include direct mutation of player inventory or only suggested changes?
- Is map visibility always campaign-wide, or should maps support per-player fog-of-war visibility in a future phase?
