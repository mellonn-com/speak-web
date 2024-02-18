<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import * as Card from '$lib/components/ui/card';
	import { cn } from '$lib/utils';

	let email: string = '';
	let emailValid: boolean = false;
	let errorMessage: string | undefined;

	function handleKeyPress(event: KeyboardEvent) {
		if (event.key == 'Enter') {
			event.preventDefault();
			resetAccount();
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

	function resetAccount() {
		checkEmail();

		if (!emailValid) {
			return;
		}
		console.log(`Resetting account with email: ${email}`);
	}
</script>

<div class="flex h-screen items-center justify-center">
	<form on:submit={resetAccount}>
		<Card.Root class="w-[350px]">
			<Card.Header class="space-y-1">
				<Card.Title class="text-2xl">Change your password</Card.Title>
				<Card.Description>Enter your email below</Card.Description>
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
						on:keypress={handleKeyPress}
					/>
				</div>
				{#if errorMessage != undefined}
					<p class={cn('text-sm text-red-500 dark:text-red-700')}>{errorMessage}</p>
				{/if}
			</Card.Content>
			<Card.Footer class="flex justify-between space-x-5">
				<a href="/login"><Button variant="outline" class="flex-1">Cancel</Button></a>
				<Button class="flex-1" type="submit">Continue</Button>
			</Card.Footer>
		</Card.Root>
	</form>
</div>
