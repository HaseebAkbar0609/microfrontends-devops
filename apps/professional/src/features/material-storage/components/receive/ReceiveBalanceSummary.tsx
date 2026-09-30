"use client";

import { ArrowRight } from "lucide-react";
import { useWatch, type Control } from "react-hook-form";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { useMaterialFormatters } from "../../hooks/useMaterialFormatters";
import { useMaterialStockLevel } from "../../hooks/useMaterialStockLevel";
import type { MaterialArticle } from "../../types/materialStorage.types";
import { parseDecimalInput } from "../../utils/materialReceipt";
import type { ReceiveMaterialFormValues } from "./receiveMaterial.schema";

/** Shown until there is something to calculate. */
const NO_VALUE = "–";

const roundMoney = (value: number) => Math.round(value * 100) / 100;

interface ReceiveBalanceSummaryProps {
	control: Control<ReceiveMaterialFormValues>;
	articles: MaterialArticle[];
}

/** Tidigare saldo → Nytt saldo | Inköpsvärde, recalculated as the form is filled in. */
export function ReceiveBalanceSummary({ control, articles }: ReceiveBalanceSummaryProps) {
	const { formatQuantity, formatMoney } = useMaterialFormatters();
	const [depotId, articleId, quantityText, priceText] = useWatch({
		control,
		name: ["depotId", "articleId", "quantity", "unitPrice"],
	});
	const stockLevel = useMaterialStockLevel(articleId, depotId);
	const article = articles.find((candidate) => candidate.id === articleId);

	const parsedQuantity = parseDecimalInput(quantityText);
	const quantity = parsedQuantity !== null && parsedQuantity > 0 ? parsedQuantity : null;
	const price = parseDecimalInput(priceText);

	const previous = article && stockLevel ? formatQuantity(stockLevel.inStock, article.unit) : NO_VALUE;
	const next =
		article && stockLevel && quantity !== null
			? formatQuantity(stockLevel.inStock + quantity, article.unit)
			: NO_VALUE;
	const purchaseValue = quantity !== null && price !== null ? formatMoney(roundMoney(quantity * price)) : NO_VALUE;

	return (
		<div
			aria-live="polite"
			className="grid grid-cols-[1fr_auto_1fr] items-center gap-y-4 rounded-lg border border-slate-200 bg-slate-50 px-6 py-4 text-center sm:grid-cols-[1fr_auto_1fr_1px_1fr]"
		>
			<SummaryCell label={localizationConstants.materialPreviousBalance} value={previous} />
			<ArrowRight className="h-5 w-5 text-slate-500" aria-hidden />
			<SummaryCell label={localizationConstants.materialNewBalance} value={next} />
			<span className="hidden h-12 w-px bg-slate-200 sm:block" aria-hidden />
			<SummaryCell
				label={localizationConstants.materialPurchaseValue}
				value={purchaseValue}
				className="col-span-3 sm:col-span-1"
			/>
		</div>
	);
}

function SummaryCell({ label, value, className }: { label: TranslationKeys; value: string; className?: string }) {
	return (
		<div className={className}>
			<p className="text-sm text-slate-600">
				<Translate text={label} />
			</p>
			<p className="mt-1 text-xl font-semibold text-slate-900 tabular-nums">{value}</p>
		</div>
	);
}
