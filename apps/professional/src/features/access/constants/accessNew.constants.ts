import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import type { AccessFieldError } from "../types/accessNew.types";

/** The message shown under a field for each kind of error. */
export const ACCESS_ERROR_KEYS: Record<AccessFieldError, TranslationKeys> = {
	required: localizationConstants.accessErrorRequired,
	tooLong: localizationConstants.accessErrorTooLong,
	postalCode: localizationConstants.accessErrorPostalCode,
	email: localizationConstants.accessErrorEmail,
	dateOrder: localizationConstants.accessErrorDateOrder,
	duplicate: localizationConstants.accessErrorDuplicate,
	noTags: localizationConstants.accessErrorNoTags,
};

/** Select value standing for "nothing chosen"; never a real option. */
export const ACCESS_NO_SELECTION = "none";

/** Number format of the price columns: a space between thousands, as in the Figma frame ("158 000"). */
export const ACCESS_NUMBER_LOCALE = "sv-SE";
