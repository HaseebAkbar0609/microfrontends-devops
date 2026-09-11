"use client";

import { CollapsibleSection } from "@/components/common/CollapsibleSection";
import {
	DataTable,
	type DataTableAction,
} from "@/components/table/DataTable";
import { Translate } from "@/utils/translation/translate";
import { ORGANISATION_COLUMNS } from "../organisationColumns";
import type { OrganisationGroupRows, OrganisationMember } from "../types";

export interface OrganisationGroupTableProps {
	group: OrganisationGroupRows;
	actions: DataTableAction<OrganisationMember>[];
	actionsLabel: (row: OrganisationMember) => string;
	sortBy?: string;
	sortOrder?: string;
	onSort: (field: string) => void;
}

/**
 * One party's collapsible card: the grey title bar, and its rows beneath.
 *
 * `CollapsibleSection` rather than a button toggling a sibling, so the header
 * reports `aria-expanded` and `aria-controls` — the order module's equivalent
 * hand-rolls the toggle and announces no state at all. Its defaults are written
 * for a form section (`mb-4 border-b pb-4`), so the frame's 56px bar comes from
 * overrides rather than from a second component.
 *
 * The table is handed no `pagination`, which is what keeps `DataTable` from
 * rendering a bar per group — the screen has one, at page level.
 */
export function OrganisationGroupTable({
	group,
	actions,
	actionsLabel,
	sortBy,
	sortOrder,
	onSort,
}: OrganisationGroupTableProps) {
	return (
		<CollapsibleSection
			className="overflow-hidden rounded-lg border border-slate-200 bg-white"
			headerClassName="mb-0 h-14 rounded-none border-b border-slate-200 bg-slate-100 px-4 pb-0 text-sm font-semibold text-slate-900 hover:bg-slate-100"
			contentClassName="[&>div]:gap-0"
			title={<Translate text={group.titleKey} />}
		>
			<DataTable
				data={group.rows}
				columns={ORGANISATION_COLUMNS}
				rowKey={(row) => row.id}
				actions={actions}
				actionsLabel={actionsLabel}
				sortBy={sortBy}
				sortOrder={sortOrder}
				onSort={onSort}
			/>
		</CollapsibleSection>
	);
}

export default OrganisationGroupTable;
