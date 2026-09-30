"use client";

import { Download, Loader2 } from "lucide-react";
import { useWatch, type Control } from "react-hook-form";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { MATERIAL_UNIT_LABELS } from "../../constants/materialStorage.constants";
import { useMaterialFormatters } from "../../hooks/useMaterialFormatters";
import type { MaterialArticle } from "../../types/materialStorage.types";
import { parseDecimalInput } from "../../utils/materialReceipt";
import type { ReceiveMaterialFormValues } from "./receiveMaterial.schema";

const OUTLINE_BUTTON_CLASS = "h-10 cursor-pointer border-slate-200 bg-white text-slate-900 hover:bg-slate-50";

interface ReceiveMaterialFooterProps {
	control: Control<ReceiveMaterialFormValues>;
	articles: MaterialArticle[];
	isPending: boolean;
	onCancel: () => void;
	onSaveDraft: () => void;
}

/** Avbryt on the left; Spara som utkast and "Ta in 120 st" (the form's submit) on the right. */
export function ReceiveMaterialFooter({ control, articles, isPending, onCancel, onSaveDraft }: ReceiveMaterialFooterProps) {
	const t = useTranslate();
	const { formatCount } = useMaterialFormatters();
	const [articleId, quantityText] = useWatch({ control, name: ["articleId", "quantity"] });

	const unit = articles.find((article) => article.id === articleId)?.unit;
	const quantity = parseDecimalInput(quantityText);
	const submitLabel =
		unit && quantity !== null && quantity > 0
			? t(localizationConstants.materialReceiveSubmit, {
					quantity: formatCount(quantity),
					unit: t(MATERIAL_UNIT_LABELS[unit]),
				})
			: t(localizationConstants.materialReceiveMaterial);

	return (
		<div className="flex flex-wrap items-center justify-between gap-3 pt-2">
			<Button type="button" variant="outline" className={OUTLINE_BUTTON_CLASS} onClick={onCancel} disabled={isPending}>
				<Translate text={localizationConstants.cancel} />
			</Button>
			<div className="flex flex-wrap items-center gap-3">
				<Button type="button" variant="outline" className={OUTLINE_BUTTON_CLASS} onClick={onSaveDraft} disabled={isPending}>
					<Translate text={localizationConstants.materialSaveDraft} />
				</Button>
				<Button type="submit" className="h-10 cursor-pointer gap-2 bg-[#111721] text-white hover:bg-slate-800" disabled={isPending}>
					{isPending ? (
						<Loader2 className="h-4 w-4 animate-spin" aria-hidden />
					) : (
						<Download className="h-4 w-4" aria-hidden />
					)}
					{submitLabel}
				</Button>
			</div>
		</div>
	);
}
