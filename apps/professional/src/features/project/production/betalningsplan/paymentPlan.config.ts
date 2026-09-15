import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import type { PaymentAconto, PaymentPlanStatus } from "./types";

/** The longest plan name accepted. */
export const PAYMENT_PLAN_NAME_MAX_LENGTH = 120;

/** The longest Aktivitet or Lyft accepted. */
export const ACONTO_TEXT_MAX_LENGTH = 80;

/** Whole kronor; a larger figure is a typo, not a contract. */
export const AMOUNT_MAX = 999_999_999;

export const PERCENT_MAX = 100;

const MEGABYTE = 1024 * 1024;

/** Per-file ceiling for the contract and the plan's documents. */
export const PAYMENT_PLAN_FILE_MAX_BYTES = 10 * MEGABYTE;

/**
 * The contract attached on create: PDF only. MIME types for the picker's own
 * check, extensions for `checkUploadedFile`, which does not trust the browser's
 * type guess.
 */
export const CONTRACT_FILE_TYPES = ["application/pdf"];
export const CONTRACT_FILE_EXTENSIONS = [".pdf"];

/** Documents on the plan: the frame's "PNG-, JPG- och PDF-filer". */
export const DOCUMENT_FILE_TYPES = ["application/pdf", "image/png", "image/jpeg"];
export const DOCUMENT_FILE_EXTENSIONS = [".pdf", ".png", ".jpg", ".jpeg"];

/** Every document added from the view is a payment plan document. */
export const PLAN_DOCUMENT_TYPE_KEY = localizationConstants.sectionBetalningsplan;

export const PAYMENT_PLAN_STATUS_LABELS: Record<PaymentPlanStatus, TranslationKeys> = {
	draft: localizationConstants.projectPaymentPlanStatusDraft,
	sent: localizationConstants.projectPaymentPlanStatusSent,
};

export const PAYMENT_PLAN_STATUS_FILTER_OPTIONS = (
	Object.keys(PAYMENT_PLAN_STATUS_LABELS) as PaymentPlanStatus[]
).map((value) => ({ value, labelKey: PAYMENT_PLAN_STATUS_LABELS[value] }));

/** The Status badge: the frame's green "Skickad" and amber "Ej skickad". */
export function acontoStatus(aconto: PaymentAconto): {
	labelKey: TranslationKeys;
	sent: boolean;
} {
	return aconto.invoicedDate
		? { labelKey: localizationConstants.projectPaymentPlanStatusSent, sent: true }
		: { labelKey: localizationConstants.projectPaymentPlanAcontoNotSent, sent: false };
}

/**
 * The Ekonomi column: Betald once paid, Ej betald while an invoice is open,
 * and N/A before there is an invoice at all.
 */
export function acontoEconomyKey(aconto: PaymentAconto): TranslationKeys {
	if (!aconto.invoicedDate) {
		return localizationConstants.projectPaymentPlanEconomyNotApplicable;
	}
	return aconto.paid
		? localizationConstants.statusBetald
		: localizationConstants.projectPaymentPlanEconomyUnpaid;
}
