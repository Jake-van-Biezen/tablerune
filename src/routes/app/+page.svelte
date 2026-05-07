<script lang="ts">
	let { data, form } = $props();
</script>

<section class="space-y-4">
	<h1 class="text-3xl font-bold">Campaign Home</h1>
	<p class="text-zinc-300">
		Signed in as <span class="font-semibold"
			>{data.profile?.display_name || data.profile?.user_id}</span
		>.
	</p>
	<p class="text-zinc-400">
		Current role preference:
		<span class="rounded bg-zinc-800 px-2 py-0.5 text-zinc-100"
			>{data.profile?.preferred_role ?? 'player'}</span
		>
	</p>

	<form method="POST" action="?/setRole" class="flex gap-3">
		<button
			type="submit"
			name="preferred_role"
			value="dm"
			class="cursor-pointer rounded border border-zinc-700 px-3 py-1.5 hover:bg-zinc-800"
		>
			Switch to DM
		</button>
		<button
			type="submit"
			name="preferred_role"
			value="player"
			class="cursor-pointer rounded border border-zinc-700 px-3 py-1.5 hover:bg-zinc-800"
		>
			Switch to Player
		</button>
	</form>

	{#if form?.message}
		<p class="rounded border border-rose-900 bg-rose-950/70 px-3 py-2 text-rose-300">
			{form.message}
		</p>
	{/if}
</section>
