"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowUpDown, ChevronDown } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Search } from "@/components/search/Search";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { PlanningResource } from "../../types/planning.types";
import { MOCK_PERSONNEL_TOP_ASSIGNED_ALL } from "../../data/personnelPlanning.mock";

interface PersonnelDetailsDrawerProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	employees?: PlanningResource[] | { id: string; name: string; initials: string; hours: number; percentage: number; avatarUrl?: string }[];
}

export function PersonnelDetailsDrawer({
	isOpen,
	onOpenChange,
	employees,
}: PersonnelDetailsDrawerProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [sortField, setSortField] = useState<"name" | "hours">("name");
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
	const [selectedFilter, setSelectedFilter] = useState<string>("all");

	const rawList = useMemo(() => {
		const source = (employees && employees.length > 0)
			? employees
			: MOCK_PERSONNEL_TOP_ASSIGNED_ALL;

		return source.map((emp, index) => {
			const hours: number = "hours" in emp && typeof emp.hours === "number"
				? emp.hours
				: ("totalHours" in emp && typeof emp.totalHours === "number" ? emp.totalHours : 40);
			const percentage: number = "percentage" in emp && typeof emp.percentage === "number"
				? emp.percentage
				: 70;

			return {
				id: emp.id || `emp-det-${index}`,
				name: emp.name,
				initials: emp.initials || emp.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase(),
				hours,
				percentage,
				avatarUrl: emp.avatarUrl,
			};
		});
	}, [employees]);

	const handleToggleSort = (field: "name" | "hours") => {
		if (sortField === field) {
			setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
		} else {
			setSortField(field);
			setSortDirection("asc");
		}
	};

	const filteredAndSortedList = useMemo(() => {
		let result = [...rawList];

		// Filter by search query
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase().trim();
			result = result.filter((emp) => emp.name.toLowerCase().includes(query));
		}

		// Filter by dropdown filter
		if (selectedFilter === "high") {
			result = result.filter((emp) => emp.hours >= 30);
		} else if (selectedFilter === "low") {
			result = result.filter((emp) => emp.hours < 30);
		}

		// Sort
		result.sort((a, b) => {
			if (sortField === "name") {
				const comp = a.name.localeCompare(b.name, "sv");
				return sortDirection === "asc" ? comp : -comp;
			}
			const comp = a.hours - b.hours;
			return sortDirection === "asc" ? comp : -comp;
		});

		return result;
	}, [rawList, searchQuery, selectedFilter, sortField, sortDirection]);

	return (
		<Sheet open={isOpen} onOpenChange={onOpenChange}>
			<SheetContent
				side="right"
				className="w-full sm:max-w-[560px] lg:max-w-[693px] lg:w-[693px] h-full p-[24px_20px] flex flex-col gap-[4px] bg-white border-l border-slate-200 overflow-hidden font-sans focus:outline-none opacity-100"
			>
				{/* Top Header */}
				<div className="flex items-center gap-3 pb-3 border-b border-slate-100">
					<Button
						type="button"
						variant="ghost"
						size="icon"
						onClick={() => onOpenChange(false)}
						className="h-8 w-8 text-slate-900 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors cursor-pointer -ml-1 shrink-0"
						aria-label="Back"
					>
						<ArrowLeft className="w-5 h-5 stroke-[2]" />
					</Button>
					<SheetTitle className="font-sans font-semibold text-2xl leading-[100%] tracking-[-0.6px] text-slate-900 m-0 p-0">
						<Translate text={localizationConstants.visaDetaljer} />
					</SheetTitle>
				</div>

				{/* Search & Filter Bar */}
				<div className="pl-[36px] py-3 flex items-center justify-start gap-2.5">
					<div className="w-full max-w-[240px] sm:max-w-[280px] h-[36px] flex items-center">
						<Search
							value={searchQuery}
							onChange={setSearchQuery}
							placeholder={localizationConstants.search}
							className="h-[36px] text-xs"
							wrapperClassName="w-full h-[36px]"
						/>
					</div>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								type="button"
								variant="outline"
								className="h-[36px] px-3 bg-white border-slate-200 rounded-md font-sans font-medium text-xs leading-5 tracking-normal text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap shadow-2xs flex items-center gap-1.5"
							>
								<span>
									<Translate text={localizationConstants.filter} />
								</span>
								<ChevronDown className="w-3.5 h-3.5 text-slate-500" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start" className="w-44 bg-white border border-slate-200 rounded-lg shadow-xl p-1 font-sans z-[10000]">
							<DropdownMenuItem
								onClick={() => setSelectedFilter("all")}
								className={`text-xs cursor-pointer px-2.5 py-1.5 rounded ${selectedFilter === "all" ? "bg-slate-100 font-semibold text-slate-900" : "text-slate-700"}`}
							>
								<Translate text={localizationConstants.filterAllCategories} />
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => setSelectedFilter("high")}
								className={`text-xs cursor-pointer px-2.5 py-1.5 rounded ${selectedFilter === "high" ? "bg-slate-100 font-semibold text-slate-900" : "text-slate-700"}`}
							>
								<Translate text={localizationConstants.filterOver30Hours} />
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => setSelectedFilter("low")}
								className={`text-xs cursor-pointer px-2.5 py-1.5 rounded ${selectedFilter === "low" ? "bg-slate-100 font-semibold text-slate-900" : "text-slate-700"}`}
							>
								<Translate text={localizationConstants.filterUnder30Hours} />
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				{/* Table Column Headers */}
				<div className="pl-[36px] py-2.5 flex items-center justify-between gap-3 text-xs font-medium text-slate-500 border-b border-slate-100 bg-white">
					<div className="flex-1 min-w-0 flex items-center">
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={() => handleToggleSort("name")}
							className="h-auto p-0 hover:bg-transparent font-sans text-xs font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
						>
							<Translate text={localizationConstants.namnHeader} />
							<ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
						</Button>
					</div>

					<div className="w-[433px] max-w-full shrink-0 flex items-center">
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={() => handleToggleSort("hours")}
							className="h-auto p-0 hover:bg-transparent font-sans text-xs font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
						>
							<Translate text={localizationConstants.arbetstidHeader} />
							<ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
						</Button>
					</div>
				</div>

				{/* Scrollable Employee Rows */}
				<div className="flex-1 overflow-y-auto pl-[36px] py-3 space-y-4">
					{filteredAndSortedList.map((emp) => (
						<div key={emp.id} className="flex items-center justify-between gap-3">
							{/* Left Column: Avatar + Name */}
							<div className="flex items-center gap-2.5 min-w-0 flex-1">
								{emp.avatarUrl ? (
									<Image
										src={emp.avatarUrl}
										alt={emp.name}
										width={32}
										height={32}
										className="w-8 h-8 rounded-full object-cover shrink-0"
									/>
								) : (
									<div className="w-8 h-8 rounded-full bg-[#F4F4F5] text-slate-700 font-semibold text-xs flex items-center justify-center shrink-0">
										{emp.initials}
									</div>
								)}
								<p className="font-sans font-medium text-[14px] leading-[20px] tracking-normal text-slate-900 truncate">
									{emp.name}
								</p>
							</div>

							{/* Right Column: Arbetstid Outer Div (width: 433px, height: 40px, opacity: 1) */}
							<div className="w-[433px] h-[40px] max-w-full shrink-0 flex flex-col justify-between min-w-0 opacity-100">
								<div className="text-xs text-slate-600 font-medium leading-none">
									{emp.hours} <Translate text={localizationConstants.timmarSuffix} />
								</div>
								<div className="flex items-center gap-3 w-full">
									<div className="flex-1 h-[8px] rounded-[8px] bg-slate-200 overflow-hidden opacity-100">
										<div
											className="h-full rounded-[8px] bg-slate-900 transition-all duration-300"
											style={{ width: `${emp.percentage}%` }}
										/>
									</div>
									<span className="text-xs font-medium text-slate-500 w-9 text-right shrink-0">
										{emp.percentage}%
									</span>
								</div>
							</div>
						</div>
					))}

					{filteredAndSortedList.length === 0 && (
						<div className="py-12 text-center text-xs text-slate-400">
							<Translate text={localizationConstants.noDataFound} />
						</div>
					)}
				</div>
			</SheetContent>
		</Sheet>
	);
}

export default PersonnelDetailsDrawer;
