import { authStorage } from "@/lib/authStorage";
import axiosInstance from "@/lib/axiosInstance";

const LOGOUT_PATH = "/api/v1/teams/auth/logout";

export type LogoutAPIOptions = {
	/** AuthContext `clearSession` — clears storage + React auth state. */
	clearSession?: () => void;
};

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
