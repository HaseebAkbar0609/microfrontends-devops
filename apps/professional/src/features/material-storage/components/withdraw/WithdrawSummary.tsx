"use client";

import { useWatch, type Control } from "react-hook-form";
import { cn } from "@/lib/utils";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { useMaterialFormatters } from "../../hooks/useMaterialFormatters";
import { useMaterialStockLevel } from "../../hooks/useMaterialStockLevel";
import type { MaterialArticle } from "../../types/materialStorage.types";
import { typedQuantity } from "../../utils/materialQuantityInput";
import { parseDecimalInput } from "../../utils/materialStockChanges";
import { isChargedToCustomer, withdrawalValue } from "../../utils/materialWithdrawal";
import type { WithdrawMaterialFormValues } from "./withdrawMaterial.schema";

/** Shown until there is something to calculate. */
const NO_VALUE = "–";

interface WithdrawSummaryProps {
	control: Control<WithdrawMaterialFormValues>;
	articles: MaterialArticle[];
}

/** Saldo efter uttag | Materialvärde | Debiteras kund, recalculated as the form is filled in. */
export function WithdrawSummary({ control, articles }: WithdrawSummaryProps) {
	const t = useTranslate();
	const { formatQuantity, formatMoney } = useMaterialFormatters();
	const [depotId, articleId, quantityText, linkType, salesPriceText, addInvoiceLine] = useWatch({
		control,
		name: ["depotId", "articleId", "quantity", "linkType", "salesPrice", "addInvoiceLine"],
	});
	const stockLevel = useMaterialStockLevel(articleId, depotId);
	const article = articles.find((candidate) => candidate.id === articleId);
	const quantity = typedQuantity(quantityText);

	const balanceAfter = article && stockLevel && quantity !== null ? stockLevel.available - quantity : null;
	const value = withdrawalValue(
		linkType,
		quantity,
		parseDecimalInput(salesPriceText),
		article?.purchasePrice ?? null,
	);
	const charged = isChargedToCustomer(linkType, addInvoiceLine);

	return (
		<div
			aria-live="polite"
			className="grid grid-cols-1 gap-y-4 rounded-lg border border-slate-200 bg-slate-50 px-6 py-4 text-center sm:grid-cols-[1fr_1px_1fr_1px_1fr]"
		>
			<SummaryCell
				label={localizationConstants.materialBalanceAfterWithdrawal}
				value={article && balanceAfter !== null ? formatQuantity(balanceAfter, article.unit) : NO_VALUE}
				// Below zero: more than is available, which withdrawing will refuse.
				warn={balanceAfter !== null && balanceAfter < 0}
			/>
			<Divider />
			<SummaryCell
				label={localizationConstants.materialValue}
				value={value !== null ? formatMoney(value) : NO_VALUE}
			/>
			<Divider />
			<SummaryCell
				label={localizationConstants.materialChargedToCustomer}
				value={t(charged ? localizationConstants.commonYes : localizationConstants.commonNo)}
			/>
		</div>
	);
}

function Divider() {
	return <span className="hidden h-12 w-px self-center bg-slate-200 sm:block" aria-hidden />;
}

function SummaryCell({ label, value, warn }: { label: TranslationKeys; value: string; warn?: boolean }) {
	return (
		<div>
			<p className="text-sm text-slate-600">
				<Translate text={label} />
			</p>
			<p className={cn("mt-1 text-xl font-semibold tabular-nums", warn ? "text-red-600" : "text-slate-900")}>
				{value}
			</p>
		</div>
	);
}
