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
				<Card.Title class="text-2xl">Create an account</Card.Title>
				<Card.Description>Enter your email below to create your account</Card.Description>
				{#if $message}<Card.Description>{$message}</Card.Description>{/if}
			</Card.Header>
			<Card.Content class="grid gap-4">
				<div class="grid gap-2">
					<Label for="firstName">First name</Label>
					<Input
						id="firstName"
						name="firstName"
						placeholder="John"
						bind:value={$form.firstName}
						{...$constraints.firstName}
					/>
					{#if $errors.firstName}<span class="text-red-500">{$errors.firstName}</span>{/if}
				</div>
				<div class="grid gap-2">
					<Label for="lastName">Last name</Label>
					<Input
						id="lastName"
						name="lastName"
						placeholder="Doe"
						bind:value={$form.lastName}
						{...$constraints.lastName}
					/>
					{#if $errors.lastName}<span class="text-red-500">{$errors.lastName}</span>{/if}
				</div>
				<div class="grid gap-2">
					<Label for="email">Email</Label>
					<Input
						id="email"
						name="email"
						type="email"
						placeholder="email@example.com"
						bind:value={$form.email}
						{...$constraints.email}
					/>
					{#if $errors.email}<span class="text-red-500">{$errors.email}</span>{/if}
				</div>
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
					<Label for="confirmPassword">Password</Label>
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
				<a href="/login"><Button variant="outline" class="flex-1">Cancel</Button></a>
				<Button class="flex-1" type="submit">Create account</Button>
			</Card.Footer>
		</Card.Root>
	</form>
</div>
