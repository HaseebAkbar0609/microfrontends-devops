"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { ExpenseTimeReportItem, RegisterExpenseFormData } from "../../types/expense.types";
import { formatNum } from "../../utils/format";

interface ExpenseTimeReportTabProps {
	formData: RegisterExpenseFormData;
	updateField: <K extends keyof RegisterExpenseFormData>(
		key: K,
		value: RegisterExpenseFormData[K],
	) => void;
	onAddRow: () => void;
	onUpdateRow: (id: string, updates: Partial<ExpenseTimeReportItem>) => void;
	onRemoveRow: (id: string) => void;
	totals: {
		totalHours: number;
		totalAmount: number;
	};
}

export function ExpenseTimeReportTab({
	formData,
	updateField,
	onAddRow,
	onUpdateRow,
	onRemoveRow,
	totals,
}: ExpenseTimeReportTabProps) {
	const { t } = useTranslation();

	return (
		<div className="space-y-6">
			{/* Time Report Table Card */}
			<div className="bg-white rounded-lg border border-slate-200 p-6 shadow-2xs">
				<div className="flex items-center justify-between mb-4">
					<div>
						<h3 className="text-sm font-semibold text-slate-900">
							<Translate text={localizationConstants.createInvoiceTabTimeReport} />
						</h3>
						<p className="text-xs text-slate-400 mt-0.5">
							<Translate text={localizationConstants.registerExpenseTimeReportSubtitle} />
						</p>
					</div>
				</div>

				<div className="w-full overflow-x-auto">
					<Table className="w-full min-w-[850px] border-collapse border border-slate-200">
						<TableHeader>
							<TableRow className="border-b border-slate-200 bg-slate-50/70 hover:bg-slate-50/70">
								<TableHead className="py-2.5 px-3 text-xs font-semibold text-slate-700 w-12 text-center border-r border-slate-200">
									<Translate text={localizationConstants.registerExpenseTimeColActive} />
								</TableHead>
								<TableHead className="py-2.5 px-3 text-xs font-semibold text-slate-700 w-32 border-r border-slate-200">
									<Translate text={localizationConstants.registerExpenseTimeColDate} />
								</TableHead>
								<TableHead className="py-2.5 px-3 text-xs font-semibold text-slate-700 min-w-[200px] border-r border-slate-200">
									<Translate text={localizationConstants.registerExpenseTimeColRef} />
								</TableHead>
								<TableHead className="py-2.5 px-3 text-xs font-semibold text-slate-700 w-24 border-r border-slate-200">
									<Translate text={localizationConstants.registerExpenseTimeColHours} />
								</TableHead>
								<TableHead className="py-2.5 px-3 text-xs font-semibold text-slate-700 w-28 border-r border-slate-200">
									<Translate text={localizationConstants.registerExpenseTimeColRate} />
								</TableHead>
								<TableHead className="py-2.5 px-3 text-xs font-semibold text-slate-700 w-32 text-right border-r border-slate-200">
									<Translate text={localizationConstants.registerExpenseTimeColSum} />
								</TableHead>
								<TableHead className="py-2.5 px-3 text-xs font-semibold text-slate-700 min-w-[180px] border-r border-slate-200">
									<Translate text={localizationConstants.registerExpenseTimeColComment} />
								</TableHead>
								<TableHead className="py-2.5 px-2 w-12 text-center" />
							</TableRow>
						</TableHeader>
						<TableBody>
							{formData.timeReportItems.length === 0 ? (
								<TableRow>
									<TableCell colSpan={8} className="py-8 text-center text-xs text-slate-400">
										<Translate text={localizationConstants.registerExpenseTimeEmptyText} />
									</TableCell>
								</TableRow>
							) : (
								formData.timeReportItems.map((row) => (
									<TableRow
										key={row.id}
										className="border-b border-slate-200 hover:bg-slate-50/50 transition-colors"
									>
										<TableCell className="py-2 px-3 text-center border-r border-slate-200">
											<Checkbox
												checked={row.included}
												onCheckedChange={(checked) =>
													onUpdateRow(row.id, { included: Boolean(checked) })
												}
											/>
										</TableCell>
										<TableCell className="py-2 px-3 border-r border-slate-200">
											<Input
												type="date"
												value={row.date}
												onChange={(e) => onUpdateRow(row.id, { date: e.target.value })}
												className="h-8 text-xs border-0 focus-visible:ring-0 px-0 shadow-none bg-transparent"
											/>
										</TableCell>
										<TableCell className="py-2 px-3 border-r border-slate-200">
											<Input
												value={row.referenceName}
												onChange={(e) => onUpdateRow(row.id, { referenceName: e.target.value })}
												placeholder={t(localizationConstants.registerExpenseTimeRefPlaceholder)}
												className="h-8 text-xs border-0 focus-visible:ring-0 px-0 shadow-none bg-transparent"
											/>
										</TableCell>
										<TableCell className="py-2 px-3 border-r border-slate-200">
											<Input
												type="number"
												min="0"
												step="0.5"
												value={row.workedHours || ""}
												onChange={(e) =>
													onUpdateRow(row.id, { workedHours: parseFloat(e.target.value) || 0 })
												}
												className="h-8 text-xs border-0 focus-visible:ring-0 px-0 shadow-none bg-transparent"
											/>
										</TableCell>
										<TableCell className="py-2 px-3 border-r border-slate-200">
											<Input
												type="number"
												min="0"
												step="10"
												value={row.hourlyRate || ""}
												onChange={(e) =>
													onUpdateRow(row.id, { hourlyRate: parseFloat(e.target.value) || 0 })
												}
												className="h-8 text-xs border-0 focus-visible:ring-0 px-0 shadow-none bg-transparent"
											/>
										</TableCell>
										<TableCell className="py-2 px-3 text-xs font-semibold text-slate-900 border-r border-slate-200 text-right whitespace-nowrap">
											{formatNum(row.total)}
										</TableCell>
										<TableCell className="py-2 px-3 border-r border-slate-200">
											<Input
												value={row.comments || ""}
												onChange={(e) => onUpdateRow(row.id, { comments: e.target.value })}
												placeholder={t(localizationConstants.registerExpenseTimeCommentPlaceholder)}
												className="h-8 text-xs border-0 focus-visible:ring-0 px-0 shadow-none bg-transparent"
											/>
										</TableCell>
										<TableCell className="py-2 px-2 text-center">
											<Button
												type="button"
												variant="ghost"
												size="icon"
												onClick={() => onRemoveRow(row.id)}
												aria-label={t(localizationConstants.registerExpenseDeleteRow)}
												className="h-7 w-7 text-slate-400 hover:text-rose-600 cursor-pointer"
											>
												<Trash2 className="h-3.5 w-3.5" />
											</Button>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</div>

				{/* Dashed "+ Lägg till tidrad" Button */}
				<div className="pt-4 flex items-center justify-between">
					<button
						type="button"
						onClick={onAddRow}
						className="h-8 px-4 border border-dashed border-slate-300 bg-slate-50 text-xs font-medium text-slate-800 hover:bg-slate-100 cursor-pointer rounded-md transition-colors inline-flex items-center justify-center gap-1.5"
					>
						<Translate text={localizationConstants.registerExpenseTimeAddRowBtn} />
					</button>

					{/* Totals Summary */}
					<div className="flex items-center gap-6 text-xs text-slate-600">
						<div>
							<span>
								<Translate text={localizationConstants.registerExpenseTimeTotalHours} />{" "}
							</span>
							<span className="font-semibold text-slate-900">{totals.totalHours} h</span>
						</div>
						<div>
							<span>
								<Translate text={localizationConstants.registerExpenseTimeTotalAmount} />{" "}
							</span>
							<span className="font-semibold text-emerald-600">{formatNum(totals.totalAmount)} {formData.currency || "SEK"}</span>
						</div>
					</div>
				</div>
			</div>

			{/* Comments / Summering Card */}
			<div className="bg-white rounded-lg border border-slate-200 p-6 shadow-2xs">
				<h3 className="text-sm font-semibold text-slate-900 mb-2">
					<Translate text={localizationConstants.registerExpenseTimeNotesTitle} />
				</h3>
				<Textarea
					rows={3}
					value={formData.comments || ""}
					onChange={(e) => updateField("comments", e.target.value)}
					placeholder={t(localizationConstants.registerExpenseTimeNotesPlaceholder)}
					className="text-xs border-slate-200 bg-white rounded-md resize-y"
				/>
			</div>
		</div>
	);
}

export default ExpenseTimeReportTab;
