<script lang="ts">
	let { data, form } = $props();
</script>

<section class="mx-auto max-w-2xl space-y-4 rounded border border-zinc-800 p-6">
	<h1 class="text-2xl font-bold">Campaign Invitation</h1>

	{#if !data.invitation}
		<p class="text-zinc-300">This invitation is invalid or unavailable for your account.</p>
	{:else}
		<p class="text-zinc-300">
			You were invited as
			<span class="rounded bg-zinc-800 px-2 py-0.5 text-zinc-100">{data.invitation.role}</span>.
		</p>
		<p class="text-zinc-400">
			Invitation expires at: {new Date(data.invitation.expires_at).toLocaleString()}
		</p>

		<form method="POST" action="?/accept">
			<button class="rounded border border-zinc-700 px-3 py-1.5 hover:bg-zinc-800"
				>Accept invite</button
			>
		</form>
	{/if}

	{#if form?.message}
		<p class="rounded border border-rose-900 bg-rose-950/70 px-3 py-2 text-rose-300">
			{form.message}
		</p>
	{/if}
</section>
