"use client";

import React from "react";
import { Plus, Trash2, MessageSquare } from "lucide-react";
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
			<div className="bg-white rounded-lg border border-slate-200 shadow-2xs p-5">
				<h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-3 mb-4">
					<Translate text={localizationConstants.createInvoiceHeaderCardTitle} />
				</h3>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
					<div>
						<Label className="text-xs font-medium text-slate-700 mb-1.5 block">
							<Translate text={localizationConstants.createInvoiceFieldInvoiceNo} />
						</Label>
						<Input
							value={formData.invoiceNo}
							disabled
							className="h-9 bg-slate-50 border-slate-200 text-xs text-slate-800"
						/>
					</div>

					<div>
						<Label className="text-xs font-medium text-slate-700 mb-1.5 block">
							<Translate text={localizationConstants.createInvoiceFieldStatus} />
						</Label>
						<Input
							value={formData.status}
							onChange={(e) => updateField("status", e.target.value)}
							className="h-9 border-slate-200 text-xs text-slate-800"
						/>
					</div>

					<div>
						<Label className="text-xs font-medium text-slate-700 mb-1.5 block">
							<Translate text={localizationConstants.createInvoiceFieldCustomer} />
						</Label>
						<Input
							value={formData.customer}
							onChange={(e) => updateField("customer", e.target.value)}
							className="h-9 border-slate-200 text-xs text-slate-800"
						/>
					</div>

					<div>
						<Label className="text-xs font-medium text-slate-700 mb-1.5 block">
							<Translate text={localizationConstants.createInvoiceFieldProjectNumber} />
						</Label>
						<Input
							value={formData.projectNumber}
							onChange={(e) => updateField("projectNumber", e.target.value)}
							className="h-9 border-slate-200 text-xs text-slate-800"
						/>
					</div>
				</div>

				<div className="flex flex-wrap items-center gap-6 pt-3 border-t border-slate-100">
					<label className="flex items-center gap-2 text-xs font-normal text-slate-700 cursor-pointer select-none">
						<Checkbox
							checked={formData.detailedReporting}
							onCheckedChange={(c) => updateField("detailedReporting", !!c)}
						/>
						<span>
							<Translate text={localizationConstants.createInvoiceTimeDetailedReporting} />
						</span>
					</label>

					<label className="flex items-center gap-2 text-xs font-normal text-slate-700 cursor-pointer select-none">
						<Checkbox
							checked={formData.mergedReport}
							onCheckedChange={(c) => updateField("mergedReport", !!c)}
						/>
						<span>
							<Translate text={localizationConstants.createInvoiceTimeMergedReport} />
						</span>
					</label>

					<label className="flex items-center gap-2 text-xs font-normal text-slate-700 cursor-pointer select-none">
						<Checkbox
							checked={formData.showAta}
							onCheckedChange={(c) => updateField("showAta", !!c)}
						/>
						<span>
							<Translate text={localizationConstants.createInvoiceTimeShowAta} />
						</span>
					</label>
				</div>
			</div>

			{/* Time Report Table */}
			<div className="bg-white rounded-lg border border-slate-200 shadow-2xs p-5">
				<div className="w-full overflow-x-auto">
					<Table className="w-full min-w-[850px] border-collapse">
						<TableHeader>
							<TableRow className="border-b border-slate-200 bg-slate-50/70 hover:bg-slate-50/70">
								<TableHead className="py-2.5 px-3 text-xs font-semibold text-slate-700 w-28">
									<Translate text={localizationConstants.createInvoiceTimeColDate} />
								</TableHead>
								<TableHead className="py-2.5 px-3 text-xs font-semibold text-slate-700 min-w-[160px]">
									<Translate text={localizationConstants.createInvoiceTimeColEmployee} />
								</TableHead>
								<TableHead className="py-2.5 px-3 text-xs font-semibold text-slate-700 w-24 text-center bg-emerald-50">
									<Translate text={localizationConstants.createInvoiceTimeColWorkHours} />
								</TableHead>
								<TableHead className="py-2.5 px-3 text-xs font-semibold text-slate-700 w-20">
									<Translate text={localizationConstants.createInvoiceTimeColUnit} />
								</TableHead>
								<TableHead className="py-2.5 px-3 text-xs font-semibold text-slate-700 w-24 text-center">
									<Translate text={localizationConstants.createInvoiceTimeColAta} />
								</TableHead>
								<TableHead className="py-2.5 px-3 text-xs font-semibold text-slate-700 w-24 text-center">
									<Translate text={localizationConstants.createInvoiceTimeColTotalTime} />
								</TableHead>
								<TableHead className="py-2.5 px-3 text-xs font-semibold text-slate-700 w-20 text-center">
									<Translate text={localizationConstants.createInvoiceTimeColKS} />
								</TableHead>
								<TableHead className="py-2.5 px-3 text-xs font-semibold text-slate-700 w-44 text-center">
									<Translate text={localizationConstants.createInvoiceTimeColAddComment} />
								</TableHead>
								<TableHead className="py-2.5 px-2 w-12 text-center" />
							</TableRow>
						</TableHeader>
						<TableBody>
							{formData.timeReportItems.map((tr) => (
								<TableRow key={tr.id} className="border-b border-slate-100 hover:bg-slate-50/50">
									<TableCell className="py-2 px-3 text-xs font-medium text-slate-800">
										{tr.date}
									</TableCell>
									<TableCell className="py-2 px-3 text-xs font-medium text-slate-800">
										{tr.employee}
									</TableCell>
									<TableCell className="py-2 px-3 text-xs font-semibold text-slate-900 text-center bg-emerald-50/70">
										{tr.workHours}
									</TableCell>
									<TableCell className="py-2 px-3 text-xs text-slate-700">
										{tr.unit}
									</TableCell>
									<TableCell className="py-2 px-3 text-xs text-slate-700 text-center">
										{tr.ataHours}
									</TableCell>
									<TableCell className="py-2 px-3 text-xs font-medium text-slate-800 text-center">
										{tr.totalHours}
									</TableCell>
									<TableCell className="py-2 px-3 text-xs text-slate-700 text-center">
										{tr.costCenter}
									</TableCell>
									<TableCell className="py-2 px-3 text-center">
										<Button
											variant="outline"
											size="sm"
											className="h-7 text-[11px] px-2.5 border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
										>
											<MessageSquare className="h-3 w-3 mr-1 text-slate-400" />
											<Translate text={localizationConstants.createInvoiceTimeColAddComment} />
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

				<div className="pt-4 border-t border-slate-100 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
					<Button
						variant="outline"
						onClick={onAddRow}
						className="h-8 px-3 gap-1.5 border-slate-200 text-xs font-normal text-slate-700 hover:bg-slate-50 cursor-pointer"
					>
						<Plus className="h-3.5 w-3.5" />
						<span>+ Add</span>
					</Button>

					{/* Time Totals Summary Box */}
					<div className="w-full sm:w-64 bg-slate-50/60 rounded-md border border-slate-200 p-3 text-xs space-y-1.5">
						<div className="flex justify-between text-slate-600">
							<span>
								<Translate text={localizationConstants.createInvoiceTimeTotalWork} />
							</span>
							<span className="font-medium text-slate-800">{totals.totalWork}</span>
						</div>
						<div className="flex justify-between text-slate-600">
							<span>
								<Translate text={localizationConstants.createInvoiceTimeTotalAta} />
							</span>
							<span className="font-medium text-slate-800">{totals.totalAta}</span>
						</div>
						<div className="flex justify-between text-slate-900 font-bold pt-1 border-t border-slate-200">
							<span>
								<Translate text={localizationConstants.createInvoiceTimeTotalTime} />
							</span>
							<span>{totals.totalTime} tim</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
