<script lang="ts">
	import type { InsertUser, SelectUser } from '$lib/db/schema';
	import type { PageServerData } from './$types';
	import { v4 as uuidv4 } from 'uuid';

	export let data: PageServerData;

	// @ts-ignore
	let users: SelectUser[] = data!.users as SelectUser[];

	async function addUser() {
		console.log('Adding user');
		const id = uuidv4();
		const num = Math.floor(Math.random() * 420);
		const newUser: InsertUser = {
			id: id,
			email: `john${num}@mellonn.com`,
			firstName: `John${num}`,
			lastName: `Doe`
		};

		const result = await fetch('/api/users', {
			method: 'POST',
			body: JSON.stringify(newUser)
		});
		const json = await result.json();
		console.log(`Post result: ${json}`);
		users.push(json as SelectUser);
	}
</script>

<div class="p-4">
	<h1 class="text-5xl">Welcome to SvelteKit</h1>

	<h2 class="mb-2 mt-4 text-xl">Users</h2>
	<ol>
		{#if users.length > 0}
			{#each users as user}
				<li>Id: {user.id}, message: {user.email}</li>
			{/each}
		{:else}
			<p>There's no users here...</p>
		{/if}
	</ol>

	<button
		class="mt-4 h-10 w-40 rounded-lg bg-indigo-500 text-gray-100 drop-shadow-md duration-150 hover:bg-indigo-600 hover:drop-shadow-sm"
		on:click={() => addUser()}
	>
		Add user
	</button>
</div>
