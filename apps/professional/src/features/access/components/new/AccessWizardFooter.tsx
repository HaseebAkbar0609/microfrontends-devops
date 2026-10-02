"use client";

import { ArrowRight, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

interface AccessWizardFooterProps {
	onCancel: () => void;
	onSave: () => void;
	onNext: () => void;
	/** Next on step 1, Preview on step 2. */
	nextLabel: TranslationKeys;
}

/** The bar at the bottom of the wizard: Cancel, Save and Next (or Preview), right-aligned as in the Figma frames. */
export function AccessWizardFooter({ onCancel, onSave, onNext, nextLabel }: AccessWizardFooterProps) {
	return (
		<div className="sticky bottom-0 mt-auto border-t border-slate-200 bg-white px-5 py-3">
			<div className="flex flex-wrap justify-end gap-3">
				<Button type="button" variant="outline" className="h-11 w-40 cursor-pointer" onClick={onCancel}>
					<Translate text={localizationConstants.cancel} />
				</Button>
				<Button type="button" className="h-11 w-40 cursor-pointer gap-2 bg-zinc-900 text-white hover:bg-zinc-800" onClick={onSave}>
					<Translate text={localizationConstants.save} />
					<Save className="h-4 w-4" aria-hidden />
				</Button>
				<Button type="button" className="h-11 w-40 cursor-pointer gap-2 bg-zinc-900 text-white hover:bg-zinc-800" onClick={onNext}>
					<Translate text={nextLabel} />
					<ArrowRight className="h-4 w-4" aria-hidden />
				</Button>
			</div>
		</div>
	);
}
