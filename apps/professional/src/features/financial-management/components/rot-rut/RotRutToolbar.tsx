"use client";

import React from "react";
import { Search, Send, Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Translate } from "@/utils/translation/translate";
import { useTranslation } from "react-i18next";
import localizationConstants from "@/utils/translation/constants";
import { RotRutStatus, RotRutType, RotRutPeriod } from "../../types/rotRut.types";

interface RotRutToolbarProps {
	searchQuery: string;
	onSearchChange: (q: string) => void;
	statusFilter: RotRutStatus | "all";
	onStatusFilterChange: (s: RotRutStatus | "all") => void;
	typeFilter: RotRutType | "all";
	onTypeFilterChange: (t: RotRutType | "all") => void;
	periodFilter: RotRutPeriod;
	onPeriodFilterChange: (p: RotRutPeriod) => void;
	selectedCount: number;
	onSubmitSelected: () => void;
	onExportExcel: () => void;
	onPrint: () => void;
}

export function RotRutToolbar({
	searchQuery,
	onSearchChange,
	statusFilter,
	onStatusFilterChange,
	typeFilter,
	onTypeFilterChange,
	periodFilter,
	onPeriodFilterChange,
	selectedCount,
	onSubmitSelected,
	onExportExcel,
	onPrint,
}: RotRutToolbarProps) {
	const { t } = useTranslation();
	return (
		<div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-4 mb-4">
			<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
				{/* Left Side: Search & Filter Dropdowns */}
				<div className="flex flex-wrap items-center gap-3 flex-1">
					{/* Search Input */}
					<div className="relative min-w-[240px] max-w-sm flex-1">
						<Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
						<Input
							type="text"
							value={searchQuery}
							onChange={(e) => onSearchChange(e.target.value)}
							placeholder={t(localizationConstants.rotRutSearchPlaceholder)}
							className="pl-9 h-9 text-xs bg-slate-50/50 border-slate-200 rounded-lg focus-visible:ring-1 focus-visible:ring-slate-400"
						/>
					</div>

					{/* Type Filter Buttons */}
					<div className="inline-flex p-0.5 bg-slate-100 rounded-lg border border-slate-200/80 text-xs">
						<button
							type="button"
							onClick={() => onTypeFilterChange("all")}
							className={`px-3 py-1 rounded-md font-medium transition-all cursor-pointer ${
								typeFilter === "all"
									? "bg-white text-slate-900 shadow-2xs font-semibold"
									: "text-slate-600 hover:text-slate-900"
							}`}
						>
							<Translate text={localizationConstants.rotRutFilterTypeAll} />
						</button>
						<button
							type="button"
							onClick={() => onTypeFilterChange("rot")}
							className={`px-3 py-1 rounded-md font-medium transition-all cursor-pointer ${
								typeFilter === "rot"
									? "bg-indigo-600 text-white shadow-2xs font-semibold"
									: "text-slate-600 hover:text-slate-900"
							}`}
						>
							<Translate text={localizationConstants.rotRutFilterTypeRot} />
						</button>
						<button
							type="button"
							onClick={() => onTypeFilterChange("rut")}
							className={`px-3 py-1 rounded-md font-medium transition-all cursor-pointer ${
								typeFilter === "rut"
									? "bg-violet-600 text-white shadow-2xs font-semibold"
									: "text-slate-600 hover:text-slate-900"
							}`}
						>
							<Translate text={localizationConstants.rotRutFilterTypeRut} />
						</button>
					</div>

					{/* Status Dropdown */}
					<Select
						value={statusFilter}
						onValueChange={(val) => onStatusFilterChange(val as RotRutStatus | "all")}
					>
						<SelectTrigger className="w-[140px] h-9 text-xs bg-white border-slate-200">
							<SelectValue placeholder={t(localizationConstants.rotRutFilterStatusAll)} />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">
								<Translate text={localizationConstants.rotRutFilterStatusAll} />
							</SelectItem>
							<SelectItem value="pending">
								<Translate text={localizationConstants.rotRutFilterStatusPending} />
							</SelectItem>
							<SelectItem value="submitted">
								<Translate text={localizationConstants.rotRutFilterStatusSubmitted} />
							</SelectItem>
							<SelectItem value="approved">
								<Translate text={localizationConstants.rotRutFilterStatusApproved} />
							</SelectItem>
							<SelectItem value="rejected">
								<Translate text={localizationConstants.rotRutFilterStatusRejected} />
							</SelectItem>
						</SelectContent>
					</Select>

					{/* Period Dropdown */}
					<Select
						value={periodFilter}
						onValueChange={(val) => onPeriodFilterChange(val as RotRutPeriod)}
					>
						<SelectTrigger className="w-[140px] h-9 text-xs bg-white border-slate-200">
							<SelectValue placeholder={t(localizationConstants.rotRutPeriodAll)} />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">
								<Translate text={localizationConstants.rotRutPeriodAll} />
							</SelectItem>
							<SelectItem value="this_year">
								<Translate text={localizationConstants.rotRutPeriodThisYear} />
							</SelectItem>
							<SelectItem value="last_year">
								<Translate text={localizationConstants.rotRutPeriodLastYear} />
							</SelectItem>
							<SelectItem value="this_month">
								<Translate text={localizationConstants.rotRutPeriodThisMonth} />
							</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Right Side: Action CTAs */}
				<div className="flex items-center gap-2">
					{/* Batch Submit to Skatteverket */}
					<Button
						type="button"
						size="sm"
						onClick={onSubmitSelected}
						disabled={selectedCount === 0}
						className="h-9 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white gap-1.5 shadow-2xs cursor-pointer disabled:opacity-50"
					>
						<Send className="w-3.5 h-3.5" />
						<Translate text={localizationConstants.rotRutBtnSubmitSelected} />
						{selectedCount > 0 && (
							<span className="ml-1 px-1.5 py-0.2 bg-blue-800 text-white rounded-full text-[10px]">
								{selectedCount}
							</span>
						)}
					</Button>

					{/* Export & Print Utilities */}
					<Button
						type="button"
						variant="outline"
						size="icon"
						onClick={onExportExcel}
						className="h-9 w-9 border-slate-200 text-slate-600 hover:text-slate-900 cursor-pointer"
						title={t(localizationConstants.rotRutBtnExport)}
					>
						<Download className="w-4 h-4" />
					</Button>
					<Button
						type="button"
						variant="outline"
						size="icon"
						onClick={onPrint}
						className="h-9 w-9 border-slate-200 text-slate-600 hover:text-slate-900 cursor-pointer"
						title={t(localizationConstants.rotRutBtnPrint)}
					>
						<Printer className="w-4 h-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}
