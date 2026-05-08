<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';

	let { data, form } = $props();
</script>

<section class="grid gap-6 md:grid-cols-2">
	<Card>
		<CardHeader><CardTitle>Sign in</CardTitle></CardHeader>
		<CardContent>
			<form method="POST" action="?/signIn" class="space-y-3">
				<input type="hidden" name="next" value={data.next} />
				<div class="space-y-1">
					<Label for="sign-in-email">Email</Label>
					<Input id="sign-in-email" name="email" type="email" required />
				</div>
				<div class="space-y-1">
					<Label for="sign-in-password">Password</Label>
					<Input id="sign-in-password" name="password" type="password" required />
				</div>
				<Button type="submit">Sign in</Button>
			</form>
		</CardContent>
	</Card>

	<Card>
		<CardHeader><CardTitle>Create account</CardTitle></CardHeader>
		<CardContent>
			<form method="POST" action="?/signUp" class="space-y-3">
				<input type="hidden" name="next" value={data.next} />
				<div class="space-y-1">
					<Label for="sign-up-display-name">Display name</Label>
					<Input id="sign-up-display-name" name="display_name" type="text" />
				</div>
				<div class="space-y-1">
					<Label for="sign-up-email">Email</Label>
					<Input id="sign-up-email" name="email" type="email" required />
				</div>
				<div class="space-y-1">
					<Label for="sign-up-password">Password</Label>
					<Input id="sign-up-password" name="password" type="password" required />
				</div>
				<Button type="submit" variant="secondary">Sign up</Button>
			</form>
		</CardContent>
	</Card>
</section>

{#if form?.message}
	<p class="mt-4 rounded border border-emerald-800 bg-emerald-950/60 px-4 py-2 text-emerald-300">
		{form.message}
	</p>
{/if}
