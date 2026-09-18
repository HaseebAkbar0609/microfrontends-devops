"use client";

import React, { useRef } from "react";
import { FileText, Image as ImageIcon, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { CustomerAttachedDocument } from "../../../../types/createCustomer.types";

interface DocumentUploadZoneProps {
	documents: CustomerAttachedDocument[];
	onAddDocument: (file: File) => void;
	onRemoveDocument: (id: string) => void;
}

export function DocumentUploadZone({
	documents,
	onAddDocument,
	onRemoveDocument,
}: DocumentUploadZoneProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files && files.length > 0) {
			for (let i = 0; i < files.length; i++) {
				onAddDocument(files[i]);
			}
			e.target.value = "";
		}
	};

	return (
		<div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs space-y-5">
			<div>
				<h3 className="text-sm font-bold text-slate-900 tracking-tight">
					<Translate text={localizationConstants.companyDetailsSection} />
				</h3>
				<p className="text-xs text-slate-500 mt-1">
					<Translate text={localizationConstants.fileUploadHelper} />
				</p>
			</div>

			<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
				<input
					ref={fileInputRef}
					type="file"
					multiple
					accept=".pdf,.jpg,.jpeg,.png"
					onChange={handleFileSelect}
					className="hidden"
				/>
				<Button
					type="button"
					onClick={() => fileInputRef.current?.click()}
					className="h-10 px-5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold gap-2 rounded-lg cursor-pointer transition-colors shadow-2xs shrink-0"
				>
					<Upload className="h-4 w-4" />
					<span>Ladda upp dokument</span>
				</Button>
			</div>

			{documents.length > 0 && (
				<div className="border border-slate-200 rounded-lg overflow-hidden">
					<table className="w-full text-left text-xs">
						<thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
							<tr>
								<th className="py-2.5 px-4 font-semibold">Datum</th>
								<th className="py-2.5 px-4 font-semibold">Dokumentnamn</th>
								<th className="py-2.5 px-4 font-semibold">Storlek</th>
								<th className="py-2.5 px-4 font-semibold text-right">Åtgärd</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-100 text-slate-800">
							{documents.map((doc) => (
								<tr key={doc.id} className="hover:bg-slate-50/50">
									<td className="py-2.5 px-4 text-slate-500">{doc.dateAdded}</td>
									<td className="py-2.5 px-4 font-medium flex items-center gap-2">
										{doc.name.endsWith(".pdf") ? (
											<FileText className="h-4 w-4 text-rose-500 shrink-0" />
										) : (
											<ImageIcon className="h-4 w-4 text-blue-500 shrink-0" />
										)}
										<span className="truncate max-w-[200px] sm:max-w-xs">{doc.name}</span>
									</td>
									<td className="py-2.5 px-4 text-slate-500">{doc.size}</td>
									<td className="py-2.5 px-4 text-right">
										<button
											type="button"
											onClick={() => onRemoveDocument(doc.id)}
											className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer transition-colors"
											aria-label="Ta bort dokument"
										>
											<Trash2 className="h-4 w-4" />
										</button>
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
