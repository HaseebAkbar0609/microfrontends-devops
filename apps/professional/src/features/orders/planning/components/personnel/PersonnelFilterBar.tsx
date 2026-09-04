"use client";

import { useState } from "react";
import { ChevronDown, CirclePlus, Search as SearchIcon, X } from "lucide-react";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { Search } from "@/components/search/Search";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { MOCK_PERSONNEL_PROJECT_ITEMS } from "../../data/personnelPlanning.mock";

interface PersonnelFilterBarProps {
	searchQuery: string;
	setSearchQuery: (val: string) => void;
	selectedStatus: string;
	setSelectedStatus: (val: string) => void;
	selectedAssignee: string;
	setSelectedAssignee: (val: string) => void;
	selectedProject: string;
	setSelectedProject: (val: string) => void;
	uniqueProjects?: { key: string; label: string }[];
	employeesList: { id: string; name: string; initials: string; avatarUrl?: string }[];
	onResetFilters: () => void;
}

const DEFAULT_PROJECT_ITEMS = MOCK_PERSONNEL_PROJECT_ITEMS;

export function PersonnelFilterBar({
	searchQuery,
	setSearchQuery,
	selectedStatus,
	setSelectedStatus,
	selectedAssignee,
	setSelectedAssignee,
	selectedProject: _selectedProject,
	setSelectedProject,
	employeesList,
	onResetFilters,
}: PersonnelFilterBarProps) {
	const t = useTranslate();
	const [projectSearch, setProjectSearch] = useState("");
	const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
	const [isProjectPopoverOpen, setIsProjectPopoverOpen] = useState(false);

	const handleToggleProject = (code: string) => {
		const updated = selectedProjects.includes(code)
			? selectedProjects.filter((p) => p !== code)
			: [...selectedProjects, code];
		setSelectedProjects(updated);
		if (updated.length > 0) {
			setSelectedProject(updated.join(","));
		} else {
			setSelectedProject("all");
		}
	};

	const handleClearProjectFilter = () => {
		setSelectedProjects([]);
		setSelectedProject("all");
		setProjectSearch("");
	};

	const handleResetAll = () => {
		setSelectedProjects([]);
		setProjectSearch("");
		onResetFilters();
	};

	const filteredProjectItems = DEFAULT_PROJECT_ITEMS.filter((item) => {
		if (!projectSearch.trim()) return true;
		const name = t(item.nameKey) || "";
		return (
			name.toLowerCase().includes(projectSearch.toLowerCase()) ||
			item.code.includes(projectSearch)
		);
	});

	return (
    <div className="flex flex-wrap items-center gap-2.5 w-full font-sans">
      {/* 1. Project Reusable Search Bar */}
      <div className="w-full sm:w-60 md:w-65 lg:w-75 h-9 flex items-center">
        <Search
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={localizationConstants.search}
          className="h-9 text-xs"
          wrapperClassName="w-full h-[36px]"
        />
      </div>

      {/* 2. Standard Filter Button (Filter ˅) */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="h-9 px-3 bg-white border-slate-200 rounded-md font-sans font-medium text-xs leading-5 tracking-normal text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap shadow-2xs flex items-center gap-1.5"
          >
            <span>
              <Translate text={localizationConstants.filter} />
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="w-48 bg-white border border-slate-200 rounded-lg shadow-xl p-1 font-sans"
        >
          <DropdownMenuItem
            onClick={() => setSelectedStatus("all")}
            className={`text-xs cursor-pointer px-2.5 py-1.5 rounded ${selectedStatus === "all" ? "bg-slate-100 font-semibold text-slate-900" : "text-slate-700"}`}
          >
            <Translate text={localizationConstants.filterAllCategories} />
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setSelectedStatus("completed")}
            className={`text-xs cursor-pointer px-2.5 py-1.5 rounded ${selectedStatus === "completed" ? "bg-slate-100 font-semibold text-slate-900" : "text-slate-700"}`}
          >
            <Translate text={localizationConstants.planningCompleted} />
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setSelectedStatus("in_progress")}
            className={`text-xs cursor-pointer px-2.5 py-1.5 rounded ${selectedStatus === "in_progress" ? "bg-slate-100 font-semibold text-slate-900" : "text-slate-700"}`}
          >
            <Translate text={localizationConstants.planningInProgress} />
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setSelectedStatus("not_started")}
            className={`text-xs cursor-pointer px-2.5 py-1.5 rounded ${selectedStatus === "not_started" ? "bg-slate-100 font-semibold text-slate-900" : "text-slate-700"}`}
          >
            <Translate text={localizationConstants.planningNotStarted} />
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setSelectedStatus("waiting")}
            className={`text-xs cursor-pointer px-2.5 py-1.5 rounded ${selectedStatus === "waiting" ? "bg-slate-100 font-semibold text-slate-900" : "text-slate-700"}`}
          >
            <Translate text={localizationConstants.planningWaiting} />
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setSelectedStatus("cancelled")}
            className={`text-xs cursor-pointer px-2.5 py-1.5 rounded ${selectedStatus === "cancelled" ? "bg-slate-100 font-semibold text-slate-900" : "text-slate-700"}`}
          >
            <Translate text={localizationConstants.planningCancelled} />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="h-5 w-px bg-slate-200 hidden sm:block" />

      {/* 3. Assignee Filter Button (⊕ Assignee | Label 1 | Label 2) */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="h-9 flex items-center border-dashed border-slate-200/90 rounded-lg px-2.5 bg-white gap-2 shadow-2xs font-normal hover:bg-slate-50 text-slate-800 font-sans"
          >
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
              <CirclePlus className="w-4 h-4 text-slate-700 stroke-[1.75]" />
              <Translate text={localizationConstants.planningAssignee} />
            </span>
            <div className="w-px h-4 bg-slate-200" />
            {selectedAssignee !== "all" ? (
              <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs font-medium rounded whitespace-nowrap">
                {employeesList.find((e) => e.id === selectedAssignee)?.name ||
                  selectedAssignee}
              </span>
            ) : (
              <>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs font-medium rounded whitespace-nowrap">
                  <Translate text={localizationConstants.filterLabel1} />
                </span>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs font-medium rounded whitespace-nowrap">
                  <Translate text={localizationConstants.filterLabel2} />
                </span>
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => setSelectedAssignee("all")}>
            <Translate text={localizationConstants.filterAllCategories} />
          </DropdownMenuItem>
          {employeesList.map((emp) => (
            <DropdownMenuItem
              key={emp.id}
              onClick={() => setSelectedAssignee(emp.id)}
              className={
                selectedAssignee === emp.id
                  ? "bg-slate-100 font-semibold text-slate-900"
                  : ""
              }
            >
              {emp.name} ({emp.initials})
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 4. Projekt namn Popover Menu (⊕ Projekt namn | Label 1) */}
      <Popover
        open={isProjectPopoverOpen}
        onOpenChange={setIsProjectPopoverOpen}
      >
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="h-9 flex items-center border-dashed border-slate-200/90 rounded-lg px-2.5 bg-white gap-2 shadow-2xs font-normal hover:bg-slate-50 text-slate-800 font-sans"
          >
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
              <CirclePlus className="w-4 h-4 text-slate-700 stroke-[1.75]" />
              <Translate text={localizationConstants.projektNamn} />
            </span>
            <div className="w-px h-4 bg-slate-200" />
            {selectedProjects.length > 0 ? (
              selectedProjects.map((pCode) => (
                <span
                  key={pCode}
                  className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs font-medium rounded whitespace-nowrap"
                >
                  {pCode}
                </span>
              ))
            ) : (
              <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs font-medium rounded whitespace-nowrap">
                <Translate text={localizationConstants.filterLabel1} />
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          side="bottom"
          sideOffset={4}
          className="w-50 min-w-50 max-w-50 h-auto max-h-85 p-0 rounded-md border border-slate-200 bg-white shadow-xl z-50 font-sans flex flex-col overflow-hidden"
        >
          {/* Search input inside Popover */}
          <div className="w-full h-10 px-3 py-2.5 border-b border-slate-200 flex items-center gap-2 rounded-none shrink-0">
            <SearchIcon className="w-4 h-4 stroke-[1.2] text-zinc-500 shrink-0" />
            <input
              type="text"
              value={projectSearch}
              onChange={(e) => setProjectSearch(e.target.value)}
              placeholder={
                t(localizationConstants.searchProjectName) || "Projekt Namn"
              }
              className="w-full h-full font-sans font-normal text-sm leading-5 tracking-normal bg-transparent border-0 focus:outline-none focus:ring-0 text-zinc-900 placeholder:text-zinc-500 placeholder:font-sans placeholder:font-normal placeholder:text-sm placeholder:leading-5 placeholder:tracking-normal p-0"
            />
          </div>

          {/* Checkbox item list */}
          <div className="space-y-1 max-h-48 overflow-y-auto p-2">
            {filteredProjectItems.map((proj) => {
              const isChecked = selectedProjects.includes(proj.code);
              return (
                <div
                  key={proj.id}
                  onClick={() => handleToggleProject(proj.code)}
                  className="w-full flex items-center justify-between px-2 py-1.5 rounded hover:bg-slate-50 cursor-pointer select-none transition-colors text-left"
                >
                  <div className="flex items-center gap-2.5 min-w-0 pointer-events-none">
                    <Checkbox
                      checked={isChecked}
                      className="h-4 w-4 rounded border-slate-300 data-[state=checked]:bg-slate-900 data-[state=checked]:border-slate-900"
                    />
                    <span className="text-zinc-900 font-sans font-normal text-sm leading-5 tracking-normal truncate">
                      <Translate text={proj.nameKey} />
                    </span>
                  </div>
                  <span className="text-zinc-500 font-sans font-normal text-xs leading-4 tracking-normal shrink-0 ml-2">
                    {proj.code}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Clear filters button */}
          <div className="w-full h-10 px-3 py-2.5 border-t border-slate-200 flex items-center justify-center rounded-none shrink-0 text-center">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClearProjectFilter}
              className="w-full h-full font-sans font-normal text-sm leading-5 tracking-normal text-zinc-900 hover:text-black cursor-pointer transition-colors flex items-center justify-center rounded-none"
            >
              <Translate text={localizationConstants.clearFilters} />
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* 5. Status Filter Button (⊕ Status) */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="h-9 px-3 flex items-center gap-1.5 border-dashed border-slate-200/90 rounded-lg text-xs font-semibold text-slate-800 bg-white hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap shadow-2xs font-sans"
          >
            <CirclePlus className="w-4 h-4 text-slate-700 stroke-[1.75]" />
            <Translate text={localizationConstants.status} />
            {selectedStatus !== "all" && (
              <span className="ml-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs font-medium text-slate-700">
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
          </Button>
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

      {/* 6. Reset Button */}
      <Button
        type="button"
        variant="ghost"
        onClick={handleResetAll}
        className="h-9 px-2 flex items-center gap-1 text-xs font-semibold text-slate-800 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer whitespace-nowrap"
      >
        <Translate text={localizationConstants.resetFilter} />
        <X className="w-3.5 h-3.5 stroke-2" />
      </Button>
    </div>
  );
}

export default PersonnelFilterBar;
