<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';

	let { data, form } = $props();
</script>

<section class="space-y-8">
	<header class="space-y-2">
		<h1 class="text-3xl font-bold">Player Dashboard</h1>
		<p class="text-zinc-300">Manage your characters, inventory, health, and decision history.</p>
	</header>

	{#if !data.campaigns.length}
		<p class="text-zinc-400">You are not in any campaigns yet. Ask your DM for an invite link.</p>
	{:else}
		<form
			method="POST"
			action="?/createCharacter"
			class="space-y-3 rounded border border-zinc-800 p-4"
		>
			<h2 class="text-xl font-semibold">Create character</h2>
			<Label for="create-campaign">Campaign</Label>
			<select
				id="create-campaign"
				name="campaign_id"
				required
				class="w-full rounded border border-zinc-700 bg-zinc-950 px-3 py-2"
			>
				{#each data.campaigns as campaign (campaign.id)}
					<option value={campaign.id}>{campaign.name}</option>
				{/each}
			</select>
			<Label for="create-name">Name</Label>
			<Input id="create-name" name="name" required placeholder="Character name" />
			<div class="grid gap-2 md:grid-cols-2">
				<Input name="race" placeholder="Race" />
				<Input name="class_spec" placeholder="Class/spec" />
			</div>
			<div class="grid gap-2 md:grid-cols-2">
				<Input name="current_hp" type="number" min="0" value="0" />
				<Input name="max_hp" type="number" min="0" value="0" />
			</div>
			<Textarea name="background_story" rows={2} placeholder="Background story"></Textarea>
			<Textarea name="decision_summary" rows={2} placeholder="Decision summary"></Textarea>
			<Button>Create character</Button>
		</form>
	{/if}

	<section class="space-y-4">
		<h2 class="text-xl font-semibold">Your characters</h2>
		{#if !data.characters.length}
			<p class="text-zinc-400">No characters created yet.</p>
		{:else}
			{#each data.characters as character (character.id)}
				<article class="space-y-3 rounded border border-zinc-800 p-4">
					<h3 class="text-lg font-semibold">{character.name}</h3>
					<form method="POST" action="?/updateCharacter" class="space-y-2">
						<input type="hidden" name="character_id" value={character.id} />
						<input type="hidden" name="campaign_id" value={character.campaign_id} />
						<div class="grid gap-2 md:grid-cols-2">
							<input
								name="race"
								value={character.race}
								placeholder="Race"
								class="w-full rounded border border-zinc-700 bg-zinc-950 px-3 py-2"
							/>
							<input
								name="class_spec"
								value={character.class_spec}
								placeholder="Class/spec"
								class="w-full rounded border border-zinc-700 bg-zinc-950 px-3 py-2"
							/>
						</div>
						<div class="grid gap-2 md:grid-cols-2">
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
						</div>
						<textarea
							name="background_story"
							rows="2"
							class="w-full rounded border border-zinc-700 bg-zinc-950 px-3 py-2"
							>{character.background_story}</textarea
						>
						<textarea
							name="decision_summary"
							rows="2"
							class="w-full rounded border border-zinc-700 bg-zinc-950 px-3 py-2"
							>{character.decision_summary}</textarea
						>
						<button class="rounded border border-zinc-700 px-3 py-1.5 hover:bg-zinc-800"
							>Save character</button
						>
					</form>

					<form
						method="POST"
						action="?/addInventoryItem"
						class="space-y-2 rounded bg-zinc-900/60 p-3"
					>
						<input type="hidden" name="character_id" value={character.id} />
						<input type="hidden" name="campaign_id" value={character.campaign_id} />
						<p class="font-medium">Inventory</p>
						<div class="grid gap-2 md:grid-cols-3">
							<input
								name="name"
								placeholder="Item name"
								required
								class="w-full rounded border border-zinc-700 bg-zinc-950 px-3 py-2"
							/>
							<input
								name="quantity"
								type="number"
								min="1"
								value="1"
								class="w-full rounded border border-zinc-700 bg-zinc-950 px-3 py-2"
							/>
							<input
								name="notes"
								placeholder="Notes"
								class="w-full rounded border border-zinc-700 bg-zinc-950 px-3 py-2"
							/>
						</div>
						<button class="rounded border border-zinc-700 px-3 py-1.5 hover:bg-zinc-800"
							>Add item</button
						>
					</form>

					<div class="space-y-2 text-sm text-zinc-300">
						{#each data.inventoryItems.filter((item) => item.character_id === character.id) as item (item.id)}
							<form
								method="POST"
								action="?/removeInventoryItem"
								class="flex items-center justify-between rounded bg-zinc-900/50 p-2"
							>
								<input type="hidden" name="item_id" value={item.id} />
								<span>{item.quantity}x {item.name}</span>
								<button class="rounded border border-zinc-700 px-2 py-1 hover:bg-zinc-800"
									>Remove</button
								>
							</form>
						{/each}
					</div>

					<form method="POST" action="?/addDecision" class="space-y-2 rounded bg-zinc-900/60 p-3">
						<input type="hidden" name="campaign_id" value={character.campaign_id} />
						<input type="hidden" name="character_id" value={character.id} />
						<p class="font-medium">Decision log</p>
						<textarea
							name="decision_text"
							required
							rows="2"
							placeholder="Describe a choice or event..."
							class="w-full rounded border border-zinc-700 bg-zinc-950 px-3 py-2"
						></textarea>
						<button class="rounded border border-zinc-700 px-3 py-1.5 hover:bg-zinc-800"
							>Log decision</button
						>
					</form>
				</article>
			{/each}
		{/if}
	</section>

	<section class="space-y-2">
		<h2 class="text-xl font-semibold">Recent decisions</h2>
		{#each data.decisionLogs as decision (decision.id)}
			<p class="rounded border border-zinc-800 bg-zinc-900/50 p-2 text-sm text-zinc-300">
				{decision.decision_text}
			</p>
		{/each}
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
