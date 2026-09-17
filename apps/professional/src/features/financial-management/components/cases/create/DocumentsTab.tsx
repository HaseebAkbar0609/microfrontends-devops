"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Trash2, Image as ImageIcon, X, ChevronDown } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { PdfFileIcon } from "@/components/ui/PdfFileIcon";
import type { CaseDocument } from "../../../types/cases.types";

interface DocumentsTabProps {
	documents: CaseDocument[];
	images: CaseDocument[];
	onAddDocument: (doc: CaseDocument) => void;
	onRemoveDocument: (id: string) => void;
	onAddImage: (img: CaseDocument) => void;
	onRemoveImage: (id: string) => void;
}

export function DocumentsTab({
	documents,
	images,
	onAddDocument,
	onRemoveDocument,
	onAddImage,
	onRemoveImage,
}: DocumentsTabProps) {
	// Selected files to upload chips matching Figma Image 4
	const [selectedDocChips, setSelectedDocChips] = useState<string[]>([
		"Document 1.pdf",
		"Document 2.doc",
	]);
	const [selectedImageChips, setSelectedImageChips] = useState<string[]>([
		"photo1.png",
	]);

	const removeDocChip = (chip: string) => {
		setSelectedDocChips((prev) => prev.filter((c) => c !== chip));
	};

	const removeImageChip = (chip: string) => {
		setSelectedImageChips((prev) => prev.filter((c) => c !== chip));
	};

	const handleUploadDocument = () => {
		selectedDocChips.forEach((chip, index) => {
			const newDoc: CaseDocument = {
				id: `doc-${Date.now()}-${index}`,
				name: chip.endsWith(".pdf") ? "filename.pdf" : chip,
				date: new Date().toISOString().split("T")[0],
				fileType: chip.endsWith(".pdf") ? "application/pdf" : "application/msword",
				fileSize: chip.endsWith(".pdf") ? "PDF" : "DOC",
				category: "document",
			};
			onAddDocument(newDoc);
		});
		setSelectedDocChips([]);
	};

	const handleUploadImage = () => {
		selectedImageChips.forEach((chip, index) => {
			const newImg: CaseDocument = {
				id: `img-${Date.now()}-${index}`,
				name: chip === "photo1.png" ? "Photo.img" : chip,
				date: new Date().toISOString().split("T")[0],
				fileType: "image/png",
				fileSize: "520 KB",
				url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&auto=format&fit=crop&q=60",
				category: "image",
			};
			onAddImage(newImg);
		});
		setSelectedImageChips([]);
	};

	return (
		<div className="space-y-6">
			{/* Dokument Card matching Figma Image 4 */}
			<div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
				<h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
					<Translate text={localizationConstants.casesDocumentsSectionTitle} />
				</h2>

				<div className="space-y-0.5">
					<p className="text-xs font-semibold text-slate-800">
						<Translate text={localizationConstants.casesUploadYourFiles} />
					</p>
					<p className="text-[11px] text-slate-400">
						<Translate text={localizationConstants.casesUploadFormats} />
					</p>
				</div>

				{/* File picker selector with chips & Upload button matching Figma Image 4 */}
				<div className="flex flex-wrap items-center gap-3 pt-1">
					<div className="flex-1 min-w-[280px] min-h-[38px] p-1.5 bg-white border border-slate-200 rounded-lg flex items-center justify-between gap-2">
						<div className="flex flex-wrap items-center gap-1.5">
							{selectedDocChips.map((chip) => (
								<span
									key={chip}
									className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 border border-slate-200 rounded text-xs text-slate-700"
								>
									<span>{chip}</span>
									<button
										type="button"
										onClick={() => removeDocChip(chip)}
										className="text-slate-400 hover:text-slate-700 cursor-pointer"
										aria-label={`Remove ${chip}`}
									>
										<X className="w-3 h-3" />
									</button>
								</span>
							))}
							{selectedDocChips.length === 0 && (
								<button
									type="button"
									onClick={() => setSelectedDocChips(["Document 1.pdf", "Document 2.doc"])}
									className="text-xs text-slate-400 pl-2 cursor-pointer hover:text-slate-600"
								>
									+ Välj filer...
								</button>
							)}
						</div>
						<ChevronDown className="w-4 h-4 text-slate-400 shrink-0 mr-1" />
					</div>

					<button
						type="button"
						onClick={handleUploadDocument}
						className="h-[38px] px-5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
					>
						<Translate text={localizationConstants.casesBtnUpload} />
					</button>
				</div>

				{/* Table of uploaded documents matching Figma Image 4 */}
				<div className="border border-slate-200 rounded-lg overflow-hidden mt-4">
					<table className="w-full text-left text-xs">
						<thead>
							<tr className="bg-slate-50/50 border-b border-slate-200 text-slate-500 font-medium text-[11px]">
								<th className="py-3 px-4">
									<Translate text={localizationConstants.casesColDocDate} /> ⇅
								</th>
								<th className="py-3 px-4">
									<Translate text={localizationConstants.casesColDocName} /> ⇅
								</th>
								<th className="py-3 px-4">
									<Translate text={localizationConstants.casesColDocFile} /> ⇅
								</th>
								<th className="py-3 px-4 text-right"></th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-100 bg-white">
							{documents.length === 0 ? (
								<tr>
									<td colSpan={4} className="py-6 text-center text-slate-400 italic">
										<Translate text={localizationConstants.casesNoItemsFound} />
									</td>
								</tr>
							) : (
								documents.map((doc) => (
									<tr key={doc.id} className="hover:bg-slate-50/60 transition-colors">
										<td className="py-3 px-4 text-slate-600 whitespace-nowrap">{doc.date}</td>
										<td className="py-3 px-4 text-slate-800 font-medium">
											<div className="flex items-center gap-2">
												<PdfFileIcon className="h-6 w-5" />
												<span>{doc.name}</span>
											</div>
										</td>
										<td className="py-3 px-4 text-slate-600 uppercase">{doc.fileSize || "PDF"}</td>
										<td className="py-3 px-4 text-right whitespace-nowrap">
											<div className="flex items-center justify-end gap-3">
												<button
													type="button"
													onClick={() => window.open(doc.url || "#", "_blank")}
													className="px-3 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium cursor-pointer transition-colors"
												>
													<Translate text={localizationConstants.casesBtnViewFile} />
												</button>
												<button
													type="button"
													onClick={() => onRemoveDocument(doc.id)}
													className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer transition-colors"
													title="Delete"
												>
													<Trash2 className="w-3.5 h-3.5" />
												</button>
											</div>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>

			{/* Bilder Card matching Figma Image 4 */}
			<div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
				<div className="flex items-center gap-2 border-b border-slate-100 pb-3">
					<ImageIcon className="w-4 h-4 text-slate-700" />
					<h2 className="text-sm font-bold text-slate-900">
						<Translate text={localizationConstants.casesImagesSectionTitle} />
					</h2>
				</div>

				<div className="space-y-0.5">
					<p className="text-xs font-semibold text-slate-800">
						<Translate text={localizationConstants.casesUploadImages} />
					</p>
					<p className="text-[11px] text-slate-400">
						<Translate text={localizationConstants.casesImageFormats} />
					</p>
				</div>

				<div className="flex flex-wrap items-center gap-3 pt-1">
					<div className="flex-1 min-w-[280px] min-h-[38px] p-1.5 bg-white border border-slate-200 rounded-lg flex items-center justify-between gap-2">
						<div className="flex flex-wrap items-center gap-1.5">
							{selectedImageChips.map((chip) => (
								<span
									key={chip}
									className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 border border-slate-200 rounded text-xs text-slate-700"
								>
									<span>{chip}</span>
									<button
										type="button"
										onClick={() => removeImageChip(chip)}
										className="text-slate-400 hover:text-slate-700 cursor-pointer"
										aria-label={`Remove ${chip}`}
									>
										<X className="w-3 h-3" />
									</button>
								</span>
							))}
							{selectedImageChips.length === 0 && (
								<button
									type="button"
									onClick={() => setSelectedImageChips(["photo1.png"])}
									className="text-xs text-slate-400 pl-2 cursor-pointer hover:text-slate-600"
								>
									+ Välj bild...
								</button>
							)}
						</div>
						<ChevronDown className="w-4 h-4 text-slate-400 shrink-0 mr-1" />
					</div>

					<button
						type="button"
						onClick={handleUploadImage}
						className="h-[38px] px-5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
					>
						<Translate text={localizationConstants.casesBtnUpload} />
					</button>
				</div>

				{/* Thumbnail card gallery matching Figma Image 4 */}
				<div className="pt-2 space-y-2">
					<p className="text-xs font-semibold text-slate-800">Bilder</p>
					<div className="flex flex-wrap gap-4">
						{images.map((img) => (
							<div
								key={img.id}
								className="relative group w-32 border border-slate-200 rounded-lg overflow-hidden bg-slate-50 shadow-2xs"
							>
								{/* Close badge button on top right of thumbnail */}
								<button
									type="button"
									onClick={() => onRemoveImage(img.id)}
									className="absolute top-1.5 right-1.5 z-10 w-5 h-5 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center cursor-pointer transition-colors"
									aria-label="Remove photo"
								>
									<X className="w-3 h-3" />
								</button>

								<div className="relative h-24 bg-slate-200 flex items-center justify-center overflow-hidden">
									{img.url ? (
										<Image
											src={img.url}
											alt={img.name}
											fill
											unoptimized
											className="object-cover"
										/>
									) : (
										<div className="w-full h-full bg-slate-300 flex items-center justify-center text-slate-500">
											<ImageIcon className="w-8 h-8 opacity-40" />
										</div>
									)}
								</div>
								<div className="p-2 bg-white text-center border-t border-slate-100">
									<span className="text-[11px] text-slate-700 font-medium truncate block">
										{img.name}
									</span>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

export default DocumentsTab;
