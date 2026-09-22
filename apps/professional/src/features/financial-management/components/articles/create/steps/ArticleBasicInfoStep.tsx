"use client";

import React from "react";
import type { PriceListRow } from "../../../../types/article.types";
import { ArticleBasicInfoFields } from "../sections/ArticleBasicInfoFields";
import { PriceListSubTable } from "../PriceListSubTable";
import { ArticleAccountingStep1Fields } from "../sections/ArticleAccountingStep1Fields";

interface ArticleBasicInfoStepProps {
	readonly priceListRows: PriceListRow[];
	readonly onAddPriceListRow: (row: PriceListRow) => void;
	readonly onRemovePriceListRow: (id: string) => void;
}

export function ArticleBasicInfoStep({
	priceListRows,
	onAddPriceListRow,
	onRemovePriceListRow,
}: ArticleBasicInfoStepProps) {
	return (
		<div className="flex flex-col gap-6">
			{/* Card 1: Grund information */}
			<div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
				<ArticleBasicInfoFields />
			</div>

			{/* Card 2: Prislista */}
			<div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
				<PriceListSubTable
					rows={priceListRows}
					onAddRow={onAddPriceListRow}
					onRemoveRow={onRemovePriceListRow}
				/>
			</div>

			{/* Card 3: Bokförings uppgifter */}
			<div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
				<ArticleAccountingStep1Fields />
			</div>
		</div>
	);
}
