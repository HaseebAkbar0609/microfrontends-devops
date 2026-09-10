"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DocFileIcon } from "@/components/ui/DocFileIcon";
import { PdfFileIcon } from "@/components/ui/PdfFileIcon";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import type { ProjectDocumentItem } from "../types";

const HEADERS: TranslationKeys[] = [
	localizationConstants.dateHeaderLabel,
	localizationConstants.orderDocumentNameHeader,
	localizationConstants.orderFileHeader,
];

export interface SummaryDocumentsCardProps {
	documents: ProjectDocumentItem[];
	isOpen: boolean;
	/** The pencil and chevron the other summary sections also use. */
	action: React.ReactNode;
}

/** The Dokument block on the Sammanställning step — the table, read-only. */
export function SummaryDocumentsCard({
	documents,
	isOpen,
	action,
}: SummaryDocumentsCardProps) {
	return (
		<Card className="rounded-lg border border-slate-200 bg-white shadow-none">
			<CardHeader className="flex h-14 flex-row items-center justify-between border-b border-slate-200 px-6 py-0 [.border-b]:pb-0">
				<CardTitle className="text-base font-medium text-slate-900">
					<Translate text={localizationConstants.orderDokumentSection} />
				</CardTitle>
				{action}
			</CardHeader>

			{isOpen && (
				<CardContent className="p-6">
					<div className="w-full overflow-x-auto">
						<Table className="w-full min-w-[520px]">
							<TableHeader>
								<TableRow className="border-b border-slate-200 bg-white hover:bg-white">
									{HEADERS.map((label) => (
										<TableHead
											key={label}
											className="px-4 py-3 text-sm font-medium whitespace-nowrap text-slate-500"
										>
											<Translate text={label} />
										</TableHead>
									))}
								</TableRow>
							</TableHeader>

							<TableBody>
								{documents.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={HEADERS.length}
											className="py-8 text-center text-sm text-slate-500"
										>
											<Translate
												text={
													localizationConstants.noRecordsFound
												}
											/>
										</TableCell>
									</TableRow>
								) : (
									documents.map((doc) => (
										<TableRow
											key={doc.id}
											className="border-b border-slate-100 last:border-b-0"
										>
											<TableCell className="px-4 py-3 text-sm whitespace-nowrap text-slate-900">
												{doc.date}
											</TableCell>
											<TableCell className="px-4 py-3 text-sm text-slate-900">
												{doc.documentName}
											</TableCell>
											<TableCell className="px-4 py-3">
												<div className="flex items-center gap-2">
													{doc.fileType === "doc" ? (
														<DocFileIcon className="h-8 w-6 shrink-0" />
													) : (
														<PdfFileIcon className="h-8 w-6 shrink-0" />
													)}
													<span className="truncate text-sm text-slate-900">
														{doc.fileName}
													</span>
												</div>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</div>
				</CardContent>
			)}
		</Card>
	);
}

export default SummaryDocumentsCard;
