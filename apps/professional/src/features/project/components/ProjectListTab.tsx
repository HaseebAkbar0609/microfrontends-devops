"use client";

import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { ConfirmActionDialog } from "@/components/dialog/ConfirmActionDialog";
import { Button } from "@/components/ui/button";
import { TablePagination } from "@/components/table/TablePagination";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { PROJECT_MODULE_BASE_URL } from "../data/projectNav.config";
import { useProjectRows } from "../hooks/useProjectRows";
import ProjectListTable from "./ProjectListTable";
import { ProjectRowsToolbar } from "./ProjectRowsToolbar";

/**
 * The active project list.
 *
 * Rows and row actions come from `useProjectRows("list")`, which Arkiv also
 * uses — so archiving from here and restoring from there are one decision in
 * one place rather than two that can disagree.
 */
const ProjectListTab = () => {
	const router = useRouter();
	const {
		filters,
		filterOptions,
		openProject,
		toggleArchived,
		deletingProject,
		requestDelete,
		cancelDelete,
		confirmDelete,
	} = useProjectRows("list");

	return (
		<div className="flex flex-col gap-5">
			<ProjectRowsToolbar
				search={filters.search}
				onSearchChange={filters.setSearch}
				filter={filters.filter}
				onFilterChange={filters.setFilter}
				filterOptions={filterOptions}
				action={
					<Button
						type="button"
						onClick={() =>
							router.push(`${PROJECT_MODULE_BASE_URL}/create`)
						}
						className="h-10 cursor-pointer gap-2 rounded-md bg-[#111721] px-4 text-sm font-medium text-white hover:bg-slate-800"
					>
						<Plus className="h-4 w-4" aria-hidden />
						<Translate
							text={localizationConstants.projectListCreateNew}
						/>
					</Button>
				}
			/>

			<div className="rounded-md border border-slate-200 bg-white">
				<ProjectListTable
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
};

export default ProjectListTab;
