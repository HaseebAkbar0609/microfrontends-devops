"use client";

import { useMemo, useState } from "react";
import { Eye, Folders } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/table/DataTable";
import { Button } from "@/components/ui/button";
import { PdfFileIcon } from "@/components/ui/PdfFileIcon";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { ACCESS_DOCUMENT_TYPE_LABELS } from "../../constants/accessItems.constants";
import type { SortOrder } from "../../types/access.types";
import type { AccessDocument, AccessDocumentSortField } from "../../types/accessItemDetails.types";
import { sortAccessDocuments } from "../../utils/accessItemExtras";
import { AccessSectionCard } from "../details/AccessSectionCard";

const SORT_FIELDS: AccessDocumentSortField[] = ["date", "name", "fileType"];

/** The table reports the clicked column as a plain string; this narrows it. */
function isSortField(value: string): value is AccessDocumentSortField {
	return (SORT_FIELDS as string[]).includes(value);
}

/** "Documents" card: date, document name and file type, sortable, with an eye icon per row. */
export function AccessDocumentsCard({ documents, onView }: { documents: AccessDocument[]; onView: (document: AccessDocument) => void }) {
	const t = useTranslate();
	const [sort, setSort] = useState<{ field: AccessDocumentSortField | null; order: SortOrder }>({ field: null, order: "asc" });
	const rows = useMemo(() => sortAccessDocuments(documents, sort.field, sort.order), [documents, sort]);

	const columns = useMemo<DataTableColumn<AccessDocument>[]>(
		() => [
			{ key: "date", label: localizationConstants.accessDocColDate, sortable: true, cellClassName: "text-slate-900" },
			{
				key: "name",
				label: localizationConstants.accessDocColName,
				sortable: true,
				cellClassName: "text-slate-900",
				render: (row) => (
					<span className="flex items-center gap-2">
						<PdfFileIcon className="h-9 w-7" />
						{row.name}
					</span>
				),
			},
			{
				key: "fileType",
				label: localizationConstants.accessDocColFile,
				sortable: true,
				cellClassName: "text-slate-900",
				render: (row) => ACCESS_DOCUMENT_TYPE_LABELS[row.fileType],
			},
		],
		[],
	);

	return (
		<AccessSectionCard icon={<Folders className="h-5 w-5" aria-hidden />} title={localizationConstants.accessItemSectionDocuments}>
			<div className="p-4">
				<DataTable
					data={rows}
					columns={columns}
					rowKey={(row) => row.id}
					emptyMessageKey={localizationConstants.accessDocumentsEmpty}
					sortBy={sort.field ?? undefined}
					sortOrder={sort.order}
					onSort={(field, order) => isSortField(field) && setSort({ field: order ? field : null, order: order ?? "asc" })}
					primaryAction={(row) => (
						<Button
							type="button"
							variant="ghost"
							size="icon"
							className="cursor-pointer"
							aria-label={t(localizationConstants.accessViewLabel, { name: row.name })}
							onClick={() => onView(row)}
						>
							<Eye className="h-4 w-4" aria-hidden />
						</Button>
					)}
				/>
			</div>
		</AccessSectionCard>
	);
}
