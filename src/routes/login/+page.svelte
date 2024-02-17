<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import * as Card from '$lib/components/ui/card';
</script>

<div class="flex h-screen items-center justify-center">
	<Card.Root class="w-[350px]">
		<Card.Header class="space-y-1">
			<Card.Title class="text-2xl">Sign in</Card.Title>
			<Card.Description>Enter your email and password below</Card.Description>
		</Card.Header>
		<Card.Content class="grid gap-4">
			<div class="grid gap-2">
				<Label for="email">Email</Label>
				<Input id="email" type="email" placeholder="email@example.com" />
			</div>
			<div class="grid gap-2">
				<Label for="password">Password</Label>
				<Input id="password" type="password" />
			</div>
			<a href="/reset-account"><Card.Description>Forgot password?</Card.Description></a>
		</Card.Content>
		<Card.Footer class="flex justify-between space-x-5">
			<a href="/create-account"><Button variant="outline" class="flex-1">Create account</Button></a>
			<Button class="flex-1">Sign in</Button>
		</Card.Footer>
	</Card.Root>
</div>
