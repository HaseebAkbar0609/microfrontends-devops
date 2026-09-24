"use client";

import { useState } from "react";
import {
	Plus,
	Save,
	Trash2,
	Loader2,
	DoorClosed,
	LayoutGrid,
	Layers,
	FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useQuickAiCalc } from "../hooks/useQuickAiCalc";

const CHECKBOX_CLASS =
	"border-slate-400 data-[state=checked]:bg-neutral-950 data-[state=checked]:border-neutral-950 data-[state=checked]:text-white rounded-sm";

function renderComponentIcon(icon: string) {
	switch (icon) {
		case "door":
			return <DoorClosed size={16} className="text-slate-700" aria-hidden={true} />;
		case "window":
			return <LayoutGrid size={16} className="text-slate-700" aria-hidden={true} />;
		case "wall":
			return <Layers size={16} className="text-slate-700" aria-hidden={true} />;
		default:
			return <FileText size={16} className="text-slate-700" aria-hidden={true} />;
	}
}

export function CalculationQuickAiContent() {
	const t = useTranslate();
	const [deleteRowTarget, setDeleteRowTarget] = useState<{
		sectionId: string;
		rowId: string;
	} | null>(null);
	const [deleteSectionTargetId, setDeleteSectionTargetId] = useState<string | null>(null);

	// Add component dialog
	const [isAddComponentOpen, setIsAddComponentOpen] = useState(false);
	const [newComponentLabel, setNewComponentLabel] = useState("");

	// Create new section dialog
	const [isCreateSectionOpen, setIsCreateSectionOpen] = useState(false);
	const [newSectionTitle, setNewSectionTitle] = useState("");

	const {
		isSaving,
		isPurchasing,
		licenses,
		defaultSettings,
		components,
		sections,
		handleToggleSetting,
		handlePurchaseLicense,
		handleAddComponent,
		handleToggleSectionSelectAll,
		handleToggleRow,
		handleAddRow,
		handleDeleteRow,
		handleAddSection,
		handleDeleteSection,
		handleSave,
		handleCancel,
	} = useQuickAiCalc();

	return (
		<>
			<div className="flex flex-1 flex-col gap-4">
				{/* ── 1. License QuickAICalc Card ─────────────────────────────────── */}
				<div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-xs">
					{/* Header */}
					<div className="flex items-center justify-between bg-slate-200 px-4 sm:px-5 py-3">
						<h2 className="text-sm sm:text-base font-semibold text-slate-900">
							<Translate text={localizationConstants.calcQuickAiLicenseTitle} />
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

					{/* License Boxes */}
					<div className="p-4 sm:p-5">
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							{licenses.map((lic) => (
								<div
									key={lic.id}
									className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-xs"
								>
									<span className="text-sm font-medium text-slate-900">
										{lic.label}
									</span>
									{lic.active && (
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
							htmlFor="qa-markupByCalc"
							className="flex w-full max-w-xl cursor-pointer items-center gap-3 rounded-md border border-slate-200 px-3.5 py-2.5 hover:bg-slate-50 transition-colors mb-0 text-slate-700 font-normal"
						>
							<Checkbox
								id="qa-markupByCalc"
								checked={defaultSettings.markupByCalc}
								onCheckedChange={() => handleToggleSetting("markupByCalc")}
								className={CHECKBOX_CLASS}
							/>
							<span className="text-sm font-normal text-slate-700 select-none">
								<Translate text={localizationConstants.calcProMarkupByCalc} />
							</span>
						</Label>

						<Label
							htmlFor="qa-baseCosts"
							className="flex w-full max-w-xl cursor-pointer items-center gap-3 rounded-md border border-slate-200 px-3.5 py-2.5 hover:bg-slate-50 transition-colors mb-0 text-slate-700 font-normal"
						>
							<Checkbox
								id="qa-baseCosts"
								checked={defaultSettings.baseCosts}
								onCheckedChange={() => handleToggleSetting("baseCosts")}
								className={CHECKBOX_CLASS}
							/>
							<span className="text-sm font-normal text-slate-700 select-none">
								<Translate text={localizationConstants.calcBaseCosts} />
							</span>
						</Label>

						<Label
							htmlFor="qa-aPriceList"
							className="flex w-full max-w-xl cursor-pointer items-center gap-3 rounded-md border border-slate-200 px-3.5 py-2.5 hover:bg-slate-50 transition-colors mb-0 text-slate-700 font-normal"
						>
							<Checkbox
								id="qa-aPriceList"
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

				{/* ── 3. Components Card ──────────────────────────────────────────── */}
				<div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-xs">
					{/* Header */}
					<div className="flex items-center justify-between bg-slate-200 px-4 sm:px-5 py-3">
						<h2 className="text-sm sm:text-base font-semibold text-slate-900">
							<Translate text={localizationConstants.calcQuickAiComponents} />
						</h2>
						<Button
							size="sm"
							onClick={() => setIsAddComponentOpen(true)}
							className="h-8 cursor-pointer gap-1.5 rounded-md bg-neutral-950 px-3 text-xs font-medium text-white hover:bg-neutral-800"
						>
							<Plus size={13} aria-hidden={true} />
							<Translate text={localizationConstants.calcQuickAiAddComponent} />
						</Button>
					</div>

					{/* Component List */}
					<div className="flex flex-col gap-2.5 p-4 sm:p-5">
						{components.map((comp) => (
							<div
								key={comp.id}
								className="flex w-full max-w-xl items-center gap-3 rounded-md border border-slate-200 px-3.5 py-2.5 bg-white shadow-2xs"
							>
								{renderComponentIcon(comp.icon)}
								<span className="text-sm font-medium text-slate-900">
									{comp.label}
								</span>
							</div>
						))}
					</div>
				</div>

				{/* ── 4. Documents Card (with Nested Sections & Footer Actions) ──── */}
				<div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-xs">
					{/* Header */}
					<div className="flex items-center justify-between bg-slate-200 px-4 sm:px-5 py-3">
						<h2 className="text-sm sm:text-base font-semibold text-slate-900">
							<Translate text={localizationConstants.calcQuickAiDocuments} />
						</h2>
						<Button
							size="sm"
							onClick={() => setIsCreateSectionOpen(true)}
							className="h-8 cursor-pointer gap-1.5 rounded-md bg-neutral-950 px-3 text-xs font-medium text-white hover:bg-neutral-800"
						>
							<Plus size={13} aria-hidden={true} />
							<Translate text={localizationConstants.calcCreateNew} />
						</Button>
					</div>

					{/* Nested Sections */}
					<div className="flex flex-col gap-4 p-4 sm:p-5">
						{sections.map((section) => (
							<div
								key={section.id}
								className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-2xs"
							>
								{/* Sub-section Header */}
								<div className="flex items-center justify-between bg-slate-200 px-4 sm:px-5 py-2.5">
									<h3 className="text-sm font-semibold text-slate-900">
										{section.title}
									</h3>
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() => setDeleteSectionTargetId(section.id)}
										className="h-8 cursor-pointer items-center justify-center rounded-md border-none bg-bg-secondary px-3 text-xs font-medium text-slate-900 shadow-none hover:bg-bg-secondary/80"
									>
										<Translate text={localizationConstants.calcDeleteSection} />
									</Button>
								</div>

								{/* Sub-section Content */}
								<div className="flex flex-col gap-2.5 p-4 sm:p-5">
									{/* Select All Checkbox */}
									<Label
										htmlFor={`select-all-${section.id}`}
										className="flex w-full max-w-xl cursor-pointer items-center gap-3 rounded-md border border-slate-200 px-3.5 py-2.5 hover:bg-slate-50 transition-colors mb-0 text-slate-700 font-normal"
									>
										<Checkbox
											id={`select-all-${section.id}`}
											checked={section.selectAll}
											onCheckedChange={() =>
												handleToggleSectionSelectAll(section.id)
											}
											className={CHECKBOX_CLASS}
										/>
										<span className="text-sm font-medium text-slate-900 select-none">
											<Translate text={localizationConstants.calcQuickAiSelectAll} />
										</span>
									</Label>

									{/* Item Rows */}
									{section.rows.map((row) => (
										<div
											key={row.id}
											className="flex items-center gap-3 w-full max-w-xl"
										>
											<Label
												htmlFor={`row-${section.id}-${row.id}`}
												className="flex flex-1 cursor-pointer items-center gap-3 rounded-md border border-slate-200 px-3.5 py-2.5 hover:bg-slate-50 transition-colors mb-0 text-slate-700 font-normal"
											>
												<Checkbox
													id={`row-${section.id}-${row.id}`}
													checked={row.checked}
													onCheckedChange={() =>
														handleToggleRow(section.id, row.id)
													}
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
												onClick={() =>
													setDeleteRowTarget({
														sectionId: section.id,
														rowId: row.id,
													})
												}
												className="h-10 w-10 shrink-0 cursor-pointer rounded-md border-slate-200 bg-white p-0 text-slate-500 hover:bg-slate-50 hover:text-red-600 shadow-none"
												aria-label={t(localizationConstants.deleteLabel)}
											>
												<Trash2 size={16} aria-hidden={true} />
											</Button>
										</div>
									))}

									{/* New Row Button */}
									<div className="pt-1">
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() => handleAddRow(section.id)}
											className="h-10 w-full max-w-xl cursor-pointer gap-1.5 rounded-md border border-dashed border-slate-300 bg-slate-50/50 text-sm font-medium text-slate-700 hover:bg-slate-100 shadow-none"
										>
											<Plus size={14} aria-hidden={true} />
											<Translate text={localizationConstants.calcNewRow} />
										</Button>
									</div>
								</div>
							</div>
						))}

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

			{/* ── Dialogs ──────────────────────────────────────────────────────── */}
			{/* Add Component Dialog */}
			<Dialog open={isAddComponentOpen} onOpenChange={setIsAddComponentOpen}>
				<DialogContent className="bg-white sm:max-w-md">
					<DialogHeader>
						<DialogTitle>
							<Translate text={localizationConstants.calcQuickAiAddComponent} />
						</DialogTitle>
					</DialogHeader>
					<div className="flex flex-col gap-2 py-3">
						<Label htmlFor="newCompInput" className="text-sm font-medium text-slate-900">
							<Translate text={localizationConstants.calcFieldTitle} />
						</Label>
						<Input
							id="newCompInput"
							value={newComponentLabel}
							onChange={(e) => setNewComponentLabel(e.target.value)}
							placeholder={t(localizationConstants.calcQuickAiComponents)}
							className="h-10 rounded-md border-slate-200 text-sm"
						/>
					</div>
					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => {
								setIsAddComponentOpen(false);
								setNewComponentLabel("");
							}}
							className="cursor-pointer"
						>
							<Translate text={localizationConstants.cancel} />
						</Button>
						<Button
							onClick={() => {
								if (newComponentLabel.trim()) {
									void handleAddComponent(newComponentLabel.trim());
									setNewComponentLabel("");
									setIsAddComponentOpen(false);
								}
							}}
							className="cursor-pointer bg-neutral-950 text-white hover:bg-neutral-800"
						>
							<Translate text={localizationConstants.save} />
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Create New Section Dialog */}
			<Dialog open={isCreateSectionOpen} onOpenChange={setIsCreateSectionOpen}>
				<DialogContent className="bg-white sm:max-w-md">
					<DialogHeader>
						<DialogTitle>
							<Translate text={localizationConstants.calcCreateNew} />
						</DialogTitle>
					</DialogHeader>
					<div className="flex flex-col gap-2 py-3">
						<Label htmlFor="newSecInput" className="text-sm font-medium text-slate-900">
							<Translate text={localizationConstants.calcFieldTitle} />
						</Label>
						<Input
							id="newSecInput"
							value={newSectionTitle}
							onChange={(e) => setNewSectionTitle(e.target.value)}
							placeholder={t(localizationConstants.calcQuickAiDocuments)}
							className="h-10 rounded-md border-slate-200 text-sm"
						/>
					</div>
					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => {
								setIsCreateSectionOpen(false);
								setNewSectionTitle("");
							}}
							className="cursor-pointer"
						>
							<Translate text={localizationConstants.cancel} />
						</Button>
						<Button
							onClick={() => {
								if (newSectionTitle.trim()) {
									handleAddSection(newSectionTitle.trim());
									setNewSectionTitle("");
									setIsCreateSectionOpen(false);
								}
							}}
							className="cursor-pointer bg-neutral-950 text-white hover:bg-neutral-800"
						>
							<Translate text={localizationConstants.save} />
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Delete Row Confirmation Dialog */}
			<AlertDialog
				open={!!deleteRowTarget}
				onOpenChange={(open) => {
					if (!open) setDeleteRowTarget(null);
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
								if (deleteRowTarget) {
									void handleDeleteRow(
										deleteRowTarget.sectionId,
										deleteRowTarget.rowId,
									);
									setDeleteRowTarget(null);
								}
							}}
							className="cursor-pointer bg-neutral-950 text-white hover:bg-neutral-800"
						>
							{t(localizationConstants.deleteLabel)}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Delete Section Confirmation Dialog */}
			<AlertDialog
				open={!!deleteSectionTargetId}
				onOpenChange={(open) => {
					if (!open) setDeleteSectionTargetId(null);
				}}
			>
				<AlertDialogContent className="bg-white">
					<AlertDialogHeader>
						<AlertDialogTitle>
							{t(localizationConstants.calcDeleteSection)}
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
								if (deleteSectionTargetId) {
									void handleDeleteSection(deleteSectionTargetId);
									setDeleteSectionTargetId(null);
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
