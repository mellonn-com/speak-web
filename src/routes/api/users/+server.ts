import { json } from "@sveltejs/kit";
import { users, type InsertUser } from "$lib/db/schema";
import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import { drizzle } from 'drizzle-orm/neon-http';

const sql = neon(process.env.DATABASE_URL!) as NeonQueryFunction<boolean, boolean>;
const db = drizzle(sql);

export async function GET() {
    const result = await db.select().from(users);
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
