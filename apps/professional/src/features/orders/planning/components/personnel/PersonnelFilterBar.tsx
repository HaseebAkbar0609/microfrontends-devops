"use client";

import { ChevronDown, CirclePlus, X } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { Search } from "@/components/search/Search";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PersonnelFilterBarProps {
	searchQuery: string;
	setSearchQuery: (val: string) => void;
	selectedStatus: string;
	setSelectedStatus: (val: string) => void;
	selectedAssignee: string;
	setSelectedAssignee: (val: string) => void;
	selectedProject: string;
	setSelectedProject: (val: string) => void;
	uniqueProjects: { key: string; label: string }[];
	employeesList: { id: string; name: string; initials: string; avatarUrl?: string }[];
	onResetFilters: () => void;
}

export function PersonnelFilterBar({
	searchQuery,
	setSearchQuery,
	selectedStatus,
	setSelectedStatus,
	selectedAssignee,
	setSelectedAssignee,
	selectedProject,
	setSelectedProject,
	uniqueProjects,
	employeesList,
	onResetFilters,
}: PersonnelFilterBarProps) {
	return (
		<div className="flex flex-wrap items-center gap-2 w-full font-sans">
			{/* Search */}
			<Search
				value={searchQuery}
				onChange={setSearchQuery}
				placeholder={localizationConstants.search}
				wrapperClassName="w-full sm:w-[220px] flex-shrink-0"
				className="h-9 text-xs"
			/>

			{/* Status Filter (Primary) */}
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<button
						type="button"
						className="h-9 flex items-center justify-between gap-1.5 px-3 bg-transparent border border-dotted border-slate-300 rounded-md text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
					>
						<Translate text={localizationConstants.filter} />
						<ChevronDown className="w-3.5 h-3.5 text-slate-400" />
					</button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="start">
					<DropdownMenuItem onClick={() => setSelectedStatus("all")}>
						<Translate text={localizationConstants.filterAllCategories} />
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setSelectedStatus("completed")}>
						<Translate text={localizationConstants.planningCompleted} />
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setSelectedStatus("in_progress")}>
						<Translate text={localizationConstants.planningInProgress} />
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setSelectedStatus("not_started")}>
						<Translate text={localizationConstants.planningNotStarted} />
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			{/* Assignee Filter */}
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<div className="h-9 flex items-center border border-dotted border-slate-300 rounded-md overflow-hidden flex-shrink-0 cursor-pointer hover:bg-slate-50 transition-colors bg-transparent">
						<button
							type="button"
							className="h-full flex items-center gap-1.5 px-3 bg-transparent text-xs font-medium text-slate-700 pointer-events-none whitespace-nowrap"
						>
							<CirclePlus className="w-4 h-4 text-slate-500" />
							<Translate text={localizationConstants.planningAssignee} />
						</button>
						<div className="w-px h-5 bg-slate-300 flex-shrink-0" />
						<span className="h-6 my-auto mx-1 px-2 bg-slate-100 text-xs font-medium text-slate-700 flex items-center rounded-sm whitespace-nowrap">
							{selectedAssignee !== "all" ? (
								employeesList.find((e) => e.id === selectedAssignee)?.name || (
									<Translate text={localizationConstants.filterLabel1} />
								)
							) : (
								<Translate text={localizationConstants.filterLabel1} />
							)}
						</span>
						<span className="h-6 my-auto mx-1 px-2 bg-slate-100 text-xs font-medium text-slate-700 flex items-center rounded-sm whitespace-nowrap">
							<Translate text={localizationConstants.filterLabel2} />
						</span>
					</div>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="start">
					<DropdownMenuItem onClick={() => setSelectedAssignee("all")}>
						<Translate text={localizationConstants.filterAllCategories} />
					</DropdownMenuItem>
					{employeesList.map((emp) => (
						<DropdownMenuItem key={emp.id} onClick={() => setSelectedAssignee(emp.id)}>
							{emp.name} ({emp.initials})
						</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>

			<div className="h-5 w-px bg-slate-300 hidden md:block" />

			{/* Project Name Filter */}
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<button
						type="button"
						className="h-9 flex items-center gap-1.5 px-3 bg-transparent border border-dotted border-slate-300 rounded-md text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
					>
						<CirclePlus className="w-4 h-4 text-slate-500" />
						<Translate text={localizationConstants.projektNamn} />
						{selectedProject !== "all" && (
							<span className="ml-1 rounded bg-slate-200 px-1.5 py-0.5 text-xs font-medium text-slate-700">
								{uniqueProjects.find((p) => p.key === selectedProject)?.label || selectedProject}
							</span>
						)}
					</button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="start">
					<DropdownMenuItem onClick={() => setSelectedProject("all")}>
						<Translate text={localizationConstants.filterAllCategories} />
					</DropdownMenuItem>
					{uniqueProjects.map((project) => (
						<DropdownMenuItem key={project.key} onClick={() => setSelectedProject(project.key)}>
							{project.label}
						</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>

			{/* Status Filter (Secondary) */}
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<button
						type="button"
						className="h-9 flex items-center gap-1.5 px-3 bg-transparent border border-dotted border-slate-300 rounded-md text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
					>
						<CirclePlus className="w-4 h-4 text-slate-500" />
						<Translate text={localizationConstants.status} />
						{selectedStatus !== "all" && (
							<span className="ml-1 rounded bg-slate-200 px-1.5 py-0.5 text-xs font-medium text-slate-700">
								<Translate
									text={
										selectedStatus === "completed"
											? localizationConstants.planningCompleted
											: selectedStatus === "in_progress"
											? localizationConstants.planningInProgress
											: selectedStatus === "not_started"
											? localizationConstants.planningNotStarted
											: localizationConstants.status
									}
								/>
							</span>
						)}
					</button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="start">
					<DropdownMenuItem onClick={() => setSelectedStatus("all")}>
						<Translate text={localizationConstants.filterAllCategories} />
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setSelectedStatus("completed")}>
						<Translate text={localizationConstants.planningCompleted} />
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setSelectedStatus("in_progress")}>
						<Translate text={localizationConstants.planningInProgress} />
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setSelectedStatus("not_started")}>
						<Translate text={localizationConstants.planningNotStarted} />
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			{/* Reset */}
			<button
				type="button"
				onClick={onResetFilters}
				className="h-9 flex items-center gap-1 px-2 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors cursor-pointer whitespace-nowrap ml-auto"
			>
				<Translate text={localizationConstants.reset} />
				<X className="w-3.5 h-3.5" />
			</button>
		</div>
	);
}

export default PersonnelFilterBar;
