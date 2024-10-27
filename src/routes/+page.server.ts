import type { Actions, PageServerLoad } from './$types';
import { users } from '$lib/db/schema';
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/db/database';

export const load: PageServerLoad = async ({}) => {
	const result = await db.select().from(users);
	return {
		users: result
	};
};

export const actions = {
	signOut: async (event) => {
		event.cookies.delete('access_token', { path: '/' });
		event.cookies.delete('refresh_token', { path: '/' });
		event.cookies.delete('email', { path: '/' });
		event.cookies.delete('password', { path: '/' });

		return redirect(307, '/login');
	}
} satisfies Actions;
