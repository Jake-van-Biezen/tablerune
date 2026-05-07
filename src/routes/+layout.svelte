<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { data, children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<div class="min-h-screen bg-zinc-950 text-zinc-100">
	<header class="border-b border-zinc-800 bg-zinc-900/60">
		<div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
			<a class="text-lg font-semibold tracking-wide" href="/">Tablerune</a>

			<nav class="flex items-center gap-4 text-sm">
				{#if data.user}
					<a class="rounded border border-zinc-700 px-3 py-1.5 hover:bg-zinc-800" href="/app">App</a
					>
					<a class="rounded border border-zinc-700 px-3 py-1.5 hover:bg-zinc-800" href="/dm">DM</a>
					<a class="rounded border border-zinc-700 px-3 py-1.5 hover:bg-zinc-800" href="/player"
						>Player</a
					>
					<form method="POST" action="/auth/sign-in?/signOut">
						<button
							type="submit"
							class="cursor-pointer rounded border border-zinc-700 px-3 py-1.5 hover:bg-zinc-800"
						>
							Sign out
						</button>
					</form>
				{:else}
					<a
						class="rounded border border-zinc-700 px-3 py-1.5 hover:bg-zinc-800"
						href="/auth/sign-in">Sign in</a
					>
				{/if}
			</nav>
		</div>
	</header>

	<main class="mx-auto w-full max-w-6xl px-6 py-8">
		{@render children()}
	</main>
</div>
