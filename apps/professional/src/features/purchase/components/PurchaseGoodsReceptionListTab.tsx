"use client";

import Image from "next/image";
import { ArrowUpDown, Folders, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { showToast } from "@/lib/toast";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import type { PurchaseDocumentSortField } from "../hooks/usePurchaseDocuments";
import type { PurchaseAgreementDocument } from "../types/purchase.types";

const TH_CLASS =
	"h-11 px-4 text-left text-sm font-medium text-slate-500 select-none whitespace-nowrap cursor-pointer hover:text-slate-800";

const COLUMNS: {
	field: PurchaseDocumentSortField;
	label: TranslationKeys;
}[] = [
	{ field: "purchaseNo", label: localizationConstants.purchaseColNumber },
	{ field: "date", label: localizationConstants.agreementDetailDatum },
	{
		field: "documentName",
		label: localizationConstants.agreementDetailDokumentetsNamn,
	},
	{ field: "reference", label: localizationConstants.purchaseColName },
];

export interface PurchaseGoodsReceptionListTabProps {
	documents: PurchaseAgreementDocument[];
	sortBy: PurchaseDocumentSortField;
	sortOrder: "asc" | "desc";
	onSort: (field: PurchaseDocumentSortField) => void;
	onRemove: (id: string) => void;
}

/**
 * "Lista godsmottagning": the documents attached to this reception.
 *
 * Read-only apart from delete — the frame puts the upload control on the other
 * tab, and both tabs render the collection the record page owns.
 */
export function PurchaseGoodsReceptionListTab({
	documents,
	sortBy,
	sortOrder,
	onSort,
	onRemove,
}: PurchaseGoodsReceptionListTabProps) {
	const { t } = useTranslation();

	const renderSortIcon = (field: PurchaseDocumentSortField) => {
		if (sortBy !== field) {
			return <ArrowUpDown className="h-4 w-4 shrink-0 text-slate-400" />;
		}
		return (
			<ArrowUpDown
				className={`h-4 w-4 shrink-0 text-slate-900 ${sortOrder === "desc" ? "rotate-180" : ""}`}
			/>
		);
	};

	const handleSeeFile = (fileUrl?: string, name?: string) => {
		if (fileUrl) {
			window.open(fileUrl, "_blank", "noopener,noreferrer");
			return;
		}
		showToast("info", name ?? t(localizationConstants.agreementDetailFil));
	};

	return (
		<Card className="rounded-lg border border-slate-200 bg-white shadow-none">
			<CardHeader className="flex h-14 flex-row items-center border-b border-slate-200 px-6 py-0 [.border-b]:pb-0">
				<CardTitle className="flex items-center gap-2 text-base font-medium">
					<Folders className="h-5 w-5 text-slate-700" />
					<Translate
						text={localizationConstants.agreementDocuments}
					/>
				</CardTitle>
			</CardHeader>

			<CardContent className="p-6">
				{/* `Table` brings its own overflow-x wrapper, so this one only
				    draws the border. */}
				<div className="rounded border border-slate-200">
					<Table className="w-full min-w-162.5 border-collapse">
						<TableHeader>
							<TableRow className="h-11 border-b border-slate-200 hover:bg-transparent">
								{COLUMNS.map((column) => (
									<TableHead
										key={column.field}
										className={TH_CLASS}
										aria-sort={
											sortBy === column.field
												? sortOrder === "asc"
													? "ascending"
													: "descending"
												: "none"
										}
										tabIndex={0}
										onClick={() => onSort(column.field)}
										onKeyDown={(event) => {
											if (
												event.key === "Enter" ||
												event.key === " "
											) {
												event.preventDefault();
												onSort(column.field);
											}
										}}
									>
										<div className="flex items-center gap-1">
											<Translate text={column.label} />
											{renderSortIcon(column.field)}
										</div>
									</TableHead>
								))}
								<TableHead className="h-11 px-4 text-left text-sm font-medium whitespace-nowrap text-slate-500">
									<Translate
										text={
											localizationConstants.agreementDetailFil
										}
									/>
								</TableHead>
								<TableHead className="h-11 px-4" />
								<TableHead className="h-11 w-12 px-2 text-center">
									<span className="sr-only">
										<Translate
											text={
												localizationConstants.actionsHeader
											}
										/>
									</span>
								</TableHead>
							</TableRow>
						</TableHeader>

						<TableBody>
							{documents.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={COLUMNS.length + 3}
										className="py-8 text-center text-sm text-slate-400"
									>
										<Translate
											text={
												localizationConstants.agreementNoDocuments
											}
										/>
									</TableCell>
								</TableRow>
							) : (
								documents.map((doc) => (
									<TableRow
										key={doc.id}
										className="border-b border-slate-100 transition-colors last:border-b-0 hover:bg-slate-50/60"
									>
										<TableCell className="px-4 py-3 text-sm whitespace-nowrap text-slate-700">
											{doc.purchaseNo ?? "-"}
										</TableCell>
										<TableCell className="px-4 py-3 text-sm whitespace-nowrap text-slate-700">
											{doc.date}
										</TableCell>
										<TableCell className="px-4 py-3 whitespace-nowrap">
											<span className="flex items-center gap-2">
												<Image
													src={
														doc.fileType === "pdf"
															? "/file-type-pdf.png"
															: "/file-type-doc.png"
													}
													alt=""
													width={28}
													height={32}
													className="h-8 w-7 shrink-0 object-contain"
												/>
												<span className="text-sm text-slate-700">
													{doc.documentName}
												</span>
											</span>
										</TableCell>
										<TableCell className="px-4 py-3 text-sm whitespace-nowrap text-slate-700">
											{doc.reference}
										</TableCell>
										<TableCell className="px-4 py-3 text-sm whitespace-nowrap text-slate-700 uppercase">
											{doc.fileType}
										</TableCell>
										<TableCell className="px-4 py-3 text-right whitespace-nowrap">
											<Button
												type="button"
												variant="outline"
												size="sm"
												onClick={() =>
													handleSeeFile(
														doc.fileUrl,
														doc.documentName,
													)
												}
												className="h-8 cursor-pointer rounded-md border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-100"
											>
												<Translate
													text={
														localizationConstants.purchaseAgreementSeeFile
													}
												/>
											</Button>
										</TableCell>
										<TableCell className="w-12 px-2 py-3 text-center">
											<Button
												type="button"
												variant="ghost"
												size="icon"
												onClick={() =>
													onRemove(doc.id)
												}
												aria-label={`${t(localizationConstants.actionDelete)} ${doc.documentName}`}
												className="h-8 w-8 cursor-pointer rounded-md text-slate-500 hover:text-red-600"
											>
												<Trash2 className="h-4 w-4" />
											</Button>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</div>
			</CardContent>
		</Card>
	);
}

export default PurchaseGoodsReceptionListTab;
