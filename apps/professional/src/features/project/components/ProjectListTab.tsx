"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Plus, Printer, Search } from "lucide-react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { TablePagination } from "@/components/table/TablePagination";
import { cn } from "@/lib/utils";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { PROJECT_MODULE_BASE_URL } from "../data/projectNav.config";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { ProjectListItem } from "../data/projectsOverview.mock";
import { useProjectOverviewFilters } from "../hooks/useProjectOverviewFilters";
import {
	archiveProject,
	listProjects,
	removeProject,
} from "../services/projectOverviewService";
import ProjectListTable from "./ProjectListTable";

const ProjectListTab = () => {
	const t = useTranslate();
	const router = useRouter();
	const [projects, setProjects] = useState<ProjectListItem[]>(() =>
		listProjects(),
	);
	const [deletingProject, setDeletingProject] =
		useState<ProjectListItem | null>(null);
	const filters = useProjectOverviewFilters(projects);

	const filterOptions = useMemo(() => {
		const values = new Set<string>();
		projects.forEach((project) => {
			values.add(project.category);
			values.add(project.department);
		});
		return [...values];
	}, [projects]);

	const openProject = (project: ProjectListItem) =>
		router.push(`/module/production/project/${project.id}`);

	const handleArchive = (project: ProjectListItem) => {
		setProjects(archiveProject(project.id));
		showToast("success", t(localizationConstants.projectListArchivedToast));
	};

	const handleDelete = () => {
		if (!deletingProject) return;
		setProjects(removeProject(deletingProject.id));
		setDeletingProject(null);
		showToast("success", t(localizationConstants.projectListDeletedToast));
	};

	const handleCreate = () =>
		router.push(`${PROJECT_MODULE_BASE_URL}/create`);

	return (
		<div className="flex flex-col gap-5">
			<div className="flex flex-wrap items-center justify-between gap-4">
				<div className="flex flex-wrap items-center gap-4">
					<div className="relative w-72 max-w-full">
						<Search className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
						<Input
							value={filters.search}
							onChange={(event) =>
								filters.setSearch(event.target.value)
							}
							placeholder={t(localizationConstants.search)}
							className="h-9 rounded-none border-0 border-b border-slate-200 bg-transparent pl-6 text-sm shadow-none focus-visible:border-slate-400 focus-visible:ring-0"
						/>
					</div>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								type="button"
								variant="outline"
								className="h-9 gap-1.5 rounded-md border-slate-200 bg-white px-3 text-sm font-medium text-slate-900 hover:bg-slate-50"
							>
								<Translate text={localizationConstants.filter} />
								<ChevronDown className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align="start"
							className="w-48 rounded-md border border-slate-200 bg-white p-1 shadow-md"
						>
							<DropdownMenuItem
								onClick={() => filters.setFilter(null)}
								className={cn(
									"cursor-pointer rounded-md px-3 py-2 text-sm text-slate-700",
									filters.filter === null &&
										"bg-slate-100 font-medium text-slate-900",
								)}
							>
								<Translate
									text={
										localizationConstants.projectListFilterAll
									}
								/>
							</DropdownMenuItem>
							{filterOptions.map((option) => (
								<DropdownMenuItem
									key={option}
									onClick={() => filters.setFilter(option)}
									className={cn(
										"cursor-pointer rounded-md px-3 py-2 text-sm text-slate-700",
										filters.filter === option &&
											"bg-slate-100 font-medium text-slate-900",
									)}
								>
									{option}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
				<div className="flex items-center gap-3">
					<Button
						type="button"
						variant="outline"
						size="icon"
						onClick={() => window.print()}
						aria-label={t(localizationConstants.projectListPrint)}
						className="h-11 w-11 rounded-md border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
					>
						<Printer className="h-4 w-4" />
					</Button>
					<Button
						type="button"
						onClick={handleCreate}
						className="h-11 gap-2 rounded-md bg-slate-900 px-5 text-sm font-medium text-white hover:bg-slate-900/90"
					>
						<Plus className="h-4 w-4" />
						<Translate
							text={localizationConstants.projectListCreateNew}
						/>
					</Button>
				</div>
			</div>

			<div className="rounded-md border border-slate-200 bg-white">
				<ProjectListTable
					projects={filters.paged}
					sortField={filters.sortField}
					onToggleSort={filters.toggleSort}
					onOpen={openProject}
					onArchive={handleArchive}
					onDelete={setDeletingProject}
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

			<AlertDialog
				open={!!deletingProject}
				onOpenChange={(open) => {
					if (!open) setDeletingProject(null);
				}}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							<Translate
								text={
									localizationConstants.projectListDeleteConfirmTitle
								}
							/>
						</AlertDialogTitle>
						<AlertDialogDescription>
							<Translate
								text={
									localizationConstants.projectListDeleteConfirmDescription
								}
							/>
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>
							<Translate text={localizationConstants.cancel} />
						</AlertDialogCancel>
						<AlertDialogAction onClick={handleDelete}>
							<Translate
								text={
									localizationConstants.projectListDeleteAction
								}
							/>
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
};

export default ProjectListTab;
