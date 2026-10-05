"use client";

import { Calendar, Table, Check, X, ChevronDown, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { WorktimeViewMode, WorktimeSubModule, WorktimeStatus } from "@/features/personnel/types/worktime.types";
import { cn } from "@/lib/utils";

interface WorktimeHeaderToolbarProps {
	employeeName: string;
	employeeId: string;
	weekNumber: number;
	year: number;
	dateRange: string;
	status: WorktimeStatus;
	viewMode: WorktimeViewMode;
	subModule: WorktimeSubModule;
	onToggleView: (mode: WorktimeViewMode) => void;
	onSelectSubModule: (subModule: WorktimeSubModule) => void;
	onApprove: () => void;
	onReturn: () => void;
	onPrevWeek?: () => void;
	onNextWeek?: () => void;
	onResetWeek?: () => void;
}

export function WorktimeHeaderToolbar({
	employeeName,
	employeeId,
	weekNumber,
	year,
	dateRange,
	status,
	viewMode,
	subModule,
	onToggleView,
	onSelectSubModule,
	onApprove,
	onReturn,
	onPrevWeek,
	onNextWeek,
	onResetWeek,
}: WorktimeHeaderToolbarProps) {
	return (
		<div className="space-y-4">
			{/* Top Bar: Dropdown Selector & Segmented View Toggle */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
				{/* Sub-view dropdown selector */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="outline"
							size="sm"
							className="h-9 px-3.5 border-slate-200 bg-white font-semibold text-slate-900 shadow-2xs gap-2 cursor-pointer hover:bg-slate-50"
						>
							{subModule === "worktime" ? (
								<>
									<Clock className="w-4 h-4 text-sky-600" />
									<Translate text={localizationConstants.worktimeDropdownArbetstid} />
								</>
							) : (
								<>
									<Table className="w-4 h-4 text-indigo-600" />
									<Translate text={localizationConstants.worktimeDropdownTimesheet} />
								</>
							)}
							<ChevronDown className="w-4 h-4 text-slate-400 ml-1" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start" className="w-48">
						<DropdownMenuItem
							onClick={() => onSelectSubModule("worktime")}
							className={cn(
								"flex items-center gap-2 text-xs cursor-pointer",
								subModule === "worktime" ? "font-semibold text-slate-900 bg-slate-50" : "text-slate-600"
							)}
						>
							<Clock className="w-4 h-4 text-sky-600" />
							<Translate text={localizationConstants.worktimeDropdownArbetstid} />
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => onSelectSubModule("timesheet")}
							className={cn(
								"flex items-center gap-2 text-xs cursor-pointer",
								subModule === "timesheet" ? "font-semibold text-slate-900 bg-slate-50" : "text-slate-600"
							)}
						>
							<Table className="w-4 h-4 text-indigo-600" />
							<Translate text={localizationConstants.worktimeDropdownTimesheet} />
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>

				{/* Segmented Calendar / Table Toggle */}
				<div className="inline-flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
					<button
						type="button"
						onClick={() => onToggleView("calendar")}
						className={cn(
							"flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-all",
							viewMode === "calendar"
								? "bg-white text-slate-900 shadow-2xs border border-slate-200/80 font-semibold"
								: "text-slate-600 hover:text-slate-900"
						)}
					>
						<Calendar className="w-3.5 h-3.5" />
						<Translate text={localizationConstants.worktimeViewCalendar} />
					</button>
					<button
						type="button"
						onClick={() => onToggleView("table")}
						className={cn(
							"flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-all",
							viewMode === "table"
								? "bg-white text-slate-900 shadow-2xs border border-slate-200/80 font-semibold"
								: "text-slate-600 hover:text-slate-900"
						)}
					>
						<Table className="w-3.5 h-3.5" />
						<Translate text={localizationConstants.worktimeViewTable} />
					</button>
				</div>
			</div>

			{/* Second Bar: Timesheet Info & Action Buttons */}
			<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
				<div className="space-y-1">
					<div className="flex items-center gap-2.5 flex-wrap">
						<h2 className="text-base sm:text-lg font-bold text-slate-900">
							{employeeName} - <Translate text={localizationConstants.worktimeWeeklyTimesheet} />
						</h2>
						{status === "submitted" && (
							<Badge className="bg-sky-100 text-sky-800 border-sky-200 hover:bg-sky-100 text-xs px-2.5 py-0.5">
								<Translate text={localizationConstants.worktimeStatusSubmitted} />
							</Badge>
						)}
						{status === "approved" && (
							<Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100 text-xs px-2.5 py-0.5">
								<Translate text={localizationConstants.worktimeStatusApproved} />
							</Badge>
						)}
						{status === "returned" && (
							<Badge className="bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-100 text-xs px-2.5 py-0.5">
								<Translate text={localizationConstants.worktimeStatusReturned} />
							</Badge>
						)}
					</div>
					<p className="text-xs text-slate-500">
						{employeeId} • <Translate text={localizationConstants.worktimeWeekPrefix} /> {weekNumber}, {year} ({dateRange})
					</p>
				</div>

				<div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
					{/* Week Selector / Date Picker Pill & Stepper */}
					<div className="inline-flex items-center gap-1">
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={onResetWeek}
							className="h-9 px-3 text-xs border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 font-medium cursor-pointer"
						>
							<Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
							<Translate text={localizationConstants.worktimeBtnThisWeek} />
						</Button>
						<div className="inline-flex items-center rounded-lg border border-slate-200 bg-white">
							<Button
								type="button"
								variant="ghost"
								size="icon"
								onClick={onPrevWeek}
								className="h-9 w-8 text-slate-500 hover:text-slate-900 cursor-pointer"
							>
								<ChevronLeft className="w-3.5 h-3.5" />
							</Button>
							<Button
								type="button"
								variant="ghost"
								size="icon"
								onClick={onNextWeek}
								className="h-9 w-8 text-slate-500 hover:text-slate-900 cursor-pointer"
							>
								<ChevronRight className="w-3.5 h-3.5" />
							</Button>
						</div>
					</div>

					{/* Return / Reject Action Button */}
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={onReturn}
						disabled={status === "returned"}
						className="h-9 px-3.5 text-xs border-slate-300 text-slate-700 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 font-medium cursor-pointer"
					>
						<X className="w-3.5 h-3.5 mr-1 text-slate-500" />
						<Translate text={localizationConstants.worktimeBtnReturn} />
					</Button>

					{/* Approve Action Button */}
					<Button
						type="button"
						size="sm"
						onClick={onApprove}
						disabled={status === "approved"}
						className="h-9 px-4 text-xs bg-[#107c41] hover:bg-[#0e6b37] text-white font-medium shadow-2xs cursor-pointer"
					>
						<Check className="w-3.5 h-3.5 mr-1 text-white" />
						<Translate text={localizationConstants.worktimeBtnApprove} />
					</Button>
				</div>
			</div>
		</div>
	);
}
