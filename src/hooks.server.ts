import { WORKOS_CLIENT_ID } from "$env/static/private";
import { workos } from "$lib/workos";
import { redirect, type Handle, type RequestEvent } from "@sveltejs/kit";
import * as jose from 'jose';

export const handle: Handle = async ({ event, resolve }) => {
	const loginPaths = ["/login", "/reset-account", "verify-email", "create-account"];
	const accessToken = event.cookies.get("access_token");

	if (!accessToken) {
		clearCookies(event);
		if (event.route.id == "/login") {
			return resolve(event);
		}
		return redirect(307, '/login');
	}

	let jwt = jose.decodeJwt(accessToken);
	console.log("JWT:")
	console.log(JSON.stringify(jwt));

	const expiry = new Date(jwt.exp! * 1000);
	if (expiry <= new Date()) {
		const refreshToken = event.cookies.get("refresh_token");
		if (!refreshToken) {
			clearCookies(event);
			if (event.route.id == "/login") {
				return resolve(event);
			}
			return redirect(307, "/login");
		}

		try {
			const newTokens = await workos.userManagement.authenticateWithRefreshToken({
				clientId: WORKOS_CLIENT_ID,
				refreshToken: refreshToken,
			});
			event.cookies.set("access_token", newTokens.accessToken, { path: "/" });
			event.cookies.set("refresh_token", newTokens.refreshToken, { path: "/", secure: true });
			jwt = jose.decodeJwt(newTokens.accessToken);
		} catch (err) {
			console.error(`New tokens error: ${err}`);
			clearCookies(event);
			if (event.route.id == "/login") {
				return resolve(event);
			}
			return redirect(307, "/login");
		}
	}

	try {
		const jwksUrl = workos.userManagement.getJwksUrl(WORKOS_CLIENT_ID);

		const JWKS = jose.createRemoteJWKSet(new URL(jwksUrl));
		// console.log(JWKS)
		const { payload, protectedHeader } = await jose.jwtVerify(accessToken, JWKS)
		console.log(protectedHeader)
		console.log(payload)

		if (loginPaths.includes(event.route.id!)) {
			throw "login"
		}

		return resolve(event);
	} catch (err) {
		if (err == "login") {
			return redirect(307, "/");
		}
		clearCookies(event);
		if (event.route.id == "/login") {
			return resolve(event);
		}
		return redirect(307, "/login");
	}
};

function clearCookies(event: RequestEvent<Partial<Record<string, string>>, string | null>) {
	event.cookies.delete("access_token", { path: "/" });
	event.cookies.delete("refresh_token", { path: "/" });
	event.cookies.delete("email", { path: "/" });
	event.cookies.delete("password", { path: "/" });
}