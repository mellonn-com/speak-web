<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import * as Card from '$lib/components/ui/card';
	import { zxcvbn } from '@zxcvbn-ts/core';
	import { cn } from '$lib/utils';

	let email: string = '';
	let emailValid: boolean = false;
	let password: string = '';
	let passwordValid: boolean = false;
	let confirmPassword: string = '';
	$: passwordsMatch = password == confirmPassword;
	let errorMessage: string | undefined;

	function handleKeyPress(event: KeyboardEvent) {
		if (event.key == 'Enter') {
			event.preventDefault();
			createAccount();
		}
	}

	function checkEmail() {
		if (email.length == 0 || email == undefined) {
			errorMessage = 'Email must not be empty';
			emailValid = false;
			return;
		}

		const re =
			/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

		if (!email.toLocaleLowerCase().match(re)) {
			errorMessage = 'Email must be valid';
			emailValid = false;
			return;
		}

		errorMessage = undefined;
		emailValid = true;
	}

	function checkPassword() {
		if (password == undefined || password.length < 10) {
			errorMessage = 'Password must be at least 10 characters.';
			passwordValid = false;
			return;
		}
		const result = zxcvbn(password);

		if (result.score < 3) {
			let feedback = result.feedback.warning;
			if (feedback == null) {
				feedback = 'Password is not strong enough, please choose another.';
			}
			errorMessage = feedback;
			passwordValid = false;
			return;
		}
		errorMessage = undefined;
		passwordValid = true;
	}

	function checkMatch() {
		if (!passwordsMatch) {
			errorMessage = 'Passwords must match';
			return;
		}
		errorMessage = undefined;
		return;
	}

	function createAccount() {
		checkEmail();
		checkPassword();
		checkMatch();

		if (!emailValid || !passwordValid || !passwordsMatch) {
			return;
		}
		console.log(`Creating account with email: ${email} and password: ${password}`);
	}
</script>

<div class="flex h-screen items-center justify-center">
	<form on:submit={createAccount}>
		<Card.Root class="w-[350px]">
			<Card.Header class="space-y-1">
				<Card.Title class="text-2xl">Create an account</Card.Title>
				<Card.Description>Enter your email below to create your account</Card.Description>
			</Card.Header>
			<Card.Content class="grid gap-4">
				<div class="grid gap-2">
					<Label for="email">Email</Label>
					<Input
						id="email"
						type="email"
						placeholder="email@example.com"
						bind:value={email}
						on:change={checkEmail}
					/>
				</div>
				<div class="grid gap-2">
					<Label for="password">Password</Label>
					<Input id="password" type="password" bind:value={password} on:change={checkPassword} />
				</div>
				<div class="grid gap-2">
					<Label for="confirmPassword">Password</Label>
					<Input
						id="confirmPassword"
						type="password"
						bind:value={confirmPassword}
						on:keypress={handleKeyPress}
						on:change={checkMatch}
					/>
				</div>
				{#if errorMessage != undefined}
					<p class={cn('text-sm text-red-500 dark:text-red-700')}>{errorMessage}</p>
				{/if}
			</Card.Content>
			<Card.Footer class="flex justify-between space-x-5">
				<a href="/login"><Button variant="outline" class="flex-1">Cancel</Button></a>
				<Button class="flex-1" type="submit">Create account</Button>
			</Card.Footer>
		</Card.Root>
	</form>
</div>
