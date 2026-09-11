"use client";

import React, { useState } from "react";
import { Search, Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Translate } from "@/utils/translation/translate";
import { useTranslation } from "react-i18next";
import localizationConstants from "@/utils/translation/constants";
import type { BankDocumentItem } from "../../types/bank.types";

interface BankDocumentsTabViewProps {
	documents: BankDocumentItem[];
	onUploadClick: () => void;
	onViewFile?: (doc: BankDocumentItem) => void;
	onDeleteDocument?: (id: string, title: string) => void;
}

export function BankDocumentsTabView({
	documents,
	onUploadClick,
	onViewFile,
}: BankDocumentsTabViewProps) {
	const { t } = useTranslation();
	const [searchQuery, setSearchQuery] = useState("");

	const filteredDocs = documents.filter((d) => {
		if (!searchQuery.trim()) return true;
		const q = searchQuery.toLowerCase();
		return d.name.toLowerCase().includes(q) || d.date.includes(q);
	});

	const handleView = (doc: BankDocumentItem) => {
		if (onViewFile) {
			onViewFile(doc);
		} else {
			// Mock open/preview file
			const samplePdf =
				doc.fileUrl ||
				"https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
			window.open(samplePdf, "_blank");
		}
	};

	return (
		<div className="space-y-4">
			{/* Top Toolbar */}
			<div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
				<div className="flex items-center gap-2.5 flex-1 max-w-xl">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
						<Input
							type="text"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder={t(localizationConstants.searchBankPlaceholder)}
							className="pl-9 h-10 bg-white border-slate-200 text-sm placeholder:text-slate-400 rounded-lg shadow-2xs focus-visible:ring-slate-400"
						/>
					</div>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								type="button"
								variant="outline"
								className="h-10 px-3.5 bg-white border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg shadow-2xs gap-1.5 cursor-pointer"
							>
								<Filter className="w-4 h-4 text-slate-500" />
								<Translate text={localizationConstants.filterBankPlaceholder} />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start" className="w-40">
							<DropdownMenuItem className="cursor-pointer">
								<Translate text={localizationConstants.filterAll} />
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				<div>
					<Button
						type="button"
						onClick={onUploadClick}
						className="h-10 px-4 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-lg shadow-sm gap-2 cursor-pointer transition-colors"
					>
						<Plus className="w-4 h-4" />
						<Translate text={localizationConstants.btnCreateNew} />
					</Button>
				</div>
			</div>

			{/* Documents Table */}
			<div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
				<table className="w-full border-collapse text-left">
					<thead>
						<tr className="border-b border-slate-200 bg-slate-50/75 text-xs font-semibold text-slate-600 uppercase tracking-wider select-none">
							<th className="px-4 py-3">
								<Translate text={localizationConstants.colDocDate} />
							</th>
							<th className="px-4 py-3">
								<Translate text={localizationConstants.colDocName} />
							</th>
							<th className="px-4 py-3">
								<Translate text={localizationConstants.colDocFileType} />
							</th>
							<th className="w-28 px-4 py-3 text-right">
								<Translate text={localizationConstants.colDocActions} />
							</th>
						</tr>
					</thead>

					<tbody className="divide-y divide-slate-100">
						{filteredDocs.length === 0 ? (
							<tr>
								<td colSpan={4} className="py-12 text-center text-slate-500">
									<div className="flex flex-col items-center justify-center gap-2">
										<p className="font-semibold text-sm text-slate-700">
											<Translate text={localizationConstants.emptyBankDocsTitle} />
										</p>
										<p className="text-xs text-slate-500 max-w-sm">
											<Translate text={localizationConstants.emptyBankDocsDesc} />
										</p>
										<button
											type="button"
											onClick={onUploadClick}
											className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-700 underline cursor-pointer"
										>
											<Translate text={localizationConstants.btnCreateNew} />
										</button>
									</div>
								</td>
							</tr>
						) : (
							filteredDocs.map((doc) => (
								<tr key={doc.id} className="hover:bg-slate-50/70 transition-colors">
									<td className="px-4 py-3.5 text-sm text-slate-600 font-mono whitespace-nowrap">
										{doc.date}
									</td>

									<td className="px-4 py-3.5 text-sm font-medium text-slate-900 whitespace-nowrap">
										<div className="flex items-center gap-2.5">
											<div className="w-7 h-7 bg-rose-50 border border-rose-200 rounded flex items-center justify-center text-[10px] font-bold text-rose-600">
												PDF
											</div>
											<span>{doc.name}</span>
										</div>
									</td>

									<td className="px-4 py-3.5 text-sm text-slate-600 uppercase font-mono whitespace-nowrap">
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
							))
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
