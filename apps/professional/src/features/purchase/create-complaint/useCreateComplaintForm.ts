"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { useAuthStatus } from "@/context/AuthContext";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { PURCHASE_MODULE_BASE_URL } from "../data/purchaseNav.config";
import {
	collectComplaintErrors,
	complaintContactStepSchema,
	complaintReportStepSchema,
} from "./schema";
import {
	EMPTY_COMPLAINT_COMPANY,
	EMPTY_COMPLAINT_CONTACT,
	type ComplaintCompany,
	type ComplaintContact,
	type ComplaintDraft,
	type ComplaintInfo,
	type ComplaintReport,
} from "./types";
import { usePurchaseOptions } from "./usePurchaseOptions";

export type ComplaintStep = 1 | 2;

/**
 * Draft state, validation and submission for the complaint wizard.
 *
 * Split out of the page so the component is layout and wiring only, and so the
 * step transitions can be exercised without mounting the whole form.
 */
export function useCreateComplaintForm(prefillPurchaseNo?: string) {
	const { t } = useTranslation();
	const router = useRouter();
	const { company } = useAuthStatus();
	const { initialInfo, findPurchase, ...options } =
		usePurchaseOptions(prefillPurchaseNo);

	const [step, setStep] = useState<ComplaintStep>(1);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [draft, setDraft] = useState<ComplaintDraft>(() => ({
		info: initialInfo,
		supplierId: "",
		supplier: { ...EMPTY_COMPLAINT_COMPANY },
		supplierContact: { ...EMPTY_COMPLAINT_CONTACT },
		reporter: { ...EMPTY_COMPLAINT_COMPANY },
		reporterContact: { ...EMPTY_COMPLAINT_CONTACT },
		report: {
			title: "",
			description: "",
			discoveredAt: "",
			deliveredAt: "",
			priority: "high",
			gdprAccepted: false,
		},
	}));

	const listHref = `${PURCHASE_MODULE_BASE_URL}/complaints`;

	const patchInfo = useCallback(
		(patch: Partial<ComplaintInfo>) =>
			setDraft((previous) => ({
				...previous,
				info: { ...previous.info, ...patch },
			})),
		[],
	);

	const patchCompany = useCallback(
		(key: "supplier" | "reporter") =>
			(patch: Partial<ComplaintCompany>) =>
				setDraft((previous) => ({
					...previous,
					[key]: { ...previous[key], ...patch },
				})),
		[],
	);

	const patchContact = useCallback(
		(key: "supplierContact" | "reporterContact") =>
			(patch: Partial<ComplaintContact>) =>
				setDraft((previous) => ({
					...previous,
					[key]: { ...previous[key], ...patch },
				})),
		[],
	);

	const patchReport = useCallback(
		(patch: Partial<ComplaintReport>) =>
			setDraft((previous) => ({
				...previous,
				report: { ...previous.report, ...patch },
			})),
		[],
	);

	const setSupplierId = useCallback(
		(supplierId: string) =>
			setDraft((previous) => ({ ...previous, supplierId })),
		[],
	);

	/**
	 * Links the complaint to a purchase. Choosing one fills the descriptive
	 * fields, but they stay editable — and a value typed by hand is kept as-is.
	 */
	const selectPurchase = useCallback(
		(purchaseNo: string) => {
			const match = findPurchase(purchaseNo);
			patchInfo(
				match
					? { purchaseNo, name: match.name, object: match.object }
					: { purchaseNo },
			);
		},
		[findPurchase, patchInfo],
	);

	const cancel = useCallback(() => router.push(listHref), [listHref, router]);

	const validateStep1 = useCallback(() => {
		const result = complaintContactStepSchema.safeParse({
			info: { complaintType: draft.info.complaintType },
			supplierId: draft.supplierId,
			supplier: draft.supplier,
			supplierContact: draft.supplierContact,
			reporter: draft.reporter,
			reporterContact: draft.reporterContact,
		});

		if (result.success) {
			setErrors({});
			return true;
		}

		setErrors(collectComplaintErrors(result.error));
		return false;
	}, [draft]);

	const validateStep2 = useCallback(() => {
		const result = complaintReportStepSchema.safeParse(draft.report);

		if (result.success) {
			setErrors({});
			return true;
		}

		setErrors(collectComplaintErrors(result.error, "report"));
		return false;
	}, [draft.report]);

	const goNext = useCallback(() => {
		if (validateStep1()) setStep(2);
	}, [validateStep1]);

	const submit = useCallback(() => {
		if (!validateStep1()) {
			setStep(1);
			return;
		}
		if (!validateStep2()) return;

		/**
		 * Scoped to the signed-in company, which is this codebase's isolation
		 * unit — there is no `tenant_id` anywhere in the frontend yet.
		 */
		void { ...draft, companyId: company?.id ?? null };

		showToast(
			"success",
			t(localizationConstants.complaintCreateSentToast),
		);
		router.push(listHref);
	}, [company, draft, listHref, router, t, validateStep1, validateStep2]);

	/** Per-block error maps, in the shape the cards expect. */
	const blockErrors = useMemo(
		() => ({
			contact: (block: "supplierContact" | "reporterContact") =>
				Object.fromEntries(
					Object.entries(errors)
						.filter(([key]) => key.startsWith(`${block}.`))
						.map(([key, message]) => [key.split(".")[1], message]),
				) as Partial<Record<keyof ComplaintContact, string>>,
			company: (block: "supplier" | "reporter") =>
				Object.fromEntries(
					Object.entries(errors)
						.filter(([key]) => key.startsWith(`${block}.`))
						.map(([key, message]) => [key.split(".")[1], message]),
				) as Partial<Record<keyof ComplaintCompany, string>>,
		}),
		[errors],
	);

	return {
		...options,
		step,
		setStep,
		draft,
		errors,
		blockErrors,
		listHref,
		patchInfo,
		patchCompany,
		patchContact,
		patchReport,
		setSupplierId,
		selectPurchase,
		goNext,
		submit,
		cancel,
	};
}
