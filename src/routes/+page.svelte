<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SelectUser } from '$lib/db/schema';
	import type { PageServerData } from './$types';

	export let data: PageServerData;
	let users: SelectUser[] = data!.users as SelectUser[];
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

	<form method="POST" use:enhance>
		<label>
			Email
			<input name="email" type="email" />
		</label>
		<label>
			First name
			<input name="firstName" type="text" />
		</label>
		<label>
			Last name
			<input name="lastName" type="text" />
		</label>
		<button
			class="mt-4 h-10 w-40 rounded-lg bg-indigo-500 text-gray-100 drop-shadow-md duration-150 hover:bg-indigo-600 hover:drop-shadow-sm"
		>
			Add user
		</button>
	</form>
</div>
