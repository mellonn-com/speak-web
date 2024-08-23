import { WORKOS_CLIENT_ID } from "$env/static/private";
import { workos } from "$lib/workos";
import { redirect, type Handle } from "@sveltejs/kit";
import * as jose from 'jose';

export const handle: Handle = async ({ event, resolve }) => {
	const accessToken = event.cookies.get("access_token");

	if (!accessToken) {
		redirect(300, '/login');
	}

	const jwt = jose.decodeJwt(accessToken);
	console.log("JWT:")
	console.log(JSON.stringify(jwt));

	if (new Date(jwt.exp!) > new Date()) {
		console.log("Expired")
	}

	const jwksUrl = workos.userManagement.getJwksUrl(WORKOS_CLIENT_ID);
	console.log(jwksUrl);

	const JWKS = jose.createRemoteJWKSet(new URL(jwksUrl));
	const { payload, protectedHeader } = await jose.jwtVerify(accessToken, JWKS)
	console.log(protectedHeader)
	console.log(payload)

	const response = resolve(event);
	return response;
};
