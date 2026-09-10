"use client";

import { ArrowRight, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

export interface WarrantyDetailFooterProps {
	onCancel: () => void;
	onSave: () => void;
	onPreview: () => void;
}

/** The frame's sticky Avbryt / Spara / Förhandsgranska bar. */
export function WarrantyDetailFooter({
	onCancel,
	onSave,
	onPreview,
}: WarrantyDetailFooterProps) {
	return (
		<div className="mt-auto sticky -bottom-4 z-20 -mx-3 sm:-mx-6 -mb-4 border-t border-slate-200 bg-white py-3 px-4 sm:px-6 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 shadow-md">
			<Button
				type="button"
				variant="outline"
				onClick={onCancel}
				className="w-full sm:w-[140px] sm:min-w-[140px] h-[44px] px-4 py-2 rounded-lg border-slate-200 bg-white hover:bg-slate-50 text-slate-900 font-sans text-sm font-medium shadow-none cursor-pointer whitespace-nowrap"
			>
				<Translate text={localizationConstants.cancel} />
			</Button>

			<Button
				type="button"
				onClick={onSave}
				className="w-full sm:w-[140px] sm:min-w-[140px] h-[44px] px-4 py-2 rounded-lg border border-transparent bg-zinc-100 hover:bg-zinc-200 text-slate-900 font-sans text-sm font-medium shadow-none cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap"
			>
				<Save className="h-4 w-4 text-slate-800 shrink-0" strokeWidth={1.75} />
				<span>
					<Translate text={localizationConstants.saveButton} />
				</span>
			</Button>

			<Button
				type="button"
				onClick={onPreview}
				className="w-full sm:w-auto sm:min-w-[185px] h-[44px] px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-sans text-sm font-medium shadow-none cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap"
			>
				<span>
					<Translate text={localizationConstants.previewButton} />
				</span>
				<ArrowRight className="h-4 w-4 shrink-0" />
			</Button>
		</div>
	);
}

export default WarrantyDetailFooter;
