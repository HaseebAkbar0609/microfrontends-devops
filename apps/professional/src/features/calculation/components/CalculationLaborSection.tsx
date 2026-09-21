"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Plus, Save, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableHeader,
	TableBody,
	TableHead,
	TableRow,
	TableCell,
} from "@/components/ui/table";
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
import { renderSortIcon } from "@/utils/renderSortIcon";
import type { SortDir } from "@/utils/tableSort";
import type { LaborRow } from "../types/kalkyl";
import type { LaborSortField } from "../hooks/useStandardCalculation";

const TH_SORTABLE =
	"cursor-pointer select-none whitespace-nowrap px-4 py-3 text-left text-xs font-semibold text-slate-600 transition-colors hover:text-slate-900";

interface Props {
	rows: LaborRow[];
	isOpen: boolean;
	isSaving?: boolean;
	sortField: LaborSortField | null;
	sortDir: SortDir;
	onToggleOpen: () => void;
	onToggleSort: (field: LaborSortField) => void;
	onAddRow: () => void;
	onChangeCell: (id: string, field: keyof LaborRow, value: string) => void;
	onDeleteRowConfirm: (id: string) => void;
	onDeleteSectionConfirm: () => void;
	onSave: () => void;
	onCancel: () => void;
}

export function CalculationLaborSection({
	rows,
	isOpen,
	isSaving = false,
	sortField,
	sortDir,
	onToggleOpen,
	onToggleSort,
	onAddRow,
	onChangeCell,
	onDeleteRowConfirm,
	onDeleteSectionConfirm,
	onSave,
	onCancel,
}: Props) {
	const t = useTranslate();
	const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
	const [isDeleteSectionDialogOpen, setIsDeleteSectionDialogOpen] = useState(false);

	const INPUT_CLASS =
		"h-9 rounded-md border-slate-200 text-sm placeholder:text-slate-400 focus-visible:border-slate-900 focus-visible:ring-0";

	return (
		<>
			<div className="flex flex-col overflow-hidden rounded-md border border-slate-200 bg-white shadow-xs">
				{/* Collapsible Section Header */}
				<button
					type="button"
					onClick={onToggleOpen}
					className="flex w-full cursor-pointer items-center justify-between bg-slate-200 px-4 sm:px-5 py-3 text-left transition-colors hover:bg-slate-300/80"
				>
					<h2 className="text-sm sm:text-base font-semibold text-slate-900">
						<Translate text={localizationConstants.calcLaborCost} />
					</h2>
					{isOpen ? (
						<ChevronDown size={18} className="text-slate-600" aria-hidden={true} />
					) : (
						<ChevronRight size={18} className="text-slate-600" aria-hidden={true} />
					)}
				</button>

				{isOpen && (
					<div className="flex flex-col gap-4 p-4 sm:p-5">
						<div className="overflow-x-auto scrollbar-thin">
							<Table className="w-full min-w-[650px] table-auto border-collapse">
								<TableHeader>
									<TableRow className="border-b border-slate-200 bg-white hover:bg-white">
										<TableHead
											className={TH_SORTABLE}
											onClick={() => onToggleSort("item")}
										>
											<span className="flex items-center gap-1">
												{t(localizationConstants.calcItemCol)}
												{renderSortIcon("item", sortField, sortDir)}
											</span>
										</TableHead>
										<TableHead
											className={TH_SORTABLE}
											onClick={() => onToggleSort("description")}
										>
											<span className="flex items-center gap-1">
												{t(localizationConstants.calcDescriptionCol)}
												{renderSortIcon("description", sortField, sortDir)}
											</span>
										</TableHead>
										<TableHead
											className={TH_SORTABLE}
											onClick={() => onToggleSort("quantity")}
										>
											<span className="flex items-center gap-1">
												{t(localizationConstants.calcQuantityCol)}
												{renderSortIcon("quantity", sortField, sortDir)}
											</span>
										</TableHead>
										<TableHead
											className={TH_SORTABLE}
											onClick={() => onToggleSort("unit")}
										>
											<span className="flex items-center gap-1">
												{t(localizationConstants.calcUnitCol)}
												{renderSortIcon("unit", sortField, sortDir)}
											</span>
										</TableHead>
										<TableHead
											className={TH_SORTABLE}
											onClick={() => onToggleSort("aPrice")}
										>
											<span className="flex items-center gap-1">
												{t(localizationConstants.calcAPriceCol)}
												{renderSortIcon("aPrice", sortField, sortDir)}
											</span>
										</TableHead>
										<TableHead className="w-14 py-3 px-3 text-center" />
									</TableRow>
								</TableHeader>
								<TableBody>
									{rows.length === 0 ? (
										<TableRow>
											<TableCell
												colSpan={6}
												className="px-4 py-8 text-center text-sm text-slate-400"
											>
												{t(localizationConstants.noDataFound)}
											</TableCell>
										</TableRow>
									) : (
										rows.map((row) => (
											<TableRow
												key={row.id}
												className="border-b border-slate-100 hover:bg-slate-50/60 last:border-0"
											>
												<TableCell className="px-3 sm:px-4 py-2">
													<Input
														value={row.item}
														onChange={(e) =>
															onChangeCell(row.id, "item", e.target.value)
														}
														placeholder={t(localizationConstants.calcItemCol)}
														className={INPUT_CLASS}
													/>
												</TableCell>
												<TableCell className="px-3 sm:px-4 py-2">
													<Input
														value={row.description}
														onChange={(e) =>
															onChangeCell(
																row.id,
																"description",
																e.target.value,
															)
														}
														placeholder={t(
															localizationConstants.calcDescriptionCol,
														)}
														className={INPUT_CLASS}
													/>
												</TableCell>
												<TableCell className="px-3 sm:px-4 py-2">
													<Input
														value={row.quantity}
														onChange={(e) =>
															onChangeCell(
																row.id,
																"quantity",
																e.target.value,
															)
														}
														placeholder="0"
														className={INPUT_CLASS}
													/>
												</TableCell>
												<TableCell className="px-3 sm:px-4 py-2">
													<Input
														value={row.unit}
														onChange={(e) =>
															onChangeCell(row.id, "unit", e.target.value)
														}
														placeholder={t(localizationConstants.calcUnitCol)}
														className={INPUT_CLASS}
													/>
												</TableCell>
												<TableCell className="px-3 sm:px-4 py-2">
													<Input
														value={row.aPrice}
														onChange={(e) =>
															onChangeCell(row.id, "aPrice", e.target.value)
														}
														placeholder="0"
														className={INPUT_CLASS}
													/>
												</TableCell>
												<TableCell className="px-2 sm:px-3 py-2 text-center">
													<Button
														variant="outline"
														size="sm"
														onClick={() => setDeleteTargetId(row.id)}
														className="h-9 w-9 cursor-pointer rounded-md border-slate-200 bg-white p-0 text-slate-500 hover:bg-slate-100 hover:text-red-600"
														aria-label={t(
															localizationConstants.calcOverviewActionDelete,
														)}
													>
														<Trash2 size={15} aria-hidden={true} />
													</Button>
												</TableCell>
											</TableRow>
										))
									)}
									<TableRow className="border-0 bg-white hover:bg-white">
										<TableCell colSpan={6} className="px-3 sm:px-4 py-3">
											<Button
												variant="outline"
												size="sm"
												onClick={onAddRow}
												className="h-9 w-full cursor-pointer gap-1.5 rounded-md border-dashed border-slate-300 bg-slate-50/80 text-sm font-medium text-slate-700 hover:bg-slate-100"
											>
												<Plus size={14} aria-hidden={true} />
												<Translate text={localizationConstants.calcNewRow} />
											</Button>
										</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</div>

						{/* Card Footer Actions */}
						<div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 border-t border-slate-200 pt-4">
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() => setIsDeleteSectionDialogOpen(true)}
								className="h-9 w-full sm:w-auto sm:min-w-24 cursor-pointer items-center justify-center rounded-md border-none bg-bg-secondary px-5 text-sm font-medium text-slate-900 shadow-none hover:bg-bg-secondary/80"
							>
								<Translate text={localizationConstants.calcDeleteSection} />
							</Button>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={onCancel}
								className="h-9 w-full sm:w-auto sm:min-w-24 cursor-pointer items-center justify-center rounded-md border-none bg-bg-secondary px-5 text-sm font-medium text-slate-900 shadow-none hover:bg-bg-secondary/80"
							>
								<Translate text={localizationConstants.cancel} />
							</Button>
							<Button
								size="sm"
								onClick={onSave}
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
				)}
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
							{t(localizationConstants.calcOverviewDeleteConfirmTitle)}
						</AlertDialogTitle>
						<AlertDialogDescription>
							{t(localizationConstants.calcOverviewDeleteConfirmDescription)}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel className="cursor-pointer">
							{t(localizationConstants.cancel)}
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => {
								if (deleteTargetId) {
									onDeleteRowConfirm(deleteTargetId);
									setDeleteTargetId(null);
								}
							}}
							className="cursor-pointer bg-neutral-950 text-white hover:bg-neutral-800"
						>
							{t(localizationConstants.calcOverviewActionDelete)}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Delete Section Confirmation Dialog */}
			<AlertDialog
				open={isDeleteSectionDialogOpen}
				onOpenChange={setIsDeleteSectionDialogOpen}
			>
				<AlertDialogContent className="bg-white">
					<AlertDialogHeader>
						<AlertDialogTitle>
							{t(localizationConstants.calcDeleteSection)}
						</AlertDialogTitle>
						<AlertDialogDescription>
							{t(localizationConstants.calcOverviewDeleteConfirmDescription)}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel className="cursor-pointer">
							{t(localizationConstants.cancel)}
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => {
								setIsDeleteSectionDialogOpen(false);
								onDeleteSectionConfirm();
							}}
							className="cursor-pointer bg-neutral-950 text-white hover:bg-neutral-800"
						>
							{t(localizationConstants.calcOverviewActionDelete)}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
