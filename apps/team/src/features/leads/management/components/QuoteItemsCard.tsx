"use client";

import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { QuoteLineItem, QuoteTotals } from "@/features/leads/types";

type QuoteItemsCardProps = {
	items: QuoteLineItem[];
	totals: QuoteTotals;
};

export default function QuoteItemsCard({ items, totals }: QuoteItemsCardProps) {
	const t = useTranslate();

	return (
		<div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
			<div className="border-b border-slate-200 px-5 py-4">
				<div className="text-sm font-semibold text-slate-900">
					<Translate text={localizationConstants.quoteSectionLabel} />
				</div>
			</div>
			<div className="px-5 py-5">
				<div className="overflow-hidden rounded-lg border border-slate-200">
					<Table className="text-sm">
						<TableHeader>
							<TableRow className="bg-slate-50">
								<TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
									<Translate text={localizationConstants.dateLabel} />
								</TableHead>
								<TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
									<Translate text={localizationConstants.descriptionLabel} />
								</TableHead>
								<TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 text-right">
									<Translate text={localizationConstants.amountLabel} />
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{items.map((item) => (
								<TableRow key={item.id}>
									<TableCell className="px-4 py-4 text-black">
										{item.date}
									</TableCell>
									<TableCell className="px-4 py-4 text-black">
										{item.description}
									</TableCell>
									<TableCell className="px-4 py-4 text-right text-slate-900">
										{item.amount}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>

				<div className="mt-6 flex justify-end">
					<div className="w-full max-w-sm space-y-2 text-sm text-slate-700">
						<div className="flex items-center justify-between border-t border-slate-400 pt-4 text-slate-900">
							<span className="font-semibold uppercase tracking-wide text-xs text-black">
								{t(localizationConstants.quoteTotalLabel)}
							</span>
							<span className="font-semibold">{totals.quoteTotal}</span>
						</div>
						<div className="flex items-center justify-between text-slate-600">
							<span>{t(localizationConstants.includingVatLabel)}</span>
							<span>{totals.includingVat}</span>
						</div>
						<div className="flex items-center justify-between text-slate-600">
							<span>{t(localizationConstants.rotDeductionLabel)}</span>
							<span>{totals.rotDeduction}</span>
						</div>
						<div className="mt-4 flex items-center justify-between border-t border-slate-700 pt-4 text-slate-900">
							<span className="font-semibold uppercase tracking-wide text-sm text-black">
								{t(localizationConstants.finalTotalLabel)}
							</span>
							<span className="text-base text-black font-semibold">{totals.finalTotal}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
