"use client";

import { Loader2, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { MATERIAL_UNIT_LABELS } from "../../constants/materialStorage.constants";
import { useMaterialFormatters } from "../../hooks/useMaterialFormatters";
import type { MaterialUnit } from "../../types/materialStorage.types";
import { typedQuantity } from "../../utils/materialQuantityInput";

const OUTLINE_BUTTON_CLASS = "h-10 cursor-pointer border-slate-200 bg-white text-slate-900 hover:bg-slate-50";

interface MaterialDialogFooterProps {
	/** With {{quantity}} and {{unit}}, e.g. "Ta in {{quantity}} {{unit}}". */
	submitKey: TranslationKeys;
	/** The submit text until a quantity and material are chosen, e.g. "Ta in material". */
	fallbackKey: TranslationKeys;
	submitIcon: LucideIcon;
	unit: MaterialUnit | undefined;
	quantityText: string;
	isPending: boolean;
	onCancel: () => void;
	onSaveDraft: () => void;
}

/** Avbryt on the left; Spara som utkast and the form's submit ("Ta in 120 st", "Ta ut 40 st") on the right. */
export function MaterialDialogFooter({
	submitKey,
	fallbackKey,
	submitIcon: SubmitIcon,
	unit,
	quantityText,
	isPending,
	onCancel,
	onSaveDraft,
}: MaterialDialogFooterProps) {
	const t = useTranslate();
	const { formatCount } = useMaterialFormatters();
	const quantity = typedQuantity(quantityText);
	const submitLabel =
		unit && quantity !== null
			? t(submitKey, { quantity: formatCount(quantity), unit: t(MATERIAL_UNIT_LABELS[unit]) })
			: t(fallbackKey);

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
						<SubmitIcon className="h-4 w-4" aria-hidden />
					)}
					{submitLabel}
				</Button>
			</div>
		</div>
	);
}
