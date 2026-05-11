export type LanguageCode = "en" | "swe";

export const DEFAULT_LANGUAGE: LanguageCode = "swe";

export const LANGUAGE_CODES: Record<LanguageCode, LanguageCode> = {
  en: "en",
  swe: "swe",
} as const;

export const LANGUAGE_LABELS: Record<LanguageCode, string> = {
  en: "English",
  swe: "Svenska",
};
export const OTP_TYPE = {
	FORGOT_PASSWORD: "forgot_password",
	RESET_PASSWORD: "reset_password",
	VERIFY_EMAIL: "verify_email",
} as const;

export const AVAILABLE_LANGUAGES = Object.entries(LANGUAGE_LABELS).map(
  ([code, label]) => ({
    code: code as LanguageCode,
    label,
  })
);

export const MODAL_CONSTANTS = {
  LOGIN_BANKID: "login_bankid",
} as const;

export type ModalType = (typeof MODAL_CONSTANTS)[keyof typeof MODAL_CONSTANTS];
