"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, PenLine, Trash2, X } from "lucide-react";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from "@/components/ui/popover";
import type {
	PersonnelScheduleItem,
	PlanningStatus,
	PlanningAssignee,
} from "../../types/planning.types";

interface PersonnelTaskPopoverProps {
	item: PersonnelScheduleItem;
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	onEdit: (item: PersonnelScheduleItem) => void;
	onDelete: (itemId: string) => void;
	onAddAssignee: (item: PersonnelScheduleItem, assignee: PlanningAssignee) => void;
	employeesList: { id: string; name: string; initials: string; avatarUrl?: string }[];
	children: React.ReactNode;
}

function getStatusLabelKey(status: PlanningStatus): string {
	switch (status) {
		case "completed":
			return localizationConstants.planningCompleted;
		case "in_progress":
			return localizationConstants.planningInProgress;
		case "not_started":
			return localizationConstants.planningNotStarted;
		case "waiting":
			return localizationConstants.planningWaiting;
		case "cancelled":
			return localizationConstants.planningCancelled;
		case "due":
			return localizationConstants.planningDue;
		default:
			return localizationConstants.planningNotStarted;
	}
}

function getStatusBadgeStyle(status: PlanningStatus) {
	switch (status) {
		case "completed":
			return {
				bg: "bg-[#E6F4EA]",
				text: "text-[#137333]",
				accent: "#16A34A",
			};
		case "in_progress":
			return {
				bg: "bg-[#E0F2FE]",
				text: "text-[#0369A1]",
				accent: "#2563EB",
			};
		default:
			return {
				bg: "bg-[#F3F4F6]",
				text: "text-[#374151]",
				accent: "#64748B",
			};
	}
}

export function PersonnelTaskPopover({
	item,
	isOpen,
	onOpenChange,
	onEdit,
	onDelete,
	onAddAssignee,
	employeesList,
	children,
}: PersonnelTaskPopoverProps) {
	const t = useTranslate();
	const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
	const badgeStyle = getStatusBadgeStyle(item.status);

	const handleSelectAssignee = (emp: { id: string; name: string; initials: string; avatarUrl?: string }) => {
		const newAssignee: PlanningAssignee = {
			id: emp.id,
			name: emp.name,
			initials: emp.initials,
			avatarUrl: emp.avatarUrl,
			hours: 8,
		};
		onAddAssignee(item, newAssignee);
		setIsUserDropdownOpen(false);
	};

	return (
		<Popover open={isOpen} onOpenChange={onOpenChange}>
			<PopoverTrigger asChild>{children}</PopoverTrigger>
			<PopoverContent
				side="bottom"
				align="start"
				sideOffset={6}
				className="w-auto p-0 border-0 bg-transparent shadow-none z-50"
			>
				<div className="relative bg-white rounded-lg shadow-2xl border border-slate-200/90 w-[calc(100vw-32px)] max-w-[380px] sm:max-w-[400px] max-h-[85vh] overflow-y-auto flex flex-col p-5 sm:p-6 animate-in fade-in zoom-in-95 duration-150 font-sans text-slate-900">
					{/* Left Accent Bar */}
					<div
						className="absolute left-0 top-6 w-1.5 h-8 rounded-none border-0"
						style={{ backgroundColor: badgeStyle.accent }}
					/>

					{/* Header */}
					<div className="flex items-center justify-between pl-2">
						<h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate pr-2">
							{item.title}
						</h3>
						<div className="flex items-center gap-2 text-slate-700 shrink-0">
							<button
								type="button"
								onClick={() => onDelete(item.id)}
								className="p-1 hover:text-rose-600 transition-colors cursor-pointer"
								title={t(localizationConstants.actionDelete) || "Delete"}
							>
								<Trash2 className="w-4 h-4 stroke-[1.75]" />
							</button>
							<button
								type="button"
								onClick={() => {
									onOpenChange(false);
									onEdit(item);
								}}
								className="p-1 hover:text-slate-900 transition-colors cursor-pointer"
								title={t(localizationConstants.actionEdit) || "Edit"}
							>
								<PenLine className="w-4 h-4 stroke-[1.75]" />
							</button>
							<button
								type="button"
								onClick={() => onOpenChange(false)}
								className="p-1 hover:text-slate-900 transition-colors cursor-pointer"
								title={t(localizationConstants.actionClose) || "Close"}
							>
								<X className="w-4 h-4 stroke-[1.75]" />
							</button>
						</div>
					</div>

					{/* Status Pill */}
					<div className="mt-3.5 mb-2 pl-2">
						<span
							className={`px-3 py-0.5 rounded-md text-xs font-semibold inline-block border-0 shadow-2xs ${badgeStyle.bg} ${badgeStyle.text}`}
						>
							<Translate text={getStatusLabelKey(item.status)} />
						</span>
					</div>

					{/* Date & Time Info */}
					<div className="space-y-1 pl-2 text-xs text-slate-500 font-normal leading-relaxed">
						<div>{item.timeRange || "08:00 - 16:00 (8 tim)"}</div>
						<div>{item.dateText || "Måndag 10 Dec, 2025"}</div>
					</div>

					{/* Divider */}
					<div className="w-full h-px bg-slate-100 mt-4 mb-3.5" />

					{/* Assignees Section */}
					<div className="space-y-3.5">
						<h4 className="text-xs sm:text-sm font-bold text-slate-900">
							<Translate text={localizationConstants.planningAssignee} />
						</h4>

						{/* User Selection Dropdown */}
						<div className="relative w-full">
							<button
								type="button"
								onClick={() => setIsUserDropdownOpen((prev) => !prev)}
								className="w-full h-9 px-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 flex items-center justify-between hover:bg-slate-50 focus:outline-none focus:ring-1 focus:ring-slate-300 transition-colors cursor-pointer"
							>
								<span className="text-slate-500 font-normal">
									<Translate text={localizationConstants.addUsers} />
								</span>
								<ChevronDown
									className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-150 ${
										isUserDropdownOpen ? "rotate-180" : ""
									}`}
								/>
							</button>

							{isUserDropdownOpen && (
								<div className="absolute z-30 top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden py-1 max-h-48 overflow-y-auto divide-y divide-slate-50 animate-in fade-in-50 zoom-in-95 duration-100">
									{employeesList.map((emp) => (
										<button
											key={emp.id}
											type="button"
											onClick={() => handleSelectAssignee(emp)}
											className="w-full flex items-center justify-between px-3 py-2 hover:bg-slate-50 text-left transition-colors cursor-pointer group"
										>
											<div className="flex items-center gap-2.5 min-w-0">
												{emp.avatarUrl ? (
													<Image
														src={emp.avatarUrl}
														alt={emp.name}
														width={24}
														height={24}
														className="w-6 h-6 rounded-full object-cover shrink-0 border border-slate-100 shadow-2xs"
													/>
												) : (
													<div className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-semibold text-[10px] flex items-center justify-center shrink-0">
														{emp.initials}
													</div>
												)}
												<span className="text-xs font-medium text-slate-800 group-hover:text-slate-900 truncate">
													{emp.name}
												</span>
											</div>
											<span className="text-[11px] text-slate-400 font-normal shrink-0">
												8 <Translate text={localizationConstants.timmarSuffix} />
											</span>
										</button>
									))}
								</div>
							)}
						</div>

						{/* Assignees List */}
						<div className="space-y-3 pt-1 max-h-48 overflow-y-auto pr-1">
							{item.assignees.map((user, idx) => (
								<div key={`${user.id}-${idx}`} className="flex items-center justify-between">
									<div className="flex items-center gap-3 min-w-0">
										{user.avatarUrl ? (
											<Image
												src={user.avatarUrl}
												alt={user.name}
												width={28}
												height={28}
												className="w-7 h-7 rounded-full object-cover shrink-0 border border-slate-100 shadow-2xs"
											/>
										) : (
											<div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 font-semibold text-xs flex items-center justify-center shrink-0">
												{user.initials}
											</div>
										)}
										<span className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
											{user.name}
										</span>
									</div>

									<span className="text-xs text-slate-500 font-normal shrink-0">
										{user.hours} <Translate text={localizationConstants.timmarSuffix} />
									</span>
								</div>
							))}
						</div>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}

export default PersonnelTaskPopover;
