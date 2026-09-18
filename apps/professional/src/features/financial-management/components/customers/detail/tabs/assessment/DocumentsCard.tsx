"use client";

import React, { useState } from "react";
import { Folder, FileText, Download, Trash2, Upload } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { CustomerDetailData } from "@/features/financial-management/types/customerDetail.types";
import type { CustomerAttachedDocument } from "@/features/financial-management/types/createCustomer.types";
import { CustomerDetailCard } from "../../cards/CustomerDetailCard";

interface DocumentsCardProps {
	customer: CustomerDetailData;
	onUpdate: (updates: Partial<CustomerDetailData>) => void;
	onDeleteDocument?: (docId: string) => void;
}

export const DocumentsCard: React.FC<DocumentsCardProps> = ({
	customer,
	onUpdate,
	onDeleteDocument,
}) => {
	const [isAdding, setIsAdding] = useState(false);
	const [newDocName, setNewDocName] = useState("");

	const handleAddDoc = () => {
		if (!newDocName.trim()) return;
		const newDoc: CustomerAttachedDocument = {
			id: `doc-${Date.now()}`,
			name: newDocName.trim().endsWith(".pdf") ? newDocName.trim() : `${newDocName.trim()}.pdf`,
			size: "150 KB",
			type: "application/pdf",
			dateAdded: new Date().toISOString().slice(0, 10),
		};
		const updated = [...(customer.documents || []), newDoc];
		onUpdate({ documents: updated });
		setNewDocName("");
		setIsAdding(false);
	};

	return (
		<CustomerDetailCard
			title={<Translate text={localizationConstants.customerDetailCardDocuments} />}
			icon={<Folder className="h-5 w-5 text-slate-500" />}
			isEditing={isAdding}
			onEdit={() => setIsAdding(true)}
			onSave={handleAddDoc}
			onCancel={() => setIsAdding(false)}
		>
			<div className="space-y-4">
				{/* Inline Add Document Form */}
				{isAdding && (
					<div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-800/40">
						<Upload className="h-4 w-4 text-slate-400" />
						<input
							type="text"
							placeholder="Dokumentnamn (t.ex. Årsredovisning.pdf)"
							value={newDocName}
							onChange={(e) => setNewDocName(e.target.value)}
							className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-slate-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
						/>
					</div>
				)}

				{/* Documents Table */}
				<div className="overflow-x-auto">
					<table className="w-full text-left text-xs">
						<thead>
							<tr className="border-b border-slate-200 text-slate-400 dark:border-slate-800 dark:text-slate-500">
								<th className="pb-3 font-medium">
									<Translate text={localizationConstants.customerDetailColDate} />
								</th>
								<th className="pb-3 font-medium">
									<Translate text={localizationConstants.customerDetailColName} />
								</th>
								<th className="pb-3 font-medium">
									<Translate text={localizationConstants.customerDetailColSize} />
								</th>
								<th className="pb-3 font-medium">
									<Translate text={localizationConstants.customerDetailColFile} />
								</th>
								<th className="pb-3 text-right font-medium">
									<Translate text={localizationConstants.customerDetailColActions} />
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
							{customer.documents && customer.documents.length > 0 ? (
								customer.documents.map((doc: CustomerAttachedDocument) => (
									<tr
										key={doc.id}
										className="text-slate-700 transition-colors hover:bg-slate-50/50 dark:text-slate-300 dark:hover:bg-slate-800/40"
									>
										<td className="py-3.5 text-slate-500 dark:text-slate-400">
											{doc.dateAdded || "-"}
										</td>
										<td className="py-3.5 font-medium">{doc.name}</td>
										<td className="py-3.5 text-slate-500 dark:text-slate-400">
											{doc.size || "-"}
										</td>
										<td className="py-3.5">
											<span className="inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
												<FileText className="h-3 w-3" />
												PDF
											</span>
										</td>
										<td className="py-3.5 text-right">
											<div className="flex items-center justify-end gap-2">
												{doc.url && (
													<a
														href={doc.url}
														target="_blank"
														rel="noopener noreferrer"
														className="rounded p-1 text-slate-400 transition-colors hover:text-slate-700 dark:hover:text-slate-200"
														title="Download"
													>
														<Download className="h-4 w-4" />
													</a>
												)}
												{onDeleteDocument && (
													<button
														type="button"
														onClick={() => onDeleteDocument(doc.id)}
														className="rounded p-1 text-slate-400 transition-colors hover:text-red-500 dark:hover:text-red-400"
														title="Delete"
													>
														<Trash2 className="h-4 w-4" />
													</button>
												)}
											</div>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td
										colSpan={5}
										className="py-8 text-center text-slate-400 dark:text-slate-500"
									>
										<Translate text={localizationConstants.customerDetailDocumentsEmpty} />
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
		</CustomerDetailCard>
	);
};
