import { t } from "i18next";
import localizationConstants from "@/utils/translation/constants";

/**
 * Centralized user-facing messages for the API actions (toasts and returned errors).
 * Each value is a getter that translates on read, so the text follows the current
 * UI language. The copy itself lives in the localization files (sv.ts / en.ts).
 */
export const authMessages = {
	login: {
		get success() {
			return t(localizationConstants.authLoginSuccess);
		},
		get failed() {
			return t(localizationConstants.authLoginFailed);
		},
		get invalidResponse() {
			return t(localizationConstants.errorInvalidServerResponse);
		},
		get tokenNotReceived() {
			return t(localizationConstants.authTokenNotReceived);
		},
	},
	register: {
		get success() {
			return t(localizationConstants.authRegisterSuccess);
		},
		get failed() {
			return t(localizationConstants.authRegisterFailed);
		},
		get invalidResponse() {
			return t(localizationConstants.errorInvalidServerResponse);
		},
	},
	forgotPassword: {
		get success() {
			return t(localizationConstants.authForgotPasswordSuccess);
		},
		get failed() {
			return t(localizationConstants.authForgotPasswordFailed);
		},
	},
	validateOTP: {
		get success() {
			return t(localizationConstants.authOtpVerifiedSuccess);
		},
		get failed() {
			return t(localizationConstants.authOtpInvalid);
		},
	},
	resetPassword: {
		get success() {
			return t(localizationConstants.authPasswordResetSuccess);
		},
		get failed() {
			return t(localizationConstants.authPasswordResetFailed);
		},
	},
	verifyEmail: {
		get success() {
			return t(localizationConstants.authEmailVerifiedSuccess);
		},
		get failed() {
			return t(localizationConstants.authEmailVerificationFailed);
		},
	},
};

export const projectMessages = {
	save: {
		get success() {
			return t(localizationConstants.projectSavedSuccess);
		},
		get failed() {
			return t(localizationConstants.projectSaveFailed);
		},
		get invalidResponse() {
			return t(localizationConstants.errorInvalidServerResponse);
		},
	},
	archive: {
		get success() {
			return t(localizationConstants.projectArchivedSuccess);
		},
		get failed() {
			return t(localizationConstants.projectArchiveFailed);
		},
	},
	load: {
		get projectFailed() {
			return t(localizationConstants.projectLoadFailed);
		},
		get listFailed() {
			return t(localizationConstants.projectListLoadFailed);
		},
		get documentsFailed() {
			return t(localizationConstants.projectDocumentsLoadFailed);
		},
	},
	delete: {
		get success() {
			return t(localizationConstants.projectDeletedSuccess);
		},
		get failed() {
			return t(localizationConstants.projectDeleteFailed);
		},
	},
};

export const kmaMessages = {
	load: {
		get documentsFailed() {
			return t(localizationConstants.kmaDocumentsLoadFailed);
		},
		get controlsFailed() {
			return t(localizationConstants.kmaControlsLoadFailed);
		},
		get foldersFailed() {
			return t(localizationConstants.kmaFoldersLoadFailed);
		},
		get secureChecksFailed() {
			return t(localizationConstants.kmaSecureChecksLoadFailed);
		},
		get deviationsFailed() {
			return t(localizationConstants.kmaDeviationsLoadFailed);
		},
	},
};

export const companyMessages = {
	activeInactiveUser: {
		get success() {
			return t(localizationConstants.userStatusUpdatedSuccess);
		},
		get failed() {
			return t(localizationConstants.userStatusUpdateFailed);
		},
	},
};
