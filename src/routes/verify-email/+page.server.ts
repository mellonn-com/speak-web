import { db } from "$lib/db/database";
import { users } from "$lib/db/schema";
import { workos } from "$lib/workos";
import { verifyEmailSchema } from "$lib/zod/schema";
import { error, type Actions } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { fail, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";

export const load = async ({ url }) => {
    const userId = url.searchParams.get("userId");

    if (!userId) {
        console.log(userId)
        return error(404, "ID is not valid.");
    }

    const form = await superValidate(zod(verifyEmailSchema));
    return { form, userId };
}

export const actions = {
    default: async (request) => {
        const form = await superValidate(request, zod(verifyEmailSchema));
        console.log(form);

        if (!form.valid) {
            return fail(400, { form })
        }

        const user = (await db.select().from(users).where(eq(users.id, form.data.userId)))[0];

        if (!user) {
            return fail(404, { form })
        }

        console.log(user.workosID);
        workos.userManagement.verifyEmail({
            code: form.data.code,
            userId: user.workosID,
        });
    },
} satisfies Actions;
