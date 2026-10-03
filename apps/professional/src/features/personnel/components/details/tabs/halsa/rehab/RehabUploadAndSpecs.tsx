"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, FileText, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { RehabDocumentItem } from "@/features/personnel/types/halsa.types";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogCancel,
	AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface RehabUploadAndSpecsProps {
	documents: RehabDocumentItem[];
	onUploadDoc: (doc: { name: string; fileFormat: string; fileSize?: string }) => void;
	onDeleteDoc: (docId: string) => void;
	onPreviewDoc: (name: string) => void;
}

export function RehabUploadAndSpecs({
	documents,
	onUploadDoc,
	onDeleteDoc,
	onPreviewDoc,
}: RehabUploadAndSpecsProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files && files.length > 0) {
			const file = files[0];
			const ext = file.name.split(".").pop()?.toLowerCase() || "pdf";
			const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
			onUploadDoc({
				name: file.name.replace(/\.[^/.]+$/, ""),
				fileFormat: ext,
				fileSize: `${sizeMb} MB`,
			});
			if (fileInputRef.current) fileInputRef.current.value = "";
		}
	};

	return (
		<div className="space-y-4 pt-2 border-t border-slate-100">
			{/* Upload Zone */}
			<div className="space-y-1.5">
				<label className="text-xs font-semibold text-slate-700">
					<Translate text={localizationConstants.rehabUploadTitle} />
				</label>
				<div
					onClick={() => fileInputRef.current?.click()}
					className="border-2 border-dashed border-slate-200 hover:border-slate-300 rounded-lg p-4 text-center bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-colors"
				>
					<UploadCloud className="w-6 h-6 text-slate-400 mx-auto mb-1" />
					<p className="text-xs text-slate-500 font-medium">
						<Translate text={localizationConstants.rehabUploadHint} />
					</p>
					<Button
						type="button"
						variant="outline"
						size="sm"
						className="mt-2 h-7 px-3 text-xs pointer-events-none"
					>
						<Translate text={localizationConstants.rehabUploadBtn} />
					</Button>
					<input
						ref={fileInputRef}
						type="file"
						accept=".pdf,.png,.jpg,.jpeg"
						onChange={handleFileSelect}
						className="hidden"
					/>
				</div>
			</div>

			{/* Specification Table */}
			{documents.length > 0 && (
				<div className="space-y-2">
					<h5 className="text-xs font-bold text-slate-700">
						<Translate text={localizationConstants.rehabSpecsTitle} />
					</h5>
					<div className="overflow-x-auto rounded-md border border-slate-200">
						<table className="w-full text-left text-xs border-collapse">
							<thead>
								<tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase">
									<th className="py-2 px-3">
										<Translate text={localizationConstants.rehabSpecsColDate} />
									</th>
									<th className="py-2 px-3">
										<Translate text={localizationConstants.rehabSpecsColDocName} />
									</th>
									<th className="py-2 px-3 text-center">
										<Translate text={localizationConstants.rehabSpecsColFile} />
									</th>
									<th className="py-2 px-3 text-right">
										<Translate text={localizationConstants.rehabSpecsColAction} />
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-100 bg-white">
								{documents.map((doc) => (
									<tr key={doc.id} className="hover:bg-slate-50/50">
										<td className="py-2 px-3 text-slate-600">{doc.date}</td>
										<td className="py-2 px-3 font-medium text-slate-800 flex items-center gap-1.5">
											<FileText className="w-3.5 h-3.5 text-rose-500" />
											<span className="truncate max-w-[140px]">{doc.name}</span>
										</td>
										<td className="py-2 px-3 text-center uppercase text-[10px] font-bold text-slate-500">
											{doc.fileFormat}
										</td>
										<td className="py-2 px-3 text-right space-x-1">
											<Button
												type="button"
												variant="ghost"
												size="sm"
												onClick={() => onPreviewDoc(doc.name)}
												className="h-6 px-1.5 text-xs text-sky-700 hover:text-sky-800"
											>
												<Eye className="w-3.5 h-3.5 mr-1" />
												<Translate text={localizationConstants.rehabBtnViewFile} />
											</Button>
											<Button
												type="button"
												variant="ghost"
												size="icon"
												onClick={() => setDeleteTargetId(doc.id)}
												className="h-6 w-6 text-slate-400 hover:text-rose-600"
											>
												<Trash2 className="w-3.5 h-3.5" />
											</Button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}

			{/* Confirm Delete Doc Dialog */}
			<AlertDialog
				open={Boolean(deleteTargetId)}
				onOpenChange={(open) => !open && setDeleteTargetId(null)}
			>
				<AlertDialogContent className="sm:max-w-md">
					<AlertDialogHeader>
						<AlertDialogTitle className="text-base font-bold text-slate-900">
							<Translate text={localizationConstants.rehabConfirmDeleteDocTitle} />
						</AlertDialogTitle>
						<AlertDialogDescription className="text-xs text-slate-500">
							<Translate text={localizationConstants.rehabConfirmDeleteDocDesc} />
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter className="gap-2">
						<AlertDialogCancel className="h-9 text-xs">
							<Translate text={localizationConstants.cancel} />
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => {
								if (deleteTargetId) onDeleteDoc(deleteTargetId);
								setDeleteTargetId(null);
							}}
							className="h-9 text-xs bg-rose-600 hover:bg-rose-700 text-white"
						>
							<Translate text={localizationConstants.btnDelete} />
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
