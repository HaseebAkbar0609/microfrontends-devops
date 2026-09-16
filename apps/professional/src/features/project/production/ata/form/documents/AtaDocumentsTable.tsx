"use client";

import { useMemo } from "react";
import type { Control } from "react-hook-form";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTableSort } from "@/hooks/useTableSort";
import { sortItems } from "@/utils/tableSort";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { SortableHead } from "../../../components/SortableHead";
import type { AtaDocumentInput } from "../../types";
import { AtaDocumentRow, type AtaDocumentActions, type AtaDocumentsFormValues } from "./AtaDocumentRow";

type SortKey = "date" | "documentName" | "fileName";

const COLUMNS: { key: SortKey; labelKey: TranslationKeys }[] = [
	{ key: "date", labelKey: localizationConstants.ataColDate },
	{ key: "documentName", labelKey: localizationConstants.viewAtaDocName },
	{ key: "fileName", labelKey: localizationConstants.createAtaColFile },
];

export interface AtaDocumentsTableProps<T extends AtaDocumentsFormValues> {
	control: Control<T>;
	documents: AtaDocumentInput[];
	urls: ReadonlyMap<string, string>;
	lockReason: TranslationKeys | null;
	translateError: (message: string) => string;
	actions: AtaDocumentActions;
}

/**
 * "Bifogade fakturor / dokument": the attached files, sortable, each keeping its
 * place in the form. The last column is ⋮ on the project's own ÄTA and "Visa" on
 * a supplier's (see `AtaDocumentActions`).
 */
export function AtaDocumentsTable<T extends AtaDocumentsFormValues>({ control, documents, urls, lockReason, translateError, actions }: AtaDocumentsTableProps<T>) {
	const { sortField, sortDir, toggleSort } = useTableSort<SortKey>();
	const rows = useMemo(
		() =>
			sortItems(
				documents.map((document, index) => ({ document, index })),
				sortField,
				sortDir,
				(row, field) => row.document[field as SortKey],
			),
		[documents, sortField, sortDir],
	);

	return (
		<div className="overflow-hidden rounded-lg border border-slate-200">
			<p className="bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-900">
				<Translate text={localizationConstants.viewAtaAttachedInvoicesDocs} />
			</p>
			<div className="w-full overflow-x-auto">
				<Table className="min-w-[40rem]">
					<TableHeader>
						<TableRow className="hover:bg-transparent">
							{COLUMNS.map((column) => (
								<SortableHead
									key={column.key}
									labelKey={column.labelKey}
									onSort={() => toggleSort(column.key)}
									active={sortField === column.key}
									dir={sortDir}
								/>
							))}
							<TableHead className={actions.mode === "manage" ? "w-12" : "w-24"} />
						</TableRow>
					</TableHeader>
					<TableBody>
						{rows.length === 0 ? (
							<TableRow className="hover:bg-transparent">
								<TableCell colSpan={COLUMNS.length + 1} className="py-8 text-center text-sm text-slate-500">
									<Translate text={localizationConstants.viewAtaNoDocuments} />
								</TableCell>
							</TableRow>
						) : (
							rows.map(({ document, index }) => (
								<AtaDocumentRow<T>
									key={document.id}
									control={control}
									document={document}
									index={index}
									url={urls.get(document.id)}
									lockReason={lockReason}
									translateError={translateError}
									actions={actions}
								/>
							))
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}

export default AtaDocumentsTable;
