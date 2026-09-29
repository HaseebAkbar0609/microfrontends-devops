"use client";

import React from "react";
import { Award, Plus, Trash2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { CompetenceDocItem } from "../../../types/createEmployee.types";

interface ViewCompetenceListCardProps {
	items: CompetenceDocItem[];
	onAdd: () => void;
	onDelete: (id: string) => void;
	onPreview?: (fileName: string) => void;
}

export function ViewCompetenceListCard({
	items,
	onAdd,
	onDelete,
	onPreview,
}: ViewCompetenceListCardProps) {
	return (
		<div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
			{/* Header */}
			<div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
				<div className="flex items-center gap-2.5">
					<div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
						<Award className="w-4 h-4" />
					</div>
					<h2 className="text-sm font-semibold text-slate-900">
						<Translate text={localizationConstants.personalkortTabCompetence} />
					</h2>
				</div>

				<Button
					type="button"
					size="sm"
					onClick={onAdd}
					className="bg-[#111721] hover:bg-slate-800 text-white text-xs h-8 px-3 rounded-md cursor-pointer shadow-2xs gap-1.5"
				>
					<Plus className="w-3.5 h-3.5" />
					<Translate text={localizationConstants.addCompetenceBtn} />
				</Button>
			</div>

			<div className="p-5">
				<div className="overflow-x-auto rounded-lg border border-slate-200">
					<table className="w-full text-left text-xs">
						<thead>
							<tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 font-medium">
								<th className="py-2.5 px-4">
									<Translate text={localizationConstants.colDate} />
								</th>
								<th className="py-2.5 px-4">
									<Translate text={localizationConstants.colDocName} />
								</th>
								<th className="py-2.5 px-4">
									<Translate text={localizationConstants.colValidity} />
								</th>
								<th className="py-2.5 px-4">
									<Translate text={localizationConstants.colFile} />
								</th>
								<th className="py-2.5 px-4 text-right">
									<Translate text={localizationConstants.tableSpecification} />
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-100">
							{items.map((doc) => (
								<tr
									key={doc.id}
									className="hover:bg-slate-50/60 transition-colors text-slate-700"
								>
									<td className="py-3 px-4 font-mono">{doc.date}</td>
									<td className="py-3 px-4 font-medium text-slate-900">
										{doc.name}
									</td>
									<td className="py-3 px-4 text-slate-600">{doc.validity}</td>
									<td className="py-3 px-4">
										<button
											type="button"
											onClick={() => onPreview?.(doc.fileName)}
											className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
										>
											<FileText className="w-3.5 h-3.5" />
											<span className="truncate max-w-[120px]">
												{doc.fileName}
											</span>
										</button>
									</td>
									<td className="py-3 px-4 text-right">
										<Button
											type="button"
											variant="ghost"
											size="icon"
											onClick={() => onDelete(doc.id)}
											className="h-7 w-7 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md cursor-pointer"
										>
											<Trash2 className="w-3.5 h-3.5" />
										</Button>
									</td>
								</tr>
							))}
							{items.length === 0 && (
								<tr>
									<td colSpan={5} className="py-6 text-center text-slate-400 text-xs">
										<Translate text={localizationConstants.emptyCompetenceTitle} />
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
