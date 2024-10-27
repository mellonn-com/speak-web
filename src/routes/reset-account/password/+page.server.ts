import { passwordResetSchema } from '$lib/zod/schema';
import { fail, message, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from '../$types';
import { redirect, type Actions } from '@sveltejs/kit';
import { workos } from '$lib/workos';
import { WORKOS_CLIENT_ID } from '$env/static/private';
import { NotFoundException } from '@workos-inc/node';

export const load: PageServerLoad = async ({ url, cookies }) => {
	const token = url.searchParams.get('token');
	if (!token) {
		return redirect(307, '/login');
	}
	cookies.set('token', token, { path: '/' });
	const form = await superValidate(zod(passwordResetSchema));
	return { form };
};

export const actions = {
	default: async ({ request, cookies }) => {
		const form = await superValidate(request, zod(passwordResetSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			const token = cookies.get('token');
			cookies.delete('token', { path: '/' });
			if (!token) {
				return setError(
					form,
					'token',
					'Some unknown error happened, please try resetting your password again.'
				);
			}
			await workos.userManagement.resetPassword({ token: token, newPassword: form.data.password });

			const email = cookies.get('email');
			cookies.delete('email', { path: '/' });
			if (!email) {
				return message(form, 'Password reset successfully!');
			}
			const { accessToken, refreshToken } = await workos.userManagement.authenticateWithPassword({
				clientId: WORKOS_CLIENT_ID,
				email: email,
				password: form.data.password
			});

			cookies.set('access_token', accessToken, { path: '/' });
			cookies.set('refresh_token', refreshToken, { path: '/', secure: true });
		} catch (err) {
			if (err instanceof NotFoundException) {
				if (err.code === 'password_reset_token_not_found') {
					console.log('Token not found');
					return setError(
						form,
						'token',
						'This link have expired, please try resetting your password again.'
					);
				}
			}
			console.log(err);
			return fail(500, { form });
		}
		return redirect(307, '/');
	}
} satisfies Actions;
