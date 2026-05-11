import { appConstants } from "@/constants/api";

const NAME = appConstants.LOCAL_SESSION_HINT_COOKIE_NAME;
const MAX_AGE_SEC = 60 * 60 * 24 * 30;

/**
 * Non-secret hint for middleware: user likely has tokens in localStorage.
 * Set/cleared with authStorage token lifecycle.
 */
export function setSessionHintCookie(hasSession: boolean): void {
	if (typeof document === "undefined") return;
	if (hasSession) {
		document.cookie = `${NAME}=1; path=/; max-age=${MAX_AGE_SEC}; SameSite=Lax`;
	} else {
		document.cookie = `${NAME}=; path=/; max-age=0`;
	}
}

export function clearSessionHintCookie(): void {
	setSessionHintCookie(false);
}
