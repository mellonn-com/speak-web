import { WORKOS_API_KEY } from '$env/static/private';
import { WorkOS } from '@workos-inc/node';

export const workos = new WorkOS(WORKOS_API_KEY);
