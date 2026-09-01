"use client";

import React from "react";
import { Trash2 } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { CreateInvoiceFormData } from "../../types/createInvoice.types";

interface InvoiceTimeReportTabProps {
	formData: CreateInvoiceFormData;
	updateField: <K extends keyof CreateInvoiceFormData>(
		key: K,
		value: CreateInvoiceFormData[K],
	) => void;
	onAddRow: () => void;
	onRemoveRow: (id: string) => void;
	totals: {
		totalWork: number;
		totalAta: number;
		totalTime: number;
	};
}

export function InvoiceTimeReportTab({
	formData,
	updateField,
	onAddRow,
	onRemoveRow,
	totals,
}: InvoiceTimeReportTabProps) {
	return (
		<div className="space-y-5">
			{/* Top Header Card */}
			<div className="bg-white rounded-lg border border-slate-200 p-5">
				<h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-3 mb-4">
					<Translate text={localizationConstants.createInvoiceHeaderCardTitle} />
				</h3>

				<div className="space-y-4">
					{/* Row 1: Faktura nr | Status | Checkboxes */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-center">
						<div className="lg:col-span-2">
							<Label className="text-xs font-medium text-slate-700 mb-1.5 block">
								<Translate text={localizationConstants.createInvoiceFieldInvoiceNo} />
							</Label>
							<Input
								value={formData.invoiceNo}
								disabled
								className="h-9 bg-[#f4f4f5] border-slate-200 text-xs font-medium text-slate-800 rounded-md"
							/>
						</div>

						<div className="lg:col-span-2">
							<Label className="text-xs font-medium text-slate-700 mb-1.5 block">
								<Translate text={localizationConstants.createInvoiceFieldStatus} />
							</Label>
							<Input
								value={formData.status}
								onChange={(e) => updateField("status", e.target.value)}
								className="h-9 border-slate-200 text-xs text-slate-800 bg-white rounded-md"
							/>
						</div>

						<div className="lg:col-span-8 flex items-center justify-start lg:justify-end gap-5 pt-3 lg:pt-5">
							<label className="flex items-center gap-2 text-xs font-normal text-slate-700 cursor-pointer select-none">
								<Checkbox
									checked={formData.detailedReporting}
									onCheckedChange={(c) => updateField("detailedReporting", !!c)}
									className="data-[state=checked]:bg-slate-900 data-[state=checked]:border-slate-900 rounded-xs h-4 w-4"
								/>
								<span>
									<Translate text={localizationConstants.createInvoiceTimeDetailedReporting} />
								</span>
							</label>

							<label className="flex items-center gap-2 text-xs font-normal text-slate-700 cursor-pointer select-none">
								<Checkbox
									checked={formData.mergedReport}
									onCheckedChange={(c) => updateField("mergedReport", !!c)}
									className="data-[state=checked]:bg-slate-900 data-[state=checked]:border-slate-900 rounded-xs h-4 w-4"
								/>
								<span>
									<Translate text={localizationConstants.createInvoiceTimeMergedReport} />
								</span>
							</label>

							<label className="flex items-center gap-2 text-xs font-normal text-slate-700 cursor-pointer select-none">
								<Checkbox
									checked={formData.showAta}
									onCheckedChange={(c) => updateField("showAta", !!c)}
									className="data-[state=checked]:bg-slate-900 data-[state=checked]:border-slate-900 rounded-xs h-4 w-4"
								/>
								<span>
									<Translate text={localizationConstants.createInvoiceTimeShowAta} />
								</span>
							</label>
						</div>
					</div>

					{/* Row 2: kund | Objekt nr */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
						<div className="lg:col-span-2">
							<Label className="text-xs font-medium text-slate-700 mb-1.5 block">
								kund
							</Label>
							<Input
								value="David Gilmour"
								onChange={(e) => updateField("customer", e.target.value)}
								className="h-9 border-slate-200 text-xs text-slate-800 bg-white rounded-md"
							/>
						</div>

						<div className="lg:col-span-2">
							<Label className="text-xs font-medium text-slate-700 mb-1.5 block">
								Objekt nr
							</Label>
							<Input
								value={formData.projectNumber}
								onChange={(e) => updateField("projectNumber", e.target.value)}
								className="h-9 border-slate-200 text-xs text-slate-800 bg-white rounded-md"
							/>
						</div>
					</div>
				</div>
			</div>

			{/* Time Report Table */}
			<div className="bg-white rounded-lg border border-slate-200 p-5">
				<div className="w-full overflow-x-auto">
					<Table className="w-full min-w-[850px] border-collapse border border-slate-200">
						<TableHeader>
							<TableRow className="border-b border-slate-200 bg-white hover:bg-white">
								<TableHead className="py-2 px-3 text-xs font-normal text-slate-700 w-28 border-r border-slate-200">
									<Translate text={localizationConstants.createInvoiceTimeColDate} />
								</TableHead>
								<TableHead className="py-2 px-3 text-xs font-normal text-slate-700 min-w-[160px] border-r border-slate-200">
									<Translate text={localizationConstants.createInvoiceTimeColEmployee} />
								</TableHead>
								<TableHead className="py-2 px-3 text-xs font-semibold text-slate-800 w-24 text-center bg-[#e6f4ea] border-r border-slate-200">
									<Translate text={localizationConstants.createInvoiceTimeColWorkHours} />
								</TableHead>
								<TableHead className="py-2 px-3 text-xs font-normal text-slate-700 w-20 border-r border-slate-200">
									<Translate text={localizationConstants.createInvoiceTimeColUnit} />
								</TableHead>
								<TableHead className="py-2 px-3 text-xs font-normal text-slate-700 w-24 text-center border-r border-slate-200">
									<Translate text={localizationConstants.createInvoiceTimeColAta} />
								</TableHead>
								<TableHead className="py-2 px-3 text-xs font-normal text-slate-700 w-24 text-center border-r border-slate-200">
									<Translate text={localizationConstants.createInvoiceTimeColTotalTime} />
								</TableHead>
								<TableHead className="py-2 px-3 text-xs font-normal text-slate-700 w-20 text-center border-r border-slate-200">
									<Translate text={localizationConstants.createInvoiceTimeColKS} />
								</TableHead>
								<TableHead className="py-2 px-3 text-xs font-normal text-slate-700 w-44 text-center border-r border-slate-200">
									<Translate text={localizationConstants.createInvoiceTimeColAddComment} />
								</TableHead>
								<TableHead className="py-2 px-2 w-12 text-center" />
							</TableRow>
						</TableHeader>
						<TableBody>
							{formData.timeReportItems.map((tr) => (
								<TableRow key={tr.id} className="border-b border-slate-200 hover:bg-slate-50/50">
									<TableCell className="py-2 px-3 text-xs font-normal text-slate-800 border-r border-slate-200">
										{tr.date}
									</TableCell>
									<TableCell className="py-2 px-3 text-xs font-normal text-slate-800 border-r border-slate-200">
										{tr.employee}
									</TableCell>
									<TableCell className="py-2 px-3 text-xs font-semibold text-slate-900 text-center bg-[#e6f4ea] border-r border-slate-200">
										{tr.workHours}
									</TableCell>
									<TableCell className="py-2 px-3 text-xs text-slate-700 border-r border-slate-200">
										{tr.unit}
									</TableCell>
									<TableCell className="py-2 px-3 text-xs text-slate-700 text-center border-r border-slate-200">
										{tr.ataHours}
									</TableCell>
									<TableCell className="py-2 px-3 text-xs font-normal text-slate-800 text-center border-r border-slate-200">
										{tr.totalHours}
									</TableCell>
									<TableCell className="py-2 px-3 text-xs text-slate-700 text-center border-r border-slate-200">
										{tr.costCenter}
									</TableCell>
									<TableCell className="py-2 px-3 text-center border-r border-slate-200">
										<Button
											variant="outline"
											size="sm"
											className="h-7 text-[11px] px-3 border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer bg-slate-50 font-normal rounded-md"
										>
											lägga till kommentarer
										</Button>
									</TableCell>
									<TableCell className="py-2 px-2 text-center">
										<Button
											variant="ghost"
											size="icon"
											onClick={() => onRemoveRow(tr.id)}
											className="h-7 w-7 text-slate-400 hover:text-red-600 cursor-pointer"
										>
											<Trash2 className="h-3.5 w-3.5" />
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>

				<div className="pt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
					<button
						type="button"
						onClick={onAddRow}
						className="h-8 px-4 border border-dashed border-slate-300 bg-[#f8fafc] text-xs font-normal text-slate-800 hover:bg-slate-100 cursor-pointer rounded-md transition-colors inline-flex items-center justify-center gap-1.5"
					>
						+ Add
					</button>

					{/* Time Totals Summary Box matching Figma */}
					<div className="w-full sm:w-64 text-xs space-y-1.5 text-right pr-2">
						<div className="flex justify-between text-slate-600">
							<span>
								<Translate text={localizationConstants.createInvoiceTimeTotalWork} />
							</span>
							<span className="text-slate-800">{totals.totalWork}</span>
						</div>
						<div className="flex justify-between text-slate-600">
							<span>
								<Translate text={localizationConstants.createInvoiceTimeTotalAta} />
							</span>
							<span className="text-slate-800">{totals.totalAta}</span>
						</div>
						<div className="border-t border-slate-200 my-1 pt-1" />
						<div className="flex justify-between text-slate-900 font-bold text-xs">
							<span>
								<Translate text={localizationConstants.createInvoiceTimeTotalTime} />
							</span>
							<span>{totals.totalTime} tim</span>
						</div>
					</div>
				</div>
			</div>

			{/* Kommentar Card matching Figma Image 5 */}
			<div className="bg-white rounded-lg border border-slate-200 p-5 mb-5">
				<h3 className="text-sm font-semibold text-slate-900 mb-1">
					<Translate text={localizationConstants.createInvoiceCommentTitle} />
				</h3>
				<Label className="text-xs text-slate-500 mb-2 block font-normal">
					<Translate text={localizationConstants.createInvoiceCommentPlaceholder} />
				</Label>
				<Textarea
					rows={4}
					value={formData.comments}
					onChange={(e) => updateField("comments", e.target.value)}
					placeholder="Skriv kommentar här..."
					className="text-xs border-slate-200 resize-y bg-white rounded-md"
				/>
			</div>
		</div>
	);
}
