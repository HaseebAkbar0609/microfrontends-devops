"use client";

import { useMemo } from "react";
import { CircleCheck, CircleDashed, Folder, MoreVertical } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { ProjectSectionCard } from "../../../components/ProjectSectionCard";
import { SortableHead } from "../../../components/SortableHead";
import type { SupplierPlanDocument } from "../types";

type DocumentSortKey = "planNumber" | "name" | "fileName";

const CELL = "px-4 py-3 text-sm text-slate-900";
const CHECK =
	"size-5 cursor-pointer rounded-full border-slate-400 data-[state=checked]:border-slate-900 data-[state=checked]:bg-slate-900 data-[state=indeterminate]:border-slate-500 data-[state=indeterminate]:bg-slate-500 data-[state=indeterminate]:text-white";

export interface SupplierDocumentsCardProps {
	documents: SupplierPlanDocument[];
	/** Approved plans are settled: the review can no longer change. */
	locked: boolean;
	onReview: (documentIds: string[], reviewed: boolean) => void;
}

/**
 * The supplier's plan documents, each with the project's review tick.
 *
 * The header tick reviews or clears them all, and shows "some" when they are
 * mixed. The footer's Godkänn waits for every tick. "Se Plan" has nothing to
 * open without a file store, so it is disabled and says so.
 */
export function SupplierDocumentsCard({ documents, locked, onReview }: SupplierDocumentsCardProps) {
	const t = useTranslate();
	const reviewedCount = documents.filter((doc) => doc.reviewed).length;
	const allChecked = documents.length > 0 && reviewedCount === documents.length;
	const headerState = allChecked ? true : reviewedCount > 0 ? "indeterminate" : false;
	const allIds = documents.map((doc) => doc.id);
	const { sortField, sortDir, toggleSort } = useTableSort<DocumentSortKey>();
	const rows = useMemo(
		() => sortItems(documents, sortField, sortDir, (doc, field) => doc[field as DocumentSortKey]),
		[documents, sortField, sortDir],
	);
	const sortProps = (key: DocumentSortKey) => ({
		onSort: () => toggleSort(key),
		active: sortField === key,
		dir: sortDir,
	});

	return (
		<ProjectSectionCard titleKey={localizationConstants.sectionBetalningsplan} icon={<Folder className="h-5 w-5 text-slate-700" aria-hidden />}>
			<div className="w-full overflow-x-auto">
				<Table className="min-w-[40rem]">
					<TableHeader>
						<TableRow className="hover:bg-transparent">
							<TableHead className="w-12 px-4">
								<Checkbox
									checked={headerState}
									disabled={locked || documents.length === 0}
									onCheckedChange={() => onReview(allIds, !allChecked)}
									aria-label={t(localizationConstants.projectSupplierPlanReviewAll)}
									className={CHECK}
								/>
							</TableHead>
							<SortableHead labelKey={localizationConstants.colPlan} className="w-24" {...sortProps("planNumber")} />
							<SortableHead labelKey={localizationConstants.colBetalningsplan} {...sortProps("name")} />
							<SortableHead labelKey={localizationConstants.colFil} {...sortProps("fileName")} />
							<SortableHead labelKey={localizationConstants.projectPaymentPlanColHandling} className="w-32" />
							<TableHead className="w-12" />
						</TableRow>
					</TableHeader>
					<TableBody>
						{rows.length === 0 ? (
							<TableRow>
								<TableCell colSpan={6} className="py-8 text-center text-sm text-slate-500">
									<Translate text={localizationConstants.projectSupplierPlanDocumentsEmpty} />
								</TableCell>
							</TableRow>
						) : (
							rows.map((doc) => (
								<TableRow key={doc.id}>
									<TableCell className="w-12 px-4 py-3">
										<Checkbox
											checked={doc.reviewed}
											disabled={locked}
											onCheckedChange={(checked) => onReview([doc.id], checked === true)}
											aria-label={`${t(localizationConstants.projectSupplierPlanReviewDocument)} ${doc.name}`}
											className={CHECK}
										/>
									</TableCell>
									<TableCell className={`${CELL} tabular-nums`}>{String(doc.planNumber).padStart(2, "0")}</TableCell>
									<TableCell className={CELL}>{doc.name}</TableCell>
									<TableCell className={CELL}>
										<span className="flex min-w-0 items-center gap-3">
											<PdfFileIcon className="h-10 w-8" />
											<span className="truncate">{doc.fileName}</span>
										</span>
									</TableCell>
									<TableCell className={CELL}>
										<span title={t(localizationConstants.projectSupplierPlanNoPreview)} className="inline-flex">
											<Button type="button" variant="outline" disabled className="h-9 border-slate-200 px-3">
												<Translate text={localizationConstants.btnSePlan} />
											</Button>
										</span>
									</TableCell>
									<TableCell className="w-12 px-2 py-3 text-right">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													type="button"
													variant="ghost"
													size="icon"
													aria-label={`${t(localizationConstants.actions)} ${doc.name}`}
													className="h-9 w-9 cursor-pointer text-slate-700"
												>
													<MoreVertical className="h-4 w-4" aria-hidden />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end" className="w-52 border border-slate-200 bg-white p-1 shadow-md">
												<DropdownMenuItem
													disabled={locked}
													title={locked ? t(localizationConstants.projectSupplierPlanAlreadyApproved) : undefined}
													onClick={() => onReview([doc.id], !doc.reviewed)}
													className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-slate-900"
												>
													{doc.reviewed ? (
														<CircleDashed className="h-4 w-4 shrink-0" aria-hidden />
													) : (
														<CircleCheck className="h-4 w-4 shrink-0" aria-hidden />
													)}
													<Translate
														text={
															doc.reviewed
																? localizationConstants.projectSupplierPlanUnmarkReviewed
																: localizationConstants.projectSupplierPlanMarkReviewed
														}
													/>
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

export default SupplierDocumentsCard;
