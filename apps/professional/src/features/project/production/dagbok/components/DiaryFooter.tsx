"use client";

import { Save, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

const BUTTON = "h-11 cursor-pointer rounded-md px-6 text-sm font-medium shadow-none sm:min-w-36";

export interface DiaryFooterProps {
	dirty: boolean;
	onCancel: () => void;
	onSaveDraft: () => void;
	onPublish: () => void;
}

/**
 * A draft's sticky bar: Avbryt (only with changes to throw away), Spara utkast
 * and Publicera. A published diary has no bar — there is nothing left to do.
 */
export function DiaryFooter({ dirty, onCancel, onSaveDraft, onPublish }: DiaryFooterProps) {
	return (
		<div className="sticky bottom-0 z-40 -mx-4 border-t border-slate-200 bg-white py-3 sm:-mx-6 print:hidden">
			<div className="flex flex-col-reverse items-stretch justify-end gap-2 px-4 sm:flex-row sm:items-center sm:gap-3 sm:px-6">
				<Button type="button" variant="outline" onClick={onCancel} disabled={!dirty} className={cn(BUTTON, "border-slate-200 bg-white text-slate-900")}>
					<Translate text={localizationConstants.cancel} />
				</Button>
				<Button type="button" variant="outline" onClick={onSaveDraft} className={cn(BUTTON, "gap-2 border-slate-200 bg-white text-slate-900")}>
					<Save className="h-4 w-4" aria-hidden />
					<Translate text={localizationConstants.projectDiarySaveDraft} />
				</Button>
				<Button type="button" onClick={onPublish} className={cn(BUTTON, "gap-2 bg-[#111721] text-white hover:bg-slate-800")}>
					<Send className="h-4 w-4" aria-hidden />
					<Translate text={localizationConstants.projectDiaryPublish} />
				</Button>
			</div>
		</div>
	);
}

export default DiaryFooter;
