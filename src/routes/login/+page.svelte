<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import * as Card from '$lib/components/ui/card';
	import { superForm } from 'sveltekit-superforms';
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';

	export let data;

	const loginInfoWritable = writable();

	const { form, errors, constraints, message, enhance } = superForm(data.form);

	$: loginInfoWritable.set({
		email: $form.email,
		password: $form.password
	});
	setContext('loginInfo', loginInfoWritable);
</script>

<div class="flex h-screen items-center justify-center">
	<form method="post" use:enhance>
		<Card.Root class="w-[350px]">
			<Card.Header class="space-y-1">
				<Card.Title class="text-2xl">Sign in</Card.Title>
				<Card.Description>Enter your email and password below</Card.Description>
				{#if $message}<Card.Description>{$message}</Card.Description>{/if}
			</Card.Header>
			<Card.Content class="grid gap-4">
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
				<a href="/reset-account"><Card.Description>Forgot password?</Card.Description></a>
			</Card.Content>
			<Card.Footer class="flex justify-between space-x-5">
				<a href="/create-account"
					><Button variant="outline" class="flex-1">Create account</Button></a
				>
				<Button class="flex-1" type="submit">Sign in</Button>
			</Card.Footer>
		</Card.Root>
	</form>
</div>
