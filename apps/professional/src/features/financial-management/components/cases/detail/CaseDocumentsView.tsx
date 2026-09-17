"use client";

import React from "react";
import Image from "next/image";
import { Image as ImageIcon } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { PdfFileIcon } from "@/components/ui/PdfFileIcon";
import type { CaseDocument } from "../../../types/cases.types";

interface CaseDocumentsViewProps {
	documents: CaseDocument[];
	images: CaseDocument[];
}

export function CaseDocumentsView({
	documents,
	images,
}: CaseDocumentsViewProps) {
	return (
		<div className="space-y-6">
			{/* Documents Table matching Figma Image 5 Right */}
			<div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
				<h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
					<Translate text={localizationConstants.casesDocumentsSectionTitle} />
				</h2>

				<div className="border border-slate-200 rounded-lg overflow-hidden">
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
									<td colSpan={4} className="py-8 text-center text-slate-400 italic">
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
											<button
												type="button"
												onClick={() => window.open(doc.url || "#", "_blank")}
												className="px-3 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium cursor-pointer transition-colors shadow-2xs"
											>
												<Translate text={localizationConstants.casesBtnViewFile} />
											</button>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>

			{/* Images Section if present */}
			{images.length > 0 && (
				<div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
					<div className="flex items-center gap-2 border-b border-slate-100 pb-3">
						<ImageIcon className="w-4 h-4 text-slate-700" />
						<h2 className="text-sm font-bold text-slate-900">
							<Translate text={localizationConstants.casesImagesSectionTitle} />
						</h2>
					</div>

					<div className="flex flex-wrap gap-4 pt-1">
						{images.map((img) => (
							<div
								key={img.id}
								className="w-32 border border-slate-200 rounded-lg overflow-hidden bg-slate-50 shadow-2xs cursor-pointer hover:border-slate-400 transition-colors"
								onClick={() => window.open(img.url || "#", "_blank")}
							>
								<div className="relative h-24 bg-slate-100 flex items-center justify-center overflow-hidden">
									{img.url ? (
										<Image
											src={img.url}
											alt={img.name}
											fill
											unoptimized
											className="object-cover"
										/>
									) : (
										<ImageIcon className="w-8 h-8 text-slate-300" />
									)}
								</div>
								<div className="p-2 bg-white border-t border-slate-100">
									<p className="text-[11px] font-mono text-slate-700 truncate font-medium">
										{img.name}
									</p>
									<p className="text-[10px] text-slate-400">{img.fileSize || "BILD"}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}

export default CaseDocumentsView;
