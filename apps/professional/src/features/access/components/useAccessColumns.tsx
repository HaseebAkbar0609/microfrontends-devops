"use client";

import { useMemo } from "react";
import type { DataTableColumn } from "@/components/table/DataTable";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { ACCESS_EMPTY_CELL, ACCESS_TYPE_LABELS } from "../constants/access.constants";
import type { AccessPoint } from "../types/access.types";
import { formatAssignedAt } from "../utils/accessList";
import { AccessStatusBadge } from "./AccessStatusBadge";

/** Columns of the Figma list. Every one sorts; keys match AccessSortField. */
export function useAccessColumns(): DataTableColumn<AccessPoint>[] {
	const t = useTranslate();

	return useMemo(
		() => [
			{ key: "idNumber", label: localizationConstants.accessColIdNo, sortable: true, cellClassName: "text-slate-900" },
			{
				key: "objectRef",
				label: localizationConstants.accessColObject,
				sortable: true,
				render: (row) => row.objectRef ?? ACCESS_EMPTY_CELL,
			},
			{
				key: "name",
				label: localizationConstants.accessColName,
				sortable: true,
				cellClassName: "font-semibold text-slate-900",
			},
			{
				key: "type",
				label: localizationConstants.accessColType,
				sortable: true,
				render: (row) => t(ACCESS_TYPE_LABELS[row.type]),
			},
			{ key: "city", label: localizationConstants.accessColCity, sortable: true },
			{
				key: "assignedTo",
				label: localizationConstants.accessColAssignedTo,
				sortable: true,
				render: (row) => {
					const [first, ...others] = row.assignees;
					if (!first) return t(localizationConstants.accessUnassigned);
					return others.length > 0 ? `${first} +${others.length}` : first;
				},
			},
			{
				key: "lastAssignedAt",
				label: localizationConstants.accessColLastAssigned,
				sortable: true,
				render: (row) => formatAssignedAt(row.lastAssignedAt) ?? ACCESS_EMPTY_CELL,
			},
			{
				key: "status",
				label: localizationConstants.accessColStatus,
				sortable: true,
				render: (row) => <AccessStatusBadge status={row.status} />,
			},
		],
		[t],
	);
}
