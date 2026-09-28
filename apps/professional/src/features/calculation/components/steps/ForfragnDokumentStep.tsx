"use client";

import React, { useState, useRef, useEffect } from "react";
import { ArrowUpDown, Folders, Trash2, Upload, X, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { cn } from "@/lib/utils";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { KalkylDocItem } from "../../types/kalkyl";
import {
	getEnquiryAvailableDocumentsAPIAction,
	MOCK_AVAILABLE_DOCUMENTS,
	type AvailableDocOption,
} from "../../api/createEnquiryApi";
import { KalkylDocIcon } from "../KalkylDocIcon";
import { KalkylDocumentPreviewDialog } from "../KalkylDocumentPreviewDialog";

interface ForfragnDokumentStepProps {
	documents: KalkylDocItem[];
	gdprAccepted: boolean;
	onGdprChange: (v: boolean) => void;
	onAddDocument: (doc: KalkylDocItem) => void;
	onRemoveDocument: (id: string) => void;
}

type SortField = "datum" | "namn" | "typ" | "fileType";

export function ForfragnDokumentStep({
	documents,
	gdprAccepted,
	onGdprChange,
	onAddDocument,
	onRemoveDocument,
}: ForfragnDokumentStepProps) {
	const t = useTranslate();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [availableDocs, setAvailableDocs] = useState<AvailableDocOption[]>(MOCK_AVAILABLE_DOCUMENTS);
	const [previewDoc, setPreviewDoc] = useState<KalkylDocItem | null>(null);
	const [docToDelete, setDocToDelete] = useState<string | null>(null);
	const [sortField, setSortField] = useState<SortField>("datum");
	const [sortAsc, setSortAsc] = useState(true);

	useEffect(() => {
		let isMounted = true;
		async function fetchAvailableDocs() {
			try {
				const docs = await getEnquiryAvailableDocumentsAPIAction();
				if (isMounted && docs.length > 0) {
					setAvailableDocs(docs);
				}
			} catch {
				// Fallback to MOCK_AVAILABLE_DOCUMENTS
			}
		}
		fetchAvailableDocs();
		return () => {
			isMounted = false;
		};
	}, []);

	function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
		const files = e.target.files;
		if (!files) return;
		const today = new Date().toISOString().split("T")[0];
		Array.from(files).forEach((file, index) => {
			const lower = file.name.toLowerCase();
			const fileType: KalkylDocItem["fileType"] = lower.endsWith(".pdf")
				? "pdf"
				: lower.endsWith(".doc") || lower.endsWith(".docx")
					? "doc"
					: "img";
			onAddDocument({
				id: `doc_${Date.now()}_${index}_${Math.random().toString(36).substring(2, 6)}`,
				datum: today,
				namn: file.name,
				typ: `A500-${10 + index}`,
				fileType,
			});
		});
		if (fileInputRef.current) fileInputRef.current.value = "";
	}

	function handleSelectMockDoc(docOption: AvailableDocOption) {
		if (documents.some((d) => d.namn === docOption.namn)) return;
		const today = new Date().toISOString().split("T")[0];
		onAddDocument({
			id: `doc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
			datum: today,
			namn: docOption.namn,
			typ: `A500-${10 + documents.length}`,
			fileType: docOption.fileType,
		});
	}

	function handleSort(field: SortField) {
		if (sortField === field) {
			setSortAsc((prev) => !prev);
		} else {
			setSortField(field);
			setSortAsc(true);
		}
	}

	const sortedDocs = [...documents].sort((a, b) => {
		const aVal = String(a[sortField] || "").toLowerCase();
		const bVal = String(b[sortField] || "").toLowerCase();
		if (aVal < bVal) return sortAsc ? -1 : 1;
		if (aVal > bVal) return sortAsc ? 1 : -1;
		return 0;
	});

	return (
		<div className="flex flex-col gap-4">
			<Card className="gap-0 overflow-hidden rounded-lg border border-slate-200 bg-white py-0 pb-0 shadow-none">
				<CardHeader className="h-14 flex flex-row items-center border-b border-slate-200 px-4 sm:px-6 py-0 [.border-b]:pb-0">
					<CardTitle className="flex items-center gap-2 text-base font-medium text-slate-900">
						<Folders className="h-5 w-5 text-slate-700" />
						<Translate text={localizationConstants.calcInquiryWizStep3} />
					</CardTitle>
				</CardHeader>

				<CardContent className="px-4 py-4 sm:px-6 sm:py-5">
					{/* Upload & Dropdown selector */}
					<div className="mb-5">
						<Label className="mb-1 block text-sm font-semibold text-slate-900">
							<Translate text={localizationConstants.agreementUploadFiles} />
						</Label>
						<p className="mb-3 text-xs text-slate-500 sm:text-sm">
							<Translate text={localizationConstants.agreementFileTypes} />
						</p>

						<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<div
										role="button"
										tabIndex={0}
										className="flex min-h-10 h-auto flex-1 cursor-pointer select-none items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-1.5 transition-colors hover:border-slate-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400 text-left font-normal shadow-none"
									>
										<div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5 py-0.5">
											{documents.length === 0 ? (
												<span className="text-sm text-slate-400">
													<Translate text={localizationConstants.agreementNoFile} />
												</span>
											) : (
												documents.map((doc) => (
													<span
														key={doc.id}
														className="inline-flex max-w-full items-center gap-1.5 rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-normal text-slate-700 shadow-none"
													>
														<span className="max-w-[120px] truncate font-medium sm:max-w-[160px]">
															{doc.namn}
														</span>
														<span
															role="button"
															tabIndex={0}
															aria-label={t(localizationConstants.remove)}
															onClick={(e) => {
																e.preventDefault();
																e.stopPropagation();
																onRemoveDocument(doc.id);
															}}
															onKeyDown={(e) => {
																if (e.key === "Enter" || e.key === " ") {
																	e.preventDefault();
																	e.stopPropagation();
																	onRemoveDocument(doc.id);
																}
															}}
															className="ml-0.5 h-4 w-4 cursor-pointer rounded-xs p-0 text-slate-400 hover:bg-slate-200 hover:text-slate-700 shrink-0 inline-flex items-center justify-center"
														>
															<X className="h-3 w-3" />
														</span>
													</span>
												))
											)}
										</div>
										<ChevronDown className="ml-2 h-4 w-4 shrink-0 text-slate-500 pointer-events-none" />
									</div>
								</DropdownMenuTrigger>

								<DropdownMenuContent
									align="start"
									className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-[280px] sm:min-w-[320px] max-h-64 overflow-y-auto rounded-lg border border-slate-200 bg-white p-1.5 shadow-lg z-50"
								>
									{availableDocs.map((doc) => {
										const isAlreadySelected = documents.some((d) => d.namn === doc.namn);
										return (
											<DropdownMenuItem
												key={doc.id}
												disabled={isAlreadySelected}
												onClick={() => handleSelectMockDoc(doc)}
												className={cn(
													"flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm transition-colors",
													isAlreadySelected
														? "cursor-not-allowed bg-slate-50 opacity-50"
														: "hover:bg-slate-100",
												)}
											>
												<div className="flex min-w-0 items-center gap-2.5">
													<span
														className={cn(
															"truncate text-sm font-medium",
															isAlreadySelected ? "text-slate-400 line-through" : "text-slate-800",
														)}
													>
														{doc.namn}
													</span>
												</div>
												{isAlreadySelected ? (
													<span className="shrink-0 rounded bg-emerald-50 px-1.5 py-0.5 text-xs font-semibold text-emerald-600">
														✓
													</span>
												) : (
													<span className="shrink-0 text-xs text-slate-400">
														+<Translate text={localizationConstants.calcNewKopplaBtn} />
													</span>
												)}
											</DropdownMenuItem>
										);
									})}
									<div className="mt-1 border-t border-slate-100 pt-1">
										<DropdownMenuItem
											onClick={() => fileInputRef.current?.click()}
											className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
										>
											<Upload className="h-4 w-4 shrink-0 text-slate-500" />
											<span>
												<Translate text={localizationConstants.agreementUpload} />
											</span>
										</DropdownMenuItem>
									</div>
								</DropdownMenuContent>
							</DropdownMenu>

							<Input
								ref={fileInputRef}
								type="file"
								multiple
								aria-label={t(localizationConstants.agreementUploadFiles)}
								accept=".png,.jpg,.jpeg,.pdf,.doc,.docx"
								className="hidden"
								onChange={handleFileSelect}
							/>
							<Button
								type="button"
								onClick={() => fileInputRef.current?.click()}
								className="h-10 w-full sm:w-auto min-w-24 shrink-0 cursor-pointer bg-slate-900 text-sm font-medium text-white shadow-none hover:bg-slate-800"
							>
								<Translate text={localizationConstants.agreementUpload} />
							</Button>
						</div>
					</div>

					{/* GDPR Checkbox */}
					<div className="mb-6 flex items-start gap-2.5 sm:gap-3">
						<Checkbox
							id="gdpr-forfragn"
							checked={gdprAccepted}
							onCheckedChange={(c) => onGdprChange(Boolean(c))}
							className="mt-0.5 shrink-0 cursor-pointer border-slate-300 data-[state=checked]:bg-slate-900"
						/>
						<label
							htmlFor="gdpr-forfragn"
							className="block min-w-0 flex-1 cursor-pointer text-xs font-normal leading-relaxed text-slate-600 sm:text-sm select-none"
						>
							<Translate text={localizationConstants.calcNewGdprText} />{" "}
							<a
								href="#privacy"
								onClick={(e) => e.preventDefault()}
								className="inline font-medium text-amber-600 underline hover:text-amber-700"
							>
								<Translate text={localizationConstants.calcNewGdprLink} />
							</a>{" "}
							<Translate text={localizationConstants.calcNewGdprSuffix} />
						</label>
					</div>

					{/* Bifogade dokument Table Section */}
					<div className="mt-6 border-t border-slate-200 pt-5">
						<h3 className="mb-3 text-sm font-semibold text-slate-900">
							<Translate text={localizationConstants.calcInquiryWizBifogadeDokument} />
						</h3>

						{documents.length === 0 ? (
							<div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 py-8 text-center text-sm text-slate-400">
								<Translate text={localizationConstants.agreementNoFile} />
							</div>
						) : (
							<div className="overflow-x-auto rounded-lg border border-slate-200">
								<Table className="w-full min-w-[640px] table-fixed">
									<TableHeader>
										<TableRow className="border-b border-slate-200 hover:bg-transparent">
											<TableHead
												onClick={() => handleSort("datum")}
												className="w-32 cursor-pointer font-medium text-slate-600 hover:text-slate-900"
											>
												<div className="flex items-center gap-1">
													<Translate text={localizationConstants.calcInquiryWizDocDate} />
													<ArrowUpDown className="h-3 w-3 text-slate-400" />
												</div>
											</TableHead>
											<TableHead
												onClick={() => handleSort("namn")}
												className="cursor-pointer font-medium text-slate-600 hover:text-slate-900"
											>
												<div className="flex items-center gap-1">
													<Translate text={localizationConstants.calcInquiryWizDocName} />
													<ArrowUpDown className="h-3 w-3 text-slate-400" />
												</div>
											</TableHead>
											<TableHead
												onClick={() => handleSort("typ")}
												className="w-28 cursor-pointer font-medium text-slate-600 hover:text-slate-900"
											>
												<div className="flex items-center gap-1">
													<Translate text={localizationConstants.calcInquiryWizDocType} />
													<ArrowUpDown className="h-3 w-3 text-slate-400" />
												</div>
											</TableHead>
											<TableHead
												onClick={() => handleSort("fileType")}
												className="w-24 cursor-pointer font-medium text-slate-600 hover:text-slate-900"
											>
												<div className="flex items-center gap-1">
													<Translate text={localizationConstants.calcInquiryWizDocFile} />
													<ArrowUpDown className="h-3 w-3 text-slate-400" />
												</div>
											</TableHead>
											<TableHead className="w-40 border-l border-slate-200 px-4" />
										</TableRow>
									</TableHeader>
									<TableBody>
										{sortedDocs.map((doc) => (
											<TableRow key={doc.id} className="border-b border-slate-100 hover:bg-slate-50/70">
												<TableCell className="w-32 whitespace-nowrap text-sm text-slate-600">
													{doc.datum}
												</TableCell>
												<TableCell className="min-w-0 px-4 py-3">
													<div className="flex w-full min-w-0 items-center gap-3 overflow-hidden text-sm font-normal text-slate-900">
														<KalkylDocIcon
															fileType={doc.fileType}
															fileName={doc.namn}
															className="h-10 w-8 shrink-0"
														/>
														<span className="truncate text-sm font-medium text-slate-900" title={doc.namn}>
															{doc.namn}
														</span>
													</div>
												</TableCell>
												<TableCell className="w-28 whitespace-nowrap text-sm text-slate-600">
													{doc.typ}
												</TableCell>
												<TableCell className="w-24 whitespace-nowrap text-sm font-medium uppercase text-slate-500">
													{doc.fileType}
												</TableCell>
												<TableCell className="w-40 shrink-0 border-l border-slate-200 px-4 py-3 text-right">
													<div className="flex items-center justify-end gap-3">
														<Button
															type="button"
															variant="outline"
															size="sm"
															onClick={() => setPreviewDoc(doc)}
															className="h-8 cursor-pointer rounded-md border-slate-200 bg-white px-3 text-xs font-normal text-slate-900 shadow-none hover:bg-slate-50"
														>
															<Translate text={localizationConstants.calcInquiryWizViewFile} />
														</Button>
														<Button
															type="button"
															variant="ghost"
															size="icon"
															onClick={() => setDocToDelete(doc.id)}
															className="h-8 w-8 cursor-pointer text-slate-900 hover:bg-slate-100"
														>
															<Trash2 className="h-4 w-4" />
														</Button>
													</div>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Preview Dialog */}
			<KalkylDocumentPreviewDialog
				document={previewDoc}
				isOpen={Boolean(previewDoc)}
				onClose={() => setPreviewDoc(null)}
			/>

			{/* Delete Confirmation Alert Dialog */}
			<AlertDialog
				open={Boolean(docToDelete)}
				onOpenChange={(open) => !open && setDocToDelete(null)}
			>
				<AlertDialogContent className="max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
					<AlertDialogHeader>
						<AlertDialogTitle className="text-base font-semibold text-slate-900">
							<Translate text={localizationConstants.calcInquiryWizDeleteDocConfirm} />
						</AlertDialogTitle>
						<AlertDialogDescription className="text-sm text-slate-500">
							<Translate text={localizationConstants.calcArchiveDeleteConfirmDescription} />
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter className="flex flex-row items-center justify-end gap-2">
						<AlertDialogCancel className="h-9 cursor-pointer border-slate-200 bg-white text-sm text-slate-700 hover:bg-slate-50">
							<Translate text={localizationConstants.cancelButton} />
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => {
								if (docToDelete) {
									onRemoveDocument(docToDelete);
									setDocToDelete(null);
								}
							}}
							className="h-9 cursor-pointer bg-slate-900 text-sm text-white hover:bg-slate-800"
						>
							<Translate text={localizationConstants.deleteLabel} />
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
