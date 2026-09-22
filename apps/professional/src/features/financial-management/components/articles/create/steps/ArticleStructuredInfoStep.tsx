"use client";

import React from "react";
import { ArticlePricesFields } from "../sections/ArticlePricesFields";
import { ArticleOrderWarehouseFields } from "../sections/ArticleOrderWarehouseFields";
import { ArticleAccountingStep2Fields } from "../sections/ArticleAccountingStep2Fields";

export function ArticleStructuredInfoStep() {
	return (
		<div className="flex flex-col gap-6 bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
			<ArticlePricesFields />
			<ArticleOrderWarehouseFields />
			<ArticleAccountingStep2Fields />
		</div>
	);
}
