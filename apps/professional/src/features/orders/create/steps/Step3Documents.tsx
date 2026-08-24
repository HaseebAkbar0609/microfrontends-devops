"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
	ArrowUpDown,
	MoreVertical,
	PencilLine,
	Trash2,
	FilePlus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
import localizationConstants from "@/utils/translation/constants";
import { uploadOrderDocumentAPIAction } from "../api/orderCreateApi";
import type { OrderDocumentItem } from "../types";

interface Step3DocumentsProps {
	documents: OrderDocumentItem[];
	onDocumentsChange: (docs: OrderDocumentItem[]) => void;
}

export function Step3Documents({
	documents,
	onDocumentsChange,
}: Step3DocumentsProps) {
	const t = useTranslate();
	const [selectedFileName, setSelectedFileName] = useState("");
	const [pendingFile, setPendingFile] = useState<File | null>(null);
	const [editingId, setEditingId] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setSelectedFileName(file.name);
			setPendingFile(file);
		}
	};

	const handleUploadClick = async () => {
		if (!pendingFile && !selectedFileName) {
			fileInputRef.current?.click();
			return;
		}

		const fileName = pendingFile ? pendingFile.name : selectedFileName;
		const ext = fileName.split(".").pop()?.toLowerCase() || "pdf";
		const fileType: OrderDocumentItem["fileType"] =
			ext === "doc" || ext === "docx"
				? "doc"
				: ext === "png"
				? "png"
				: ext === "jpg" || ext === "jpeg"
				? "jpg"
				: "pdf";

		let uploadedUrl = "";
		let uploadedId = `doc-${Date.now()}`;
		if (pendingFile) {
			try {
				const uploadRes = await uploadOrderDocumentAPIAction(pendingFile);
				uploadedUrl = uploadRes.url;
				uploadedId = uploadRes.id;
			} catch (err) {
				console.warn("[Upload API Error]", err);
			}
		}

		const newDoc: OrderDocumentItem = {
			id: uploadedId,
			date: new Date().toISOString().split("T")[0],
			documentName: fileName.replace(/\.[^/.]+$/, "") || "Dockumentets namn",
			fileName: fileName,
			fileType: fileType,
			fileSize: pendingFile ? `${(pendingFile.size / 1024).toFixed(0)} KB` : "1.2 MB",
			fileUrl: uploadedUrl,
		};

		onDocumentsChange([...documents, newDoc]);
		setSelectedFileName("");
		setPendingFile(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
		showToast("success", t(localizationConstants.orderUploadButton));
	};

	const handleDocumentNameChange = (id: string, newName: string) => {
		onDocumentsChange(
			documents.map((doc) =>
				doc.id === id ? { ...doc, documentName: newName } : doc
			)
		);
	};

	const handleDeleteDocument = (id: string) => {
		onDocumentsChange(documents.filter((doc) => doc.id !== id));
		showToast("info", t(localizationConstants.actionDelete));
	};

	return (
		<div className="flex flex-col gap-4">
			<Card className="rounded-lg border border-slate-200 bg-white shadow-none pb-4">
				<CardHeader className="h-12 flex flex-row items-center border-b border-slate-200 px-4 py-0 [.border-b]:pb-0">
					<CardTitle className="flex items-center gap-2 text-base font-medium text-slate-900">
						<FilePlus className="h-5 w-5 text-slate-700" />
						<span><Translate text={localizationConstants.orderDokumentSection} /></span>
					</CardTitle>
				</CardHeader>
				<CardContent className="px-4 py-0 space-y-4">
					{/* Upload Area */}
					<div className="space-y-1">
						<Label className="text-sm font-medium text-slate-700">
							<Translate text={localizationConstants.orderUploadFileLabel} />
						</Label>
						<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
							<input
								ref={fileInputRef}
								type="file"
								accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
								onChange={handleFileSelect}
								className="hidden"
							/>
							<button
								type="button"
								onClick={() => fileInputRef.current?.click()}
								className="flex h-10 flex-1 items-center rounded-md border border-slate-200 bg-white px-3 text-left text-sm text-slate-600 shadow-none cursor-pointer hover:border-gray-300 focus:outline-none focus:ring-1 focus:ring-slate-300"
							>
								{selectedFileName ? (
									<span className="text-slate-900">{selectedFileName}</span>
								) : (
									<span className="text-slate-400">
										{t(localizationConstants.fileUploadLabel)}
									</span>
								)}
							</button>
							<Button
								type="button"
								onClick={handleUploadClick}
								className="h-10 rounded-md bg-[#0F172A] px-6 text-sm font-medium text-white hover:bg-[#1e293b] cursor-pointer shadow-none"
							>
								<Translate text={localizationConstants.orderUploadButton} />
							</Button>
						</div>
						<p className="text-xs text-slate-500 pt-1">
							<Translate text={localizationConstants.orderFileAllowedHelper} />
						</p>
					</div>

					{/* Bifogade dokument Table */}
					<div className="space-y-3 pt-2">
						<div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
							<div className="flex h-9 items-center bg-slate-200 px-4 border-b border-slate-200">
								<h3 className="text-sm font-semibold text-slate-900">
									<Translate text={localizationConstants.orderAttachedDocumentsHeader} />
								</h3>
							</div>
							<Table>
								<TableHeader className="bg-white">
									<TableRow className="border-b border-slate-200 hover:bg-white">
										<TableHead className="text-xs font-medium text-slate-600 h-8">
											<div className="flex items-center gap-1.5">
												<span><Translate text={localizationConstants.dateHeaderLabel} /></span>
												<ArrowUpDown className="h-3 w-3 text-slate-400" />
											</div>
										</TableHead>
										<TableHead className="text-xs font-medium text-slate-600 h-8">
											<div className="flex items-center gap-1.5">
												<span><Translate text={localizationConstants.documentNameHeader} /></span>
												<ArrowUpDown className="h-3 w-3 text-slate-400" />
											</div>
										</TableHead>
										<TableHead className="text-xs font-medium text-slate-600 h-8">
											<div className="flex items-center gap-1.5">
												<span><Translate text={localizationConstants.fileHeader} /></span>
												<ArrowUpDown className="h-3 w-3 text-slate-400" />
											</div>
										</TableHead>
										<TableHead className="w-12 text-right text-xs font-medium text-slate-600 h-8">
											<span className="sr-only"><Translate text={localizationConstants.actionsHeader} /></span>
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{documents.length === 0 ? (
										<TableRow>
											<TableCell
												colSpan={4}
												className="py-6 text-center text-xs text-slate-400"
											>
												<Translate text={localizationConstants.orderNoDocumentsYet} />
											</TableCell>
										</TableRow>
									) : (
										documents.map((doc) => (
											<TableRow
												key={doc.id}
												className="border-b border-slate-100 transition-colors hover:bg-slate-50/50"
											>
												<TableCell className="py-1.5 text-xs text-slate-600">
													{doc.date}
												</TableCell>
												<TableCell className="py-1.5">
													{editingId === doc.id ? (
														<Input
															value={doc.documentName}
															onChange={(e) =>
																handleDocumentNameChange(
																	doc.id,
																	e.target.value
																)
															}
															onBlur={() => setEditingId(null)}
															onKeyDown={(e) => {
																if (e.key === "Enter")
																	setEditingId(null);
															}}
															autoFocus
															className="h-[34px] max-w-[220px] text-xs rounded-md"
														/>
													) : (
														<div
															onClick={() => setEditingId(doc.id)}
															className="inline-flex items-center rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 shadow-none cursor-pointer hover:border-gray-300 min-h-[34px]"
														>
															{doc.documentName || "Dockumentets namn"}
														</div>
													)}
												</TableCell>
												<TableCell className="py-1.5">
													<div className="flex items-center gap-2.5">
														{doc.fileType === "pdf" ? (
															<Image
																src="/file-type-pdf.png"
																alt="PDF"
																width={36}
																height={36}
																className="h-9 w-9 object-contain shrink-0"
															/>
														) : doc.fileType === "doc" ? (
															<Image
																src="/file-type-doc.png"
																alt="DOC"
																width={36}
																height={36}
																className="h-9 w-9 object-contain shrink-0"
															/>
														) : (
															<span className="flex items-center justify-center rounded bg-[#10B981] px-2 py-1 text-[10px] font-bold text-white tracking-wider">
																PNG
															</span>
														)}
														<span className="text-xs font-normal text-slate-800">
															{doc.fileName}
														</span>
													</div>
												</TableCell>
												<TableCell className="py-1.5 text-right">
													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button
																variant="ghost"
																size="icon"
																aria-label={t(localizationConstants.actionsHeader)}
																className="h-8 w-8 text-slate-700 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
															>
																<MoreVertical className="h-4 w-4" />
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent
															align="end"
															className="w-36 bg-white shadow-lg border border-slate-200 rounded-lg"
														>
															<DropdownMenuItem
																onClick={() => setEditingId(doc.id)}
																className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:bg-slate-50"
															>
																<PencilLine className="h-3.5 w-3.5 text-slate-700" />
																<span><Translate text={localizationConstants.actionEdit} /></span>
															</DropdownMenuItem>
															<DropdownMenuItem
																onClick={() =>
																	handleDeleteDocument(doc.id)
																}
																className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:bg-slate-50"
															>
																<Trash2 className="h-3.5 w-3.5 text-slate-700" />
																<span><Translate text={localizationConstants.actionDelete} /></span>
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
				</CardContent>
			</Card>
		</div>
	);
}
