"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import {
	MAX_EXTRA_DISCOUNT_PERCENT,
	MIN_EXTRA_DISCOUNT_PERCENT,
} from "../constants/sales.constants";
import type { QuoteModuleRow, SalesCompany, SalesQuote } from "../types";
import { calculateQuoteTotals } from "../utils/quoteCalculations";
import { createQuoteDraft, type QuoteDraft } from "../utils/quoteDraft";
import {
	createId,
	createQuoteNumber,
	createQuoteValidUntil,
} from "../utils/salesFactories";

function clampDiscount(value: number): number {
	return Math.min(
		MAX_EXTRA_DISCOUNT_PERCENT,
		Math.max(MIN_EXTRA_DISCOUNT_PERCENT, value),
	);
}

/**
 * Draft, pricing and save for the quote builder. The page and its sections stay
 * layout and wiring.
 */
export function useQuoteBuilderForm(
	company: SalesCompany,
	onChange: (patch: Partial<SalesCompany>) => Promise<boolean>,
) {
	const t = useTranslate();
	const router = useRouter();

	const [draft, setDraft] = useState<QuoteDraft>(() =>
		createQuoteDraft(
			company,
			(key) => t(key),
			t(localizationConstants.salesQuoteDefaultNotes),
		),
	);

	const totals = useMemo(
		() =>
			calculateQuoteTotals(
				draft.modules,
				draft.term,
				draft.extraDiscountPercent,
			),
		[draft.modules, draft.term, draft.extraDiscountPercent],
	);

	const quoteNumber = useMemo(
		() => company.quote?.quoteNumber ?? createQuoteNumber(),
		[company.quote?.quoteNumber],
	);

	const update = useCallback((patch: Partial<QuoteDraft>) => {
		setDraft((previous) => ({ ...previous, ...patch }));
	}, []);

	const setExtraDiscount = useCallback((value: number) => {
		setDraft((previous) => ({
			...previous,
			extraDiscountPercent: clampDiscount(value),
		}));
	}, []);

	const updateModule = useCallback(
		(moduleId: string, patch: Partial<QuoteModuleRow>) => {
			setDraft((previous) => ({
				...previous,
				modules: previous.modules.map((row) =>
					row.id === moduleId ? { ...row, ...patch } : row,
				),
			}));
		},
		[],
	);

	const addModule = useCallback(() => {
		setDraft((previous) => ({
			...previous,
			modules: [
				...previous.modules,
				{
					id: createId("qm"),
					name: t(localizationConstants.salesQuoteNewModuleName),
					description: "",
					price: 0,
					unit: "perMonth",
					selected: true,
					quantity: 1,
					quantityEditable: true,
				},
			],
		}));
	}, [t]);

	const removeModule = useCallback((moduleId: string) => {
		setDraft((previous) => ({
			...previous,
			modules: previous.modules.filter((row) => row.id !== moduleId),
		}));
	}, []);

	const save = useCallback(async () => {
		const quote: SalesQuote = {
			quoteNumber,
			createdAt: draft.createdAt,
			validUntil: createQuoteValidUntil(draft.validDays),
			users: draft.users,
			term: draft.term,
			monthlyNet: totals.monthlyNet,
			firstInvoice: totals.firstInvoice,
			lines: totals.lines,
			notes: draft.notes,
		};

		const saved = await onChange({
			name: draft.customerName || company.name,
			organisationNumber: draft.organisationNumber,
			contactPerson: draft.contactPerson,
			email: draft.email,
			mobile: draft.customerMobile,
			seller: draft.sellerName,
			status: "quoted",
			quote,
		});

		if (saved) {
			showToast("success", t(localizationConstants.salesQuoteSavedToast));
			router.push(`/module/sales/companies/${company.id}`);
		}
	}, [company.id, company.name, draft, onChange, quoteNumber, router, t, totals]);

	return {
		draft,
		totals,
		quoteNumber,
		update,
		setExtraDiscount,
		updateModule,
		addModule,
		removeModule,
		save,
	};
}
