import { authStorage } from "@/lib/authStorage";
import axiosInstance from "@/lib/axiosInstance";

const LOGOUT_PATH = "/api/v1/customers/auth/logout";

export type LogoutAPIOptions = {
	/** AuthContext `clearSession` — clears storage + React auth state. */
	clearSession?: () => void;
};

/**
 * Call logout API, then clear local session. Redirect should be done by the caller.
 * Still clears session if the API fails (e.g. expired token).
 * Pass `clearSession` from `useAuthStatus()` so context stays in sync.
 *
 * Request shape: `Authorization: Bearer <access token>` header, body `{ refresh_token }`.
 */
export async function logoutAPIAction(
	options?: LogoutAPIOptions,
): Promise<{ ok: boolean }> {
	try {
		const accessToken = authStorage.getAccessToken();
		const refreshToken = authStorage.getRefreshToken();

		await axiosInstance.post(
			LOGOUT_PATH,
			refreshToken ? { refresh_token: refreshToken } : {},
			{
				headers: {
					...(accessToken && {
						Authorization: `Bearer ${accessToken}`,
					}),
				},
			},
		);
		return { ok: true };
	} catch {
		return { ok: false };
	} finally {
		if (options?.clearSession) {
			options.clearSession();
		} else {
			authStorage.clearSession();
		}
	}
}
