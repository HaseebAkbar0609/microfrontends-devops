"use client";

import { ArrowRight, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

export interface TimeplanFormFooterProps {
	onCancel: () => void;
	onSave: () => void;
	/**
	 * Saves and opens the plan's Gantt — the form's "Tidsplan →". Omit it on the
	 * Gantt itself, where Spara becomes the primary button, as that frame draws.
	 */
	onOpenPlan?: () => void;
	disabled?: boolean;
}

const BUTTON = "h-11 cursor-pointer rounded-md px-8 text-sm font-medium sm:min-w-40";
const PRIMARY = "bg-[#111721] text-white hover:bg-slate-800";

/**
 * The sticky action bar the form and the Gantt share: Avbryt, Spara, and on the
 * form a primary "Tidsplan →".
 *
 * Inline sticky bars are how this app's create pages do it; there is no shared
 * footer, and `WarrantyDetailFooter` — the nearest match — hardcodes its primary
 * label and tunes its margins to its own parent.
 */
export function TimeplanFormFooter({
	onCancel,
	onSave,
	onOpenPlan,
	disabled = false,
}: TimeplanFormFooterProps) {
	return (
		<div className="sticky bottom-0 z-40 border-t border-slate-200 bg-white py-3">
			<div className="flex flex-col-reverse items-stretch justify-end gap-2 px-6 sm:flex-row sm:items-center sm:gap-3">
				<Button
					type="button"
					variant="outline"
					onClick={onCancel}
					className={cn(BUTTON, "border-slate-200 bg-white text-slate-900")}
				>
					<Translate text={localizationConstants.cancel} />
				</Button>
				<Button
					type="button"
					onClick={onSave}
					disabled={disabled}
					className={cn(
						BUTTON,
						"gap-2 shadow-none",
						onOpenPlan ? "bg-slate-100 text-slate-900 hover:bg-slate-200" : PRIMARY,
					)}
				>
					<Save className="h-4 w-4" aria-hidden />
					<Translate text={localizationConstants.saveButton} />
				</Button>
				{onOpenPlan && (
					<Button
						type="button"
						onClick={onOpenPlan}
						disabled={disabled}
						className={cn(BUTTON, "gap-2 text-base", PRIMARY)}
					>
						<Translate text={localizationConstants.projectSectionTidsplan} />
						<ArrowRight className="h-4 w-4" aria-hidden />
					</Button>
				)}
			</div>
		</div>
	);
}

export default TimeplanFormFooter;
