<script lang="ts">
	let { data, form } = $props();
</script>

<section class="grid gap-6 md:grid-cols-2">
	<form
		method="POST"
		action="?/signIn"
		class="space-y-3 rounded border border-zinc-800 bg-zinc-900 p-6"
	>
		<h1 class="text-2xl font-semibold">Sign in</h1>
		<input type="hidden" name="next" value={data.next} />
		<div class="space-y-1">
			<label class="text-sm text-zinc-300" for="sign-in-email">Email</label>
			<input
				id="sign-in-email"
				name="email"
				type="email"
				required
				class="w-full rounded border border-zinc-700 bg-zinc-950 px-3 py-2"
			/>
		</div>
		<div class="space-y-1">
			<label class="text-sm text-zinc-300" for="sign-in-password">Password</label>
			<input
				id="sign-in-password"
				name="password"
				type="password"
				required
				class="w-full rounded border border-zinc-700 bg-zinc-950 px-3 py-2"
			/>
		</div>
		<button
			type="submit"
			class="cursor-pointer rounded bg-emerald-500 px-4 py-2 font-medium text-zinc-950"
		>
			Sign in
		</button>
	</form>

	<form
		method="POST"
		action="?/signUp"
		class="space-y-3 rounded border border-zinc-800 bg-zinc-900 p-6"
	>
		<h2 class="text-2xl font-semibold">Create account</h2>
		<input type="hidden" name="next" value={data.next} />
		<div class="space-y-1">
			<label class="text-sm text-zinc-300" for="sign-up-display-name">Display name</label>
			<input
				id="sign-up-display-name"
				name="display_name"
				type="text"
				class="w-full rounded border border-zinc-700 bg-zinc-950 px-3 py-2"
			/>
		</div>
		<div class="space-y-1">
			<label class="text-sm text-zinc-300" for="sign-up-email">Email</label>
			<input
				id="sign-up-email"
				name="email"
				type="email"
				required
				class="w-full rounded border border-zinc-700 bg-zinc-950 px-3 py-2"
			/>
		</div>
		<div class="space-y-1">
			<label class="text-sm text-zinc-300" for="sign-up-password">Password</label>
			<input
				id="sign-up-password"
				name="password"
				type="password"
				required
				class="w-full rounded border border-zinc-700 bg-zinc-950 px-3 py-2"
			/>
		</div>
		<button
			type="submit"
			class="cursor-pointer rounded bg-zinc-100 px-4 py-2 font-medium text-zinc-950"
		>
			Sign up
		</button>
	</form>
</section>

{#if form?.message}
	<p class="mt-4 rounded border border-emerald-800 bg-emerald-950/60 px-4 py-2 text-emerald-300">
		{form.message}
	</p>
{/if}
