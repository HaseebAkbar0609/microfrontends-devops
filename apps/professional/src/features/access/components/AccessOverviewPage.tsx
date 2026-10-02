"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { ACCESS_NEW_BASE_URL, accessDetailsUrl } from "../data/accessNav.config";
import { useAccessList } from "../hooks/useAccessList";
import type { AccessPoint } from "../types/access.types";
import { AccessDeleteDialog } from "./AccessDeleteDialog";
import { AccessTable, type AccessRowAction } from "./AccessTable";
import { AccessToolbar } from "./AccessToolbar";

/**
 * Smart Access overview (TFS-1101): the Åtkomsthantering list with search,
 * filter, sorting, paging and the Öppna / Arkiv / Ta bort row menu. Öppna and
 * the eye icon open the details page (TFS-1102); "New access management" opens the
 * new-access wizard (TFS-1105).
 */
export function AccessOverviewPage() {
	const t = useTranslate();
	const list = useAccessList();
	const { archive, remove } = list;
	const [deleteTarget, setDeleteTarget] = useState<AccessPoint | null>(null);

	const router = useRouter();

	const onRowAction = useCallback(
		(action: AccessRowAction, row: AccessPoint) => {
			if (action === "open") return router.push(accessDetailsUrl(row.id));
			if (action === "delete") return setDeleteTarget(row);
			archive(row.id);
			showToast("success", t(localizationConstants.accessArchivedToast, { name: row.name }));
		},
		[archive, router, t],
	);

	const confirmDelete = useCallback(
		(row: AccessPoint) => {
			remove(row.id);
			setDeleteTarget(null);
			showToast("success", t(localizationConstants.accessDeletedToast, { name: row.name }));
		},
		[remove, t],
	);

	return (
		<div className="flex flex-1 flex-col px-5 py-5">
			<section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
				<div className="border-b border-slate-200">
					<AccessToolbar
						search={list.params.search}
						onSearchChange={list.setSearch}
						status={list.params.status}
						type={list.params.type}
						onStatusChange={list.setStatus}
						onTypeChange={list.setType}
						onClearFilters={list.clearFilters}
						onNew={() => router.push(ACCESS_NEW_BASE_URL)}
					/>
				</div>
				<AccessTable
					page={list.page}
					params={list.params}
					onSort={list.setSort}
					onPageChange={list.setPage}
					onPageSizeChange={list.setPageSize}
					onRowAction={onRowAction}
				/>
			</section>
			<AccessDeleteDialog
				target={deleteTarget}
				onConfirm={confirmDelete}
				onCancel={() => setDeleteTarget(null)}
			/>
		</div>
	);
}
