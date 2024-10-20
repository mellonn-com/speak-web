import { WORKOS_CLIENT_ID } from "$env/static/private";
import { workos } from "$lib/workos";
import { userResetSchema } from "$lib/zod/schema";
import { GenericServerException } from "@workos-inc/node";
import type { Actions } from "../$types";
import { fail, message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { redirect } from "@sveltejs/kit";

export const load = async () => {
    const form = await superValidate(zod(userResetSchema));
    return { form };
}

export const actions = {
    default: async ({ request, cookies }) => {
        const form = await superValidate(request, zod(userResetSchema));
        console.log(form);

        if (!form.valid) {
            return fail(400, { form })
        }

        const email = cookies.get("email");
        const password = cookies.get("password");
        if (!email || !password) {
            return fail(400, { form })
        }
        try {
            const { accessToken, refreshToken } = await workos.userManagement.authenticateWithPassword({
                clientId: WORKOS_CLIENT_ID,
                email: email,
                password: password,
            });

            cookies.set("access_token", accessToken, { path: '/' })
            cookies.set("refresh_token", refreshToken, { path: '/', secure: true })
        } catch (err) {
            return fail(500, { form });
        }
        return message(form, "Reset mail successfully sent");
    },
} satisfies Actions;
