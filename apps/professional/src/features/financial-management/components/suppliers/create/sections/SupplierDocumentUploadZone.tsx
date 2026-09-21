"use client";

import React, { useRef, useState } from "react";
import { UploadCloud, Trash2, Eye } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { SupplierAttachedDocument } from "../../../../types/createSupplier.types";

const DOC_TYPES = [
	{ value: "Avtal", label: "Avtal" },
	{ value: "Certifikat", label: "Certifikat" },
	{ value: "Prislista", label: "Prislista" },
	{ value: "Kreditbedömning", label: "Kreditbedömning" },
	{ value: "Övrigt", label: "Övrigt" },
];

interface SupplierDocumentUploadZoneProps {
	documents: SupplierAttachedDocument[];
	onAddDocument: (doc: SupplierAttachedDocument) => void;
	onRemoveDocument: (id: string) => void;
}

export function SupplierDocumentUploadZone({
	documents,
	onAddDocument,
	onRemoveDocument,
}: SupplierDocumentUploadZoneProps) {
	const { t } = useTranslation();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [selectedDocType, setSelectedDocType] = useState("Avtal");

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files || files.length === 0) return;

		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
			const newDoc: SupplierAttachedDocument = {
				id: `doc-${Date.now()}-${i}`,
				name: file.name,
				size: `${sizeInMb} MB`,
				type: selectedDocType,
				dateAdded: new Date().toISOString().split("T")[0],
				url: URL.createObjectURL(file),
			};
			onAddDocument(newDoc);
		}

		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	return (
		<div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
			<div className="border-b border-slate-100 pb-4">
				<h3 className="text-sm font-bold text-slate-900 tracking-tight">
					<Translate text={localizationConstants.supplierCardCompanyFiles} />
				</h3>
			</div>

			{/* Drop Zone Box */}
			<div
				onClick={() => fileInputRef.current?.click()}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						fileInputRef.current?.click();
					}
				}}
				tabIndex={0}
				role="button"
				className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-slate-400 hover:bg-slate-50 transition-colors focus:outline-none"
			>
				<div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
					<UploadCloud className="h-6 w-6 text-slate-600" />
				</div>
				<p className="text-xs font-semibold text-slate-800">
					<Translate text={localizationConstants.supplierUploadFilesText} />
				</p>
				<p className="text-[11px] text-slate-400 mt-1">
					<Translate text={localizationConstants.supplierUploadFilesSubtext} />
				</p>
				<input
					ref={fileInputRef}
					type="file"
					multiple
					accept=".pdf,.png,.jpg,.jpeg,.docx"
					className="hidden"
					onChange={handleFileSelect}
				/>
			</div>

			{/* Doc Type Selector + Trigger Upload */}
			<div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
				<div className="flex items-center gap-2">
					<span className="text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.supplierDocTypeLabel} />:
					</span>
					<Select value={selectedDocType} onValueChange={setSelectedDocType}>
						<SelectTrigger className="h-9 w-40 text-xs bg-white">
							<SelectValue />
						</SelectTrigger>
						<SelectContent className="bg-white">
							{DOC_TYPES.map((dt) => (
								<SelectItem key={dt.value} value={dt.value} className="text-xs cursor-pointer">
									{dt.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={() => fileInputRef.current?.click()}
					className="h-9 px-4 text-xs font-semibold border-slate-200 hover:bg-slate-50 cursor-pointer"
				>
					<Translate text={localizationConstants.supplierUploadButton} />
				</Button>
			</div>

			{/* Document Table */}
			{documents.length > 0 && (
				<div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
					<table className="w-full text-left text-xs">
						<thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
							<tr>
								<th className="py-2.5 px-3">
									<Translate text={localizationConstants.supplierDocColDate} />
								</th>
								<th className="py-2.5 px-3">
									<Translate text={localizationConstants.supplierDocColName} />
								</th>
								<th className="py-2.5 px-3">
									<Translate text={localizationConstants.supplierDocColFile} />
								</th>
								<th className="py-2.5 px-3 text-right">
									<Translate text={localizationConstants.supplierDocColActions} />
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-100 bg-white">
							{documents.map((doc) => (
								<tr key={doc.id} className="hover:bg-slate-50">
									<td className="py-2.5 px-3 text-slate-600">{doc.dateAdded}</td>
									<td className="py-2.5 px-3 font-medium text-slate-800">{doc.name}</td>
									<td className="py-2.5 px-3 text-slate-500">{doc.type} ({doc.size})</td>
									<td className="py-2.5 px-3 text-right">
										<div className="flex items-center justify-end gap-2">
											{doc.url && (
												<a
													href={doc.url}
													target="_blank"
													rel="noopener noreferrer"
													className="text-slate-400 hover:text-blue-600 p-1"
													title={t(localizationConstants.supplierViewFile)}
												>
													<Eye className="h-4 w-4" />
												</a>
											)}
											<button
												type="button"
												onClick={() => onRemoveDocument(doc.id)}
												className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
												title={t(localizationConstants.deleteLabel)}
											>
												<Trash2 className="h-4 w-4" />
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}
