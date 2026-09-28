"use client";

import { ArrowRight, CircleFadingPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { CostCategorySection } from "./CostCategorySection";
import { CalculationStepSidebar } from "./CalculationStepSidebar";
import { SupplierPriceListDialog } from "./SupplierPriceListDialog";
import type { useTemplateCalculation } from "../../hooks/useTemplateCalculation";

type TemplateCalculationHookReturn = ReturnType<typeof useTemplateCalculation>;

interface TemplateCalculationWorkspaceProps {
	calcHook: TemplateCalculationHookReturn;
	onNextTab?: () => void;
	onCancel?: () => void;
}

export function TemplateCalculationWorkspace({
	calcHook,
	onNextTab,
	onCancel,
}: TemplateCalculationWorkspaceProps) {
	const t = useTranslate();
	const {
		templates,
		selectedTemplateId,
		sections,
		isSaving,
		isPriceListOpen,
		setIsPriceListOpen,
		deleteSectionTarget,
		setDeleteSectionTarget,
		handleSelectTemplate,
		handleToggleSection,
		handleAddRow,
		handleUpdateRow,
		handleDeleteRow,
		handleAddSection,
		handleConfirmDeleteSection,
		handleImportPriceListItem,
		handleSave,
	} = calcHook;

	return (
		<div className="flex flex-1 flex-col overflow-hidden bg-slate-50">
			{/* Main Workspace Area with Body and Sidebar */}
			<div className="flex flex-1 flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">
				{/* Sidebar (Top on small screens with exact matching left/right gap, right side on lg screens) */}
				<div className="order-1 lg:order-2 shrink-0 px-4 pt-4 pb-1 sm:px-6 sm:pl-15 sm:pr-6 sm:pt-6 sm:pb-1 lg:p-6 lg:pl-0 lg:pb-6 lg:overflow-y-auto">
					<CalculationStepSidebar
						step={1}
						progress={50}
						isSaving={isSaving}
						showPriceListButton={calcHook.selectedMode === "mall"}
						onSave={() => void handleSave()}
						onOpenPriceList={() => setIsPriceListOpen(true)}
					/>
				</div>

				{/* Calculation Form Canvas */}
				<div className="order-2 lg:order-1 flex-1 px-4 pt-3 pb-6 sm:px-6 sm:pl-15 sm:pr-6 sm:pt-3 sm:pb-6 lg:p-6 lg:pl-15 lg:pr-6 lg:overflow-y-auto space-y-4">
					{/* Template Picker Card - only visible when mode is 'mall' */}
					{calcHook.selectedMode === "mall" && (
						<Card className="rounded-lg border border-slate-200 bg-white shadow-none">
							<CardContent className="px-4 py-3 sm:px-5 sm:py-3.5">
								<div className="flex flex-col gap-1.5 w-full sm:w-80">
									<Label className="text-sm font-medium text-slate-700">
										<Translate text={localizationConstants.calcTemplateSelectMall} />
									</Label>
									<Select
										value={selectedTemplateId}
										onValueChange={(val) => void handleSelectTemplate(val)}
									>
										<SelectTrigger className="h-10 w-full bg-white border-slate-200 text-sm font-normal text-slate-900">
											<SelectValue placeholder={t(localizationConstants.calcTemplateMallPlaceholder)} />
										</SelectTrigger>
										<SelectContent className="bg-white shadow-md border-slate-200">
											{templates.map((tmpl) => (
												<SelectItem key={tmpl.id} value={tmpl.id} className="text-sm cursor-pointer">
													{tmpl.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</CardContent>
						</Card>
					)}

					{/* Section Header with Add Section Button */}
					<div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-200 px-5 py-3 shadow-none">
						<span className="text-sm font-semibold text-slate-900">
							<Translate text={localizationConstants.calcKalkyl} />
						</span>
						<Button
							type="button"
							size="sm"
							onClick={handleAddSection}
							className="h-9 cursor-pointer gap-1.5 bg-neutral-950 px-3.5 text-xs font-medium text-white hover:bg-neutral-800 shadow-none"
						>
							<CircleFadingPlus className="h-4 w-4" />
							<Translate text={localizationConstants.calcBerNySektion} />
						</Button>
					</div>

					{/* Accordion Cost Category Sections */}
					<div className="space-y-4">
						{sections.map((sec) => (
							<CostCategorySection
								key={sec.id}
								section={sec}
								onToggle={() => handleToggleSection(sec.id)}
								onAddRow={() => handleAddRow(sec.id)}
								onUpdateRow={(rowId, patch) => handleUpdateRow(sec.id, rowId, patch)}
								onDeleteRow={(rowId) => handleDeleteRow(sec.id, rowId)}
								onDeleteSection={() => setDeleteSectionTarget(sec.id)}
							/>
						))}
					</div>
				</div>
			</div>

			{/* Sticky Bottom Navigation Bar */}
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
					onClick={onNextTab}
					className="h-9 min-w-24 cursor-pointer gap-2 rounded-md bg-neutral-950 px-5 text-sm font-medium text-white hover:bg-neutral-800 shadow-none"
				>
					<Translate text={localizationConstants.nextButton} />
					<ArrowRight className="h-4 w-4" />
				</Button>
			</div>

			{/* Delete Section Alert Dialog */}
			<AlertDialog
				open={!!deleteSectionTarget}
				onOpenChange={(open) => {
					if (!open) setDeleteSectionTarget(null);
				}}
			>
				<AlertDialogContent className="bg-white">
					<AlertDialogHeader>
						<AlertDialogTitle className="text-slate-900">
							<Translate text={localizationConstants.deleteConfirmationTitle} />
						</AlertDialogTitle>
						<AlertDialogDescription className="text-slate-600">
							<Translate text={localizationConstants.calcDeleteSection} />?
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel className="cursor-pointer border-slate-200 text-slate-700">
							<Translate text={localizationConstants.cancel} />
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleConfirmDeleteSection}
							className="cursor-pointer bg-red-600 text-white hover:bg-red-700 shadow-none"
						>
							<Translate text={localizationConstants.deleteLabel} />
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Supplier Price List Dialog */}
			<SupplierPriceListDialog
				isOpen={isPriceListOpen}
				onClose={() => setIsPriceListOpen(false)}
				sections={sections}
				onImportItem={(targetSecId, item) => {
					handleImportPriceListItem(targetSecId, item);
					setIsPriceListOpen(false);
				}}
			/>
		</div>
	);
}
