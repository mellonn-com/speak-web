import { workos } from "$lib/workos";
import { userResetSchema } from "$lib/zod/schema";
import type { Actions, PageServerLoad } from "../$types";
import { fail, message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";

export const load: PageServerLoad = async () => {
    const form = await superValidate(zod(userResetSchema));
    return { form };
}

export const actions = {
    default: async ({ request, cookies }) => {
        const form = await superValidate(request, zod(userResetSchema));

        if (!form.valid) {
            return fail(400, { form })
        }

        try {
            cookies.set("email", form.data.email, { path: "/", secure: true });
            await workos.userManagement.createPasswordReset({ email: form.data.email })
        } catch (err) {
            console.log(err)
            return fail(500, { form })
        }
        return message(form, "Reset mail successfully sent!");
    },
} satisfies Actions;
