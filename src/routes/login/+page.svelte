<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import * as Card from '$lib/components/ui/card';
	import { cn } from '$lib/utils';

	let email: string = '';
	let emailValid: boolean = false;
	let password: string = '';
	let errorMessage: string | undefined;

	function handleKeyPress(event: KeyboardEvent) {
		if (event.key == 'Enter') {
			event.preventDefault();
			signIn();
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

	function signIn() {
		checkEmail();

		if (!emailValid) {
			return;
		}
		if (password.length == 0 || password == undefined) {
			errorMessage = 'Password must not be empty';
			return;
		}
		console.log(`Email: ${email}, password: ${password}`);
	}
</script>

<div class="flex h-screen items-center justify-center">
	<form on:submit={signIn}>
		<Card.Root class="w-[350px]">
			<Card.Header class="space-y-1">
				<Card.Title class="text-2xl">Sign in</Card.Title>
				<Card.Description>Enter your email and password below</Card.Description>
			</Card.Header>
			<Card.Content class="grid gap-4">
				<div class="grid gap-2">
					<Label for="email">Email</Label>
					<Input
						id="email"
						bind:value={email}
						type="email"
						placeholder="email@example.com"
						on:change={checkEmail}
					/>
				</div>
				<div class="grid gap-2">
					<Label for="password">Password</Label>
					<Input
						id="password"
						bind:value={password}
						type="password"
						required
						on:keypress={handleKeyPress}
					/>
				</div>
				{#if errorMessage != undefined}
					<p class={cn('text-sm text-red-500 dark:text-red-700')}>{errorMessage}</p>
				{/if}
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
