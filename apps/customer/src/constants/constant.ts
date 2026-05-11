export type LanguageCode = "en" | "sv";

export const DEFAULT_LANGUAGE: LanguageCode = "sv";

export const LANGUAGE_CODES: Record<LanguageCode, LanguageCode> = {
	en: "en",
	sv: "sv",
} as const;

export const LANGUAGE_LABELS: Record<LanguageCode, string> = {
	en: "English",
	sv: "Svenska",
};

export const MODAL_CONSTANTS = {
	LOGIN_BANKID: "login_bankid",
	NEW_INVITATION: "newInvitation",
	APPROVE: "approve",
	REJECT: "reject",
	ARCHIVE: "archive",
	DELETE: "delete",
} as const;

export const OTP_TYPE = {
	FORGOT_PASSWORD: "forgot_password",
	VERIFY_EMAIL: "verify_email",
} as const;

export const AVAILABLE_LANGUAGES = Object.entries(LANGUAGE_LABELS).map(
	([code, label]) => ({
		code: code as LanguageCode,
		label,
	}),
);

export type ModalType = (typeof MODAL_CONSTANTS)[keyof typeof MODAL_CONSTANTS];
