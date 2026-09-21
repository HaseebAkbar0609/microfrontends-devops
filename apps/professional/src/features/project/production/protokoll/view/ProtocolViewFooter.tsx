"use client";

import { PencilLine, Save, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

const BUTTON = "h-11 min-w-0 flex-1 cursor-pointer rounded-md px-3 text-sm font-medium shadow-none sm:flex-none sm:min-w-36 sm:px-8";
const SECONDARY = "bg-slate-100 text-slate-900 hover:bg-slate-200";
const GROUP = "flex w-full gap-2 sm:w-auto sm:gap-3";

export interface ProtocolViewFooterProps {
	onCancel: () => void;
	onEdit: () => void;
	onSave: () => void;
	onSend: () => void;
}

/**
 * The protocol's sticky bar, as drawn: Avbryt and Ändra on the left, Spara and
 * Skicka on the right. On a phone each pair takes a row, so no button is
 * squeezed below its label.
 */
export function ProtocolViewFooter({ onCancel, onEdit, onSave, onSend }: ProtocolViewFooterProps) {
	return (
		<div className="sticky bottom-0 z-40 border-t border-slate-200 bg-white py-3">
			<div className="flex flex-wrap items-center justify-between gap-2 px-4 sm:gap-3 sm:px-6">
				<div className={GROUP}>
					<Button type="button" variant="secondary" onClick={onCancel} className={cn(BUTTON, SECONDARY)}>
						<Translate text={localizationConstants.btnAvbryt} />
					</Button>
					<Button
						type="button"
						variant="outline"
						onClick={onEdit}
						className={cn(BUTTON, "gap-2 border-slate-200 bg-white text-slate-900")}
					>
						<PencilLine className="h-4 w-4" aria-hidden />
						<Translate text={localizationConstants.protocolEditProtocolAction} />
					</Button>
				</div>
				<div className={GROUP}>
					<Button type="button" variant="secondary" onClick={onSave} className={cn(BUTTON, "gap-2", SECONDARY)}>
						<Save className="h-4 w-4" aria-hidden />
						<Translate text={localizationConstants.btnSpara} />
					</Button>
					<Button type="button" onClick={onSend} className={cn(BUTTON, "gap-2 bg-[#111721] text-white hover:bg-slate-800")}>
						<Send className="h-4 w-4" aria-hidden />
						<Translate text={localizationConstants.btnSkicka} />
					</Button>
				</div>
			</div>
		</div>
	);
}

export default ProtocolViewFooter;
