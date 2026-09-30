"use client";

import { TriangleAlert } from "lucide-react";
import { useWatch, type Control } from "react-hook-form";
import { FormCheckbox } from "@/components/form";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { useMaterialFormatters } from "../../hooks/useMaterialFormatters";
import { useMaterialStockLevel } from "../../hooks/useMaterialStockLevel";
import type { MaterialArticle } from "../../types/materialStorage.types";
import { WITHDRAWAL_LINK_RULES } from "../../utils/materialWithdrawal";
import type { WithdrawMaterialFormValues } from "./withdrawMaterial.schema";

interface WithdrawChargeRowProps {
	control: Control<WithdrawMaterialFormValues>;
	articles: MaterialArticle[];
}

/**
 * Under the summary: the invoice line checkbox (orders and projects only; an
 * invoice always gets the line, internal use never) and, when part of the
 * depot's stock is reserved, a warning that it cannot be taken.
 */
export function WithdrawChargeRow({ control, articles }: WithdrawChargeRowProps) {
	const t = useTranslate();
	const { formatQuantity } = useMaterialFormatters();
	const [depotId, articleId, linkType] = useWatch({ control, name: ["depotId", "articleId", "linkType"] });
	const stockLevel = useMaterialStockLevel(articleId, depotId);
	const unit = articles.find((article) => article.id === articleId)?.unit;
	const reserved = unit && stockLevel && stockLevel.reserved > 0 ? formatQuantity(stockLevel.reserved, unit) : null;
	const showCheckbox = WITHDRAWAL_LINK_RULES[linkType].invoiceLineOptional;

	if (!showCheckbox && !reserved) return null;

	return (
		<div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
			{showCheckbox && (
				<FormCheckbox
					control={control}
					name="addInvoiceLine"
					label={localizationConstants.materialAddAsInvoiceLine}
					variant="secondary"
					className="space-y-0"
					labelClassName="mb-0 font-normal text-slate-900"
				/>
			)}
			{reserved && (
				<p className="ml-auto flex items-center gap-2 text-sm text-orange-700">
					<TriangleAlert className="h-4 w-4 shrink-0" aria-hidden />
					{t(localizationConstants.materialReservedWarning, { quantity: reserved })}
				</p>
			)}
		</div>
	);
}
