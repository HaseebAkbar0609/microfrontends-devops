"use client";

import { useRef, useState } from "react";
import { ArrowUpDown, FileText, Folder, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { showToast } from "@/lib/toast";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { ACCEPTED_UPLOAD_TYPES } from "../data/newMachine.config";
import type {
	MachineDocumentItem,
	MachineDocumentKind,
	PendingMachineFile,
} from "../types/newMachine.types";

interface MachineDocumentsStepProps {
	documents: MachineDocumentItem[];
	onAddDocuments: (files: PendingMachineFile[], kind: MachineDocumentKind) => void;
	onRemoveDocument: (id: string) => void;
}

function fileTypeOf(name: string): MachineDocumentItem["fileType"] {
	const ext = name.split(".").pop()?.toLowerCase() ?? "";
	if (ext === "pdf") return "pdf";
	if (ext === "png") return "png";
	if (ext === "jpg" || ext === "jpeg") return "jpg";
	return "doc";
}

/** A sortable column heading, matching the document tables in the design. */
function SortableHead({ labelKey }: { labelKey: TranslationKeys }) {
	return (
		<TableHead className="px-4 py-3 text-xs font-medium text-slate-500">
			<div className="flex items-center gap-1">
				<Translate text={labelKey} />
				<ArrowUpDown className="h-3.5 w-3.5 opacity-60" />
			</div>
		</TableHead>
	);
}

function DocumentTable({
	titleKey,
	rows,
	onRemove,
}: {
	titleKey: TranslationKeys;
	rows: MachineDocumentItem[];
	onRemove: (id: string) => void;
}) {
	const t = useTranslate();

	return (
		<div className="flex flex-col gap-3">
			<h3 className="text-sm font-medium text-slate-900">
				<Translate text={titleKey} />
			</h3>
			<div className="overflow-hidden rounded-lg border border-slate-200">
				<Table>
					<TableHeader>
						<TableRow className="border-b border-slate-200 bg-white hover:bg-white">
							<SortableHead labelKey={localizationConstants.machineCreateColDate} />
							<SortableHead
								labelKey={localizationConstants.machineCreateColDocName}
							/>
							<SortableHead labelKey={localizationConstants.machineCreateColFile} />
							<TableHead className="px-4 py-3" />
						</TableRow>
					</TableHeader>
					<TableBody>
						{rows.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={4}
									className="py-8 text-center text-sm text-slate-500"
								>
									<Translate
										text={localizationConstants.machineCreateNoDocuments}
									/>
								</TableCell>
							</TableRow>
						) : (
							rows.map((doc) => (
								<TableRow key={doc.id} className="border-b border-slate-100">
									<TableCell className="px-4 py-3 text-sm text-slate-700">
										{doc.date}
									</TableCell>
									<TableCell className="px-4 py-3">
										<div className="flex items-center gap-2">
											<FileText className="h-5 w-5 shrink-0 text-red-500" />
											<span className="text-sm text-slate-900">{doc.name}</span>
										</div>
									</TableCell>
									<TableCell className="px-4 py-3 text-sm uppercase text-slate-700">
										{doc.fileType}
									</TableCell>
									<TableCell className="px-4 py-3">
										<div className="flex items-center justify-end gap-2">
											<Button
												type="button"
												variant="outline"
												size="sm"
												className="h-8 cursor-pointer border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-100"
											>
												<Translate
													text={localizationConstants.machineCreateViewFile}
												/>
											</Button>
											<Button
												type="button"
												variant="ghost"
												size="icon"
												aria-label={t(localizationConstants.actionDelete)}
												onClick={() => onRemove(doc.id)}
												className="h-8 w-8 cursor-pointer text-slate-500 hover:text-red-600"
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
	);
}

/**
 * Step 2 of the wizard: pick files, choose which register they belong to via
 * the Upload menu, and review them in the Specifikation / Ekonomi tables.
 */
export function MachineDocumentsStep({
	documents,
	onAddDocuments,
	onRemoveDocument,
}: MachineDocumentsStepProps) {
	const t = useTranslate();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [pending, setPending] = useState<PendingMachineFile[]>([]);

	const handleFilesPicked = (event: React.ChangeEvent<HTMLInputElement>) => {
		const picked = Array.from(event.target.files ?? []).map((file, index) => ({
			id: `${file.name}-${index}-${file.size}`,
			name: file.name,
		}));
		setPending((prev) => [...prev, ...picked]);
		// Allow re-picking the same file after it has been filed or removed.
		event.target.value = "";
	};

	const handleUpload = (kind: MachineDocumentKind) => {
		if (pending.length === 0) {
			showToast("error", t(localizationConstants.machineCreateNoFilesPicked));
			return;
		}
		onAddDocuments(pending, kind);
		setPending([]);
		showToast("success", t(localizationConstants.machineCreateFilesUploaded));
	};

	return (
		<Card>
			<CardHeader className="flex h-14 flex-row items-center border-b border-slate-200 px-6 py-0 [.border-b]:pb-0">
				<CardTitle className="flex items-center gap-2 text-base font-medium">
					<Folder className="h-5 w-5 text-slate-700" />
					<Translate text={localizationConstants.machineCreateDocumentsCard} />
				</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-6">
				<div className="flex flex-col gap-1">
					<p className="text-sm font-medium text-slate-900">
						<Translate text={localizationConstants.machineCreateUploadLabel} />
					</p>
					<p className="text-xs text-slate-500">
						<Translate text={localizationConstants.machineCreateUploadHint} />
					</p>

					<div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-start">
						{/* Picked-but-not-filed files, shown as removable chips */}
						<button
							type="button"
							onClick={() => fileInputRef.current?.click()}
							className="flex min-h-10 flex-1 cursor-pointer flex-wrap items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-left"
						>
							{pending.length === 0 ? (
								<span className="text-sm text-slate-400">
									<Translate
										text={localizationConstants.machineCreateChooseFiles}
									/>
								</span>
							) : (
								pending.map((file) => (
									<span
										key={file.id}
										className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-700"
									>
										{file.name}
										<span
											role="button"
											tabIndex={0}
											aria-label={t(localizationConstants.actionDelete)}
											onClick={(event) => {
												event.stopPropagation();
												setPending((prev) =>
													prev.filter((f) => f.id !== file.id)
												);
											}}
											onKeyDown={(event) => {
												if (event.key === "Enter" || event.key === " ") {
													event.stopPropagation();
													setPending((prev) =>
														prev.filter((f) => f.id !== file.id)
													);
												}
											}}
											className="cursor-pointer text-slate-500 hover:text-slate-900"
										>
											<X className="h-3 w-3" />
										</span>
									</span>
								))
							)}
						</button>

						<input
							ref={fileInputRef}
							type="file"
							multiple
							accept={ACCEPTED_UPLOAD_TYPES}
							onChange={handleFilesPicked}
							className="hidden"
						/>

						{/* Upload files into either register */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									type="button"
									className="h-10 cursor-pointer bg-[#111721] px-5 text-sm font-medium text-white hover:bg-slate-800"
								>
									<Translate
										text={localizationConstants.machineCreateUploadButton}
									/>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								align="end"
								className="w-44 border border-slate-200 bg-white p-1 shadow-md"
							>
								<DropdownMenuItem
									onClick={() => handleUpload("specification")}
									className="flex cursor-pointer items-center gap-2 text-slate-700 focus:bg-slate-50"
								>
									<FileText className="h-4 w-4 text-slate-500" />
									<Translate
										text={localizationConstants.machineCreateSpecification}
									/>
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => handleUpload("economy")}
									className="flex cursor-pointer items-center gap-2 text-slate-700 focus:bg-slate-50"
								>
									<FileText className="h-4 w-4 text-slate-500" />
									<Translate text={localizationConstants.machineCreateEconomy} />
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>

				<DocumentTable
					titleKey={localizationConstants.machineCreateSpecification}
					rows={documents.filter((doc) => doc.kind === "specification")}
					onRemove={onRemoveDocument}
				/>
				<DocumentTable
					titleKey={localizationConstants.machineCreateEconomyDocuments}
					rows={documents.filter((doc) => doc.kind === "economy")}
					onRemove={onRemoveDocument}
				/>
			</CardContent>
		</Card>
	);
}

export { fileTypeOf };
