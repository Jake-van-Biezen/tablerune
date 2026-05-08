<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';

	let { data, form } = $props();
</script>

<section class="space-y-8">
	<header class="space-y-2">
		<h1 class="text-3xl font-bold">DM Dashboard</h1>
		<p class="text-zinc-300">
			Create campaigns, update campaign metadata, and issue player invitations.
		</p>
	</header>

	<form
		method="POST"
		action="?/createCampaign"
		class="space-y-3 rounded border border-zinc-800 p-4"
	>
		<h2 class="text-xl font-semibold">Create campaign</h2>
		<div class="space-y-1">
			<Label for="campaign-name">Name</Label>
			<Input id="campaign-name" name="name" required />
		</div>
		<div class="space-y-1">
			<Label for="campaign-description">Description</Label>
			<Textarea id="campaign-description" name="description" rows={3}></Textarea>
		</div>
		<Button>Create</Button>
	</form>

	<section class="space-y-4">
		<h2 class="text-xl font-semibold">Your campaigns</h2>
		{#if !data.campaigns.length}
			<p class="text-zinc-400">No campaigns yet.</p>
		{:else}
			<div class="space-y-4">
				{#each data.campaigns as campaign (campaign.id)}
					<article class="space-y-3 rounded border border-zinc-800 p-4">
						<form method="POST" action="?/updateCampaign" class="space-y-2">
							<input type="hidden" name="campaign_id" value={campaign.id} />
							<label class="text-sm text-zinc-300" for={`name-${campaign.id}`}>Campaign name</label>
							<input
								id={`name-${campaign.id}`}
								name="name"
								value={campaign.name}
								required
								class="w-full rounded border border-zinc-700 bg-zinc-950 px-3 py-2"
							/>
							<label class="text-sm text-zinc-300" for={`description-${campaign.id}`}
								>Description</label
							>
							<textarea
								id={`description-${campaign.id}`}
								name="description"
								rows="2"
								class="w-full rounded border border-zinc-700 bg-zinc-950 px-3 py-2"
							>
								{campaign.description}</textarea
							>
							<button class="rounded border border-zinc-700 px-3 py-1.5 hover:bg-zinc-800"
								>Save</button
							>
						</form>

						<form method="POST" action="?/issueInvite" class="space-y-2 rounded bg-zinc-900/60 p-3">
							<input type="hidden" name="campaign_id" value={campaign.id} />
							<label class="text-sm text-zinc-300" for={`invite-${campaign.id}`}
								>Invite player email</label
							>
							<div class="flex gap-2">
								<input
									id={`invite-${campaign.id}`}
									name="invited_email"
									type="email"
									required
									class="w-full rounded border border-zinc-700 bg-zinc-950 px-3 py-2"
								/>
								<button class="rounded border border-zinc-700 px-3 py-1.5 hover:bg-zinc-800"
									>Invite</button
								>
							</div>
						</form>

						<div class="space-y-1 text-sm text-zinc-300">
							<p class="font-medium">Invitation links</p>
							{#each data.invitations.filter((invite) => invite.campaign_id === campaign.id) as invite (invite.id)}
								<p class="break-all">
									/invite/{invite.token}
									{#if invite.accepted_at}
										<span class="text-emerald-300"> (accepted)</span>
									{:else}
										<span class="text-zinc-400"> (pending)</span>
									{/if}
								</p>
							{/each}
						</div>
					</article>
				{/each}
			</div>
		{/if}
	</section>

	<section class="space-y-4">
		<h2 class="text-xl font-semibold">Party state</h2>
		{#if !data.characters.length}
			<p class="text-zinc-400">No player characters in your campaigns yet.</p>
		{:else}
			<div class="space-y-3">
				{#each data.characters as character (character.id)}
					<form
						method="POST"
						action="?/updatePartyState"
						class="space-y-2 rounded border border-zinc-800 p-3"
					>
						<input type="hidden" name="character_id" value={character.id} />
						<input type="hidden" name="campaign_id" value={character.campaign_id} />
						<p class="font-medium">{character.name}</p>
						<div class="flex gap-2">
							<input
								name="current_hp"
								type="number"
								min="0"
								value={character.current_hp}
								class="w-full rounded border border-zinc-700 bg-zinc-950 px-3 py-2"
							/>
							<input
								name="max_hp"
								type="number"
								min="0"
								value={character.max_hp}
								class="w-full rounded border border-zinc-700 bg-zinc-950 px-3 py-2"
							/>
							<button class="rounded border border-zinc-700 px-3 py-1.5 hover:bg-zinc-800"
								>Update HP</button
							>
						</div>
						<p class="text-sm text-zinc-400">
							Inventory items:
							{data.inventoryItems
								.filter((item) => item.character_id === character.id)
								.reduce((sum, item) => sum + item.quantity, 0)}
						</p>
					</form>
				{/each}
			</div>
		{/if}
	</section>

	<section class="space-y-4">
		<h2 class="text-xl font-semibold">Campaign maps</h2>
		{#if !data.campaigns.length}
			<p class="text-zinc-400">Create a campaign first to upload maps.</p>
		{:else}
			<form
				method="POST"
				action="?/uploadMap"
				enctype="multipart/form-data"
				class="space-y-3 rounded border border-zinc-800 p-4"
			>
				<div class="space-y-1">
					<label class="text-sm text-zinc-300" for="map-campaign">Campaign</label>
					<select
						id="map-campaign"
						name="campaign_id"
						required
						class="w-full rounded border border-zinc-700 bg-zinc-950 px-3 py-2"
					>
						{#each data.campaigns as campaign (campaign.id)}
							<option value={campaign.id}>{campaign.name}</option>
						{/each}
					</select>
				</div>
				<div class="space-y-1">
					<Label for="map-title">Title</Label>
					<Input id="map-title" name="title" required />
				</div>
				<div class="space-y-1">
					<Label for="map-file">Map file</Label>
					<Input id="map-file" name="map_file" type="file" required />
				</div>
				<Button variant="outline">Upload map</Button>
			</form>
		{/if}

		<div class="space-y-2 text-sm text-zinc-300">
			{#each data.maps as map (map.id)}
				<p class="break-all">
					<span class="font-medium">{map.title}:</span>
					{map.storage_path}
				</p>
			{/each}
		</div>
	</section>

	{#if form?.message}
		<p class="rounded border border-rose-900 bg-rose-950/70 px-3 py-2 text-rose-300">
			{form.message}
		</p>
	{/if}
	{#if form?.success}
		<p class="rounded border border-emerald-900 bg-emerald-950/70 px-3 py-2 text-emerald-300">
			{form.success}
		</p>
	{/if}
</section>
