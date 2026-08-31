"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { useAuthStatus } from "@/context/AuthContext";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { MOCK_PURCHASE_SUPPLIERS } from "../data/purchaseSuppliers.mock";
import { MOCK_PURCHASES } from "../data/purchases.mock";
import { PURCHASE_MODULE_BASE_URL } from "../data/purchaseNav.config";
import { usePurchaseDocuments } from "../hooks/usePurchaseDocuments";
import {
	collectGoodsReceptionErrors,
	EMPTY_GOODS_RECEPTION_DRAFT,
	goodsReceptionSchema,
	type GoodsReceptionInput,
} from "./schema";

const LIST_HREF = `${PURCHASE_MODULE_BASE_URL}/goods-reception`;

/** One reception line per purchase, matching the frame's `I501-001`. */
function orderLineOf(purchaseNo: string) {
	return `${purchaseNo}-001`;
}

/**
 * Draft state, validation and submission for the goods reception create screen.
 *
 * Split out of the page so the component stays layout and wiring, matching
 * `useCreateComplaintForm` next door.
 */
export function useCreateGoodsReceptionForm() {
	const { t } = useTranslation();
	const router = useRouter();
	const { company } = useAuthStatus();

	const [draft, setDraft] = useState<GoodsReceptionInput>(
		EMPTY_GOODS_RECEPTION_DRAFT,
	);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [gdprAccepted, setGdprAccepted] = useState(false);

	const orderOptions = useMemo(
		() => MOCK_PURCHASES.map((purchase) => orderLineOf(purchase.purchaseNo)),
		[],
	);

	const supplierOptions = useMemo(
		() => MOCK_PURCHASE_SUPPLIERS.map((supplier) => supplier.name),
		[],
	);

	/** Documents attached in this session; a new reception starts with none. */
	const documents = usePurchaseDocuments([], {
		supplier: draft.supplier || undefined,
		purchaseNo: draft.purchaseNo || undefined,
		reference: draft.name || undefined,
	});

	const patch = useCallback(
		(patchValue: Partial<GoodsReceptionInput>) => {
			setDraft((previous) => ({ ...previous, ...patchValue }));
			setErrors((previous) => {
				const next = { ...previous };
				for (const key of Object.keys(patchValue)) delete next[key];
				return next;
			});
		},
		[],
	);

	/**
	 * Picking an order line fills the descriptive fields from the purchase it
	 * belongs to. They stay editable, as on the complaint wizard.
	 */
	const selectOrder = useCallback(
		(orderLine: string) => {
			const match = MOCK_PURCHASES.find(
				(purchase) => orderLineOf(purchase.purchaseNo) === orderLine,
			);

			patch(
				match
					? {
							purchaseNo: orderLine,
							name: match.name,
							object: match.object,
						}
					: { purchaseNo: orderLine },
			);
		},
		[patch],
	);

	const cancel = useCallback(() => router.push(LIST_HREF), [router]);

	const submit = useCallback(() => {
		const result = goodsReceptionSchema.safeParse(draft);

		if (!result.success) {
			setErrors(collectGoodsReceptionErrors(result.error));
			return;
		}

		setErrors({});
		documents.commitPendingFiles();

		/**
		 * Scoped to the signed-in company, which is this codebase's isolation
		 * unit — there is no `tenant_id` anywhere in the frontend yet.
		 */
		void {
			...result.data,
			unitPrice: Number(result.data.unitPrice),
			companyId: company?.id ?? null,
			gdprAccepted,
		};

		showToast(
			"success",
			t(localizationConstants.purchaseGoodsReceptionCreatedToast),
		);
		router.push(LIST_HREF);
	}, [company, documents, draft, gdprAccepted, router, t]);

	return {
		draft,
		errors,
		patch,
		selectOrder,
		orderOptions,
		supplierOptions,
		gdprAccepted,
		setGdprAccepted,
		documents,
		listHref: LIST_HREF,
		cancel,
		submit,
	};
}
