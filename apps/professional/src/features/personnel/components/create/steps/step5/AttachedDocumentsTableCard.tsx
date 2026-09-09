"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { Trash2, Eye, CircleUser } from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { PdfFileIcon } from "@/components/ui/PdfFileIcon";
import { DocFileIcon } from "@/components/ui/DocFileIcon";
import { AttachedDocItem } from "@/features/personnel/types/createEmployee.types";

interface AttachedDocumentsTableCardProps {
	attachedDocs: AttachedDocItem[];
	onRemoveDoc: (id: string) => void;
}

export function AttachedDocumentsTableCard({
	attachedDocs,
	onRemoveDoc,
}: AttachedDocumentsTableCardProps) {
	const { t } = useTranslation();

	return (
		<section className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs">
			<div className="flex items-center gap-2.5 mb-5">
				<div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100/80 text-slate-700">
					<CircleUser className="w-5 h-5 text-slate-600" />
				</div>
				<h2 className="text-base font-semibold text-slate-900">
					{t(localizationConstants.tableSpecification)}
				</h2>
			</div>

			<div className="rounded-lg border border-slate-200 overflow-hidden">
				<Table>
					<TableHeader className="bg-slate-50">
						<TableRow className="border-b border-slate-200">
							<TableHead className="text-xs font-semibold text-slate-600 h-10 px-4">
								{t(localizationConstants.colDate)}
							</TableHead>
							<TableHead className="text-xs font-semibold text-slate-600 h-10 px-4">
								{t(localizationConstants.colDocName)}
							</TableHead>
							<TableHead className="text-xs font-semibold text-slate-600 h-10 px-4">
								{t(localizationConstants.colFile)}
							</TableHead>
							<TableHead className="text-xs font-semibold text-slate-600 h-10 px-4 text-center">
								{t(localizationConstants.btnViewFile)}
							</TableHead>
							<TableHead className="text-xs font-semibold text-slate-600 h-10 px-4 text-right">
								{t(localizationConstants.actionsMenuLabel)}
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{attachedDocs.map((doc) => {
							const isDoc = doc.fileFormat?.toUpperCase() === "DOC";
							return (
								<TableRow key={doc.id} className="border-b border-slate-100 hover:bg-slate-50/60">
									<TableCell className="text-sm text-slate-700 px-4 py-3">
										{doc.date}
									</TableCell>
									<TableCell className="text-sm font-medium text-slate-900 px-4 py-3">
										{doc.name}
									</TableCell>
									<TableCell className="px-4 py-3">
										<div className="flex items-center gap-2">
											{isDoc ? <DocFileIcon className="h-7 w-6" /> : <PdfFileIcon className="h-7 w-6" />}
											<span className="text-xs font-medium text-slate-600">
												{doc.fileFormat}
											</span>
										</div>
									</TableCell>
									<TableCell className="px-4 py-3 text-center">
										<Button
											type="button"
											variant="ghost"
											size="sm"
											className="text-slate-700 hover:text-slate-900 hover:bg-slate-100 text-xs font-medium inline-flex items-center gap-1.5"
											onClick={() => window.open(doc.fileUrl || "#", "_blank")}
										>
											<Eye className="h-3.5 w-3.5 text-slate-500" />
											{t(localizationConstants.btnViewFile)}
										</Button>
									</TableCell>
									<TableCell className="px-4 py-3 text-right">
										<Button
											type="button"
											variant="ghost"
											size="sm"
											onClick={() => onRemoveDoc(doc.id)}
											className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-1.5 h-auto"
											aria-label={`${t(localizationConstants.btnCancel)} ${doc.name}`}
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</div>
		</section>
	);
}
