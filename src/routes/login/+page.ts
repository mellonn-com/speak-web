import { fail } from "@sveltejs/kit";
import type { Actions } from "../$types";
import { users, type SelectUser } from "$lib/db/schema";
import { eq } from "drizzle-orm";
import { db } from "$lib/db/database";

export const actions = {
    login: async ({ request }) => {
        const data = await request.formData();
        const email = data.get('email');
        const password = data.get('password');

        if (!email) {
            return fail(400, { email, missing: true });
        }

        // Checks if user actually exists
        const user: SelectUser = (await db.select().from(users).where(eq(users.email, email.toString())))[0];

        if (!user) {
            return fail(400, { email, incorrect: true });
        }

        // TODO: Attempt to sign in, if it fails, handle wrong password.
        return { success: true };
    },
} satisfies Actions;
