import { fail } from "@sveltejs/kit";
import type { Actions } from "../$types";
import { users, type SelectUser } from "$lib/db/schema";
import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";

const sql = neon(process.env.DATABASE_URL!) as NeonQueryFunction<boolean, boolean>;
const db = drizzle(sql);

export const actions = {
    login: async ({ request }) => {
        const data = await request.formData();
        const email = data.get('email');
        const password = data.get('password');

        if (!email) {
            return fail(400, { email, missing: true });
        }

        const user: SelectUser = (await db.select().from(users).where(eq(users.email, email.toString())))[0];

        if (!user) {
            return fail(400, { user, missing: true });
        }
        return { success: true };
    },
} satisfies Actions;
