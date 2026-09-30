"use client";

import React from "react";
import { ArrowLeft, User, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PdfFileIcon } from "@/components/ui/PdfFileIcon";
import { DocFileIcon } from "@/components/ui/DocFileIcon";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { CompetenceItem } from "../../../../types/competence.types";

interface KompetensDetailViewProps {
	competence: CompetenceItem;
	onBack: () => void;
	onEdit: (competence: CompetenceItem) => void;
	onPreviewDoc?: (docName: string) => void;
}

export function KompetensDetailView({
	competence,
	onBack,
	onEdit,
	onPreviewDoc,
}: KompetensDetailViewProps) {
	return (
		<div className="space-y-4">
			{/* Back Link */}
			<button
				type="button"
				onClick={onBack}
				className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer transition-colors"
			>
				<ArrowLeft className="h-3.5 w-3.5" />
				<span>
					<Translate text={localizationConstants.kompetensDetailBack} /> {competence.nr}
				</span>
			</button>

			{/* Main Detail Card */}
			<div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
				{/* Header */}
				<div className="flex items-center justify-between border-b border-slate-100 pb-4">
					<div className="flex items-center gap-3">
						<div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-700">
							<User className="h-4 w-4" />
						</div>
						<h2 className="text-sm sm:text-base font-bold text-slate-900">
							<Translate text={localizationConstants.kompetensDetailBack} /> {competence.nr}
						</h2>
						{competence.status === "active" ? (
							<span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-700 text-white">
								<Translate text={localizationConstants.kompetensStatusActive} />
							</span>
						) : (
							<span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-semibold bg-amber-500 text-white">
								<Translate text={localizationConstants.kompetensStatusExpireSoon} />
							</span>
						)}
					</div>

					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={() => onEdit(competence)}
						className="h-8 px-3 text-xs font-medium border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs gap-1.5"
					>
						<Pencil className="h-3.5 w-3.5 text-slate-500" />
						<Translate text={localizationConstants.kompetensDetailEdit} />
					</Button>
				</div>

				{/* 2-Column Info Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
					<div className="space-y-1">
						<span className="text-[11px] font-medium text-slate-500 block">
							<Translate text={localizationConstants.kompetensColName} />
						</span>
						<p className="text-xs font-semibold text-slate-900">
							{competence.name}
						</p>
					</div>

					<div className="space-y-1">
						<span className="text-[11px] font-medium text-slate-500 block">
							<Translate text={localizationConstants.kompetensColTraining} />
						</span>
						<p className="text-xs font-semibold text-slate-900">
							{competence.training}
						</p>
					</div>

					<div className="space-y-1">
						<span className="text-[11px] font-medium text-slate-500 block">
							<Translate text={localizationConstants.kompetensColCertNo} />
						</span>
						<p className="text-xs font-semibold text-slate-900">
							{competence.certNo}
						</p>
					</div>

					<div className="space-y-1">
						<span className="text-[11px] font-medium text-slate-500 block">
							<Translate text={localizationConstants.kompetensColExpiry} />
						</span>
						<p className="text-xs font-semibold text-slate-900">
							{competence.expiryDate}
						</p>
					</div>
				</div>

				{/* Specifikation Sub-table */}
				<div className="space-y-3 pt-2">
					<h3 className="text-xs font-semibold text-slate-900">
						<Translate text={localizationConstants.kompetensDetailSpecification} />
					</h3>

					<div className="rounded-lg border border-slate-200 overflow-hidden">
						<table className="w-full text-xs text-left">
							<thead className="bg-slate-50/80 text-[11px] text-slate-500 font-medium border-b border-slate-200">
								<tr>
									<th className="py-2.5 px-4">
										<Translate text={localizationConstants.kompetensDocColDate} />
									</th>
									<th className="py-2.5 px-4">
										<Translate
											text={localizationConstants.kompetensDocColDocName}
										/>
									</th>
									<th className="py-2.5 px-4">
										<Translate text={localizationConstants.kompetensDocColFile} />
									</th>
									<th className="py-2.5 px-4 text-right"></th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-100">
								{competence.specifications.length === 0 ? (
									<tr>
										<td
											colSpan={4}
											className="py-4 text-center text-slate-400 text-xs"
										>
											<Translate text={localizationConstants.kompetensEmptySpecs} />
										</td>
									</tr>
								) : (
									competence.specifications.map((item) => (
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
													<span className="font-semibold text-slate-900">
														{item.name}
													</span>
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
													<Translate
														text={localizationConstants.kompetensDetailSeeFile}
													/>
												</button>
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}
