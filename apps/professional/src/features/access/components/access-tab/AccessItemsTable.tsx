"use client";

import { useMemo, useState } from "react";
import { Eye, Trash2 } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/table/DataTable";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { ACCESS_TYPE_LABELS } from "../../constants/access.constants";
import { isAccessItemSortField } from "../../constants/accessItems.constants";
import type { SortOrder } from "../../types/access.types";
import type { AccessItem, AccessItemSortField } from "../../types/accessItems.types";
import { sortAccessItems } from "../../utils/accessItems";
import { AccessItemStatusBadge } from "./AccessItemStatusBadge";

interface AccessItemsTableProps {
	items: AccessItem[];
	onView: (item: AccessItem) => void;
	onDelete: (item: AccessItem) => void;
}

/** The items table inside a person's accordion: sortable columns, then an eye and a trash icon per row. */
export function AccessItemsTable({ items, onView, onDelete }: AccessItemsTableProps) {
	const t = useTranslate();
	const [sort, setSort] = useState<{ field: AccessItemSortField | null; order: SortOrder }>({
		field: null,
		order: "asc",
	});
	const rows = useMemo(() => sortAccessItems(items, sort.field, sort.order), [items, sort]);

	const columns = useMemo<DataTableColumn<AccessItem>[]>(
		() => [
			{ key: "nycId", label: localizationConstants.accessItemColNycId, sortable: true, cellClassName: "text-slate-900" },
			{ key: "regNo", label: localizationConstants.accessItemColRegNo, sortable: true, cellClassName: "text-slate-900" },
			{
				key: "type",
				label: localizationConstants.accessColType,
				sortable: true,
				render: (row) => t(ACCESS_TYPE_LABELS[row.type]),
			},
			{ key: "accessTo", label: localizationConstants.accessItemColAccessTo, sortable: true },
			{ key: "startDate", label: localizationConstants.accessItemColStartDate, sortable: true },
			{ key: "endDate", label: localizationConstants.accessItemColEndDate, sortable: true },
			{
				key: "status",
				label: localizationConstants.accessColStatus,
				sortable: true,
				render: (row) => <AccessItemStatusBadge status={row.status} />,
			},
		],
		[t],
	);

	return (
		<DataTable
			data={rows}
			columns={columns}
			rowKey={(row) => row.id}
			emptyMessageKey={localizationConstants.accessItemsEmpty}
			sortBy={sort.field ?? undefined}
			sortOrder={sort.order}
			onSort={(field, order) =>
				isAccessItemSortField(field) && setSort({ field: order ? field : null, order: order ?? "asc" })
			}
			primaryAction={(row) => (
				<div className="flex items-center justify-end gap-1">
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className="cursor-pointer"
						aria-label={t(localizationConstants.accessItemViewLabel, { id: row.nycId })}
						onClick={() => onView(row)}
					>
						<Eye className="h-4 w-4" aria-hidden />
					</Button>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className="cursor-pointer"
						aria-label={t(localizationConstants.accessItemDeleteLabel, { id: row.nycId })}
						onClick={() => onDelete(row)}
					>
						<Trash2 className="h-4 w-4" aria-hidden />
					</Button>
				</div>
			)}
		/>
	);
}
