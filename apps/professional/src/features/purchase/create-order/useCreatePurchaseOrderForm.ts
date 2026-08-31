"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { ROLES } from "@/constants/roles";
import { useAuthStatus } from "@/context/AuthContext";
import { hasPermission } from "@/lib/hasPermission";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { PURCHASE_MODULE_BASE_URL } from "../data/purchaseNav.config";
import { MOCK_PURCHASE_SUPPLIERS } from "../data/purchaseSuppliers.mock";
import { usePurchaseDocuments } from "../hooks/usePurchaseDocuments";
import type {
	PurchaseContactPerson,
	PurchaseOrderSpecLine,
	PurchaseRow,
} from "../types/purchase.types";
import {
	collectOrderErrors,
	orderContactStepSchema,
	orderObjectStepSchema,
	orderSpecificationStepSchema,
	type OrderObjectStepInput,
	type OrderSpecificationStepInput,
} from "./schema";

/** Named so call sites read as steps rather than magic numbers. */
export const ORDER_STEPS = {
	OBJECT: 1,
	CONTACT: 2,
	SPECIFICATION: 3,
} as const;

export type OrderStep = (typeof ORDER_STEPS)[keyof typeof ORDER_STEPS];

export const TOTAL_ORDER_STEPS = ORDER_STEPS.SPECIFICATION;

/**
 * Parses a numeric cell for arithmetic. Anything that is not a finite,
 * non-negative number reads as 0 while the raw text stays in the field, so a
 * half-typed value can never make a total `NaN`.
 */
export function parseAmount(value: string): number {
	const parsed = Number(value.replace(",", ".").trim());
	return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

export function lineSubtotal(line: PurchaseOrderSpecLine): number {
	return parseAmount(line.quantity) * parseAmount(line.unitPrice);
}

/**
 * Builds the payload a create-order endpoint will take.
 *
 * Kept as a pure function so the shape is inspectable and testable without
 * mounting the wizard, and so there is a single obvious call site to swap for
 * the real request once an endpoint exists.
 */
export function buildPurchaseOrderPayload(input: {
	purchaseId: string;
	object: OrderObjectStepInput;
	delivery: {
		deliveryAddress: string;
		deliveryPostalCode: string;
		deliveryCity: string;
	};
	contact: PurchaseContactPerson;
	specification: OrderSpecificationStepInput;
	total: number;
	gdprAccepted: boolean;
	companyId: string | null;
}) {
	return {
		purchaseId: input.purchaseId,
		object: { ...input.object, ...input.delivery },
		contact: input.contact,
		specification: {
			...input.specification,
			lines: (input.specification.lines ?? []).map((line) => ({
				...line,
				quantity: parseAmount(line.quantity),
				unitPrice: parseAmount(line.unitPrice),
			})),
			total: input.total,
		},
		gdprAccepted: input.gdprAccepted,
		/**
		 * The company is this codebase's isolation unit — there is no
		 * `tenant_id` anywhere in the frontend. Whatever consumes this must
		 * still scope server-side; a client-supplied id is a hint, not a
		 * boundary.
		 */
		companyId: input.companyId,
	};
}

function emptyLine(id: string): PurchaseOrderSpecLine {
	return {
		id,
		articleNo: "",
		supplierArticleNo: "",
		designation: "",
		quantity: "",
		unit: "",
		unitPrice: "",
	};
}

/**
 * Draft state, per-step validation and submission for the Ny inköpsorder
 * wizard.
 *
 * Split out of the page so the component stays layout and wiring, matching
 * `useCreateComplaintForm` next door.
 */
export function useCreatePurchaseOrderForm(purchase: PurchaseRow) {
	const { t } = useTranslation();
	const router = useRouter();
	const { company } = useAuthStatus();

	const recordHref = `${PURCHASE_MODULE_BASE_URL}/${encodeURIComponent(purchase.id)}`;

	/** Line ids come from a counter, not `Date.now()`, so they cannot collide. */
	const lineCounter = useRef(1);

	const [step, setStep] = useState<OrderStep>(1);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [gdprAccepted, setGdprAccepted] = useState(false);

	const [object, setObject] = useState<OrderObjectStepInput>({
		supplierId: "",
		projectNo: purchase.object,
		projectName: purchase.name,
		objectName: purchase.name,
		blockName: "",
		projectAddress: "",
		projectPostalCode: "",
		projectCity: "",
		deliverySameAsProject: true,
		deliveryAddress: "",
		deliveryPostalCode: "",
		deliveryCity: "",
	});

	const [contact, setContact] = useState<PurchaseContactPerson>({
		contactId: "",
		firstName: "",
		lastName: "",
		address: "",
		postalCode: "",
		email: "",
		phone: "",
		city: "",
		role: "",
	});

	const [specification, setSpecification] =
		useState<OrderSpecificationStepInput>({
			supplierCompany: "",
			monitoringEnabled: false,
			monitoringDate: "",
			desiredDelivery: "",
			marking: `${purchase.purchaseNo}-001`,
			deliveryMethod: "",
			comments: "",
			lines: [emptyLine("line-1")],
		});

	const documents = usePurchaseDocuments([], {
		supplier: specification.supplierCompany || undefined,
		purchaseNo: specification.marking || undefined,
		reference: purchase.name || undefined,
	});

	const supplierOptions = useMemo(
		() =>
			MOCK_PURCHASE_SUPPLIERS.map((supplier) => ({
				value: supplier.id,
				label: supplier.name,
			})),
		[],
	);

	/** Clearing an error as its field is edited avoids stale red borders. */
	const clearErrors = useCallback((keys: string[]) => {
		setErrors((previous) => {
			const next = { ...previous };
			for (const key of keys) delete next[key];
			return next;
		});
	}, []);

	const patchObject = useCallback(
		(patch: Partial<OrderObjectStepInput>) => {
			setObject((previous) => ({ ...previous, ...patch }));
			clearErrors(Object.keys(patch));
		},
		[clearErrors],
	);

	const patchContact = useCallback(
		(patch: Partial<PurchaseContactPerson>) => {
			setContact((previous) => ({ ...previous, ...patch }));
			clearErrors(Object.keys(patch));
		},
		[clearErrors],
	);

	const patchSpecification = useCallback(
		(patch: Partial<OrderSpecificationStepInput>) => {
			setSpecification((previous) => {
				const next = { ...previous, ...patch };

				// Ticking Bevakning fills the Information card's date, as the
				// frame shows; clearing it takes the date away again.
				if (
					patch.monitoringEnabled === false &&
					previous.monitoringEnabled
				) {
					next.monitoringDate = "";
				}

				return next;
			});
			clearErrors(Object.keys(patch));
		},
		[clearErrors],
	);

	/**
	 * Delivery mirrors the project address while the checkbox is ticked, as a
	 * derived value rather than duplicated state — the same approach as the
	 * purchase object screen.
	 */
	const delivery = useMemo(
		() =>
			object.deliverySameAsProject
				? {
						deliveryAddress: object.projectAddress ?? "",
						deliveryPostalCode: object.projectPostalCode ?? "",
						deliveryCity: object.projectCity ?? "",
					}
				: {
						deliveryAddress: object.deliveryAddress ?? "",
						deliveryPostalCode: object.deliveryPostalCode ?? "",
						deliveryCity: object.deliveryCity ?? "",
					},
		[
			object.deliverySameAsProject,
			object.projectAddress,
			object.projectPostalCode,
			object.projectCity,
			object.deliveryAddress,
			object.deliveryPostalCode,
			object.deliveryCity,
		],
	);

	const updateLine = useCallback(
		(id: string, patch: Partial<PurchaseOrderSpecLine>) => {
			setSpecification((previous) => ({
				...previous,
				lines: (previous.lines ?? []).map((line) =>
					line.id === id ? { ...line, ...patch } : line,
				),
			}));
			setErrors((previous) => {
				const next = { ...previous };
				for (const key of Object.keys(previous)) {
					if (key.startsWith("lines.")) delete next[key];
				}
				return next;
			});
		},
		[],
	);

	const addLine = useCallback(() => {
		lineCounter.current += 1;
		setSpecification((previous) => ({
			...previous,
			lines: [
				...(previous.lines ?? []),
				emptyLine(`line-${lineCounter.current}`),
			],
		}));
	}, []);

	const removeLine = useCallback((id: string) => {
		setSpecification((previous) => ({
			...previous,
			lines: (previous.lines ?? []).filter((line) => line.id !== id),
		}));
	}, []);

	/** The frame prints a Summa of 0 above a non-zero row; this is computed. */
	const grandTotal = useMemo(
		() =>
			(specification.lines ?? []).reduce(
				(sum, line) => sum + lineSubtotal(line as PurchaseOrderSpecLine),
				0,
			),
		[specification.lines],
	);

	const validateStep = useCallback(
		(target: OrderStep): boolean => {
			if (target === 1) {
				const result = orderObjectStepSchema.safeParse(object);
				if (result.success) {
					setErrors({});
					return true;
				}
				setErrors(collectOrderErrors(result.error));
				return false;
			}

			if (target === 2) {
				const result = orderContactStepSchema.safeParse(contact);
				if (result.success) {
					setErrors({});
					return true;
				}
				setErrors(collectOrderErrors(result.error));
				return false;
			}

			const result = orderSpecificationStepSchema.safeParse(specification);
			if (result.success) {
				setErrors({});
				return true;
			}
			setErrors(collectOrderErrors(result.error));
			return false;
		},
		[object, contact, specification],
	);

	const goNext = useCallback(() => {
		if (!validateStep(step)) return;
		setStep((previous) => (previous < 3 ? ((previous + 1) as OrderStep) : previous));
	}, [step, validateStep]);

	const goBack = useCallback(() => {
		setErrors({});
		setStep((previous) => (previous > 1 ? ((previous - 1) as OrderStep) : previous));
	}, []);

	/** Backwards is always allowed; forwards has to pass the current step. */
	const goToStep = useCallback(
		(target: OrderStep) => {
			if (target <= step) {
				setErrors({});
				setStep(target);
				return;
			}
			if (validateStep(step)) setStep(target);
		},
		[step, validateStep],
	);

	const cancel = useCallback(() => router.push(recordHref), [router, recordHref]);

	const submit = useCallback(() => {
		/**
		 * The buttons are wrapped in `PermissionGate`, but `submit` is reachable
		 * from the hook, so it re-checks rather than trusting the rendered tree.
		 * This is a guard, not a boundary — the server must enforce it too.
		 */
		if (!hasPermission(ROLES.MANAGER, "CREATE_PURCHASE")) {
			showToast(
				"error",
				t(localizationConstants.purchaseOrderUnavailable),
			);
			return;
		}

		for (const target of Object.values(ORDER_STEPS)) {
			if (!validateStep(target)) {
				setStep(target);
				return;
			}
		}

		documents.commitPendingFiles();

		void buildPurchaseOrderPayload({
			purchaseId: purchase.id,
			object,
			delivery,
			contact,
			specification,
			total: grandTotal,
			gdprAccepted,
			companyId: company?.id ?? null,
		});

		showToast("success", t(localizationConstants.purchaseOrderCreatedToast));
		router.push(recordHref);
	}, [
		company,
		contact,
		delivery,
		documents,
		gdprAccepted,
		grandTotal,
		object,
		purchase.id,
		recordHref,
		router,
		specification,
		t,
		validateStep,
	]);

	return {
		step,
		goNext,
		goBack,
		goToStep,
		errors,
		object,
		patchObject,
		delivery,
		contact,
		patchContact,
		specification,
		patchSpecification,
		updateLine,
		addLine,
		removeLine,
		grandTotal,
		supplierOptions,
		documents,
		gdprAccepted,
		setGdprAccepted,
		recordHref,
		cancel,
		submit,
	};
}
