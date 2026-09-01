"use client";

import React, { useState } from "react";
import { Trash2, MessageSquare } from "lucide-react";
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
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { CreateInvoiceFormData, TimeReportItem } from "../../types/createInvoice.types";

interface InvoiceTimeReportTabProps {
	formData: CreateInvoiceFormData;
	updateField: <K extends keyof CreateInvoiceFormData>(
		key: K,
		value: CreateInvoiceFormData[K],
	) => void;
	onAddRow: () => void;
	onUpdateRow: (id: string, updates: Partial<TimeReportItem>) => void;
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
	onUpdateRow,
	onRemoveRow,
	totals,
}: InvoiceTimeReportTabProps) {
	const [activeCommentItem, setActiveCommentItem] = useState<TimeReportItem | null>(null);
	const [commentText, setCommentText] = useState("");

	const handleOpenComment = (item: TimeReportItem) => {
		setActiveCommentItem(item);
		setCommentText(item.comments || "");
	};

	const handleSaveComment = () => {
		if (activeCommentItem) {
			onUpdateRow(activeCommentItem.id, { comments: commentText });
			setActiveCommentItem(null);
		}
	};

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
								<Translate text={localizationConstants.createInvoiceFieldCustomer} />
							</Label>
							<Input
								value={formData.customer}
								onChange={(e) => updateField("customer", e.target.value)}
								className="h-9 border-slate-200 text-xs text-slate-800 bg-white rounded-md"
							/>
						</div>

						<div className="lg:col-span-2">
							<Label className="text-xs font-medium text-slate-700 mb-1.5 block">
								<Translate text={localizationConstants.createInvoiceFieldProjectNumber} />
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
									<TableCell className="py-2 px-3 border-r border-slate-200">
										<Input
											type="date"
											value={tr.date}
											onChange={(e) => onUpdateRow(tr.id, { date: e.target.value })}
											className="h-8 text-xs border-0 focus-visible:ring-0 px-0 shadow-none bg-transparent"
										/>
									</TableCell>
									<TableCell className="py-2 px-3 border-r border-slate-200">
										<Input
											value={tr.employee}
											onChange={(e) => onUpdateRow(tr.id, { employee: e.target.value })}
											className="h-8 text-xs border-0 focus-visible:ring-0 px-0 shadow-none font-normal"
										/>
									</TableCell>
									<TableCell className="py-2 px-3 text-center bg-[#e6f4ea] border-r border-slate-200">
										<Input
											type="number"
											value={tr.workHours}
											onChange={(e) =>
												onUpdateRow(tr.id, { workHours: Number(e.target.value) })
											}
											className="h-8 text-xs border-0 focus-visible:ring-0 text-center shadow-none font-semibold text-slate-900 bg-transparent"
										/>
									</TableCell>
									<TableCell className="py-2 px-3 border-r border-slate-200">
										<Select
											value={tr.unit}
											onValueChange={(val) => onUpdateRow(tr.id, { unit: val })}
										>
											<SelectTrigger className="h-8 text-xs border-0 focus:ring-0 px-0 bg-transparent shadow-none">
												<SelectValue />
											</SelectTrigger>
											<SelectContent className="bg-white">
												<SelectItem value="tim">tim</SelectItem>
												<SelectItem value="dagar">dagar</SelectItem>
											</SelectContent>
										</Select>
									</TableCell>
									<TableCell className="py-2 px-3 text-center border-r border-slate-200">
										<Input
											type="number"
											value={tr.ataHours}
											onChange={(e) =>
												onUpdateRow(tr.id, { ataHours: Number(e.target.value) })
											}
											className="h-8 text-xs border-0 focus-visible:ring-0 text-center shadow-none bg-transparent"
										/>
									</TableCell>
									<TableCell className="py-2 px-3 text-xs font-normal text-slate-800 text-center border-r border-slate-200">
										{tr.totalHours}
									</TableCell>
									<TableCell className="py-2 px-3 border-r border-slate-200">
										<Input
											value={tr.costCenter}
											onChange={(e) => onUpdateRow(tr.id, { costCenter: e.target.value })}
											className="h-8 text-xs border-0 focus-visible:ring-0 text-center shadow-none bg-transparent"
										/>
									</TableCell>
									<TableCell className="py-2 px-3 text-center border-r border-slate-200">
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() => handleOpenComment(tr)}
											className="h-7 text-[11px] px-3 border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer bg-slate-50 font-normal rounded-md"
										>
											{tr.comments ? (
												<Translate text={localizationConstants.createInvoiceTimeEditComment} />
											) : (
												<Translate text={localizationConstants.createInvoiceTimeColAddComment} />
											)}
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
						<Translate text={localizationConstants.createInvoiceAddRow} />
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

			{/* Row Comment Modal */}
			<Dialog open={!!activeCommentItem} onOpenChange={(open) => !open && setActiveCommentItem(null)}>
				<DialogContent className="max-w-md bg-white">
					<DialogHeader>
						<DialogTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
							<MessageSquare className="h-4 w-4" />
							<span>
								<Translate text={localizationConstants.createInvoiceTimeCommentDialogTitle} />: {activeCommentItem?.employee} ({activeCommentItem?.date})
							</span>
						</DialogTitle>
					</DialogHeader>
					<div className="py-2">
						<Textarea
							rows={4}
							value={commentText}
							onChange={(e) => setCommentText(e.target.value)}
							placeholder="Skriv anteckningar för detta arbetspass..."
							className="text-xs"
						/>
					</div>
					<DialogFooter>
						<Button variant="outline" size="sm" onClick={() => setActiveCommentItem(null)}>
							<Translate text={localizationConstants.createInvoiceBtnCancel} />
						</Button>
						<Button size="sm" onClick={handleSaveComment} className="bg-slate-900 text-white">
							<Translate text={localizationConstants.createInvoiceTimeCommentDialogSave} />
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
