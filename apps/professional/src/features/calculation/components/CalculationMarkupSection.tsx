"use client";

import { useState } from "react";
import { Plus, Save, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import type { MarkupRow } from "../types/kalkyl";

const PERCENTAGE_OPTIONS = [
	"5",
	"10",
	"15",
	"20",
	"25",
	"30",
	"35",
	"40",
	"45",
	"50",
];

interface Props {
	titleKey: string;
	rows: MarkupRow[];
	isSaving?: boolean;
	onAddRow: () => void;
	onChangeTitle: (id: string, value: string) => void;
	onChangePercentage: (id: string, value: string) => void;
	onDeleteRowConfirm: (id: string) => void;
	onSave: () => void;
	onCancel: () => void;
}

export function CalculationMarkupSection({
	titleKey,
	rows,
	isSaving = false,
	onAddRow,
	onChangeTitle,
	onChangePercentage,
	onDeleteRowConfirm,
	onSave,
	onCancel,
}: Props) {
	const t = useTranslate();
	const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

	return (
		<>
			<div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-xs">
				{/* Section Header */}
				<div className="flex items-center justify-between bg-slate-200 px-4 sm:px-5 py-3">
					<h2 className="text-sm sm:text-base font-semibold text-slate-900">
						<Translate text={titleKey} />
					</h2>
					<Button
						size="sm"
						onClick={onAddRow}
						className="h-8 cursor-pointer gap-1.5 rounded-md bg-neutral-950 px-3 text-xs font-medium text-white hover:bg-neutral-800"
					>
						<Plus size={14} aria-hidden={true} />
						<Translate text={localizationConstants.calcCreateNew} />
					</Button>
				</div>

				{/* Rows List */}
				<div className="flex flex-col gap-4 p-4 sm:p-5">
					<div className="flex flex-col gap-3">
						{rows.length === 0 ? (
							<p className="py-4 text-center text-sm text-slate-400">
								{t(localizationConstants.noDataFound)}
							</p>
						) : (
							rows.map((row) => (
								<div
									key={row.id}
									className="flex flex-col sm:grid sm:grid-cols-[1fr_1fr_auto] items-stretch sm:items-end gap-3 rounded-md sm:rounded-none bg-slate-50/50 sm:bg-transparent p-3 sm:p-0 border border-slate-100 sm:border-0"
								>
									<div className="flex flex-col gap-1.5">
										<span className="text-sm font-medium text-slate-700">
											{t(localizationConstants.calcFieldTitle)}
										</span>
										<Input
											value={row.title}
											onChange={(e) =>
												onChangeTitle(row.id, e.target.value)
											}
											placeholder={t(
												localizationConstants.calcMarkupPlaceholder,
											)}
											className="h-10 rounded-md border-slate-200 text-sm placeholder:text-slate-400 focus-visible:border-slate-900 focus-visible:ring-0"
										/>
									</div>

									<div className="flex flex-col gap-1.5">
										<span className="text-sm font-medium text-slate-700">
											{t(localizationConstants.calcMarkupPercentage)}
										</span>
										<Select
											value={row.markupPercentage}
											onValueChange={(val) =>
												onChangePercentage(row.id, val)
											}
										>
											<SelectTrigger className="h-10 w-full rounded-md border-slate-200 text-sm text-slate-800 focus:ring-0 [&_svg]:opacity-100 [&_svg]:text-slate-500">
												<SelectValue placeholder="10%" />
											</SelectTrigger>
											<SelectContent className="bg-white border-slate-200 shadow-md">
												{PERCENTAGE_OPTIONS.map((opt) => (
													<SelectItem
														key={opt}
														value={opt}
														className="cursor-pointer text-sm"
													>
														{opt}%
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>

									<div className="flex items-center justify-end sm:justify-center">
										<Button
											variant="outline"
											size="sm"
											onClick={() => setDeleteTargetId(row.id)}
											className="h-10 w-10 shrink-0 cursor-pointer rounded-md border-slate-200 bg-white p-0 text-slate-500 hover:bg-slate-50 hover:text-red-600"
											aria-label={t(localizationConstants.calcOverviewActionDelete)}
										>
											<Trash2 size={16} aria-hidden={true} />
										</Button>
									</div>
								</div>
							))
						)}
					</div>

					{/* Card Footer Actions */}
					<div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 border-t border-slate-200 pt-4">
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
		</>
	);
}
