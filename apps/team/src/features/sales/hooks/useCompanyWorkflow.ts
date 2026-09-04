"use client";

import { useCallback } from "react";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import type { SalesCompany } from "../types";
import { createOrder, createPendingPayment } from "../utils/salesFactories";

/**
 * The pipeline transitions on the company card.
 *
 * The irreversible ones are wrapped in `ConfirmDialog` at the call site, so the
 * functions here run only once the user has confirmed.
 */
export function useCompanyWorkflow(
	company: SalesCompany,
	onChange: (patch: Partial<SalesCompany>) => void,
) {
	const t = useTranslate();

	const moveToLead = useCallback(() => {
		onChange({ status: "lead" });
	}, [onChange]);

	const confirmCreateOrder = useCallback(() => {
		onChange({
			order: createOrder(company),
			status: "accepted",
			payment: null,
		});
		showToast("success", t(localizationConstants.salesOrderCreatedToast));
	}, [company, onChange, t]);

	const confirmSendPayment = useCallback(() => {
		onChange({ payment: createPendingPayment(company) });
		showToast("success", t(localizationConstants.salesPaymentSentToast));
	}, [company, onChange, t]);

	const confirmMarkPaid = useCallback(() => {
		if (!company.payment) return;
		onChange({ payment: { ...company.payment, status: "paid" } });
		showToast("success", t(localizationConstants.salesPaymentPaidToast));
	}, [company.payment, onChange, t]);

	return {
		moveToLead,
		confirmCreateOrder,
		confirmSendPayment,
		confirmMarkPaid,
	};
}
