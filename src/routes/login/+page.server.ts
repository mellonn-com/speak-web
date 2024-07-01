import type { Actions } from "../$types";
import { userLoginSchema } from "$lib/zod/schema";
import { fail, message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { workos } from "$lib/workos";
import { WORKOS_CLIENT_ID } from "$env/static/private";

export const load = async () => {
    const form = await superValidate(zod(userLoginSchema));
    return { form };
}

export const actions = {
    default: async ({ request }) => {
        const form = await superValidate(request, zod(userLoginSchema));
        console.log(form);

        if (!form.valid) {
            return fail(400, { form })
        }

        const { user } = await workos.userManagement.authenticateWithPassword({
            clientId: WORKOS_CLIENT_ID,
            email: form.data.email,
            password: form.data.password
        });

        if (!user) {
            return fail(500, { form });
        }
        console.log(JSON.stringify(user));

        // TODO: redirect to email verification if needed, or redirect to app page.
        return message(form, "Successfully signed in");
    },
} satisfies Actions;
