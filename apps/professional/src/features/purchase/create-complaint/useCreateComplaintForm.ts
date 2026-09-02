"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { ROLES } from "@/constants/roles";
import { useAuthStatus } from "@/context/AuthContext";
import { hasPermission } from "@/lib/hasPermission";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { PURCHASE_MODULE_BASE_URL } from "../data/purchaseNav.config";
import { usePurchaseDocuments } from "../hooks/usePurchaseDocuments";
import type {
	PurchaseAgreementDocument,
	PurchaseComplaintStatus,
} from "../types/purchase.types";
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

/** Extensions and size the complaint upload actually accepts. */
export const COMPLAINT_ACCEPT_EXTENSIONS = [
	".png",
	".jpg",
	".jpeg",
	".pdf",
	".doc",
	".docx",
];

export const COMPLAINT_MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

/**
 * Builds the payload a create-complaint endpoint will take.
 *
 * Kept as a pure function, like `buildPurchaseOrderPayload` next door, so the
 * shape is inspectable and testable without mounting the wizard and there is a
 * single obvious call site to swap for the real request.
 *
 * No `complaintNo` is invented here — the server assigns it.
 */
export function buildComplaintPayload(input: {
	draft: ComplaintDraft;
	documents: PurchaseAgreementDocument[];
	companyId: string | null;
	isDraft: boolean;
}) {
	return {
		...input.draft,
		/** New complaints start unsent; the list renders this as "Ej skickad". */
		status: "not_sent" as PurchaseComplaintStatus,
		isDraft: input.isDraft,
		documents: input.documents.map((document) => ({
			id: document.id,
			documentName: document.documentName,
			reference: document.reference,
			fileType: document.fileType,
			date: document.date,
		})),
		/**
		 * The company is this codebase's isolation unit — there is no
		 * `tenant_id` anywhere in the frontend. Whatever consumes this must
		 * still scope server-side; a client-supplied id is a hint, not a
		 * boundary.
		 */
		companyId: input.companyId,
	};
}

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

	/**
	 * Held here rather than inside `ComplaintDocumentsCard`, which owned a
	 * private instance the form could not see — so every attachment was
	 * discarded on submit. Both sibling wizards keep it in the form hook and
	 * pass it down, and this now matches them.
	 */
	const documents = usePurchaseDocuments([], {
		supplier: draft.supplier.company || undefined,
		purchaseNo: draft.info.purchaseNo || undefined,
		reference: draft.info.name || undefined,
		acceptExtensions: COMPLAINT_ACCEPT_EXTENSIONS,
		maxFileSizeBytes: COMPLAINT_MAX_FILE_SIZE_BYTES,
	});

	/**
	 * The buttons are wrapped in `PermissionGate`, but these actions are
	 * reachable from the hook, so they re-check rather than trusting the
	 * rendered tree. This is a guard, not a boundary — the server must enforce
	 * it too.
	 */
	const ensureCanCreate = useCallback(() => {
		if (hasPermission(ROLES.MANAGER, "CREATE_PURCHASE")) return true;
		showToast("error", t(localizationConstants.complaintCreateUnavailable));
		return false;
	}, [t]);

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
		if (!ensureCanCreate()) return;

		if (!validateStep1()) {
			setStep(1);
			return;
		}
		if (!validateStep2()) return;

		// Anything still sitting in the picker is part of what is being sent.
		// `commitPendingFiles` returns the new rows because `documents` has not
		// re-rendered yet.
		const committed = documents.commitPendingFiles();

		void buildComplaintPayload({
			draft,
			documents: [...committed, ...documents.documents],
			companyId: company?.id ?? null,
			isDraft: false,
		});

		showToast(
			"success",
			t(localizationConstants.complaintCreateSentToast),
		);
		router.push(listHref);
	}, [
		company,
		documents,
		draft,
		ensureCanCreate,
		listHref,
		router,
		t,
		validateStep1,
		validateStep2,
	]);

	/**
	 * Spara. A draft is deliberately not validated — a half-filled complaint is
	 * the whole point — so this only checks permission, keeps the attachments
	 * and stays on the page.
	 */
	const saveDraft = useCallback(() => {
		if (!ensureCanCreate()) return;

		const committed = documents.commitPendingFiles();

		void buildComplaintPayload({
			draft,
			documents: [...committed, ...documents.documents],
			companyId: company?.id ?? null,
			isDraft: true,
		});

		showToast(
			"success",
			t(localizationConstants.complaintCreateSavedToast),
		);
	}, [company, documents, draft, ensureCanCreate, t]);

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
		saveDraft,
		documents,
		cancel,
	};
}
