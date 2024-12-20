import { json } from '@sveltejs/kit';
import { users, type InsertUser } from '$lib/db/schema';
import { db } from '$lib/db/database';

export async function GET() {
	console.log('Getting users');
	const result = await db.select().from(users);
	console.log(`Result: ${JSON.stringify(result)}`);
	return json(result);
}

export async function POST(event: any) {
	const request = event.request as Request;
	let newUser: InsertUser;
	newUser = (await request.json()) as InsertUser;

	console.log(`Adding new test: ${JSON.stringify(newUser)}`);

	await db.insert(users).values(newUser);

	return json(newUser);
}
