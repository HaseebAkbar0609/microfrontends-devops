"use client";

import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { CalculationSummaryTable } from "./CalculationSummaryTable";
import { OverheadCostTable } from "./OverheadCostTable";
import { SammanstallningBreakdownCard } from "./SammanstallningBreakdownCard";
import { SammanfattningStepSidebar } from "./SammanfattningStepSidebar";
import type { useTemplateCalculation } from "../../../hooks/useTemplateCalculation";

type TemplateCalculationHookReturn = ReturnType<typeof useTemplateCalculation>;

interface SammanfattningWorkspaceProps {
	calcHook: TemplateCalculationHookReturn;
	onCancel?: () => void;
}

export function SammanfattningWorkspace({
	calcHook,
	onCancel,
}: SammanfattningWorkspaceProps) {
	const {
		summaryComputedRows,
		calculationSummaryTotals,
		overheadComputedRows,
		overheadTotals,
		totalCombinedDelsumma,
		finalOfferSum,
		vinstPct,
		setVinstPct,
		saveAsTemplate,
		setSaveAsTemplate,
		isSaving,
		handleAddOverheadRow,
		handleDeleteOverheadRow,
		handleSave,
	} = calcHook;

	return (
		<div className="flex flex-1 flex-col overflow-hidden bg-slate-50">
			{/* Main Workspace Area with Body and Sidebar */}
			<div className="flex flex-1 flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">
				{/* Step 2/2 Sidebar (Top on small screens with matching margin, right side on lg screens) */}
				<div className="order-1 lg:order-2 shrink-0 px-4 pt-4 pb-1 sm:px-6 sm:pl-15 sm:pr-6 sm:pt-6 sm:pb-1 lg:p-6 lg:pl-0 lg:pb-6 lg:overflow-y-auto">
					<SammanfattningStepSidebar
						saveAsTemplate={saveAsTemplate}
						onToggleSaveAsTemplate={setSaveAsTemplate}
					/>
				</div>

				{/* Summary Cards Canvas */}
				<div className="order-2 lg:order-1 flex-1 px-4 pt-3 pb-6 sm:px-6 sm:pl-15 sm:pr-6 sm:pt-3 sm:pb-6 lg:p-6 lg:pl-15 lg:pr-6 lg:overflow-y-auto space-y-5">
					{/* 1. Calculation Card */}
					<CalculationSummaryTable
						rows={summaryComputedRows}
						totals={calculationSummaryTotals}
					/>

					{/* 2. Overhead Card */}
					<OverheadCostTable
						rows={overheadComputedRows}
						totals={overheadTotals}
						onAddRow={handleAddOverheadRow}
						onDeleteRow={handleDeleteOverheadRow}
					/>

					{/* 3. Sammanställning Breakdown Card */}
					<SammanstallningBreakdownCard
						summaKalkyl={calculationSummaryTotals.totalSubtotal}
						summaOverhead={overheadTotals.totalDelsumma}
						delsumma={totalCombinedDelsumma}
						vinstPct={vinstPct}
						finalOfferSum={finalOfferSum}
						onChangeVinstPct={setVinstPct}
					/>
				</div>
			</div>

			{/* Sticky Bottom Bar */}
			<div className="flex h-16 items-center justify-end gap-3 border-t border-slate-200 bg-white px-6 sm:pl-15 sm:pr-6">
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={onCancel}
					className="h-9 min-w-24 cursor-pointer rounded-md border-slate-200 bg-white px-5 text-sm font-normal text-slate-900 hover:bg-slate-50 shadow-none"
				>
					<Translate text={localizationConstants.cancelButton} />
				</Button>

				<Button
					type="button"
					size="sm"
					onClick={() => void handleSave()}
					disabled={isSaving}
					className="h-9 min-w-24 cursor-pointer gap-2 rounded-md bg-neutral-950 px-5 text-sm font-medium text-white hover:bg-neutral-800 shadow-none disabled:opacity-50"
				>
					<Save className="h-4 w-4" />
					<Translate text={localizationConstants.saveButton} />
				</Button>
			</div>
		</div>
	);
}
