"use client";

import { formatCurrency } from "@/utils/formatCurrency";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

export interface AtaSummaryBoxProps {
	total: number;
	count: number;
}

/** The grey "Totalt ÄTA / Antal Äta" box over the table, for the rows on screen. */
export function AtaSummaryBox({ total, count }: AtaSummaryBoxProps) {
	return (
		<dl className="grid w-fit grid-cols-[auto_auto] items-baseline gap-x-5 gap-y-1 rounded-lg bg-slate-100 px-4 py-3">
			<dt className="text-sm font-medium text-slate-900">
				<Translate text={localizationConstants.ataTotalAta} />
			</dt>
			<dd className="text-base text-slate-500 tabular-nums">{formatCurrency(total)}</dd>
			<dt className="text-sm font-medium text-slate-900">
				<Translate text={localizationConstants.ataCountAta} />
			</dt>
			<dd className="text-base text-slate-500 tabular-nums">{count}</dd>
		</dl>
	);
}

export default AtaSummaryBox;
