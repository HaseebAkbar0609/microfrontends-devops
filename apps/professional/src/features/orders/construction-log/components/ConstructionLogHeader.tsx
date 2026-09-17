"use client";

import { useState, useMemo } from "react";
import {
	Calendar as CalendarIcon,
	ChevronDown,
	Printer,
	Plus,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Search } from "@/components/search/Search";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { CONSTRUCTION_LOG_CONSTANTS } from "../constants/constructionLog.constants";

interface ConstructionLogHeaderProps {
	projectName?: string;
	projectNo?: string;
	selectedDate: string;
	onDateChange: (date: string) => void;
	constructionDay?: string;
	address?: string;
	hideTitle?: boolean;
	searchQuery: string;
	onSearchChange: (value: string) => void;
	categoryFilter: string;
	onCategoryFilterChange: (category: string) => void;
	onOpenNewLogModal: () => void;
	onPrint: () => void;
}

export function ConstructionLogHeader({
	projectName = CONSTRUCTION_LOG_CONSTANTS.DEFAULT_PROJECT_NAME,
	projectNo = CONSTRUCTION_LOG_CONSTANTS.DEFAULT_ORDER_ID,
	selectedDate,
	onDateChange,
	constructionDay = CONSTRUCTION_LOG_CONSTANTS.DEFAULT_CONSTRUCTION_DAY,
	address = CONSTRUCTION_LOG_CONSTANTS.DEFAULT_ADDRESS,
	hideTitle = false,
	searchQuery,
	onSearchChange,
	categoryFilter,
	onCategoryFilterChange,
	onOpenNewLogModal,
	onPrint,
}: ConstructionLogHeaderProps) {
	const t = useTranslate();
	const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

	const parsedDate = useMemo(() => {
		if (!selectedDate) return new Date();
		const [y, m, d] = selectedDate.split("-").map(Number);
		return new Date(y, m - 1, d);
	}, [selectedDate]);

	const handleSelectDate = (date: Date | undefined) => {
		if (!date) return;
		const yyyy = date.getFullYear();
		const mm = String(date.getMonth() + 1).padStart(2, "0");
		const dd = String(date.getDate()).padStart(2, "0");
		onDateChange(`${yyyy}-${mm}-${dd}`);
		setIsDatePickerOpen(false);
	};

	return (
		<div className="flex flex-col gap-5">
			{/* Top Title */}
			{!hideTitle && (
				<div className="flex items-center gap-1.5 text-xl sm:text-2xl font-semibold text-slate-900">
					<span className="text-slate-500 font-normal">
						<Translate text={localizationConstants.order} /> {projectNo} /
					</span>
					<span className="text-slate-900 font-semibold">
						<Translate text={localizationConstants.orderDagbokTitle} />
					</span>
				</div>
			)}

			{/* Toolbar (Search + Filter + Print + + Ny dagbok) */}
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between print:hidden">
				<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
					<Search
						value={searchQuery}
						onChange={onSearchChange}
						placeholder={localizationConstants.search}
						className="h-10 w-full"
						wrapperClassName="w-full sm:w-[240px] md:w-[280px]"
					/>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
								className="h-10 w-full sm:w-auto min-w-[90px] rounded-lg border-slate-200 text-slate-700 font-normal bg-white hover:bg-slate-50 gap-1.5 px-3 text-xs shadow-none justify-between cursor-pointer"
						>
							<span>
								{categoryFilter === CONSTRUCTION_LOG_CONSTANTS.FILTER_ALL && (
									<Translate text={localizationConstants.filter} />
								)}
								{categoryFilter === CONSTRUCTION_LOG_CONSTANTS.FILTER_NORMAL && (
									<Translate text={localizationConstants.orderDagbokFilterNormal} />
								)}
								{categoryFilter === CONSTRUCTION_LOG_CONSTANTS.FILTER_DEVIATION && (
									<Translate text={localizationConstants.orderDagbokCardDeviations} />
								)}
							</span>
							<ChevronDown className="h-3.5 w-3.5 text-slate-500 shrink-0" />
						</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align="start"
							className="w-44 border border-slate-200 bg-white shadow-md rounded-lg p-1 z-30"
						>
							<DropdownMenuItem
								onClick={() => onCategoryFilterChange(CONSTRUCTION_LOG_CONSTANTS.FILTER_ALL)}
								className="cursor-pointer text-xs text-slate-700 focus:bg-slate-100 focus:text-slate-900"
							>
								<Translate text={localizationConstants.filter} /> ({CONSTRUCTION_LOG_CONSTANTS.FILTER_ALL})
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => onCategoryFilterChange(CONSTRUCTION_LOG_CONSTANTS.FILTER_NORMAL)}
								className="cursor-pointer text-xs text-slate-700 focus:bg-slate-100 focus:text-slate-900"
							>
								<Translate text={localizationConstants.orderDagbokFilterNormal} />
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => onCategoryFilterChange(CONSTRUCTION_LOG_CONSTANTS.FILTER_DEVIATION)}
								className="cursor-pointer text-xs text-slate-700 focus:bg-slate-100 focus:text-slate-900"
							>
								<Translate text={localizationConstants.orderDagbokCardDeviations} />
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				<div className="flex items-center justify-end gap-2 sm:gap-3 w-full sm:w-auto">
					<Button
						type="button"
						variant="ghost"
						size="icon"
						onClick={onPrint}
						title={t(localizationConstants.print)}
						aria-label={t(localizationConstants.print)}
						className="h-10 w-10 rounded-lg border border-slate-200 hover:bg-slate-100 cursor-pointer"
					>
						<Printer className="h-4 w-4 text-slate-700" />
					</Button>

					<Button
						type="button"
						onClick={onOpenNewLogModal}
						className="h-10 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-sans text-sm font-medium leading-5 tracking-normal gap-2 shadow-none cursor-pointer whitespace-nowrap"
					>
						<Plus className="h-4 w-4" />
						<span>
							<Translate text={localizationConstants.orderDagbokBtnNew} />
						</span>
					</Button>
				</div>
			</div>

			{/* Info Strip */}
			<div className="flex flex-wrap items-center gap-4 md:gap-6 w-full">
				{/* Gray summary box - Project info */}
				<div className="bg-slate-100 rounded-lg px-4 py-3 grid grid-cols-[auto_1fr] items-center gap-x-6 gap-y-2.5 min-w-[210px] w-fit">
					<span className="font-sans font-semibold text-sm leading-none tracking-normal text-slate-900">
						<Translate text={localizationConstants.orderDagbokProject} />
					</span>
					<span className="font-sans font-semibold text-sm leading-none tracking-normal text-slate-600 text-left">
						{projectName}
					</span>
					<span className="font-sans font-semibold text-sm leading-none tracking-normal text-slate-900">
						<Translate text={localizationConstants.orderDagbokProjectNo} />
					</span>
					<span className="font-sans font-semibold text-sm leading-none tracking-normal text-slate-600 text-left">
						{projectNo}
					</span>
				</div>

				{/* Date Picker */}
				<div className="flex flex-col gap-1 w-full sm:w-[385px]">
					<Label className="text-slate-900 tracking-normal flex items-center gap-0.5">
						<Translate text={localizationConstants.orderDagbokDate} />
						<span className="text-red-500">*</span>
					</Label>
					<Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
						<PopoverTrigger asChild>
							<Button
								variant="outline"
								className="h-9 justify-start text-left font-normal border-slate-200 font-sans text-sm leading-5 tracking-normal px-3 bg-white hover:bg-slate-50 text-zinc-500 gap-2"
							>
								<CalendarIcon className="h-4 w-4 text-slate-400 shrink-0" />
								<span>{selectedDate || t(localizationConstants.orderDagbokPlaceholderPickDate)}</span>
							</Button>
						</PopoverTrigger>
						<PopoverContent
							className="w-auto p-0 border border-slate-200 bg-white shadow-lg rounded-lg z-50"
							align="start"
						>
							<Calendar
								mode="single"
								selected={parsedDate}
								onSelect={handleSelectDate}
							/>
						</PopoverContent>
					</Popover>
				</div>

				{/* Construction Day */}
				<div className="flex flex-col gap-1.5 pl-8 pr-12 border-l border-slate-200 min-w-[140px]">
					<span className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
						<Translate text={localizationConstants.orderDagbokConstructionDay} />
					</span>
					<span className="font-sans text-sm font-medium leading-5 tracking-normal text-zinc-500">{constructionDay}</span>
				</div>

				{/* Address */}
				<div className="flex flex-col gap-1.5 pl-8 border-l border-slate-200">
					<span className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
						<Translate text={localizationConstants.orderDagbokAddress} />
					</span>
					<span className="font-sans text-sm font-medium leading-5 tracking-normal text-zinc-500 truncate max-w-[200px]" title={address}>
						{address}
					</span>
				</div>
			</div>
		</div>
	);
}

export default ConstructionLogHeader;
