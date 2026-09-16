"use client";

import { useMemo } from "react";
import { MoreVertical, Trash2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PdfFileIcon } from "@/components/ui/PdfFileIcon";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTableSort } from "@/hooks/useTableSort";
import { sortItems } from "@/utils/tableSort";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import type { PaymentPlanDocument } from "../types";
import { DocumentUploadRow } from "./DocumentUploadRow";
import { ProjectSectionCard } from "../../components/ProjectSectionCard";
import { SortableHead } from "../../components/SortableHead";

type DocumentSortKey = "date" | "typeKey" | "fileName";

const CELL = "px-4 py-3 text-sm text-slate-900";

export interface PlanDocumentsCardProps {
	documents: PaymentPlanDocument[];
	onAdd: (fileName: string) => void;
	onDelete: (document: PaymentPlanDocument) => void;
}

/** Ladda upp betalningsplan — files attached to the plan. */
export function PlanDocumentsCard({ documents, onAdd, onDelete }: PlanDocumentsCardProps) {
	const t = useTranslate();
	const { sortField, sortDir, toggleSort } = useTableSort<DocumentSortKey>();
	const rows = useMemo(
		() =>
			sortItems(documents, sortField, sortDir, (doc, field) =>
				field === "typeKey" ? doc.typeKey : doc[field as "date" | "fileName"],
			),
		[documents, sortField, sortDir],
	);

	const head = (key: DocumentSortKey, labelKey: Parameters<typeof SortableHead>[0]["labelKey"]) => (
		<SortableHead
			labelKey={labelKey}
			onSort={() => toggleSort(key)}
			active={sortField === key}
			dir={sortDir}
		/>
	);

	return (
		<ProjectSectionCard
			titleKey={localizationConstants.sectionLaddaUppBetalningsplan}
			icon={<Upload className="h-5 w-5 text-slate-700" aria-hidden />}
			contentClassName="flex flex-col gap-6"
		>
			<DocumentUploadRow onAdd={onAdd} />

			<div className="w-full max-w-3xl overflow-x-auto">
				<Table className="min-w-[32rem]">
					<TableHeader>
						<TableRow className="hover:bg-transparent">
							{head("date", localizationConstants.colDatum)}
							{head("typeKey", localizationConstants.orderTypLabel)}
							{head("fileName", localizationConstants.colPdf)}
							<TableHead className="w-12" />
						</TableRow>
					</TableHeader>
					<TableBody>
						{rows.length === 0 ? (
							<TableRow>
								<TableCell colSpan={4} className="py-8 text-center text-sm text-slate-500">
									<Translate text={localizationConstants.projectPaymentPlanDocumentsEmpty} />
								</TableCell>
							</TableRow>
						) : (
							rows.map((doc) => (
								<TableRow key={doc.id}>
									<TableCell className={CELL}>{doc.date}</TableCell>
									<TableCell className={CELL}>{t(doc.typeKey)}</TableCell>
									<TableCell className={CELL}>
										<span className="flex min-w-0 items-center gap-3">
											<PdfFileIcon className="h-10 w-8" />
											<span className="truncate">{doc.fileName}</span>
										</span>
									</TableCell>
									<TableCell className="w-12 px-2 py-3 text-right">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													type="button"
													variant="ghost"
													size="icon"
													aria-label={`${t(localizationConstants.actions)} ${doc.fileName}`}
													className="h-9 w-9 cursor-pointer text-slate-700"
												>
													<MoreVertical className="h-4 w-4" aria-hidden />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end" className="w-40 border border-slate-200 bg-white p-1 shadow-md">
												<DropdownMenuItem
													onClick={() => onDelete(doc)}
													className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-slate-900"
												>
													<Trash2 className="h-4 w-4 shrink-0" aria-hidden />
													<Translate text={localizationConstants.btnRadera} />
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>
		</ProjectSectionCard>
	);
}

export default PlanDocumentsCard;
