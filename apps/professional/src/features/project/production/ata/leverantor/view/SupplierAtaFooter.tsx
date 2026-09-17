"use client";

import { ArrowLeft, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";

const BUTTON = "h-11 cursor-pointer rounded-md px-8 text-sm font-medium shadow-none sm:min-w-40";

export interface SupplierAtaFooterProps {
	/** Why Spara is unavailable (a settled ÄTA), or `null`. */
	saveReason: TranslationKeys | null;
	onBack: () => void;
	onCancel: () => void;
	onSave: () => void;
}

/** The frame's bar: ← Tillbaka till (the list) · Avbryt · Spara. */
export function SupplierAtaFooter({ saveReason, onBack, onCancel, onSave }: SupplierAtaFooterProps) {
	const t = useTranslate();

	return (
		<div className="sticky bottom-0 z-40 border-t border-slate-200 bg-white py-3">
			<div className="flex flex-col-reverse items-stretch justify-end gap-2 px-4 sm:flex-row sm:items-center sm:gap-3 sm:px-6">
				<Button type="button" variant="outline" onClick={onBack} className={cn(BUTTON, "gap-2 border-slate-200 bg-slate-100 text-slate-900 hover:bg-slate-200")}>
					<ArrowLeft className="h-4 w-4" aria-hidden />
					<Translate text={localizationConstants.projectAtaSupplierBackToList} />
				</Button>
				<Button type="button" variant="outline" onClick={onCancel} className={cn(BUTTON, "border-slate-200 bg-white text-slate-900")}>
					<Translate text={localizationConstants.createAtaBtnCancel} />
				</Button>
				<span title={saveReason ? t(saveReason) : undefined} className="flex">
					<Button
						type="button"
						onClick={onSave}
						disabled={Boolean(saveReason)}
						className={cn(BUTTON, "w-full gap-2 bg-[#111721] text-white hover:bg-slate-800")}
					>
						<Save className="h-4 w-4" aria-hidden />
						<Translate text={localizationConstants.createAtaBtnSave} />
					</Button>
				</span>
			</div>
			{saveReason && (
				<p className="px-4 pt-2 text-right text-xs text-slate-500 sm:px-6">
					<Translate text={saveReason} />
				</p>
			)}
		</div>
	);
}

export default SupplierAtaFooter;
