import type { Actions } from '../$types';
import { userLoginSchema } from '$lib/zod/schema';
import { fail, message, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { workos } from '$lib/workos';
import { WORKOS_CLIENT_ID } from '$env/static/private';
import { GenericServerException } from '@workos-inc/node';
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/db/database';
import { type SelectUser, users } from '$lib/db/schema';
import { eq } from 'drizzle-orm';

export const load = async () => {
	const form = await superValidate(zod(userLoginSchema));
	return { form };
};

export const actions = {
	default: async ({ request, cookies }) => {
		const form = await superValidate(request, zod(userLoginSchema));
		console.log(form);

		if (!form.valid) {
			return fail(400, { form });
		}

		const dbUser: SelectUser = (
			await db.select().from(users).where(eq(users.email, form.data.email))
		)[0];

		if (!dbUser) {
			return setError(form, 'email', "User with this email doesn't exist.");
		}

		try {
			const { accessToken, refreshToken } = await workos.userManagement.authenticateWithPassword({
				clientId: WORKOS_CLIENT_ID,
				email: form.data.email,
				password: form.data.password
			});

			cookies.set('access_token', accessToken, { path: '/' });
			cookies.set('refresh_token', refreshToken, { path: '/', secure: true });
		} catch (err) {
			if (err instanceof GenericServerException) {
				const data: any = err.rawData;
				console.log(data);
				if (data['code'] == 'email_verification_required') {
					console.log('Verification needed!!');
					cookies.set('email', form.data.email, { path: '/', secure: true });
					cookies.set('password', form.data.password, { path: '/', secure: true });
					return redirect(300, `/verify-email?userId=${dbUser.id}`);
				}
			}
			return fail(500, { form });
		}

		return redirect(307, '/');
	}
} satisfies Actions;
