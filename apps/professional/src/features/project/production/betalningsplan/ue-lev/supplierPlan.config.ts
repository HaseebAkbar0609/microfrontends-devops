import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { canApprove } from "./supplierPlanMath";
import type { SupplierEconomy, SupplierPaymentPlan, SupplierPlanStatus } from "./types";

export const SUPPLIER_STATUS_LABELS: Record<SupplierPlanStatus, TranslationKeys> = {
	approved: localizationConstants.statusGodkand,
	under_review: localizationConstants.statusGranskas,
	not_ready: localizationConstants.statusEjKlar,
};

export const SUPPLIER_STATUS_FILTER_OPTIONS = (
	Object.keys(SUPPLIER_STATUS_LABELS) as SupplierPlanStatus[]
).map((value) => ({ value, labelKey: SUPPLIER_STATUS_LABELS[value] }));

/** Status rank for sorting: approved, then under review, then not ready. */
export const SUPPLIER_STATUS_RANK: Record<SupplierPlanStatus, number> = {
	approved: 0,
	under_review: 1,
	not_ready: 2,
};

export const SUPPLIER_ECONOMY_LABELS: Record<SupplierEconomy, TranslationKeys> = {
	paid: localizationConstants.statusBetald,
	not_due: localizationConstants.projectSupplierPlanNotDue,
	not_applicable: localizationConstants.projectPaymentPlanEconomyNotApplicable,
};

export type SupplierColumnKey = "companyName" | "totalAmount" | "status";

/** The list's columns, in order — also what the header + picker offers. */
export const SUPPLIER_LIST_COLUMNS: { key: SupplierColumnKey; labelKey: TranslationKeys }[] = [
	{ key: "companyName", labelKey: localizationConstants.colForetagsNamn },
	{ key: "totalAmount", labelKey: localizationConstants.colTotal },
	{ key: "status", labelKey: localizationConstants.statusLabel },
];

/**
 * Why a plan cannot be approved, or `null` when it can. The same reasons are
 * shown on the list's ⋮ item and the view's footer.
 */
export function approveBlockedReason(
	plan: Pick<SupplierPaymentPlan, "status" | "documents">,
): TranslationKeys | null {
	if (plan.status === "approved") return localizationConstants.projectSupplierPlanAlreadyApproved;
	if (plan.status === "not_ready") return localizationConstants.projectSupplierPlanNotReady;
	if (!canApprove(plan)) return localizationConstants.projectSupplierPlanReviewFirst;
	return null;
}
