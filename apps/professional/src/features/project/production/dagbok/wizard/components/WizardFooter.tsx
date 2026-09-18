"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import type { WizardStep } from "../useNewDiaryWizard";

const BUTTON = "h-11 cursor-pointer rounded-md px-8 text-sm font-medium shadow-none sm:min-w-40";

export interface WizardFooterProps {
	step: WizardStep;
	onCancel: () => void;
	onBack: () => void;
	onNext: () => void;
}

/** The wizard's sticky bar: Avbryt · ← Tillbaka (step 2) · Nästa →. */
export function WizardFooter({ step, onCancel, onBack, onNext }: WizardFooterProps) {
	return (
		<div className="sticky bottom-0 z-40 -mx-4 border-t border-slate-200 bg-white py-3 sm:-mx-6 print:hidden">
			<div className="flex flex-col-reverse items-stretch justify-end gap-2 px-4 sm:flex-row sm:items-center sm:gap-3 sm:px-6">
				<Button type="button" variant="outline" onClick={onCancel} className={cn(BUTTON, "border-slate-200 bg-white text-slate-900")}>
					<Translate text={localizationConstants.cancel} />
				</Button>
				{step === 2 && (
					<Button type="button" variant="outline" onClick={onBack} className={cn(BUTTON, "gap-2 border-slate-200 bg-white text-slate-900")}>
						<ArrowLeft className="h-4 w-4" aria-hidden />
						<Translate text={localizationConstants.projectDiaryBack} />
					</Button>
				)}
				<Button type="button" onClick={onNext} className={cn(BUTTON, "gap-2 bg-[#111721] text-white hover:bg-slate-800")}>
					<Translate text={localizationConstants.projectDiaryNext} />
					<ArrowRight className="h-4 w-4" aria-hidden />
				</Button>
			</div>
		</div>
	);
}

export default WizardFooter;
