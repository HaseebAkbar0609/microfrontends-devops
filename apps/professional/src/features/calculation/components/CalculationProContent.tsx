"use client";

import { useState } from "react";
import { Plus, Save, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useCalculationPro } from "../hooks/useCalculationPro";

const CHECKBOX_CLASS =
	"border-slate-400 data-[state=checked]:bg-neutral-950 data-[state=checked]:border-neutral-950 data-[state=checked]:text-white rounded-sm";

export function CalculationProContent() {
	const t = useTranslate();
	const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

	const {
		isSaving,
		isPurchasing,
		categories,
		defaultSettings,
		selectedType,
		industryTypes,
		industryRows,
		handleToggleSetting,
		handleSelectType,
		handleToggleRow,
		handleAddRow,
		handleDeleteRow,
		handlePurchaseLicense,
		handleSave,
		handleCancel,
	} = useCalculationPro();

	return (
		<>
			<div className="flex flex-1 flex-col gap-4">
				{/* ── 1. Industry category Card ────────────────────────────────────── */}
				<div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-xs">
					{/* Header */}
					<div className="flex items-center justify-between bg-slate-200 px-4 sm:px-5 py-3">
						<h2 className="text-sm sm:text-base font-semibold text-slate-900">
							<Translate text={localizationConstants.calcProIndustryCategory} />
						</h2>
						<Button
							size="sm"
							onClick={() => void handlePurchaseLicense()}
							disabled={isPurchasing}
							className="h-8 cursor-pointer gap-1.5 rounded-md bg-neutral-950 px-3 text-xs font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
						>
							{isPurchasing ? (
								<Loader2 size={13} className="animate-spin text-white" aria-hidden={true} />
							) : (
								<Plus size={13} aria-hidden={true} />
							)}
							<Translate text={localizationConstants.calcProPurchaseLicense} />
						</Button>
					</div>

					{/* Category Boxes */}
					<div className="p-4 sm:p-5">
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							{categories.map((item) => (
								<div
									key={item.id}
									className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-xs"
								>
									<span className="text-sm font-medium text-slate-900">
										{item.label}
									</span>
									{item.active && (
										<span className="inline-flex items-center rounded-md bg-emerald-600 px-2.5 py-0.5 text-xs font-medium text-white shadow-none">
											<Translate text={localizationConstants.activeLabel} />
										</span>
									)}
								</div>
							))}
						</div>
					</div>
				</div>

				{/* ── 2. Default settings Card ────────────────────────────────────── */}
				<div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-xs">
					{/* Header */}
					<div className="bg-slate-200 px-4 sm:px-5 py-3">
						<h2 className="text-sm sm:text-base font-semibold text-slate-900">
							<Translate text={localizationConstants.calcProDefaultSettings} />
						</h2>
					</div>

					{/* Checkbox Rows */}
					<div className="flex flex-col gap-2.5 p-4 sm:p-5">
						<Label
							htmlFor="markupByCalc"
							className="flex w-full max-w-xl cursor-pointer items-center gap-3 rounded-md border border-slate-200 px-3.5 py-2.5 hover:bg-slate-50 transition-colors mb-0 text-slate-700 font-normal"
						>
							<Checkbox
								id="markupByCalc"
								checked={defaultSettings.markupByCalc}
								onCheckedChange={() => handleToggleSetting("markupByCalc")}
								className={CHECKBOX_CLASS}
							/>
							<span className="text-sm font-normal text-slate-700 select-none">
								<Translate text={localizationConstants.calcProMarkupByCalc} />
							</span>
						</Label>

						<Label
							htmlFor="baseCosts"
							className="flex w-full max-w-xl cursor-pointer items-center gap-3 rounded-md border border-slate-200 px-3.5 py-2.5 hover:bg-slate-50 transition-colors mb-0 text-slate-700 font-normal"
						>
							<Checkbox
								id="baseCosts"
								checked={defaultSettings.baseCosts}
								onCheckedChange={() => handleToggleSetting("baseCosts")}
								className={CHECKBOX_CLASS}
							/>
							<span className="text-sm font-normal text-slate-700 select-none">
								<Translate text={localizationConstants.calcBaseCosts} />
							</span>
						</Label>

						<Label
							htmlFor="aPriceList"
							className="flex w-full max-w-xl cursor-pointer items-center gap-3 rounded-md border border-slate-200 px-3.5 py-2.5 hover:bg-slate-50 transition-colors mb-0 text-slate-700 font-normal"
						>
							<Checkbox
								id="aPriceList"
								checked={defaultSettings.aPriceList}
								onCheckedChange={() => handleToggleSetting("aPriceList")}
								className={CHECKBOX_CLASS}
							/>
							<span className="text-sm font-normal text-slate-700 select-none">
								<Translate text={localizationConstants.calcProAPriceList} />
							</span>
						</Label>
					</div>
				</div>

				{/* ── 3. Industry settings Card (with Footer Actions inside) ──────── */}
				<div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-xs">
					{/* Header */}
					<div className="bg-slate-200 px-4 sm:px-5 py-3">
						<h2 className="text-sm sm:text-base font-semibold text-slate-900">
							<Translate text={localizationConstants.calcProIndustrySettings} />
						</h2>
					</div>

					<div className="flex flex-col gap-4 p-4 sm:p-5">
						{/* Type Dropdown */}
						<div className="flex flex-col gap-1.5">
							<Label htmlFor="industryTypeSelect" className="text-sm font-medium text-slate-900 mb-0">
								<Translate text={localizationConstants.calcProType} />
							</Label>
							<Select value={selectedType} onValueChange={handleSelectType}>
								<SelectTrigger
									id="industryTypeSelect"
									className="h-10 w-full max-w-xl rounded-md border-slate-200 bg-white text-sm text-slate-800 shadow-none focus:ring-0 [&_svg]:opacity-100 [&_svg]:text-slate-500"
								>
									<SelectValue placeholder={selectedType} />
								</SelectTrigger>
								<SelectContent className="bg-white border-slate-200 shadow-md">
									{industryTypes.map((type) => (
										<SelectItem
											key={type}
											value={type}
											className="cursor-pointer text-sm"
										>
											{type}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Industry Rows */}
						<div className="flex flex-col gap-2.5 pt-1">
							{industryRows.map((row) => (
								<div key={row.id} className="flex items-center gap-3 w-full max-w-xl">
									<Label
										htmlFor={`row-${row.id}`}
										className="flex flex-1 cursor-pointer items-center gap-3 rounded-md border border-slate-200 px-3.5 py-2.5 hover:bg-slate-50 transition-colors mb-0 text-slate-700 font-normal"
									>
										<Checkbox
											id={`row-${row.id}`}
											checked={row.checked}
											onCheckedChange={() => handleToggleRow(row.id)}
											className={CHECKBOX_CLASS}
										/>
										<span className="flex-1 text-sm font-normal text-slate-700 select-none">
											{row.label}
										</span>
									</Label>
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() => setDeleteTargetId(row.id)}
										className="h-10 w-10 shrink-0 cursor-pointer rounded-md border-slate-200 bg-white p-0 text-slate-500 hover:bg-slate-50 hover:text-red-600 shadow-none"
										aria-label={t(localizationConstants.deleteLabel)}
									>
										<Trash2 size={16} aria-hidden={true} />
									</Button>
								</div>
							))}
						</div>

						{/* New Row Button */}
						<div className="pt-1">
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={handleAddRow}
								className="h-10 w-full max-w-xl cursor-pointer gap-1.5 rounded-md border border-dashed border-slate-300 bg-slate-50/50 text-sm font-medium text-slate-700 hover:bg-slate-100 shadow-none"
							>
								<Plus size={14} aria-hidden={true} />
								<Translate text={localizationConstants.calcNewRow} />
							</Button>
						</div>

						{/* Footer Actions inside Card with divider line */}
						<div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 border-t border-slate-200 pt-4 mt-2">
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={handleCancel}
								className="h-9 w-full sm:w-auto sm:min-w-24 cursor-pointer items-center justify-center rounded-md border-none bg-bg-secondary px-5 text-sm font-medium text-slate-900 shadow-none hover:bg-bg-secondary/80"
							>
								<Translate text={localizationConstants.cancel} />
							</Button>
							<Button
								size="sm"
								onClick={() => void handleSave()}
								disabled={isSaving}
								className="h-9 w-full sm:w-auto sm:min-w-24 cursor-pointer items-center justify-center gap-2 rounded-md bg-neutral-950 px-5 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
							>
								{isSaving ? (
									<Loader2 size={15} className="animate-spin text-white" aria-hidden={true} />
								) : (
									<Save size={15} className="shrink-0 text-white" aria-hidden={true} />
								)}
								<Translate text={localizationConstants.save} />
							</Button>
						</div>
					</div>
				</div>
			</div>

			{/* Delete Row Confirmation Dialog */}
			<AlertDialog
				open={!!deleteTargetId}
				onOpenChange={(open) => {
					if (!open) setDeleteTargetId(null);
				}}
			>
				<AlertDialogContent className="bg-white">
					<AlertDialogHeader>
						<AlertDialogTitle>
							{t(localizationConstants.deleteConfirmationTitle)}
						</AlertDialogTitle>
						<AlertDialogDescription>
							{t(localizationConstants.deleteConfirmationDescription)}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel className="cursor-pointer">
							{t(localizationConstants.cancel)}
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => {
								if (deleteTargetId) {
									void handleDeleteRow(deleteTargetId);
									setDeleteTargetId(null);
								}
							}}
							className="cursor-pointer bg-neutral-950 text-white hover:bg-neutral-800"
						>
							{t(localizationConstants.deleteLabel)}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
