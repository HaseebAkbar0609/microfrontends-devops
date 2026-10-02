"use client";

import { useMemo, useState } from "react";
import { DataTable, type DataTableColumn } from "@/components/table/DataTable";
import localizationConstants from "@/utils/translation/constants";
import type { SortOrder } from "../../types/access.types";
import type { AccessContact, AccessContactSortField } from "../../types/accessDetails.types";
import { sortContacts } from "../../utils/accessDetails";

const SORT_FIELDS: AccessContactSortField[] = ["name", "email", "mobile"];

/** The table reports the clicked column as a plain string; this narrows it. */
function isSortField(value: string): value is AccessContactSortField {
	return (SORT_FIELDS as string[]).includes(value);
}

const COLUMNS: DataTableColumn<AccessContact>[] = [
	{ key: "name", label: localizationConstants.accessContactResponsible, sortable: true, cellClassName: "text-slate-900" },
	{ key: "email", label: localizationConstants.email, sortable: true },
	{ key: "mobile", label: localizationConstants.accessContactMobile, sortable: true },
];

/** Contact Person table of the Figma frame. A short list, so sorting only and no paging. */
export function AccessContactsTable({ contacts }: { contacts: AccessContact[] }) {
	const [sort, setSort] = useState<{ field: AccessContactSortField | null; order: SortOrder }>({
		field: null,
		order: "asc",
	});
	const rows = useMemo(() => sortContacts(contacts, sort.field, sort.order), [contacts, sort]);

	return (
		<div className="p-4">
			<DataTable
				data={rows}
				columns={COLUMNS}
				rowKey={(contact) => contact.id}
				emptyMessageKey={localizationConstants.accessContactsEmpty}
				sortBy={sort.field ?? undefined}
				sortOrder={sort.order}
				onSort={(field, order) =>
					isSortField(field) && setSort({ field: order ? field : null, order: order ?? "asc" })
				}
			/>
		</div>
	);
}
