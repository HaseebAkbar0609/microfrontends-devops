"use client";

import { formatCurrency } from "@/utils/formatCurrency";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import type { PaymentPlanSummary } from "../paymentPlanMath";

export interface AcontoSummaryLabels {
	sent: TranslationKeys;
	remaining: TranslationKeys;
}

/** The Beställare wording: what has been sent, and what is left to send. */
export const SENT_SUMMARY_LABELS: AcontoSummaryLabels = {
	sent: localizationConstants.lblSkickat,
	remaining: localizationConstants.lblKvarAttSkicka,
};

/**
 * The grey box under an aconto table: what has gone out, and the total. The
 * first two rows are worded by the caller — a supplier's plan reads Erhållet
 * and Kvar att erhålla.
 */
export function AcontoSummary({
	summary,
	labels = SENT_SUMMARY_LABELS,
}: {
	summary: PaymentPlanSummary;
	labels?: AcontoSummaryLabels;
}) {
	const rows: { key: keyof Omit<PaymentPlanSummary, "total">; labelKey: TranslationKeys }[] = [
		{ key: "sent", labelKey: labels.sent },
		{ key: "remaining", labelKey: labels.remaining },
		{ key: "retained", labelKey: localizationConstants.sectionInnehallnaMedel },
	];

	return (
		<dl className="w-full max-w-sm rounded-lg bg-slate-200/70 px-4 py-3">
			<div className="flex flex-col gap-1 border-b border-slate-300 pb-2">
				{rows.map((row) => (
					<div key={row.key} className="flex items-center justify-between gap-4 text-sm text-slate-500">
						<dt className="pl-6">
							<Translate text={row.labelKey} />
						</dt>
						<dd className="tabular-nums">{formatCurrency(summary[row.key])} kr</dd>
					</div>
				))}
			</div>
			<div className="flex items-center justify-between gap-4 pt-2 text-slate-900">
				<dt className="pl-6 text-base font-medium">
					<Translate text={localizationConstants.projectPaymentPlanTotal} />
				</dt>
				<dd className="text-lg font-semibold tabular-nums">{formatCurrency(summary.total)} kr</dd>
			</div>
		</dl>
	);
}

export default AcontoSummary;
