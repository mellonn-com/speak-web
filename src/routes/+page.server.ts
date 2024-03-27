import { neon, type NeonQueryFunction } from '@neondatabase/serverless';
import type { Actions, PageServerLoad } from './$types'
import { drizzle } from 'drizzle-orm/neon-http';
import { users, type InsertUser } from '$lib/db/schema';
import { v4 as uuidv4 } from 'uuid';

const sql = neon(process.env.DATABASE_URL!) as NeonQueryFunction<boolean, boolean>;
const db = drizzle(sql);

export const load: PageServerLoad = async ({ }) => {
    const result = db.select().from(users);
    return {
        users: result
    };
};

export const actions = {
    default: async (event) => {
        const id: string = uuidv4();
        let newUser: InsertUser;
        const data = await event.request.formData();
        console.log(data)
        newUser = {
            id: id,
            email: data.get("email")?.toString(),
            firstName: data.get("firstName")?.toString(),
            lastName: data.get("lastName")?.toString()
        };

        console.log(`Adding new user: ${JSON.stringify(newUser)}`);

        await db.insert(users).values(newUser);

        return { success: true };
    },
} satisfies Actions;
