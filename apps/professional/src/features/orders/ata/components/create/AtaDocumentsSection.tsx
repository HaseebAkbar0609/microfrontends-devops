"use client";

import React, { useRef, useState, useMemo } from "react";
import {
	FilePlus,
	ChevronUp,
	MoreVertical,
	PencilLine,
	Trash2,
	ArrowUpDown,
	ArrowUp,
	ArrowDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
	Table,
	TableHeader,
	TableBody,
	TableHead,
	TableRow,
	TableCell,
} from "@/components/ui/table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DocFileIcon } from "@/components/ui/DocFileIcon";
import { PdfFileIcon } from "@/components/ui/PdfFileIcon";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { showToast } from "@/lib/toast";
import type { AttachedDocument } from "../../types/ata.types";
import { AtaMultiSelect } from "./AtaMultiSelect";
import {
	AVAILABLE_INVOICE_OPTIONS,
	AVAILABLE_TIME_REPORT_OPTIONS,
} from "../../data/createAta.mock";

export interface AtaDocumentsSectionProps {
	attachedDocs: AttachedDocument[];
	supplierInvoices: string[];
	timeReports: string[];
	onSupplierInvoicesChange: (invoices: string[]) => void;
	onTimeReportsChange: (reports: string[]) => void;
	onUploadFiles: (files: FileList | File[]) => void;
	onDeleteDoc: (id: string) => void;
	isExpanded: boolean;
	onToggleExpand: () => void;
}

export function AtaDocumentsSection({
	attachedDocs,
	supplierInvoices,
	timeReports,
	onSupplierInvoicesChange,
	onTimeReportsChange,
	onUploadFiles,
	onDeleteDoc,
	isExpanded,
	onToggleExpand,
}: AtaDocumentsSectionProps) {
	const t = useTranslate();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [pendingFiles, setPendingFiles] = useState<File[]>([]);
	const [sortField, setSortField] = useState<keyof AttachedDocument | null>(null);
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

	const handleSort = (field: keyof AttachedDocument) => {
		if (sortField === field) {
			setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
		} else {
			setSortField(field);
			setSortOrder("asc");
		}
	};

	const sortedDocs = useMemo(() => {
		if (!sortField) return attachedDocs;
		return [...attachedDocs].sort((a, b) => {
			const valA = a[sortField] || "";
			const valB = b[sortField] || "";
			const comp = String(valA).localeCompare(String(valB), "sv");
			return sortOrder === "asc" ? comp : -comp;
		});
	}, [attachedDocs, sortField, sortOrder]);

	const renderSortIcon = (field: keyof AttachedDocument) => {
		if (sortField !== field) {
			return <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 opacity-60 ml-1 shrink-0" />;
		}
		return sortOrder === "asc" ? (
			<ArrowUp className="h-3.5 w-3.5 text-slate-900 ml-1 shrink-0" />
		) : (
			<ArrowDown className="h-3.5 w-3.5 text-slate-900 ml-1 shrink-0" />
		);
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			setPendingFiles(Array.from(e.target.files));
		}
	};

	const handleUploadClick = () => {
		if (pendingFiles.length === 0) return;
		onUploadFiles(pendingFiles);
		setPendingFiles([]);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
		showToast("success", t(localizationConstants.createAtaUploadBtn));
	};

	const renderFileIcon = (fileType: string) => {
		if (fileType === "pdf") {
			return <PdfFileIcon className="h-11 w-9 shrink-0" />;
		}
		return <DocFileIcon className="h-11 w-9 shrink-0" />;
	};

	return (
		<Card className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xs w-full flex flex-col gap-0 pb-0">
			{/* Header */}
			<Button
				type="button"
				variant="ghost"
				onClick={onToggleExpand}
				className="flex h-14 min-h-14 w-full cursor-pointer items-center justify-between px-5 sm:px-6 py-0 text-left transition-colors hover:bg-slate-50 font-normal rounded-none shadow-none focus:outline-none"
				aria-expanded={isExpanded}
			>
				<div className="flex items-center gap-2.5 min-w-0">
					<FilePlus className="size-6 text-slate-700 shrink-0" />
					<span className="font-sans text-base font-medium leading-6 tracking-normal text-slate-900 truncate">
						<Translate text={localizationConstants.createAtaDocuments} />
					</span>
				</div>
				<ChevronUp
					size={18}
					className={cn(
						"text-zinc-500 transition-transform duration-200 shrink-0",
						!isExpanded && "rotate-180"
					)}
					aria-hidden={true}
				/>
			</Button>

			{/* Body */}
			{isExpanded && (
				<div className="p-4 flex flex-col gap-4 border-t border-slate-200">
					{/* Upload Box */}
					<div className="flex flex-col gap-2">
						<Label className="font-sans font-medium text-sm leading-5 tracking-normal text-slate-900">
							<Translate text={localizationConstants.createAtaUploadYourFiles} />
						</Label>
						<input
							type="file"
							ref={fileInputRef}
							onChange={handleFileChange}
							multiple
							accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
							className="hidden"
						/>
						<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full min-w-0">
							<button
								type="button"
								onClick={() => fileInputRef.current?.click()}
								className="flex-1 min-w-0 h-11 rounded-lg border border-slate-200 bg-white px-4 flex items-center justify-start text-left cursor-pointer hover:bg-slate-50 transition-colors focus:outline-none focus:border-slate-900 shadow-none font-sans font-medium text-sm leading-5 tracking-normal text-slate-400"
							>
								{pendingFiles.length > 0 ? (
									<span className="font-sans font-medium text-sm leading-5 tracking-normal text-slate-900 truncate min-w-0 flex-1">
										{pendingFiles.map((f) => f.name).join(", ")}
									</span>
								) : (
									<span className="font-sans font-medium text-sm leading-5 tracking-normal text-slate-400 truncate min-w-0 flex-1">
										<Translate text={localizationConstants.createAtaUploadBtn} />
									</span>
								)}
							</button>

							<Button
								type="button"
								disabled={pendingFiles.length === 0}
								onClick={handleUploadClick}
								className={cn(
									"w-full sm:w-auto h-11 px-6 rounded-lg font-medium text-sm shrink-0 shadow-none whitespace-nowrap transition-colors",
									pendingFiles.length > 0
										? "bg-slate-900 hover:bg-slate-800 text-white cursor-pointer"
										: "bg-slate-500 hover:bg-slate-500 text-white opacity-90 cursor-not-allowed"
								)}
							>
								<Translate text={localizationConstants.createAtaUploadBtn} />
							</Button>
						</div>
						<p className="font-sans font-normal text-sm leading-5 tracking-normal text-slate-500">
							<Translate text={localizationConstants.createAtaUploadHint} />
						</p>
					</div>

					{/* Multi-select filter inputs */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div className="flex flex-col gap-1.5">
							<Label className="font-sans font-medium text-sm leading-5 tracking-normal text-slate-900">
								<Translate text={localizationConstants.createAtaSupplierInvoice} />
							</Label>
							<AtaMultiSelect
								options={AVAILABLE_INVOICE_OPTIONS}
								selectedValues={supplierInvoices}
								onChange={onSupplierInvoicesChange}
								placeholder={t(localizationConstants.createAtaSupplierInvoice)}
							/>
						</div>

						<div className="flex flex-col gap-1.5">
							<Label className="font-sans font-medium text-sm leading-5 tracking-normal text-slate-900">
								<Translate text={localizationConstants.createAtaTimeReport} />
							</Label>
							<AtaMultiSelect
								options={AVAILABLE_TIME_REPORT_OPTIONS}
								selectedValues={timeReports}
								onChange={onTimeReportsChange}
								placeholder={t(localizationConstants.createAtaTimeReport)}
							/>
						</div>
					</div>

					{/* Attached Documents Table */}
					<div className="flex flex-col gap-2 pt-2">
						<div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
							<div className="flex h-9 items-center bg-slate-200 px-4 border-b border-slate-200">
								<h3 className="text-sm font-semibold text-slate-900">
									<Translate text={localizationConstants.createAtaAttachedDocs} />
								</h3>
							</div>
							<Table className="w-full table-auto border-collapse">
								<TableHeader className="bg-white">
									<TableRow className="border-b border-slate-200 bg-white hover:bg-white">
										<TableHead
											onClick={() => handleSort("date")}
											className="px-4 py-3 font-sans text-sm font-medium text-slate-500 hover:text-slate-900 cursor-pointer select-none whitespace-nowrap w-36"
										>
											<div className="flex items-center gap-1">
												<span>
													<Translate text={localizationConstants.createAtaColDate} />
												</span>
												{renderSortIcon("date")}
											</div>
										</TableHead>
										<TableHead
											onClick={() => handleSort("referenceNumber")}
											className="px-4 py-3 font-sans text-sm font-medium text-slate-500 hover:text-slate-900 cursor-pointer select-none whitespace-nowrap"
										>
											<div className="flex items-center gap-1">
												<span>
													<Translate text={localizationConstants.createAtaColDocRefNo} />
												</span>
												{renderSortIcon("referenceNumber")}
											</div>
										</TableHead>
										<TableHead
											onClick={() => handleSort("fileName")}
											className="px-4 py-3 font-sans text-sm font-medium text-slate-500 hover:text-slate-900 cursor-pointer select-none whitespace-nowrap"
										>
											<div className="flex items-center gap-1">
												<span>
													<Translate text={localizationConstants.createAtaColFile} />
												</span>
												{renderSortIcon("fileName")}
											</div>
										</TableHead>
										<TableHead className="px-4 py-3 font-sans text-sm font-medium text-slate-500 w-12 text-right">
											{/* Actions */}
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody className="[&_tr:last-child]:border-b [&_tr:last-child]:border-slate-200">
									{sortedDocs.length === 0 ? (
										<TableRow className="border-b border-slate-200">
											<TableCell colSpan={4} className="h-16 text-center font-sans text-sm text-slate-400">
												<Translate text={localizationConstants.noDataFound} />
											</TableCell>
										</TableRow>
									) : (
										sortedDocs.map((doc) => (
											<TableRow
												key={doc.id}
												className="border-b border-slate-200 hover:bg-slate-50/50 transition-colors font-sans text-sm text-slate-900"
											>
												<TableCell className="px-4 py-3 whitespace-nowrap font-sans text-sm text-slate-900">
													{doc.date}
												</TableCell>
												<TableCell className="px-4 py-3 whitespace-nowrap font-sans text-sm font-normal text-slate-900">
													<input
														type="text"
														defaultValue={doc.referenceNumber}
														aria-label={t(localizationConstants.createAtaColDocRefNo)}
														className="h-8 px-2.5 border border-slate-200 rounded font-sans text-sm text-slate-900 bg-transparent focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
													/>
												</TableCell>
												<TableCell className="px-4 py-3 whitespace-nowrap font-sans text-sm text-slate-900">
													<div className="flex items-center gap-2">
														{renderFileIcon(doc.fileType)}
														<span className="text-slate-900 font-sans text-sm font-normal">
															{doc.fileName}
														</span>
													</div>
												</TableCell>
												<TableCell className="px-4 py-3 whitespace-nowrap text-right">
													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button
																variant="ghost"
																size="icon"
																className="h-8 w-8 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900 p-0 cursor-pointer"
																aria-label={`${t(localizationConstants.actions)} ${doc.fileName}`}
															>
																<MoreVertical className="h-4 w-4" />
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent
															align="end"
															className="w-[140px] rounded-xl bg-white p-1.5 shadow-md border border-slate-200"
														>
															<DropdownMenuItem
																onClick={() => {}}
																className="flex items-center gap-2.5 px-2.5 py-2 text-sm font-normal text-slate-900 cursor-pointer rounded-lg hover:bg-slate-100 transition-colors"
															>
																<PencilLine className="h-4 w-4 text-slate-900 shrink-0" strokeWidth={1.75} />
																<Translate text={localizationConstants.createAtaActionEdit} />
															</DropdownMenuItem>
															<DropdownMenuItem
																onClick={() => onDeleteDoc(doc.id)}
																className="flex items-center gap-2.5 px-2.5 py-2 text-sm font-normal text-slate-900 cursor-pointer rounded-lg hover:bg-slate-100 transition-colors"
															>
																<Trash2 className="h-4 w-4 text-slate-900 shrink-0" strokeWidth={1.75} />
																<Translate text={localizationConstants.createAtaActionDelete} />
															</DropdownMenuItem>
														</DropdownMenuContent>
													</DropdownMenu>
												</TableCell>
											</TableRow>
										))
									)}
								</TableBody>
							</Table>
						</div>
					</div>
				</div>
			)}
		</Card>
	);
}
