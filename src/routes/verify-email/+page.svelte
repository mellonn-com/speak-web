<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import * as Card from '$lib/components/ui/card';
	import { superForm } from 'sveltekit-superforms';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data = $bindable() }: Props = $props();

	const { form, errors, constraints, message, enhance } = superForm(data.form);
</script>

<div class="flex h-screen items-center justify-center">
	<form method="post" use:enhance>
		<Card.Root class="w-[350px]">
			<Card.Header class="space-y-1">
				<Card.Title class="text-2xl">Verify your email</Card.Title>
				<Card.Description>A code has been sent to your email.</Card.Description>
				{#if $message}<Card.Description>{$message}</Card.Description>{/if}
			</Card.Header>
			<Card.Content class="grid gap-4">
				<div class="grid gap-2">
					<Label for="code">Code</Label>
					<Input id="code" name="code" type="text" bind:value={$form.code} {...$constraints.code} />
					{#if $errors._errors}<span class="text-red-500">{$errors._errors}</span>{/if}
				</div>
				<input class="hidden" id="userId" name="userId" type="text" bind:value={data.userId} />
			</Card.Content>
			<Card.Footer>
				<Button class="flex-1" type="submit">Verify email</Button>
			</Card.Footer>
		</Card.Root>
	</form>
</div>
