"use client";

import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { UploadCloud, FileText, Trash2, Download, Plus } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { AuthorityFormData, AuthorityAttachment } from "../../types/authorities.types";

interface AuthorityDocumentStepProps {
	formData: AuthorityFormData;
	onChange: (data: AuthorityFormData) => void;
}

export function AuthorityDocumentStep({
	formData,
	onChange,
}: AuthorityDocumentStepProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files || files.length === 0) return;

		const newAttachments: AuthorityAttachment[] = [];
		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			const ext = file.name.split(".").pop()?.toUpperCase() || "PDF";
			const sizeMb = (file.size / (1024 * 1024)).toFixed(1) + " MB";
			newAttachments.push({
				id: `att-${Date.now()}-${i}`,
				name: file.name,
				fileType: ext === "DOC" || ext === "DOCX" ? "DOC" : "PDF",
				fileSize: sizeMb,
				uploadDate: new Date().toISOString().split("T")[0],
				fileUrl: URL.createObjectURL(file),
			});
		}

		onChange({
			...formData,
			attachments: [...(formData.attachments || []), ...newAttachments],
		});

		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const handleDeleteAttachment = (id: string) => {
		const updated = (formData.attachments || []).filter((a) => a.id !== id);
		onChange({
			...formData,
			attachments: updated,
		});
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		const files = e.dataTransfer.files;
		if (!files || files.length === 0) return;

		const newAttachments: AuthorityAttachment[] = [];
		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			const ext = file.name.split(".").pop()?.toUpperCase() || "PDF";
			const sizeMb = (file.size / (1024 * 1024)).toFixed(1) + " MB";
			newAttachments.push({
				id: `att-${Date.now()}-${i}`,
				name: file.name,
				fileType: ext === "DOC" || ext === "DOCX" ? "DOC" : "PDF",
				fileSize: sizeMb,
				uploadDate: new Date().toISOString().split("T")[0],
				fileUrl: URL.createObjectURL(file),
			});
		}

		onChange({
			...formData,
			attachments: [...(formData.attachments || []), ...newAttachments],
		});
	};

	return (
		<div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-6">
			<div>
				<h3 className="text-sm font-semibold text-slate-900 mb-1">
					<Translate text={localizationConstants.tabDokument} />
				</h3>
				<p className="text-xs text-slate-500">
					Ladda upp och hantera bifogade dokument för ärendet.
				</p>
			</div>

			{/* Upload Zone */}
			<div
				onDragOver={(e) => e.preventDefault()}
				onDrop={handleDrop}
				onClick={() => fileInputRef.current?.click()}
				className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center cursor-pointer hover:border-slate-400 transition-colors bg-slate-50/50"
			>
				<input
					ref={fileInputRef}
					type="file"
					multiple
					accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
					onChange={handleFileSelect}
					className="hidden"
				/>
				<div className="flex flex-col items-center justify-center space-y-3">
					<div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
						<UploadCloud className="h-6 w-6" />
					</div>
					<div>
						<p className="text-sm font-medium text-slate-800">
							<Translate text={localizationConstants.fieldAuthorityDropFiles} />{" "}
							<span className="text-slate-900 underline font-semibold">
								<Translate text={localizationConstants.fieldAuthorityBrowse} />
							</span>
						</p>
						<p className="text-xs text-slate-500 mt-1">
							PDF, DOC, DOCX, PNG, JPG (max 10MB)
						</p>
					</div>
				</div>
			</div>

			{/* Attachments List */}
			<div>
				<div className="flex items-center justify-between mb-3">
					<h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
						Bifogade filer ({formData.attachments?.length || 0})
					</h4>
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={() => fileInputRef.current?.click()}
						className="h-8 text-xs gap-1.5 border-slate-200"
					>
						<Plus className="h-3.5 w-3.5" />
						Lägg till fil
					</Button>
				</div>

				{(!formData.attachments || formData.attachments.length === 0) ? (
					<div className="rounded-lg border border-slate-100 bg-slate-50/50 py-8 text-center text-xs text-slate-500">
						Inga dokument har bifogats än.
					</div>
				) : (
					<div className="overflow-x-auto rounded-lg border border-slate-200">
						<table className="w-full text-left text-xs text-slate-600">
							<thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
								<tr>
									<th className="px-4 py-2.5">Filnamn</th>
									<th className="px-4 py-2.5">Format</th>
									<th className="px-4 py-2.5">Storlek</th>
									<th className="px-4 py-2.5">Uppladdat</th>
									<th className="px-4 py-2.5 text-right">Åtgärd</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-100">
								{formData.attachments.map((att) => (
									<tr key={att.id} className="hover:bg-slate-50/50">
										<td className="px-4 py-3 font-medium text-slate-900 flex items-center gap-2">
											<FileText className="h-4 w-4 text-slate-400 shrink-0" />
											<span className="truncate max-w-xs">{att.name}</span>
										</td>
										<td className="px-4 py-3">
											<span
												className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold ${
													att.fileType === "PDF"
														? "bg-rose-50 text-rose-600 border border-rose-200"
														: "bg-blue-50 text-blue-600 border border-blue-200"
												}`}
											>
												{att.fileType}
											</span>
										</td>
										<td className="px-4 py-3 text-slate-500">{att.fileSize}</td>
										<td className="px-4 py-3 text-slate-500">{att.uploadDate}</td>
										<td className="px-4 py-3 text-right">
											<div className="flex items-center justify-end gap-1">
												{att.fileUrl && (
													<a
														href={att.fileUrl}
														download={att.name}
														className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
													>
														<Download className="h-3.5 w-3.5" />
													</a>
												)}
												<button
													type="button"
													onClick={() => handleDeleteAttachment(att.id)}
													className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50"
												>
													<Trash2 className="h-3.5 w-3.5" />
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
		</div>
	);
}

export default AuthorityDocumentStep;
