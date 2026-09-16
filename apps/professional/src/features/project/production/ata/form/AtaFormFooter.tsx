"use client";

import { ArrowLeft, ArrowRight, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import type { AtaStep } from "./useAtaForm";

const BUTTON = "h-11 cursor-pointer rounded-md px-8 text-sm font-medium shadow-none sm:min-w-40";
const PRIMARY = "bg-[#111721] text-white hover:bg-slate-800";

export interface AtaFormFooterProps {
	step: AtaStep;
	/** Why Spara is unavailable (a locked ÄTA), or `null`. */
	saveReason: TranslationKeys | null;
	onCancel: () => void;
	onSave: () => void;
	onPreview: () => void;
	onBack: () => void;
}

/**
 * The sticky bar: Avbryt · Spara · Förhandsgranska → on step 1. The frame draws
 * the same three on step 2, but previewing the preview does nothing, so step 2
 * offers ← Tillbaka to the fields instead and Spara becomes the primary action.
 */
export function AtaFormFooter({ step, saveReason, onCancel, onSave, onPreview, onBack }: AtaFormFooterProps) {
	const t = useTranslate();

	return (
		<div className="sticky bottom-0 z-40 border-t border-slate-200 bg-white py-3">
			<div className="flex flex-col-reverse items-stretch justify-end gap-2 px-4 sm:flex-row sm:items-center sm:gap-3 sm:px-6">
				<Button type="button" variant="outline" onClick={onCancel} className={cn(BUTTON, "border-slate-200 bg-white text-slate-900")}>
					<Translate text={localizationConstants.createAtaBtnCancel} />
				</Button>
				{step === 2 && (
					<Button type="button" variant="outline" onClick={onBack} className={cn(BUTTON, "gap-2 border-slate-200 bg-white text-slate-900")}>
						<ArrowLeft className="h-4 w-4" aria-hidden />
						<Translate text={localizationConstants.backButton} />
					</Button>
				)}
				{/* Wrapped so a locked ÄTA's reason still shows on the disabled button. */}
				<span title={saveReason ? t(saveReason) : undefined} className="flex">
					<Button
						type="button"
						onClick={onSave}
						disabled={Boolean(saveReason)}
						className={cn(BUTTON, "w-full gap-2", step === 1 ? "bg-slate-100 text-slate-900 hover:bg-slate-200" : PRIMARY)}
					>
						<Save className="h-4 w-4" aria-hidden />
						<Translate text={localizationConstants.createAtaBtnSave} />
					</Button>
				</span>
				{step === 1 && (
					<Button type="button" onClick={onPreview} className={cn(BUTTON, "gap-2", PRIMARY)}>
						<Translate text={localizationConstants.createAtaBtnPreview} />
						<ArrowRight className="h-4 w-4" aria-hidden />
					</Button>
				)}
			</div>
			{saveReason && (
				<p className="px-4 pt-2 text-right text-xs text-slate-500 sm:px-6">
					<Translate text={saveReason} />
				</p>
			)}
		</div>
	);
}

export default AtaFormFooter;
