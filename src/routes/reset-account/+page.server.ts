import { userResetSchema } from "$lib/zod/schema";
import type { Actions } from "../$types";
import { fail, message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";

export const load = async () => {
    const form = await superValidate(zod(userResetSchema));
    return { form };
}

export const actions = {
    default: async ({ request }) => {
        const form = await superValidate(request, zod(userResetSchema));
        console.log(form);

        if (!form.valid) {
            return fail(400, { form })
        }

        // TODO: Attempt to sign in, if it fails, handle wrong password.
        return message(form, "Reset mail successfully sent");
    },
} satisfies Actions;
