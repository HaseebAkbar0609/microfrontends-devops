"use client";

import { Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

const BUTTON = "h-11 min-w-0 flex-1 cursor-pointer rounded-md px-3 text-sm font-medium shadow-none sm:flex-none sm:px-8 sm:min-w-40";

export interface PlanFooterProps {
	onCancel: () => void;
	onSave: () => void;
	onSend: () => void;
}

/**
 * The view's sticky action bar: Avbryt, Spara, Skicka. The frame spells the
 * last "Sklicka" and gives it a save icon; it sends, so it says Skicka and
 * carries the send icon the list's Skicka uses.
 */
export function PlanFooter({ onCancel, onSave, onSend }: PlanFooterProps) {
	return (
		<div className="sticky bottom-0 z-40 border-t border-slate-200 bg-white py-3">
			{/* One row at every width: stacked, three full-width buttons would cover a
			    phone's screen from a sticky bar. */}
			<div className="flex items-center justify-end gap-2 px-4 sm:gap-3 sm:px-6">
				<Button
					type="button"
					variant="secondary"
					onClick={onCancel}
					className={cn(BUTTON, "bg-slate-100 text-slate-900 hover:bg-slate-200")}
				>
					<Translate text={localizationConstants.btnAvbryt} />
				</Button>
				<Button
					type="button"
					variant="secondary"
					onClick={onSave}
					className={cn(BUTTON, "bg-slate-100 text-slate-900 hover:bg-slate-200")}
				>
					<Translate text={localizationConstants.btnSpara} />
				</Button>
				<Button
					type="button"
					onClick={onSend}
					className={cn(BUTTON, "gap-2 bg-[#111721] text-white hover:bg-slate-800")}
				>
					<Send className="h-4 w-4" aria-hidden />
					<Translate text={localizationConstants.btnSkicka} />
				</Button>
			</div>
		</div>
	);
}

export default PlanFooter;
