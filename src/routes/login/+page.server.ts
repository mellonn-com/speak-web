import type { Actions } from "../$types";
import { userLoginSchema } from "$lib/zod/schema";
import { fail, message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { workos } from "$lib/workos";
import { WORKOS_CLIENT_ID } from "$env/static/private";
import { GenericServerException } from "@workos-inc/node";

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

        try {
            const { user } = await workos.userManagement.authenticateWithPassword({
                clientId: WORKOS_CLIENT_ID,
                email: form.data.email,
                password: form.data.password
            });
            console.log(JSON.stringify(user));
        } catch (err) {
            if (err instanceof GenericServerException) {
                const data: any = err.rawData;
                console.log(data)
                if (data["code"] == "email_verification_required") {
                    console.log("Verification needed!!");
                }
            }
            return fail(500, { form });
        }

        // TODO: redirect to email verification if needed, or redirect to app page.
        return message(form, "Successfully signed in");
    },
} satisfies Actions;
