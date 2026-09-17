"use client";

import React, { useState } from "react";
import { FileText, Trash2, Eye, UploadCloud, Image as ImageIcon } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
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
	const [docType, setDocType] = useState("Document type 1");
	const [docSubType, setDocSubType] = useState("Document Sub-t 1");
	const [selectedImagePreset, setSelectedImagePreset] = useState("photo1.png");

	const handleUploadDocument = () => {
		const newDoc: CaseDocument = {
			id: `doc-${Date.now()}`,
			name: "filename.pdf",
			date: new Date().toISOString().split("T")[0],
			fileType: "application/pdf",
			fileSize: "PDF",
			category: "document",
		};
		onAddDocument(newDoc);
	};

	const handleUploadImage = () => {
		const newImg: CaseDocument = {
			id: `img-${Date.now()}`,
			name: "17066.jpeg",
			date: new Date().toISOString().split("T")[0],
			fileType: "image/jpeg",
			fileSize: "520 KB",
			category: "image",
		};
		onAddImage(newImg);
	};

	return (
		<div className="space-y-6">
			{/* Document Upload Card matching Figma Image 3 */}
			<div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
				<h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
					<Translate text={localizationConstants.casesDocumentsSectionTitle} />
				</h2>

				<div className="space-y-1">
					<p className="text-xs font-semibold text-slate-800">
						<Translate text={localizationConstants.casesUploadYourFiles} />
					</p>
					<p className="text-[11px] text-slate-400">
						<Translate text={localizationConstants.casesUploadFormats} />
					</p>
				</div>

				<div className="flex flex-wrap items-center gap-3 pt-1">
					<select
						value={docType}
						onChange={(e) => setDocType(e.target.value)}
						className="h-9 px-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 min-w-[160px] focus:outline-none focus:ring-1 focus:ring-slate-400 cursor-pointer"
					>
						<option value="Document type 1">Document type 1</option>
						<option value="Document type 2">Document type 2</option>
					</select>

					<select
						value={docSubType}
						onChange={(e) => setDocSubType(e.target.value)}
						className="h-9 px-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 min-w-[160px] focus:outline-none focus:ring-1 focus:ring-slate-400 cursor-pointer"
					>
						<option value="Document Sub-t 1">Document Sub-t 1</option>
						<option value="Document Sub-t 2">Document Sub-t 2</option>
					</select>

					<button
						type="button"
						onClick={handleUploadDocument}
						className="h-9 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
					>
						<UploadCloud className="w-4 h-4" />
						<Translate text={localizationConstants.casesBtnUpload} />
					</button>
				</div>

				{/* Table of uploaded documents */}
				<div className="border border-slate-200 rounded-lg overflow-hidden mt-4">
					<table className="w-full text-left text-xs">
						<thead>
							<tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[11px]">
								<th className="py-2.5 px-4">
									<Translate text={localizationConstants.casesColDocDate} />
								</th>
								<th className="py-2.5 px-4">
									<Translate text={localizationConstants.casesColDocName} />
								</th>
								<th className="py-2.5 px-4">
									<Translate text={localizationConstants.casesColDocFile} />
								</th>
								<th className="py-2.5 px-4 text-right"></th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-100">
							{documents.length === 0 ? (
								<tr>
									<td colSpan={4} className="py-6 text-center text-slate-400 italic">
										<Translate text={localizationConstants.casesNoItemsFound} />
									</td>
								</tr>
							) : (
								documents.map((doc) => (
									<tr key={doc.id} className="hover:bg-slate-50/50">
										<td className="py-3 px-4 text-slate-600 whitespace-nowrap">{doc.date}</td>
										<td className="py-3 px-4 text-slate-800 font-medium">
											<div className="flex items-center gap-2">
												<FileText className="w-4 h-4 text-rose-500 shrink-0" />
												<span>{doc.name}</span>
											</div>
										</td>
										<td className="py-3 px-4 text-slate-500 uppercase">{doc.fileSize || "PDF"}</td>
										<td className="py-3 px-4 text-right whitespace-nowrap">
											<div className="flex items-center justify-end gap-3">
												<button
													type="button"
													onClick={() => alert(`Visar fil: ${doc.name}`)}
													className="text-slate-600 hover:text-slate-900 font-medium hover:underline cursor-pointer"
												>
													<Translate text={localizationConstants.casesBtnViewFile} />
												</button>
												<button
													type="button"
													onClick={() => onRemoveDocument(doc.id)}
													className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer transition-colors"
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

			{/* Images Upload Card matching Figma Image 3 */}
			<div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
				<div className="flex items-center gap-2 border-b border-slate-100 pb-3">
					<ImageIcon className="w-4 h-4 text-slate-700" />
					<h2 className="text-sm font-bold text-slate-900">
						<Translate text={localizationConstants.casesImagesSectionTitle} />
					</h2>
				</div>

				<div className="space-y-1">
					<p className="text-xs font-semibold text-slate-800">
						<Translate text={localizationConstants.casesUploadImages} />
					</p>
					<p className="text-[11px] text-slate-400">
						<Translate text={localizationConstants.casesImageFormats} />
					</p>
				</div>

				<div className="flex flex-wrap items-center gap-3 pt-1">
					<select
						value={selectedImagePreset}
						onChange={(e) => setSelectedImagePreset(e.target.value)}
						className="h-9 px-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 min-w-[200px] focus:outline-none focus:ring-1 focus:ring-slate-400 cursor-pointer"
					>
						<option value="photo1.png">photo1.png</option>
						<option value="photo2.jpg">photo2.jpg</option>
					</select>

					<button
						type="button"
						onClick={handleUploadImage}
						className="h-9 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
					>
						<UploadCloud className="w-4 h-4" />
						<Translate text={localizationConstants.casesBtnUpload} />
					</button>
				</div>

				{/* Thumbnail card grid matching Figma Image 3 */}
				<div className="pt-2">
					<p className="text-xs font-semibold text-slate-700 mb-2">Bilder</p>
					<div className="flex flex-wrap gap-4">
						{images.map((img) => (
							<div
								key={img.id}
								className="relative group w-28 border border-slate-200 rounded-lg overflow-hidden bg-slate-50 shadow-2xs"
							>
								<div className="h-20 bg-slate-200 flex items-center justify-center overflow-hidden">
									{img.url ? (
										<img
											src={img.url}
											alt={img.name}
											className="w-full h-full object-cover"
										/>
									) : (
										<ImageIcon className="w-8 h-8 text-slate-400" />
									)}
								</div>
								<div className="p-1.5 bg-white border-t border-slate-100 flex items-center justify-between">
									<span className="text-[10px] text-slate-600 truncate font-mono">
										{img.name}
									</span>
									<button
										type="button"
										onClick={() => onRemoveImage(img.id)}
										className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer transition-colors"
									>
										<Trash2 className="w-3 h-3" />
									</button>
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
