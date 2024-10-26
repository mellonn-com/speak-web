<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import * as Card from '$lib/components/ui/card';
	import { superForm } from 'sveltekit-superforms';

	export let data;

	const { form, errors, constraints, message, enhance } = superForm(data.form);
</script>

<div class="flex h-screen items-center justify-center">
	<form method="post" use:enhance>
		<Card.Root class="w-[350px]">
			<Card.Header class="space-y-1">
				<Card.Title class="text-2xl">Change your password</Card.Title>
				<Card.Description>Enter a new password below</Card.Description>
			</Card.Header>
			{#if !$message && !$errors.token}
				<Card.Content class="grid gap-4">
					<div class="grid gap-2">
						<Label for="password">Password</Label>
						<Input
							id="password"
							name="password"
							type="password"
							bind:value={$form.password}
							{...$constraints.password}
						/>
						{#if $errors.password}<span class="text-red-500">{$errors.password}</span>{/if}
					</div>
					<div class="grid gap-2">
						<Label for="confirmPassword">Confirm password</Label>
						<Input
							id="confirmPassword"
							name="confirmPassword"
							type="password"
							bind:value={$form.confirmPassword}
							{...$constraints.confirmPassword}
						/>
						{#if $errors.confirmPassword}<span class="text-red-500">{$errors.confirmPassword}</span
							>{/if}
					</div>
				</Card.Content>
				<Card.Footer class="flex justify-between space-x-5">
					<a href="/login" class="flex flex-1 items-center justify-center"
						><Button variant="outline" class="flex-1">Cancel</Button></a
					>
					<Button class="flex-1" type="submit">Change password</Button>
				</Card.Footer>
			{:else if $errors.token}
				<Card.Content class="grid gap-4">
					{$errors.token}
				</Card.Content>
				<Card.Footer class="flex justify-between space-x-5">
					<a href="/login" class="flex flex-1 items-center justify-center"
						><Button variant="outline" class="flex-1">Cancel</Button></a
					>
					<a href="/reset-account" class="flex flex-1 items-center justify-center"
						><Button variant="default" class="flex-1">Try again</Button></a
					>
				</Card.Footer>
			{:else}
				<Card.Content class="grid gap-4">
					{$message}
				</Card.Content>
				<Card.Footer>
					<a href="/login" class="flex items-center justify-center"
						><Button class="flex-1">Go to login</Button></a
					>
				</Card.Footer>
			{/if}
		</Card.Root>
	</form>
</div>
