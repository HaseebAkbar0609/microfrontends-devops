"use client";

import React from "react";
import { Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { BankDocumentItem } from "../../types/bank.types";

interface BankLoanDocumentsCardProps {
	documents?: BankDocumentItem[];
	onEdit: () => void;
	onViewFile?: (doc: BankDocumentItem) => void;
}

export function BankLoanDocumentsCard({
	documents = [],
	onEdit,
	onViewFile,
}: BankLoanDocumentsCardProps) {
	const handleView = (doc: BankDocumentItem) => {
		if (onViewFile) {
			onViewFile(doc);
		} else {
			const samplePdf =
				doc.fileUrl ||
				"https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
			window.open(samplePdf, "_blank");
		}
	};

	const displayDocs: BankDocumentItem[] =
		documents.length > 0
			? documents
			: [
					{
						id: "d1",
						date: "2024-05-10",
						name: "filename.pdf",
						fileType: "PDF",
					},
					{
						id: "d2",
						date: "2024-05-10",
						name: "filename.pdf",
						fileType: "PDF",
					},
				];

	return (
		<div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
			{/* Header */}
			<div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
				<h3 className="text-base font-semibold text-slate-900">
					<Translate text={localizationConstants.sectionDocuments} />
				</h3>

				<Button
					type="button"
					variant="ghost"
					size="sm"
					onClick={onEdit}
					className="h-8 text-xs text-slate-600 hover:text-slate-900 gap-1.5 cursor-pointer"
				>
					<Edit2 className="w-3.5 h-3.5" />
					<Translate text={localizationConstants.btnEdit} />
				</Button>
			</div>

			{/* Documents Table */}
			<div className="p-6">
				<div className="border border-slate-200 rounded-lg overflow-hidden">
					<table className="w-full border-collapse text-left text-sm">
						<thead>
							<tr className="bg-slate-50/75 border-b border-slate-200 text-xs font-semibold text-slate-600">
								<th className="px-4 py-3">
									<Translate text={localizationConstants.colDocDate} />
								</th>
								<th className="px-4 py-3">
									<Translate text={localizationConstants.colDocName} />
								</th>
								<th className="px-4 py-3">
									<Translate text={localizationConstants.colDocFileType} />
								</th>
								<th className="w-28 px-4 py-3 text-right"></th>
							</tr>
						</thead>

						<tbody className="divide-y divide-slate-100">
							{displayDocs.map((doc) => (
								<tr key={doc.id} className="hover:bg-slate-50/60 transition-colors">
									<td className="px-4 py-3.5 text-slate-600 font-mono whitespace-nowrap">
										{doc.date}
									</td>

									<td className="px-4 py-3.5 font-medium text-slate-900 whitespace-nowrap">
										<div className="flex items-center gap-2.5">
											<div className="w-7 h-7 bg-rose-50 border border-rose-200 rounded flex items-center justify-center text-[10px] font-bold text-rose-600">
												PDF
											</div>
											<span>{doc.name}</span>
										</div>
									</td>

									<td className="px-4 py-3.5 text-slate-600 uppercase font-mono whitespace-nowrap">
										{doc.fileType || "PDF"}
									</td>

									<td className="px-4 py-3.5 text-right whitespace-nowrap">
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() => handleView(doc)}
											className="h-8 px-3 text-xs bg-white border-slate-200 hover:bg-slate-50 text-slate-700 cursor-pointer shadow-2xs font-medium"
										>
											<Translate text={localizationConstants.btnViewFile} />
										</Button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
