"use client";

import React, { useRef } from "react";
import { Folder, UploadCloud, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { SupplierAttachedDocument } from "../../../../../types/createSupplier.types";
import { SupplierDetailCard } from "../../cards/SupplierDetailCard";

interface SupplierDocumentsCardProps {
	documents: SupplierAttachedDocument[];
	onAddDocument: (doc: SupplierAttachedDocument) => void;
	onDeleteDocument: (id: string) => void;
}

export function SupplierDocumentsCard({
	documents,
	onAddDocument,
	onDeleteDocument,
}: SupplierDocumentsCardProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);

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
				type: "Dokument",
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
		<SupplierDetailCard
			title={<Translate text={localizationConstants.supplierDetailCardDocuments} />}
			icon={<Folder className="h-5 w-5" />}
			headerExtra={
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={() => fileInputRef.current?.click()}
					className="h-8 px-3 text-xs font-semibold gap-1.5 border-slate-200 hover:bg-slate-50 cursor-pointer"
				>
					<UploadCloud className="h-3.5 w-3.5" />
					<Translate text={localizationConstants.supplierUploadButton} />
				</Button>
			}
		>
			<input
				ref={fileInputRef}
				type="file"
				multiple
				accept=".pdf,.png,.jpg,.jpeg,.docx"
				className="hidden"
				onChange={handleFileSelect}
			/>

			{documents.length === 0 ? (
				<div className="py-6 text-center text-xs text-slate-400">
					Inga dokument uppladdade
				</div>
			) : (
				<div className="overflow-hidden rounded-lg border border-slate-200">
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
												>
													<Eye className="h-4 w-4" />
												</a>
											)}
											<button
												type="button"
												onClick={() => onDeleteDocument(doc.id)}
												className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
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
		</SupplierDetailCard>
	);
}
