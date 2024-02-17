<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import * as Card from '$lib/components/ui/card';
</script>

<div class="flex h-screen items-center justify-center">
	<Card.Root class="w-[350px]">
		<Card.Header class="space-y-1">
			<Card.Title class="text-2xl">Change your password</Card.Title>
			<Card.Description>Enter your email below</Card.Description>
		</Card.Header>
		<Card.Content class="grid gap-4">
			<div class="grid gap-2">
				<Label for="email">Email</Label>
				<Input id="email" type="email" placeholder="email@example.com" />
			</div>
		</Card.Content>
		<Card.Footer class="flex justify-between space-x-5">
			<a href="/login"><Button variant="outline" class="flex-1">Cancel</Button></a>
			<Button class="flex-1">Continue</Button>
		</Card.Footer>
	</Card.Root>
</div>
