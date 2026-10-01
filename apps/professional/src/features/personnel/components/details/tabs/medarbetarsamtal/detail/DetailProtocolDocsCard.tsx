"use client";

import React from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PdfFileIcon } from "@/components/ui/PdfFileIcon";
import { DocFileIcon } from "@/components/ui/DocFileIcon";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { MedarbetarsamtalItem } from "../../../../../types/medarbetarsamtal.types";

interface DetailProtocolDocsCardProps {
	review: MedarbetarsamtalItem;
	onEditSection?: (sectionNumber: number) => void;
	onPreviewDoc?: (name: string) => void;
}

export function DetailProtocolDocsCard({
	review,
	onEditSection,
	onPreviewDoc,
}: DetailProtocolDocsCardProps) {
	return (
		<div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
			<div className="flex items-center justify-between border-b border-slate-100 pb-3">
				<h3 className="text-xs font-bold text-slate-900">
					<Translate text={localizationConstants.nyIncheckningSectionProtocol} />
				</h3>
				<Button
					type="button"
					variant="ghost"
					size="sm"
					onClick={() => onEditSection?.(7)}
					className="h-7 px-2 text-xs text-slate-600 hover:text-slate-900 cursor-pointer gap-1"
				>
					<Pencil className="h-3 w-3 text-slate-400" />
					<Translate text={localizationConstants.kompetensDetailEdit} />
				</Button>
			</div>

			<div className="rounded-lg border border-slate-200 overflow-hidden">
				<table className="w-full text-xs text-left">
					<thead className="bg-slate-50/80 text-[11px] text-slate-500 font-medium border-b border-slate-200">
						<tr>
							<th className="py-2.5 px-4">
								<Translate text={localizationConstants.kompetensDocColDate} />
							</th>
							<th className="py-2.5 px-4">
								<Translate text={localizationConstants.kompetensDocColDocName} />
							</th>
							<th className="py-2.5 px-4">
								<Translate text={localizationConstants.kompetensDocColFile} />
							</th>
							<th className="py-2.5 px-4 text-right"></th>
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-100">
						{review.documents.length === 0 ? (
							<tr>
								<td colSpan={4} className="py-4 text-center text-slate-400 text-xs">
									<Translate text={localizationConstants.medarbetarsamtalEmptyDocs} />
								</td>
							</tr>
						) : (
							review.documents.map((item) => (
								<tr key={item.id} className="hover:bg-slate-50/50">
									<td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
										{item.date}
									</td>
									<td className="py-3 px-4">
										<div className="flex items-center gap-2.5">
											{item.fileType === "doc" ? (
												<DocFileIcon className="h-6 w-5 shrink-0" />
											) : (
												<PdfFileIcon className="h-6 w-5 shrink-0" />
											)}
											<span className="font-semibold text-slate-900">{item.name}</span>
										</div>
									</td>
									<td className="py-3 px-4 text-slate-500 uppercase text-[10px] font-semibold">
										{item.fileType}
									</td>
									<td className="py-3 px-4 text-right">
										<button
											type="button"
											onClick={() => onPreviewDoc?.(item.name)}
											className="text-xs font-semibold text-slate-700 hover:text-slate-900 cursor-pointer"
										>
											<Translate text={localizationConstants.kompetensDetailSeeFile} />
										</button>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
