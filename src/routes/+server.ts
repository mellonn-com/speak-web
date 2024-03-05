import { drizzle } from "drizzle-orm/planetscale-serverless";
import { Client } from "@planetscale/database";
import * as schema from "src/db/schema"
import { json } from "@sveltejs/kit";

const client = new Client({
    host: process.env.PLANETSCALE_HOST,
    username: process.env.PLANETSCALE_USERNAME,
    password: process.env.PLANETSCALE_PASSWORD,
});

const db = drizzle(client, { schema });

export function GET() {
    const result = db.select().from(users);
    return json(result);
}
