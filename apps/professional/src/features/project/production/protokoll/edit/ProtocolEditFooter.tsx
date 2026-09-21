"use client";

import { Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

const BUTTON = "h-11 min-w-0 flex-1 cursor-pointer rounded-md px-3 text-sm font-medium shadow-none sm:flex-none sm:min-w-40 sm:px-8";

/** The edit page's sticky bar: Avbryt and Spara. Spara submits the form it sits in. */
export function ProtocolEditFooter({ onCancel }: { onCancel: () => void }) {
	return (
		<div className="sticky bottom-0 z-40 border-t border-slate-200 bg-white py-3">
			<div className="flex items-center justify-end gap-2 px-4 sm:gap-3 sm:px-6">
				<Button
					type="button"
					variant="secondary"
					onClick={onCancel}
					className={cn(BUTTON, "bg-slate-100 text-slate-900 hover:bg-slate-200")}
				>
					<Translate text={localizationConstants.btnAvbryt} />
				</Button>
				<Button type="submit" className={cn(BUTTON, "gap-2 bg-[#111721] text-white hover:bg-slate-800")}>
					<Save className="h-4 w-4" aria-hidden />
					<Translate text={localizationConstants.btnSpara} />
				</Button>
			</div>
		</div>
	);
}

export default ProtocolEditFooter;
