"use client";

import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { cn } from "@/lib/utils";

interface SammanfattningStepSidebarProps {
	saveAsTemplate: boolean;
	onToggleSaveAsTemplate: (checked: boolean) => void;
	className?: string;
}

export function SammanfattningStepSidebar({
	saveAsTemplate,
	onToggleSaveAsTemplate,
	className,
}: SammanfattningStepSidebarProps) {
	return (
		<div className={cn("w-full lg:w-72 shrink-0", className)}>
			<Card className="rounded-lg border border-slate-200 bg-white px-4 py-3 sm:px-5 sm:py-3.5 shadow-none">
				<div className="flex flex-col gap-3">
					{/* Step 2/2 Header */}
					<div className="flex items-center justify-between text-sm font-semibold text-slate-900">
						<span>
							<Translate text={localizationConstants.stepLabel} /> 2/2
						</span>
					</div>

					{/* 100% Filled Progress Bar */}
					<div
						className="h-2 w-full overflow-hidden rounded-full bg-slate-100"
						role="progressbar"
						aria-valuenow={100}
						aria-valuemin={0}
						aria-valuemax={100}
					>
						<div className="h-full w-full rounded-full bg-slate-900 transition-all duration-300" />
					</div>

					{/* Divider */}
					<div className="border-t border-slate-100 my-0.5" />

					{/* Save Kalkyl As Template Checkbox */}
					<div className="flex items-center gap-2">
						<Checkbox
							id="save-as-template-chk"
							checked={saveAsTemplate}
							onCheckedChange={(checked) => onToggleSaveAsTemplate(!!checked)}
							className="h-4 w-4 rounded border-slate-300 data-[state=checked]:bg-slate-900 data-[state=checked]:border-slate-900"
						/>
						<Label
							htmlFor="save-as-template-chk"
							className="text-xs font-normal text-slate-700 cursor-pointer select-none leading-tight"
						>
							<Translate text={localizationConstants.calcBerSaveAsTemplate} />
						</Label>
					</div>
				</div>
			</Card>
		</div>
	);
}
