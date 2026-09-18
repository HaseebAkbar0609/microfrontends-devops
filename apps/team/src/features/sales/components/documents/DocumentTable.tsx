"use client";

import Link from "next/link";
import { ArrowRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/dialog/ConfirmDialog";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { getSalesDocumentLabelKey } from "../../constants/salesDocumentTypes";
import type { SalesDocument } from "../../utils/salesDocuments";
import { formatCurrency, formatDate } from "../../utils/salesFormatters";

const HEAD_CLASS = "h-11 px-5 text-xs font-medium uppercase tracking-wide text-slate-500";

type DocumentTableProps = {
	documents: SalesDocument[];
	onRemove: (documentId: string) => void;
};

/** Every document, with a link to the ones the CRM can open. */
export function DocumentTable({ documents, onRemove }: DocumentTableProps) {
	const t = useTranslate();

	if (documents.length === 0) {
		return (
			<p className="px-5 py-10 text-center text-sm text-slate-500">
				<Translate text={localizationConstants.salesDocEmpty} />
			</p>
		);
	}

	return (
		<div className="overflow-x-auto">
			<Table>
				<TableHeader>
					<TableRow>
						{[
							localizationConstants.salesActivityTypeLabel,
							localizationConstants.salesDocColumnNumber,
							localizationConstants.salesColumnCompany,
							localizationConstants.dateLabel,
							localizationConstants.salesColumnStatus,
						].map((labelKey) => (
							<TableHead key={labelKey} className={HEAD_CLASS}>
								<Translate text={labelKey} />
							</TableHead>
						))}
						<TableHead className={`${HEAD_CLASS} text-right`}>
							<Translate text={localizationConstants.amountLabel} />
						</TableHead>
						<TableHead className={`${HEAD_CLASS} text-right`}>
							<Translate text={localizationConstants.salesColumnAction} />
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{documents.map((document) => (
						<TableRow key={document.id}>
							<TableCell className="px-5 py-3 text-slate-600">
								<Translate text={getSalesDocumentLabelKey(document.type)} />
							</TableCell>
							<TableCell className="px-5 font-medium text-slate-900">
								{document.number}
							</TableCell>
							<TableCell className="px-5 text-slate-600">
								{document.companyName}
							</TableCell>
							<TableCell className="px-5 tabular-nums text-slate-600">
								{formatDate(document.date)}
							</TableCell>
							<TableCell className="px-5 text-slate-600">
								<Translate text={document.statusKey} />
							</TableCell>
							<TableCell className="px-5 text-right tabular-nums">
								{formatCurrency(document.amount)}
							</TableCell>
							<TableCell className="px-5 text-right">
								{document.href ? (
									<Button
										asChild
										variant="outline"
										size="sm"
										className="cursor-pointer active:scale-[0.98]"
									>
										<Link href={document.href}>
											<Translate text={localizationConstants.salesOpenAction} />
											<ArrowRight className="ml-1 h-3.5 w-3.5" />
										</Link>
									</Button>
								) : (
									<ConfirmDialog
										title={t(localizationConstants.salesDocRemoveConfirmTitle)}
										description={t(
											localizationConstants.salesDocRemoveConfirmDescription,
										)}
										confirmText={t(localizationConstants.salesConfirmLabel)}
										cancelText={t(localizationConstants.salesCancelButton)}
										onConfirm={() => onRemove(document.id)}
										trigger={
											<Button
												type="button"
												variant="ghost"
												size="icon"
												aria-label={t(localizationConstants.salesDocRemoveAction)}
												className="cursor-pointer text-slate-500 hover:text-red-600 active:scale-[0.98]"
											>
												<Trash2 className="h-4 w-4" />
											</Button>
										}
									/>
								)}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
