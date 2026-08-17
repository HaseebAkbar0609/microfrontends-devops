"use client";

import { useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	Plus,
	CirclePlus,
	X,
	Calendar as CalendarIcon,
	Info,
	Trash2,
	Pencil,
} from "lucide-react";
import { Search } from "@/components/search/Search";
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from "@/components/ui/popover";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { usePlanning } from "../hooks/usePlanning";
import {
	MOCK_LEFT_ORDERS,
	MOCK_ORDER_PLANNING_ITEMS,
} from "../data/planning.mock";
import type {
	OrderPlanningCardItem,
	PlanningAssignee,
} from "../types/planning.types";

const HOUR_HEIGHT = 100;
const MIN_HOUR = 7;

function getWeekNumber(date: Date): number {
	const d = new Date(date);
	d.setHours(0, 0, 0, 0);
	d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
	const week1 = new Date(d.getFullYear(), 0, 4);
	return 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
}

function getDayNameKey(dayOfWeek: number): string {
	const keys = [
		localizationConstants.sunday,
		localizationConstants.monday,
		localizationConstants.tuesday,
		localizationConstants.wednesday,
		localizationConstants.thursday,
		localizationConstants.friday,
		localizationConstants.saturday,
	];
	return keys[dayOfWeek % 7];
}

const AVAILABLE_USERS: PlanningAssignee[] = [
	{
		id: "u-anders",
		name: "Anders Larsson",
		initials: "AB",
		hours: 8,
	},
	{
		id: "u-eva",
		name: "Eva Mendes",
		initials: "EM",
		avatarUrl:
			"https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&auto=format&fit=crop&q=80",
		hours: 6,
	},
	{
		id: "u-goran",
		name: "Göran Andersson",
		initials: "GA",
		hours: 5,
	},
	{
		id: "u-sara",
		name: "Sara Nilsson",
		initials: "SN",
		hours: 4,
	},
	{
		id: "u-karl",
		name: "Karl Johansson",
		initials: "KJ",
		hours: 4,
	},
	{
		id: "u-maria",
		name: "Maria Lind",
		initials: "ML",
		hours: 4,
	},
];

function TaskDetailCard({
	card,
	onClose,
	onDelete,
	onAddAssignee,
}: {
	card: OrderPlanningCardItem;
	onClose: () => void;
	onDelete: (id: string) => void;
	onAddAssignee: (user: (typeof AVAILABLE_USERS)[0]) => void;
}) {
	const t = useTranslate();
	const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

	const getStatusLabelKey = (status: string) => {
		switch (status) {
			case "in_progress":
				return localizationConstants.planningInProgress;
			case "waiting":
				return localizationConstants.planningWaiting;
			case "cancelled":
				return localizationConstants.planningCancelled;
			case "completed":
				return localizationConstants.planningCompleted;
			case "due":
				return localizationConstants.planningDue;
			default:
				return localizationConstants.planningNotStarted;
		}
	};

	return (
		<div className="relative bg-white rounded-lg shadow-2xl border border-slate-200/90 w-[calc(100vw-32px)] max-w-[390px] sm:max-w-[420px] max-h-[85vh] overflow-y-auto flex flex-col p-5 sm:p-6 animate-in fade-in zoom-in-95 duration-150 font-sans">
			{/* Left Color Bar - Flat / No Rounded Border */}
			<div
				className="absolute left-0 top-6 w-1.5 h-8 rounded-none border-0"
				style={{ backgroundColor: card.color }}
			/>

			{/* Header */}
			<div className="flex items-center justify-between pl-2">
				<h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate pr-2">
					{card.orderName}
				</h3>
				<div className="flex items-center gap-2.5 text-slate-700 shrink-0">
					<button
						type="button"
						onClick={() => onDelete(card.id)}
						className="p-1 hover:text-rose-600 transition-colors cursor-pointer"
						title={t(localizationConstants.actionDelete)}
					>
						<Trash2 className="w-4 h-4 stroke-[1.75]" />
					</button>
					<button
						type="button"
						className="p-1 hover:text-slate-900 transition-colors cursor-pointer"
						title={t(localizationConstants.actionEdit)}
					>
						<Pencil className="w-4 h-4 stroke-[1.75]" />
					</button>
					<button
						type="button"
						onClick={onClose}
						className="p-1 hover:text-slate-900 transition-colors cursor-pointer"
						title={t(localizationConstants.actionClose)}
					>
						<X className="w-4 h-4 stroke-[1.75]" />
					</button>
				</div>
			</div>

			{/* Status Pill - No Border */}
			<div className="mt-3.5 mb-2 pl-2">
				<span
					className="px-3 py-0.5 rounded-md text-xs font-semibold inline-block border-0 shadow-2xs"
					style={{
						backgroundColor: `${card.color}15`,
						color: card.color,
					}}
				>
					<Translate text={getStatusLabelKey(card.status)} />
				</span>
			</div>

			{/* Date & Time Info */}
			<div className="space-y-1 pl-2 text-xs text-slate-500 font-normal leading-relaxed">
				<div>
					{card.timeRange} ({card.totalHours}{" "}
					<Translate text={localizationConstants.hoursAbbr} />)
				</div>
				<div>{card.dayDate}</div>
			</div>

			{/* Divider */}
			<div className="w-full h-px bg-slate-100 mt-4 mb-3.5" />

			{/* Assignee Section */}
			<div className="space-y-3.5">
				<h4 className="text-xs sm:text-sm font-bold text-slate-900">
					<Translate text={localizationConstants.planningAssignee} />
				</h4>

				{/* User Selection Dropdown with Profile & Name */}
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
							{AVAILABLE_USERS.map((user) => (
								<button
									key={user.id}
									type="button"
									onClick={() => {
										onAddAssignee(user);
										setIsUserDropdownOpen(false);
									}}
									className="w-full flex items-center justify-between px-3 py-2 hover:bg-slate-50 text-left transition-colors cursor-pointer group"
								>
									<div className="flex items-center gap-2.5 min-w-0">
										{user.avatarUrl ? (
											<div className="w-6 h-6 rounded-full overflow-hidden shrink-0 border border-slate-100 shadow-2xs">
												<img
													src={user.avatarUrl}
													alt={user.name}
													className="w-full h-full object-cover"
												/>
											</div>
										) : (
											<div className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-semibold text-[10px] flex items-center justify-center shrink-0">
												{user.initials}
											</div>
										)}
										<span className="text-xs font-medium text-slate-800 group-hover:text-slate-900 truncate">
											{user.name}
										</span>
									</div>
									<span className="text-[11px] text-slate-400 font-normal shrink-0">
										{user.hours}{" "}
										<Translate text={localizationConstants.hoursAbbr} />
									</span>
								</button>
							))}
						</div>
					)}
				</div>

				{/* Assignees List */}
				<div className="space-y-3.5 pt-1 max-h-48 sm:max-h-56 overflow-y-auto pr-1">
					{card.assignees.map((user, idx) => (
						<div
							key={`${user.id}-${idx}`}
							className="flex items-center justify-between"
						>
							<div className="flex items-center gap-3 min-w-0">
								{user.avatarUrl ? (
									<div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-slate-100 shadow-2xs">
										<img
											src={user.avatarUrl}
											alt={user.name}
											className="w-full h-full object-cover"
										/>
									</div>
								) : (
									<div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-semibold text-xs flex items-center justify-center shrink-0">
										{user.initials}
									</div>
								)}
								<span className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
									{user.name}
								</span>
							</div>

							<span className="text-xs text-slate-500 font-normal shrink-0">
								{user.hours}{" "}
								<Translate text={localizationConstants.hoursAbbr} />
							</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export function PlanningOrderTab() {
	const { i18n } = useTranslation();
	const t = useTranslate();
	const {
		startDate,
		navigateWeek,
		removeTask,
		addAssignee,
	} = usePlanning();

	// Local state
	const [searchQuery, setSearchQuery] = useState("");
	const [showDetails, setShowDetails] = useState(true);
	const [selectedOrderNumber, setSelectedOrderNumber] = useState<string | null>(null);
	const [selectedCard, setSelectedCard] = useState<OrderPlanningCardItem | null>(null);
	const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
	const [statusFilter, setStatusFilter] = useState<string>("all");

	// Working card items state
	const [items, setItems] = useState<OrderPlanningCardItem[]>(MOCK_ORDER_PLANNING_ITEMS);

	// Calculate current week dates
	const currentWeekDates = useMemo(() => {
		const start = new Date(startDate);
		const langCode = i18n.language === "sv" ? "sv-SE" : "en-US";
		const monthName = start.toLocaleString(langCode, { month: "short" });
		const year = start.getFullYear();
		const weekNum = getWeekNumber(start);
		return {
			monthName: monthName.charAt(0).toUpperCase() + monthName.slice(1),
			year,
			weekNum,
		};
	}, [startDate, i18n.language]);

	// Generate days for the current view (3 days)
	const days = useMemo(() => {
		const start = new Date(startDate);
		const defaultHours = [40, 38, 32];
		const result = [];
		for (let i = 0; i < 3; i++) {
			const day = new Date(start);
			day.setDate(start.getDate() + i);
			result.push({
				dateNumber: day.getDate(),
				dayNameKey: getDayNameKey(day.getDay()),
				totalHours: defaultHours[i % 3],
			});
		}
		return result;
	}, [startDate]);

	// Time Slots (7 AM to 12 PM)
	const timeSlots = [
		{ label: "7 AM", hour: 7 },
		{ label: "8 AM", hour: 8 },
		{ label: "9 AM", hour: 9 },
		{ label: "10 AM", hour: 10 },
		{ label: "11 AM", hour: 11 },
		{ label: "12 PM", hour: 12 },
	];

	// Filter items by search, status filter & order selection
	const filteredItems = useMemo(() => {
		let result = items;
		if (selectedOrderNumber) {
			result = result.filter((item) => item.orderNumber === selectedOrderNumber);
		}
		if (statusFilter !== "all") {
			result = result.filter((item) => item.status === statusFilter);
		}
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			result = result.filter(
				(item) =>
					item.orderName.toLowerCase().includes(query) ||
					item.orderNumber.toLowerCase().includes(query)
			);
		}
		return result;
	}, [items, searchQuery, selectedOrderNumber, statusFilter]);

	// Handlers
	const handleSelectAssignee = useCallback(
		async (user: (typeof AVAILABLE_USERS)[0]) => {
			if (!selectedCard) return;

			const newAssignee: PlanningAssignee = {
				id: `user-${Date.now()}`,
				name: user.name,
				initials: user.initials,
				avatarUrl: user.avatarUrl,
				hours: user.hours || 4,
			};

			try {
				await addAssignee(selectedCard.id, newAssignee);
				const updatedAssigneeList = [...selectedCard.assignees, newAssignee];

				setSelectedCard((prev) =>
					prev ? { ...prev, assignees: updatedAssigneeList } : null
				);

				setItems((prevItems) =>
					prevItems.map((item) =>
						item.id === selectedCard.id
							? { ...item, assignees: updatedAssigneeList }
							: item
					)
				);
			} catch (err) {
				console.error("Failed to add assignee:", err);
			}
		},
		[selectedCard, addAssignee]
	);

	const handleDeleteCard = useCallback(async (cardId: string) => {
		try {
			await removeTask(cardId);
			setItems((prevItems) => prevItems.filter((item) => item.id !== cardId));
			setSelectedCard(null);
		} catch (err) {
			console.error("Failed to delete task:", err);
		}
	}, [removeTask]);

	const getStatusLabelKey = (status: string) => {
		switch (status) {
			case "in_progress":
				return localizationConstants.planningInProgress;
			case "waiting":
				return localizationConstants.planningWaiting;
			case "cancelled":
				return localizationConstants.planningCancelled;
			case "completed":
				return localizationConstants.planningCompleted;
			case "due":
				return localizationConstants.planningDue;
			default:
				return localizationConstants.planningNotStarted;
		}
	};

	return (
		<div className="flex flex-col w-full bg-white font-sans space-y-4">
			{/* 1. TOP TOOLBAR & FILTER SECTION */}
			<div className="flex flex-wrap items-center gap-2 sm:gap-3">
				{/* Search Bar */}
				<Search
					value={searchQuery}
					onChange={setSearchQuery}
					placeholder={t(localizationConstants.planningSearchPlaceholder)}
					className="w-full sm:w-56 md:w-64"
				/>

				{/* Filter Dropdown */}
				<div className="relative">
					<button
						type="button"
						onClick={() => setIsFilterDropdownOpen((prev) => !prev)}
						className="h-9 px-3 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 flex items-center gap-1.5 hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap shadow-2xs"
					>
						<Translate text={localizationConstants.planningFilter} />
						<ChevronDown
							className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-150 ${
								isFilterDropdownOpen ? "rotate-180" : ""
							}`}
						/>
					</button>

					{isFilterDropdownOpen && (
						<div className="absolute z-30 top-full left-0 mt-1.5 w-48 bg-white border border-slate-200 rounded-lg shadow-xl py-1 divide-y divide-slate-100 animate-in fade-in-50 zoom-in-95 duration-100">
							<div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
								<Translate text={localizationConstants.filterStatus} />
							</div>
							<div className="py-1">
								{[
									{ id: "all", labelKey: localizationConstants.allWork },
									{ id: "in_progress", labelKey: localizationConstants.planningInProgress },
									{ id: "waiting", labelKey: localizationConstants.planningWaiting },
									{ id: "completed", labelKey: localizationConstants.planningCompleted },
									{ id: "cancelled", labelKey: localizationConstants.planningCancelled },
									{ id: "due", labelKey: localizationConstants.planningDue },
								].map((opt) => (
									<button
										key={opt.id}
										type="button"
										onClick={() => {
											setStatusFilter(opt.id);
											setIsFilterDropdownOpen(false);
										}}
										className={`w-full flex items-center justify-between px-3 py-1.5 text-xs text-left transition-colors cursor-pointer hover:bg-slate-50 ${
											statusFilter === opt.id
												? "font-semibold text-slate-900 bg-slate-50/80"
												: "font-normal text-slate-700"
										}`}
									>
										<span>
											<Translate text={opt.labelKey} />
										</span>
										{statusFilter === opt.id && (
											<span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
										)}
									</button>
								))}
							</div>
						</div>
					)}
				</div>

				{/* Divider */}
				<div className="w-px h-5 bg-slate-200 hidden sm:block" />

				{/* + Assignee | Label 1 | Label 2 */}
				<div className="flex items-center border border-dashed border-slate-200/90 rounded-lg px-2.5 py-1 bg-white gap-2 shadow-2xs">
					<button
						type="button"
						className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 hover:text-slate-900 transition-colors cursor-pointer whitespace-nowrap"
					>
						<CirclePlus className="w-4 h-4 text-slate-700 stroke-[1.75]" />
						<Translate text={localizationConstants.filterAssignee} />
					</button>
					<div className="w-px h-4 bg-slate-200" />
					<span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs font-medium rounded">
						<Translate text={localizationConstants.filterLabel1} />
					</span>
					<span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs font-medium rounded">
						<Translate text={localizationConstants.filterLabel2} />
					</span>
				</div>

				{/* + Project Nr */}
				<button
					type="button"
					className="h-9 px-3 flex items-center gap-1.5 border border-dashed border-slate-200/90 rounded-lg text-xs font-semibold text-slate-800 bg-white hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap shadow-2xs"
				>
					<CirclePlus className="w-4 h-4 text-slate-700 stroke-[1.75]" />
					<Translate text={localizationConstants.filterProjectNr} />
				</button>

				{/* + Status */}
				<button
					type="button"
					onClick={() => setIsFilterDropdownOpen((prev) => !prev)}
					className="h-9 px-3 flex items-center gap-1.5 border border-dashed border-slate-200/90 rounded-lg text-xs font-semibold text-slate-800 bg-white hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap shadow-2xs"
				>
					<CirclePlus className="w-4 h-4 text-slate-700 stroke-[1.75]" />
					<Translate text={localizationConstants.filterStatus} />
				</button>

				{/* Reset Button */}
				<button
					type="button"
					onClick={() => {
						setSearchQuery("");
						setSelectedOrderNumber(null);
						setStatusFilter("all");
					}}
					className="flex items-center gap-1 text-xs font-semibold text-slate-800 hover:text-slate-900 transition-colors cursor-pointer ml-auto sm:ml-2 whitespace-nowrap"
				>
					<Translate text={localizationConstants.resetFilter} />
					<X className="w-3.5 h-3.5 stroke-[2]" />
				</button>
			</div>

			{/* 2. SUB-HEADER CONTROLS */}
			<div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-4 py-1.5 sm:py-2 text-sm w-full">
				<div className="flex items-center gap-1.5 xs:gap-2.5 sm:gap-3 flex-wrap">
					<button
						type="button"
						className="font-bold text-slate-900 flex items-center gap-1 sm:gap-1.5 hover:text-slate-700 cursor-pointer text-xs xs:text-sm sm:text-base whitespace-nowrap"
					>
						{currentWeekDates.monthName} {currentWeekDates.year}
						<ChevronDown className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-slate-500" />
					</button>

					<span className="text-slate-300 text-xs sm:text-base font-medium">/</span>

					<div className="flex items-center gap-0.5 sm:gap-1 text-slate-500">
						<button
							type="button"
							onClick={() => navigateWeek("prev")}
							className="p-1 hover:bg-slate-100 rounded transition-colors cursor-pointer"
						>
							<ChevronLeft className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-slate-500" />
						</button>
						<span className="font-medium text-slate-500 flex items-center gap-1 sm:gap-1.5 px-1 text-xs sm:text-sm whitespace-nowrap">
							<CalendarIcon className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-slate-500" />
							W{currentWeekDates.weekNum}
						</span>
						<button
							type="button"
							onClick={() => navigateWeek("next")}
							className="p-1 hover:bg-slate-100 rounded transition-colors cursor-pointer"
						>
							<ChevronRight className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-slate-500" />
						</button>
					</div>
				</div>

				{/* Show Details Checkbox */}
				<label className="flex items-center gap-1.5 sm:gap-2 text-xs font-medium text-slate-800 cursor-pointer select-none whitespace-nowrap">
					<input
						type="checkbox"
						checked={showDetails}
						onChange={(e) => setShowDetails(e.target.checked)}
						className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 h-3.5 w-3.5 sm:h-4 sm:w-4 accent-slate-900 cursor-pointer"
					/>
					<Translate text={localizationConstants.showDetails} />
				</label>
			</div>

			{/* 3. MAIN TIMELINE SECTION */}
			<div className="w-full flex items-start overflow-x-auto overflow-y-hidden relative bg-white border border-slate-200 rounded-lg shadow-2xs">
				{/* LEFT PANEL (Orders list) */}
				<div className="w-44 xs:w-52 sm:w-60 md:w-64 flex-shrink-0 flex flex-col bg-white border-r border-slate-200">
					<div
						onClick={() => setSelectedOrderNumber(null)}
						className="p-2.5 sm:p-3 flex items-center justify-between h-14 bg-white border-b border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors"
					>
						<div className="flex items-center gap-2 min-w-0">
							<input
								type="radio"
								name="workScope"
								checked={selectedOrderNumber === null}
								onChange={() => setSelectedOrderNumber(null)}
								className="h-3.5 w-3.5 text-slate-900 border-slate-300 accent-slate-900 cursor-pointer flex-shrink-0"
							/>
							<span className="text-xs font-semibold text-slate-900 truncate">
								<Translate text={localizationConstants.allWork} />
							</span>
						</div>
					</div>

					<div className="flex flex-col divide-y divide-slate-100">
						{MOCK_LEFT_ORDERS.map((ord) => {
							const isSelected = selectedOrderNumber === ord.orderNumber;
							return (
								<div
									key={ord.id}
									onClick={() => setSelectedOrderNumber(isSelected ? null : ord.orderNumber)}
									className={`p-2.5 sm:p-3.5 flex flex-col justify-between cursor-pointer transition-all ${
										isSelected ? "bg-slate-50" : "hover:bg-slate-50/60"
									}`}
									style={{ height: `${HOUR_HEIGHT}px` }}
								>
									<div className="min-w-0">
										<div className="text-xs font-semibold text-slate-900 truncate">
											{ord.orderName}
										</div>
										<div className="text-[10px] sm:text-[11px] text-slate-500 font-normal mt-0.5 truncate">
											{ord.timeRange}
										</div>
									</div>
									{/* Stacked User Avatars & Interactive + Button */}
									<div className="flex items-center gap-1 sm:gap-1.5 mt-auto flex-wrap">
										<div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-600 text-white text-[9px] font-semibold flex items-center justify-center border-2 border-white overflow-hidden shadow-2xs flex-shrink-0">
											<img
												src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80"
												alt="Avatar"
												className="w-full h-full object-cover"
											/>
										</div>
										<div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-600 text-white text-[9px] font-semibold flex items-center justify-center border-2 border-white overflow-hidden shadow-2xs -ml-2 flex-shrink-0">
											<img
												src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&auto=format&fit=crop&q=80"
												alt="Avatar"
												className="w-full h-full object-cover"
											/>
										</div>
										<span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white border border-dotted border-slate-400 flex items-center justify-center flex-shrink-0 ml-1 cursor-pointer hover:bg-slate-50">
											<Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-500" />
										</span>
									</div>
								</div>
							);
						})}
					</div>
				</div>

				{/* TIME COLUMN */}
				<div className="w-12 sm:w-16 flex-shrink-0 flex flex-col bg-white border-r border-slate-200">
					<div className="h-14 flex items-center justify-center text-[10px] sm:text-[11px] font-medium text-slate-400 uppercase tracking-wider">
						<Translate text={localizationConstants.gmtLabel} />
					</div>
					<div className="flex flex-col relative">
						{timeSlots.map((slot) => (
							<div
								key={slot.hour}
								className="flex items-start justify-center pt-2 text-[10px] sm:text-[11px] font-medium text-slate-400"
								style={{ height: `${HOUR_HEIGHT}px` }}
							>
								{slot.label}
							</div>
						))}
					</div>
				</div>

				{/* MAIN CONTENT CANVAS */}
				<div className="flex-1 bg-white">
					<div className="flex flex-col min-w-[720px] sm:min-w-[900px] md:min-w-[1050px]">
						{/* Days Header */}
						<div className="flex border-b border-slate-200 bg-slate-50/80 h-14">
							{days.map((day, dIdx) => (
								<div
									key={dIdx}
									className="flex-1 min-w-[240px] sm:min-w-[300px] md:min-w-[350px] px-2.5 sm:px-3.5 py-2 border-r border-slate-200 last:border-r-0 flex items-center justify-between"
								>
									<div className="flex flex-col justify-center">
										<span className="text-lg sm:text-xl font-bold text-slate-900 leading-none">{day.dateNumber}</span>
										<span className="text-[10px] sm:text-[11px] font-normal text-slate-500 mt-1 leading-none">
											<Translate text={day.dayNameKey} />
										</span>
									</div>
									<div className="flex flex-col items-end justify-center gap-1">
										<Info className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-slate-400" />
										<span className="text-[10px] sm:text-[11px] font-normal text-slate-500 leading-none">
											{day.totalHours}{" "}
											<Translate text={localizationConstants.hoursAbbr} />
										</span>
									</div>
								</div>
							))}
						</div>

						{/* Time Canvas Grid */}
						<div className="flex relative flex-1">
							{[0, 1, 2].map((dayIdx) => (
								<div
									key={dayIdx}
									className="flex-1 min-w-[240px] sm:min-w-[300px] md:min-w-[350px] border-r border-slate-200 last:border-r-0 relative flex flex-col"
								>
									{timeSlots.map((slot) => (
										<div
											key={slot.hour}
											className="border-b border-slate-100 relative"
											style={{ height: `${HOUR_HEIGHT}px` }}
										/>
									))}

									{/* Task Cards with Popover */}
									{filteredItems
										.filter((item) => item.dayIndex === dayIdx)
										.map((card) => {
											const topPx = (card.startHour - MIN_HOUR) * HOUR_HEIGHT + 3;
											const durationHours = Math.max(0.85, card.endHour - card.startHour);
											const heightPx = showDetails
												? Math.max(140, durationHours * HOUR_HEIGHT - 6)
												: 34;

											const isMultiCol = (card.totalCols || 1) > 1;
											const leftStyle = isMultiCol
												? (card.colIndex || 0) === 0
													? "4px"
													: "calc(50% + 2px)"
												: "4px";
											const widthStyle = isMultiCol
												? "calc(50% - 6px)"
												: "calc(100% - 8px)";

											return (
												<Popover
													key={card.id}
													open={selectedCard?.id === card.id}
													onOpenChange={(open) => {
														if (open) {
															setSelectedCard(card);
														} else if (selectedCard?.id === card.id) {
															setSelectedCard(null);
														}
													}}
												>
													<PopoverTrigger asChild>
														{showDetails ? (
															<div
																className={`absolute z-10 p-2.5 sm:p-3 rounded-r-lg rounded-l-[2px] shadow-xs cursor-pointer transition-all hover:shadow-md flex flex-col justify-between border-l-[2.5px] ${card.bgClass}`}
																style={{
																	top: `${topPx}px`,
																	height: `${heightPx}px`,
																	left: leftStyle,
																	width: widthStyle,
																	borderLeftColor: card.color,
																}}
															>
																<div className="flex flex-col gap-0.5 sm:gap-1 min-w-0">
																	<div className="text-[11px] sm:text-xs font-semibold text-slate-900 leading-snug truncate">
																		{card.orderName}
																	</div>
																	<div className="text-[10px] sm:text-[11px] text-slate-600 font-normal leading-tight truncate">
																		{card.timeRange}
																	</div>
																	<div className="mt-0.5 sm:mt-1">
																		<span
																			className="px-1.5 sm:px-2 py-0.5 rounded-[4px] text-[8.5px] sm:text-[9.5px] font-semibold leading-none inline-block border bg-white/60 shadow-2xs truncate max-w-full"
																			style={{ borderColor: card.color, color: card.color }}
																		>
																			<Translate text={getStatusLabelKey(card.status)} />
																		</span>
																	</div>
																</div>

																<div className="mt-auto flex items-center pt-1 sm:pt-1.5 border-t border-black/5 flex-shrink-0">
																	{card.assignees.slice(0, 2).map((user, idx) => (
																		<div
																			key={user.id}
																			className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-800 text-white text-[8px] sm:text-[9px] font-semibold flex items-center justify-center overflow-hidden border-2 border-white flex-shrink-0"
																			style={{ marginLeft: idx > 0 ? "-4px" : "0" }}
																		>
																			{user.avatarUrl ? (
																				<img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
																			) : (
																				user.initials
																			)}
																		</div>
																	))}
																	{card.assignees.length > 2 && (
																		<span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-200 text-slate-600 text-[8px] sm:text-[9px] font-semibold flex items-center justify-center border-2 border-white flex-shrink-0 -ml-1">
																			+{card.assignees.length - 2}
																		</span>
																	)}
																	<span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white border border-dotted border-slate-400 flex items-center justify-center flex-shrink-0 ml-1.5 sm:ml-2 cursor-pointer hover:bg-slate-50">
																		<Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-500" />
																	</span>
																</div>
															</div>
														) : (
															<div
																className="absolute z-10 rounded-r-lg rounded-l-[2px] shadow-2xs cursor-pointer transition-all hover:brightness-95 flex items-center gap-1.5 sm:gap-2 overflow-hidden px-2 sm:px-2.5 py-1 border-l-[2.5px]"
																style={{
																	top: `${topPx}px`,
																	height: `${heightPx}px`,
																	left: leftStyle,
																	width: widthStyle,
																	backgroundColor: `${card.color}15`,
																	borderLeftColor: card.color,
																}}
															>
																<div className="text-[11px] sm:text-xs font-semibold text-slate-900 truncate min-w-0">
																	{card.orderName}
																</div>
															</div>
														)}
													</PopoverTrigger>
													<PopoverContent
														side="bottom"
														align="start"
														sideOffset={6}
														className="w-auto p-0 border-0 bg-transparent shadow-none z-50"
													>
														<TaskDetailCard
															card={card}
															onClose={() => setSelectedCard(null)}
															onDelete={handleDeleteCard}
															onAddAssignee={handleSelectAssignee}
														/>
													</PopoverContent>
												</Popover>
											);
										})}
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default PlanningOrderTab;
