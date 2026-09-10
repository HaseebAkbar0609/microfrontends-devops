"use client";

import { ConfirmActionDialog } from "@/components/dialog/ConfirmActionDialog";
import { ModulePageHeader } from "@/components/layout/navigation";
import { TablePagination } from "@/components/table/TablePagination";
import localizationConstants from "@/utils/translation/constants";
import {
	PROJECT_MODULE_TABS,
	PROJECT_MODULE_TITLE,
	projectBreadcrumbs,
} from "../data/projectNav.config";
import { useProjectRows } from "../hooks/useProjectRows";
import ProjectListTable from "./ProjectListTable";
import { ProjectRowsToolbar } from "./ProjectRowsToolbar";

/**
 * Arkiv — the archived projects.
 *
 * The same table the active list draws, in `"archive"` mode: identical
 * columns, pill and column picker, with Avarkivera where the list offers
 * Arkivera. The frames draw the two screens the same way, and one table in two
 * modes is how they stay that way.
 */
export function ProjectArchivePage() {
	const {
		filters,
		filterOptions,
		openProject,
		toggleArchived,
		deletingProject,
		requestDelete,
		cancelDelete,
		confirmDelete,
	} = useProjectRows("archive");

	return (
		<div className="flex flex-1 flex-col bg-blue-gray-50">
			<ModulePageHeader
				title={PROJECT_MODULE_TITLE}
				tabs={PROJECT_MODULE_TABS}
				breadcrumbs={projectBreadcrumbs(
					localizationConstants.projectArchive,
				)}
			/>

			<div className="flex flex-1 flex-col gap-5 p-6">
				<ProjectRowsToolbar
					search={filters.search}
					onSearchChange={filters.setSearch}
					filter={filters.filter}
					onFilterChange={filters.setFilter}
					filterOptions={filterOptions}
				/>

				<div className="rounded-md border border-slate-200 bg-white">
					<ProjectListTable
						mode="archive"
						projects={filters.paged}
						sortField={filters.sortField}
						sortDir={filters.sortDir}
						onToggleSort={filters.toggleSort}
						onOpen={openProject}
						onToggleArchived={toggleArchived}
						onDelete={requestDelete}
					/>
				</div>

				<TablePagination
					currentPage={filters.page}
					totalPages={filters.totalPages}
					pageSize={filters.pageSize}
					onPageChange={filters.setPage}
					onPageSizeChange={filters.setPageSize}
					className="justify-center sm:justify-center"
				/>
			</div>

			<ConfirmActionDialog
				open={Boolean(deletingProject)}
				onOpenChange={(open) => !open && cancelDelete()}
				title={localizationConstants.projectListDeleteConfirmTitle}
				description={
					localizationConstants.projectListDeleteConfirmDescription
				}
				confirmLabel={localizationConstants.projectListDeleteAction}
				subject={deletingProject?.projectNr}
				destructive
				onConfirm={confirmDelete}
			/>
		</div>
	);
}

export default ProjectArchivePage;
