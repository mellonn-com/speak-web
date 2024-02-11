<script lang="ts">
	import { onDestroy } from 'svelte';
	import * as Ably from 'ably';

	interface Message {
		ID: number;
		Title: string;
	}

	let messages: Message[] = [];

	async function setupPage() {
		await fetchData();
		await subscribeToAbly();
	}

	async function subscribeToAbly() {
		const KEY = (await (await fetch('/api/keys')).json()).key;
		console.log(KEY);
		const ably = new Ably.Realtime.Promise({ key: KEY });
		await ably.connection.once('connected');
		console.log('Connected to ably');
		const channel = ably.channels.get('test');

		channel.subscribe((message) => {
			console.log(`Message received from ably: ${message}`);
			const newElement = JSON.parse(message.data).object as Message;
			console.log(`newElement: ${JSON.stringify(newElement)}`);
			console.log(`Checking against list: ${JSON.stringify(messages)}`);
			let messageToChange = messages.findIndex((message) => message.ID == newElement.ID);
			if (messageToChange == -1) {
				console.log(`Failed getting element from list, with id: ${newElement.ID}`);
				fetchData();
				return;
			}
			messages[messageToChange].Title = newElement.Title;
			console.log('Updated message!');
		});

		onDestroy(async () => {
			await channel.detach();
			ably.close();
		});
	}

	async function fetchData() {
		let response = await fetch(`/api/testDB`);
		console.log(response);
		messages = (await response.json()).messages;
	}
</script>

<h1>Welcome to SvelteKit</h1>
This is testing the pull request creation...

<!-- {#await setupPage()} -->
<!-- 	<p>loading</p> -->
<!-- {:then} -->
<!-- 	{#each messages as message} -->
<!-- 		<li>{message.ID}. {message.Title}</li> -->
<!-- 	{/each} -->
<!-- {:catch error} -->
<!-- 	<p style="color: red">{error.message}</p> -->
<!-- {/await} -->
