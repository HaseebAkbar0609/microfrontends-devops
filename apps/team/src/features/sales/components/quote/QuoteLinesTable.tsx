"use client";

import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { QUOTE_UNIT_LABEL_KEYS } from "../../constants/quoteModules";
import type { QuoteLine } from "../../types";
import { formatCurrency } from "../../utils/salesFormatters";

type QuoteLinesTableProps = {
	lines: QuoteLine[];
	/** Show the per-line description under its name (quote sheet only). */
	showDescriptions?: boolean;
};

/** The priced line table printed on the quote and the order confirmation. */
export function QuoteLinesTable({
	lines,
	showDescriptions = false,
}: QuoteLinesTableProps) {
	return (
		<table className="mt-6 w-full text-sm">
			<thead>
				<tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
					<th className="pb-2 text-left font-medium">
						<Translate text={localizationConstants.salesQuoteColFeature} />
					</th>
					<th className="pb-2 text-right font-medium">
						<Translate text={localizationConstants.salesQuoteColQuantity} />
					</th>
					<th className="pb-2 text-right font-medium">
						<Translate text={localizationConstants.salesQuoteColUnitPrice} />
					</th>
					<th className="pb-2 text-right font-medium">
						<Translate text={localizationConstants.salesQuoteColAmount} />
					</th>
				</tr>
			</thead>
			<tbody>
				{lines.length === 0 ? (
					<tr>
						<td colSpan={4} className="py-4 text-center text-slate-500">
							<Translate
								text={localizationConstants.salesQuoteSelectAtLeastOne}
							/>
						</td>
					</tr>
				) : null}

				{lines.map((line) => (
					<tr
						key={line.id}
						className="print-avoid-break border-b border-slate-200/60 align-top"
					>
						<td className="py-2 pr-2">
							<span className="font-medium text-slate-900">{line.name}</span>
							{showDescriptions && line.description ? (
								<span className="block text-xs text-slate-500">
									{line.description}
								</span>
							) : null}
						</td>
						<td className="whitespace-nowrap py-2 text-right tabular-nums">
							{line.quantity}
						</td>
						<td className="whitespace-nowrap py-2 text-right tabular-nums text-slate-500">
							{line.price} <Translate text={QUOTE_UNIT_LABEL_KEYS[line.unit]} />
						</td>
						<td className="whitespace-nowrap py-2 text-right tabular-nums">
							{formatCurrency(line.amount)}
							{line.unit === "oneTime" ? null : (
								<Translate
									text={localizationConstants.salesPerMonthSuffix}
								/>
							)}
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}
