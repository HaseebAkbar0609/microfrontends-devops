"use client";

import React, { useRef } from "react";
import {
	Folders,
	Loader2,
	Upload,
	X,
	ChevronDown,
	ArrowUpDown,
	Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { showToast } from "@/lib/toast";
import { PdfFileIcon } from "@/components/ui/PdfFileIcon";
import { DocFileIcon } from "@/components/ui/DocFileIcon";
import { useAgreementDocuments } from "../../hooks/useAgreementDocuments";
import {
	AVAILABLE_AGREEMENT_DOCUMENTS,
	ALLOWED_DOCUMENT_FILE_EXTENSIONS,
} from "../../constants/agreementDocuments";

export function AgreementDocumentCenter() {
	const t = useTranslate();
	const fileInputRef = useRef<HTMLInputElement>(null);

	const {
		documents,
		isLoading,
		pendingFiles,
		isUploading,
		docToDelete,
		handleSort,
		handleFileSelect,
		handleSelectTemplate,
		handleRemovePending,
		handleUploadPending,
		setDocToDelete,
		handleConfirmDelete,
	} = useAgreementDocuments();

	const handleBoxClick = () => {
		if (pendingFiles.length === 0) {
			fileInputRef.current?.click();
		}
	};

	const handleSeeFile = () => {
		showToast("info", t(localizationConstants.comingSoonMessage));
	};

	if (isLoading) {
		return (
			<div className="flex h-64 items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-slate-400" />
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6">
			<Card className="gap-0 overflow-hidden rounded-lg border border-slate-200 bg-white py-0 pb-0 shadow-none">
				{/* Card Header with larger folder icon */}
				<CardHeader className="h-14 flex flex-row items-center border-b border-slate-200 px-4 sm:px-6 py-0 [.border-b]:pb-0">
					<CardTitle className="flex items-center gap-2.5 text-base font-medium text-slate-900">
						<Folders className="h-6 w-6 text-slate-700" />
						<Translate text={localizationConstants.agreementDocuments} />
					</CardTitle>
				</CardHeader>

				<CardContent className="p-4 sm:p-6">
					{/* Upload & Dropdown Selector Section */}
					<div className="mb-6">
						<Label className="mb-1 block text-sm font-medium text-slate-900">
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
										onClick={handleBoxClick}
										className="flex min-h-10 h-auto flex-1 cursor-pointer select-none items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-1.5 transition-colors hover:border-slate-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400 text-left font-normal shadow-none"
									>
										<div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5 py-0.5">
											{pendingFiles.length === 0 ? (
												<span className="text-sm text-slate-400">
													<Translate text={localizationConstants.agreementNoFile} />
												</span>
											) : (
												pendingFiles.map((pf) => (
													<span
														key={pf.id}
														className="inline-flex max-w-full items-center gap-1.5 rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-normal text-slate-700 shadow-none"
													>
														<span className="max-w-[130px] truncate font-medium sm:max-w-[180px]">
															{pf.name}
														</span>
														<span
															role="button"
															tabIndex={0}
															aria-label={t(localizationConstants.remove)}
															onClick={(e) => {
																e.preventDefault();
																e.stopPropagation();
																handleRemovePending(pf.id);
															}}
															onKeyDown={(e) => {
																if (e.key === "Enter" || e.key === " ") {
																	e.preventDefault();
																	e.stopPropagation();
																	handleRemovePending(pf.id);
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
									{AVAILABLE_AGREEMENT_DOCUMENTS.map((template) => {
										const isSelected = pendingFiles.some(
											(p) => p.name === template.name,
										);
										return (
											<DropdownMenuItem
												key={template.id}
												disabled={isSelected}
												onClick={() => handleSelectTemplate(template)}
												className={cn(
													"flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm transition-colors",
													isSelected
														? "cursor-not-allowed bg-slate-50 opacity-50"
														: "hover:bg-slate-100",
												)}
											>
												<span
													className={cn(
														"truncate text-sm font-medium",
														isSelected
															? "text-slate-400 line-through"
															: "text-slate-800",
													)}
												>
													{template.name}
												</span>
												{isSelected ? (
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

							<input
								ref={fileInputRef}
								type="file"
								multiple
								aria-label={t(localizationConstants.agreementUploadFiles)}
								accept={ALLOWED_DOCUMENT_FILE_EXTENSIONS}
								className="hidden"
								onChange={handleFileSelect}
							/>

							<Button
								type="button"
								onClick={
									pendingFiles.length > 0
										? handleUploadPending
										: () => fileInputRef.current?.click()
								}
								disabled={isUploading}
								className="h-10 w-full sm:w-auto min-w-24 shrink-0 cursor-pointer bg-[#111721] text-sm font-medium text-white shadow-none hover:bg-slate-800 disabled:opacity-50"
							>
								{isUploading ? (
									<Loader2 className="h-4 w-4 animate-spin text-white" />
								) : (
									<Translate text={localizationConstants.agreementUpload} />
								)}
							</Button>
						</div>
					</div>

					{/* Attached Documents Table Section */}
					<div>
						<h3 className="mb-3 text-sm font-medium text-slate-900">
							<Translate
								text={localizationConstants.agreementCreateBifogadeDokument}
							/>
						</h3>

						<div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
							<Table className="w-full min-w-[640px] table-fixed">
								<TableHeader>
									<TableRow className="border-b border-slate-200 hover:bg-transparent">
										<TableHead
											onClick={() => handleSort("date")}
											className="w-40 pl-6 pr-4 cursor-pointer font-medium text-slate-600 hover:text-slate-900"
										>
											<div className="flex items-center gap-1">
												<Translate
													text={localizationConstants.agreementDetailDatum}
												/>
												<ArrowUpDown className="h-3 w-3 text-slate-400" />
											</div>
										</TableHead>

										<TableHead
											onClick={() => handleSort("name")}
											className="cursor-pointer font-medium text-slate-600 hover:text-slate-900"
										>
											<div className="flex items-center gap-1">
												<Translate
													text={localizationConstants.calcInquiryWizDocName}
												/>
												<ArrowUpDown className="h-3 w-3 text-slate-400" />
											</div>
										</TableHead>

										<TableHead
											onClick={() => handleSort("fileType")}
											className="w-28 cursor-pointer font-medium text-slate-600 hover:text-slate-900"
										>
											<div className="flex items-center gap-1">
												<Translate
													text={localizationConstants.agreementDetailFil}
												/>
												<ArrowUpDown className="h-3 w-3 text-slate-400" />
											</div>
										</TableHead>

										<TableHead className="w-36 border-l border-slate-200 px-4" />
									</TableRow>
								</TableHeader>

								<TableBody>
									{documents.length === 0 ? (
										<TableRow>
											<TableCell
												colSpan={4}
												className="h-28 text-center text-sm text-slate-500"
											>
												<Translate
													text={localizationConstants.agreementNoDocuments}
												/>
											</TableCell>
										</TableRow>
									) : (
										documents.map((doc) => (
											<TableRow
												key={doc.id}
												className="border-b border-slate-100 hover:bg-slate-50/70"
											>
												{/* Added left spacing */}
												<TableCell className="w-40 pl-6 pr-4 whitespace-nowrap text-sm text-slate-600">
													{doc.date}
												</TableCell>

												<TableCell className="min-w-0 px-4 py-3">
													<div className="flex w-full min-w-0 items-center gap-3 overflow-hidden text-sm font-normal text-slate-900">
														{/* Larger Document Icons */}
														{doc.fileType === "doc" ? (
															<DocFileIcon className="h-11 w-9 shrink-0" />
														) : (
															<PdfFileIcon className="h-11 w-9 shrink-0" />
														)}
														<span
															className="truncate text-sm font-normal text-slate-800"
															title={doc.name}
														>
															{doc.name}
														</span>
													</div>
												</TableCell>

												<TableCell className="w-28 whitespace-nowrap text-sm font-medium uppercase text-slate-500">
													{doc.fileType.toUpperCase()}
												</TableCell>

												<TableCell className="w-36 shrink-0 border-l border-slate-200 px-4 py-3 text-right">
													<div className="flex items-center justify-end gap-2">
														<Button
															type="button"
															variant="outline"
															size="sm"
															onClick={handleSeeFile}
															className="h-8 cursor-pointer rounded-md border-slate-200 bg-white px-3 text-xs font-normal text-slate-900 shadow-none hover:bg-slate-50"
														>
															<Translate
																text={localizationConstants.agreementCreateSeFil}
															/>
														</Button>
														<Button
															type="button"
															variant="ghost"
															size="icon"
															onClick={() => setDocToDelete(doc)}
															className="h-8 w-8 cursor-pointer text-slate-900 hover:bg-slate-100 hover:text-slate-900"
														>
															<Trash2 className="h-4 w-4" />
														</Button>
													</div>
												</TableCell>
											</TableRow>
										))
									)}
								</TableBody>
							</Table>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Delete Confirmation Alert Dialog */}
			<AlertDialog
				open={Boolean(docToDelete)}
				onOpenChange={(open) => !open && setDocToDelete(null)}
			>
				<AlertDialogContent className="max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
					<AlertDialogHeader>
						<AlertDialogTitle className="text-base font-medium text-slate-900">
							<Translate
								text={localizationConstants.calcInquiryWizDeleteDocConfirm}
							/>
						</AlertDialogTitle>
						<AlertDialogDescription className="text-sm text-slate-500">
							<Translate
								text={localizationConstants.calcArchiveDeleteConfirmDescription}
							/>
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter className="flex flex-row items-center justify-end gap-2">
						<AlertDialogCancel className="h-9 cursor-pointer border-slate-200 bg-white text-sm text-slate-700 hover:bg-slate-50">
							<Translate text={localizationConstants.cancelButton} />
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleConfirmDelete}
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

export default AgreementDocumentCenter;
