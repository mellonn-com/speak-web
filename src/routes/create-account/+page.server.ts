import type { Actions } from './$types'
import { users, type InsertUser } from '$lib/db/schema';
import { v4 as uuidv4 } from 'uuid';
import { db } from '$lib/db/database';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { userCreateSchema } from '$lib/zod/schema';

export const load = async () => {
    const form = await superValidate(zod(userCreateSchema));
    return { form };
}

export const actions = {
    default: async (request) => {
        const form = await superValidate(request, zod(userCreateSchema));
        console.log(form);

        if (!form.valid) {
            return fail(400, { form })
        }

        const id: string = uuidv4();
        let newUser: InsertUser;
        newUser = {
            id: id,
            email: form.data.email,
            firstName: form.data.firstName,
            lastName: form.data.lastName
        };

        console.log(`Adding new user: ${JSON.stringify(newUser)}`);

        await db.insert(users).values(newUser);

        return message(form, "User created");
    },
} satisfies Actions;
