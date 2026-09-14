"use client";

import { formatCurrency } from "@/utils/formatCurrency";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import type { PaymentPlanSummary } from "../paymentPlanMath";

const ROWS: { key: keyof Omit<PaymentPlanSummary, "total">; labelKey: TranslationKeys }[] = [
	{ key: "sent", labelKey: localizationConstants.lblSkickat },
	{ key: "remaining", labelKey: localizationConstants.lblKvarAttSkicka },
	{ key: "retained", labelKey: localizationConstants.sectionInnehallnaMedel },
];

/** The grey box under the aconto table: what has gone out, and the total. */
export function AcontoSummary({ summary }: { summary: PaymentPlanSummary }) {
	return (
		<dl className="w-full max-w-sm rounded-lg bg-slate-200/70 px-4 py-3">
			<div className="flex flex-col gap-1 border-b border-slate-300 pb-2">
				{ROWS.map((row) => (
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
