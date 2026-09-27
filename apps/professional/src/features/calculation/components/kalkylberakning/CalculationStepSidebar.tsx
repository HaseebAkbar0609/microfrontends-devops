"use client";

import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

import { cn } from "@/lib/utils";

interface CalculationStepSidebarProps {
	step?: 1 | 2;
	progress?: number;
	isSaving?: boolean;
	showPriceListButton?: boolean;
	className?: string;
	onSave?: () => void;
	onOpenPriceList?: () => void;
}

export function CalculationStepSidebar({
	step = 1,
	progress = 50,
	isSaving = false,
	showPriceListButton = true,
	className,
	onSave,
	onOpenPriceList,
}: CalculationStepSidebarProps) {
	return (
		<div className={cn("w-full lg:w-72 shrink-0", className)}>
			<Card className="rounded-lg border border-slate-200 bg-white px-4 py-3 sm:px-5 sm:py-3.5 shadow-none">
				<div className="flex flex-col gap-3">
					{/* Step Progress */}
					<div className="flex items-center justify-between text-sm font-medium text-slate-900">
						<span>
							<Translate text={localizationConstants.stepLabel} /> {step}/2
						</span>
					</div>
					<div
						className="h-2 w-full overflow-hidden rounded-full bg-slate-100"
						role="progressbar"
						aria-valuenow={progress}
						aria-valuemin={0}
						aria-valuemax={100}
					>
						<div
							className="h-full rounded-full bg-slate-900 transition-all duration-300"
							style={{ width: `${progress}%` }}
						/>
					</div>

					{/* Action Buttons */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5 mt-1">
						{/* Action: Spara */}
						<Button
							type="button"
							onClick={onSave}
							disabled={isSaving}
							className="h-10 w-full cursor-pointer gap-2 bg-neutral-950 text-sm font-medium text-white hover:bg-neutral-800 shadow-none disabled:opacity-50"
						>
							{isSaving ? (
								<Loader2 className="h-4 w-4 animate-spin text-white" />
							) : (
								<Send className="h-4 w-4" />
							)}
							<Translate text={localizationConstants.saveButton} />
						</Button>

						{/* Action: Leverantörs prislistor (Only shown if enabled) */}
						{showPriceListButton && (
							<Button
								type="button"
								onClick={onOpenPriceList}
								className="h-10 w-full cursor-pointer gap-2 bg-emerald-600 text-sm font-medium text-white hover:bg-emerald-700 shadow-none"
							>
								<Send className="h-4 w-4" />
								<Translate text={localizationConstants.calcTemplateSupplierPriceLists} />
							</Button>
						)}
					</div>
				</div>
			</Card>
		</div>
	);
}
