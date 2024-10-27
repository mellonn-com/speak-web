import { WORKOS_CLIENT_ID } from '$env/static/private';
import { db } from '$lib/db/database';
import { users } from '$lib/db/schema';
import { workos } from '$lib/workos';
import { verifyEmailSchema } from '$lib/zod/schema';
import { error, type Actions } from '@sveltejs/kit';
import { GenericServerException } from '@workos-inc/node';
import { eq } from 'drizzle-orm';
import { fail, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async ({ url }) => {
	const userId = url.searchParams.get('userId');

	if (!userId) {
		console.log(userId);
		return error(404, 'ID is not valid.');
	}

	const form = await superValidate(zod(verifyEmailSchema));
	return { form, userId };
};

export const actions = {
	default: async ({ request, cookies }) => {
		const form = await superValidate(request, zod(verifyEmailSchema));
		console.log(form);

		if (!form.valid) {
			return fail(400, { form });
		}

		const dbUser = (await db.select().from(users).where(eq(users.id, form.data.userId)))[0];

		if (!dbUser) {
			return fail(404, { form });
		}

		try {
			console.log(dbUser.workosID);
			await workos.userManagement.verifyEmail({
				code: form.data.code,
				userId: dbUser.workosID
			});

			const password = cookies.get('password');
			const { user, accessToken, refreshToken } =
				await workos.userManagement.authenticateWithPassword({
					clientId: WORKOS_CLIENT_ID,
					email: dbUser.email!,
					password: password!
				});
			console.log(JSON.stringify(user));

			cookies.set('access_token', accessToken, { path: '/' });
			cookies.set('refresh_token', refreshToken, { path: '/', secure: true });
		} catch (err) {
			if (err instanceof GenericServerException) {
				const data: any = err.rawData;
				console.log(data);
				if (
					data['code'] == 'email_verification_code_expired' ||
					data['code'] == 'email_verification_too_many_attempts'
				) {
					await workos.userManagement.sendVerificationEmail({ userId: dbUser.workosID });
					return setError(form, 'Verification code has expired, a new one has been sent.');
				} else {
					return setError(form, data['message']);
				}
			}
			return fail(500, { form });
		}
	}
} satisfies Actions;
