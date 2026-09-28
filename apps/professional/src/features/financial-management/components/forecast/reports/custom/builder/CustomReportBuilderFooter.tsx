"use client";

import { Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

const BUTTON = "h-11 cursor-pointer rounded-md px-8 text-sm font-medium shadow-none sm:min-w-40";
const PRIMARY = "bg-[#111721] text-white hover:bg-slate-800";

export interface CustomReportBuilderFooterProps {
	onCancel: () => void;
	onPreview: () => void;
	onSave: () => void;
}

/** The sticky bar the frame draws: Avbryt · Förhandsvisning · Spara. */
export function CustomReportBuilderFooter({ onCancel, onPreview, onSave }: CustomReportBuilderFooterProps) {
	return (
		<div className="sticky bottom-0 z-40 border-t border-slate-200 bg-white py-3">
			<div className="flex flex-col-reverse items-stretch justify-end gap-2 px-4 sm:flex-row sm:items-center sm:gap-3 sm:px-6">
				<Button
					type="button"
					variant="outline"
					onClick={onCancel}
					className={cn(BUTTON, "border-slate-200 bg-white text-slate-900")}
				>
					<Translate text={localizationConstants.cancel} />
				</Button>
				<Button type="button" onClick={onPreview} className={cn(BUTTON, "gap-2", PRIMARY)}>
					<Translate text={localizationConstants.forecastCustomReportsPreview} />
					<Save className="h-4 w-4" aria-hidden />
				</Button>
				<Button type="button" onClick={onSave} className={cn(BUTTON, "gap-2", PRIMARY)}>
					<Translate text={localizationConstants.buttonSave} />
					<Save className="h-4 w-4" aria-hidden />
				</Button>
			</div>
		</div>
	);
}

export default CustomReportBuilderFooter;
