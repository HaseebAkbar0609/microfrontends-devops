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
		<div className="flex flex-col gap-6 bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
			<ArticleBasicInfoFields />
			<PriceListSubTable
				rows={priceListRows}
				onAddRow={onAddPriceListRow}
				onRemoveRow={onRemovePriceListRow}
			/>
			<ArticleAccountingStep1Fields />
		</div>
	);
}
