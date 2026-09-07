import { request } from "@/utils/request";
import { ApiError } from "@/utils/request/request.types";

export type LandingAccountType = "customer" | "professional";

type HandoffLoginData = { code: string };
type SetPasswordData = { email: string; need_set_password: true };
type UnverifiedData = { email: string; is_verified: false };

export type LoginWithHandoffResult =
  | { status: "handoff"; code: string }
  | { status: "set_password"; message: string }
  | { status: "unverified"; message: string }
  | { status: "error"; message: string };

const LOGIN_PATH: Record<LandingAccountType, string> = {
  customer: "/v1/customers/auth/login",
  professional: "/v1/professionals/auth/login",
};

/**
 * Log in against the backend and, on success, get back a single-use
 * handoff code (never the raw tokens) instead of a session — the
 * caller redirects the browser to the owning portal's /auth/callback
 * with that code so the user lands there already signed in.
 */
export async function loginWithHandoff(
  accountType: LandingAccountType,
  email: string,
  password: string
): Promise<LoginWithHandoffResult> {
  try {
    const response = await request.post<
      HandoffLoginData | SetPasswordData | UnverifiedData
    >(
      LOGIN_PATH[accountType],
      { email, password, handoff: true },
      { skipAuth: true }
    );

    const data = response.data;

    if (data && "need_set_password" in data) {
      return { status: "set_password", message: response.message };
    }
    if (data && "is_verified" in data) {
      return { status: "unverified", message: response.message };
    }
    if (data && "code" in data && data.code) {
      return { status: "handoff", code: data.code };
    }

    return { status: "error", message: response.message };
  } catch (error) {
    const message =
      error instanceof ApiError ? error.message : "Inloggningen misslyckades. Försök igen.";
    return { status: "error", message };
  }
}
