"use client";

import { useCallback, useMemo, useState } from "react";
import { Eye, Trash2 } from "lucide-react";
import { notFound } from "next/navigation";

import { ConfirmActionDialog } from "@/components/dialog/ConfirmActionDialog";
import { ModulePageHeader } from "@/components/layout/navigation";
import { TablePagination } from "@/components/table/TablePagination";
import type { DataTableAction } from "@/components/table/DataTable";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import {
	PROJECT_MODULE_BASE_URL,
	PROJECT_MODULE_TABS,
	PROJECT_MODULE_TITLE,
} from "../../data/projectNav.config";
import { PROJECT_LIST_ROWS } from "../../data/projectsOverview.mock";
import { ProjectRowsToolbar } from "../../components/ProjectRowsToolbar";
import { ProjectRecordTitle } from "../components/ProjectRecordTitle";
import { projectProductionTabs } from "../projectProductionNav.config";
import { OrganisationDetailsDialog } from "./components/OrganisationDetailsDialog";
import { OrganisationGroupTable } from "./components/OrganisationGroupTable";
import { useProjectOrganisation } from "./hooks/useProjectOrganisation";
import type { OrganisationMember } from "./types";

export interface ProjectOrganisationPageProps {
	projectId: string;
}

/**
 * Organisation — the parties on a project, grouped by the part they play.
 *
 * Pattern 3, as Projektinformation and Tidsplan are: the record row carries the
 * section tabs. One paginator for the screen, over every group's rows at once,
 * which is what the frame's single bar below the last group means.
 */
export function ProjectOrganisationPage({
	projectId,
}: ProjectOrganisationPageProps) {
	const t = useTranslate();
	const organisation = useProjectOrganisation(projectId);
	const [viewing, setViewing] = useState<OrganisationMember | null>(null);
	const [deleting, setDeleting] = useState<OrganisationMember | null>(null);

	const project = PROJECT_LIST_ROWS.find((row) => row.id === projectId);

	/**
	 * Both dialogs open from a `DropdownMenuItem`, and Radix leaves
	 * `pointer-events: none` on `<body>` when a dialog opens in the same tick
	 * the menu closes. A timeout rather than `requestAnimationFrame`, which the
	 * purchase module uses: rAF only runs while the document is painting, so in
	 * an occluded page the callback never fires and the item does nothing.
	 */
	const actions = useMemo<DataTableAction<OrganisationMember>[]>(
		() => [
			{
				label: localizationConstants.projectListOpen,
				icon: <Eye className="h-4 w-4" />,
				onClick: (row) => setTimeout(() => setViewing(row), 0),
			},
			{
				label: localizationConstants.projectListDeleteAction,
				icon: <Trash2 className="h-4 w-4" />,
				destructive: true,
				onClick: (row) => setTimeout(() => setDeleting(row), 0),
			},
		],
		[],
	);

	/** Without this every row exposes a button named only "Actions". */
	const actionsLabel = useCallback(
		(row: OrganisationMember) =>
			`${t(localizationConstants.actions)} ${row.foretag}`.trim(),
		[t],
	);

	const confirmDelete = useCallback(() => {
		if (!deleting) return;
		organisation.removeMember(deleting.id);
		setDeleting(null);
	}, [deleting, organisation]);

	/* An id that matches no project is a 404, not an empty organisation.
	   After the hooks, not before: `notFound()` throws, and a guard above them
	   would skip the rest on that render. */
	if (!organisation.exists) notFound();

	return (
		<div className="flex flex-1 flex-col bg-blue-gray-50">
			<ModulePageHeader
				title={PROJECT_MODULE_TITLE}
				tabs={PROJECT_MODULE_TABS}
				record={{
					title: (
						<ProjectRecordTitle
							projectNo={project?.projectNr ?? projectId}
							sectionKey={
								localizationConstants.orderOrganisationTab
							}
						/>
					),
					backHref: `${PROJECT_MODULE_BASE_URL}/overview`,
				}}
				secondaryTabs={projectProductionTabs(projectId)}
			/>

			<div className="flex flex-1 flex-col gap-5 p-6">
				<ProjectRowsToolbar
					search={organisation.search}
					onSearchChange={organisation.setSearch}
					filter={organisation.filter}
					onFilterChange={organisation.setFilter}
					filterOptions={organisation.filterOptions}
					showPrint={false}
				/>

				{organisation.groups.length > 0 ? (
					<div className="flex flex-col gap-4">
						{organisation.groups.map((group) => (
							<OrganisationGroupTable
								key={group.id}
								group={group}
								actions={actions}
								actionsLabel={actionsLabel}
								sortBy={organisation.sortField ?? undefined}
								sortOrder={organisation.sortDir ?? undefined}
								onSort={organisation.onSort}
							/>
						))}
					</div>
				) : (
					/* Two different absences: a project nobody has been added to
					   yet, and a search that matched none of the people who are. */
					<p className="rounded-lg border border-slate-200 bg-white px-5 py-12 text-center text-sm text-slate-500">
						<Translate
							text={
								organisation.isEmpty
									? localizationConstants.projectOrgEmpty
									: localizationConstants.projectOrgNoMatches
							}
						/>
					</p>
				)}

				<TablePagination
					currentPage={organisation.page}
					totalPages={organisation.totalPages}
					pageSize={organisation.pageSize}
					onPageChange={organisation.setPage}
					onPageSizeChange={organisation.setPageSize}
					className="justify-center sm:justify-center"
				/>
			</div>

			<OrganisationDetailsDialog
				member={viewing}
				onClose={() => setViewing(null)}
			/>

			<ConfirmActionDialog
				open={Boolean(deleting)}
				onOpenChange={(open) => !open && setDeleting(null)}
				title={localizationConstants.projectOrgDeleteConfirmTitle}
				description={
					localizationConstants.projectOrgDeleteConfirmDescription
				}
				confirmLabel={localizationConstants.projectListDeleteAction}
				subject={deleting?.foretag}
				destructive
				onConfirm={confirmDelete}
			/>
		</div>
	);
}

export default ProjectOrganisationPage;
