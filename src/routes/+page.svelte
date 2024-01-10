<script lang="ts">
	interface Message {
		ID: number;
		Title: string;
	}

	async function fetchData(): Promise<Message[]> {
		let response = await fetch(`/api/testDB`);
		console.log(response);
		return (await response.json()).messages;
	}
</script>

<h1>Welcome to SvelteKit</h1>

{#await fetchData()}
	<p>loading</p>
{:then items}
	{#each items as item}
		<li>{item.ID}. {item.Title}</li>
	{/each}
{:catch error}
	<p style="color: red">{error.message}</p>
{/await}
