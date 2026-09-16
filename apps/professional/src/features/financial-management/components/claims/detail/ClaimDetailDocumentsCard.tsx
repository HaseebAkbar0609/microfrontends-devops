"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { ClaimDocument } from "../../../types/claims.types";

interface ClaimDetailDocumentsCardProps {
	documents: ClaimDocument[];
	onViewDocument: (doc: ClaimDocument) => void;
}

export function ClaimDetailDocumentsCard({
	documents,
	onViewDocument,
}: ClaimDetailDocumentsCardProps) {
	return (
		<div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
			<div className="px-6 py-3.5 border-b border-slate-200">
				<h2 className="text-sm font-semibold text-slate-900">
					<Translate text={localizationConstants.claimsTabDocuments} />
				</h2>
			</div>

			<div className="p-6">

			<div className="border border-slate-200 rounded-lg overflow-hidden">
				<table className="w-full text-left border-collapse">
					<thead>
						<tr className="border-b border-slate-200 bg-white text-xs font-medium text-slate-500 select-none">
							<th className="px-4 py-3">
								<Translate text={localizationConstants.claimsColDate} /> ↕
							</th>
							<th className="px-4 py-3">
								<Translate text={localizationConstants.claimsColDocName} /> ↕
							</th>
							<th className="px-4 py-3">
								<Translate text={localizationConstants.claimsColFileType} /> ↕
							</th>
							<th className="px-4 py-3 text-right border-l border-slate-200"></th>
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-100">
						{documents.length === 0 ? (
							<tr>
								<td colSpan={4} className="px-6 py-8 text-center text-xs text-slate-400">
									<Translate text={localizationConstants.claimsNoDocsUploaded} />
								</td>
							</tr>
						) : (
							documents.map((doc, index) => (
								<tr key={`${doc.id}-${index}`} className="hover:bg-slate-50/80 transition-colors">
									<td className="px-4 py-3 text-xs text-slate-700">
										{doc.date}
									</td>
									<td className="px-4 py-3 text-xs text-slate-900 font-medium">
										<div className="flex items-center gap-2">
											<span className="inline-flex items-center justify-center w-5 h-5 bg-red-500 text-white text-[9px] font-bold rounded">
												PDF
											</span>
											<span>{doc.name}</span>
										</div>
									</td>
									<td className="px-4 py-3 text-xs text-slate-700">
										{doc.fileType}
									</td>
									<td className="px-4 py-3 text-right border-l border-slate-200">
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() => onViewDocument(doc)}
											className="h-7 px-3 text-xs text-slate-700 hover:text-slate-900 border-slate-200 cursor-pointer rounded-md bg-white hover:bg-slate-50"
										>
											<Translate text={localizationConstants.claimsBtnViewFile} />
										</Button>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
		</div>
	);
}

export default ClaimDetailDocumentsCard;
