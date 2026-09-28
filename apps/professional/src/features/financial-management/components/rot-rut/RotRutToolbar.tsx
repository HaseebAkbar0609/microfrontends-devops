"use client";

import React from "react";
import { Search, Send, Download, Printer, RotateCcw } from "lucide-react";
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
	submittableCount: number;
	onSubmitSelected: () => void;
	onExportExcel: () => void;
	onPrint: () => void;
	onResetDemoData?: () => void;
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
	selectedCount: _selectedCount,
	submittableCount,
	onSubmitSelected,
	onExportExcel,
	onPrint,
	onResetDemoData,
}: RotRutToolbarProps) {
	const { t } = useTranslation();
	return (
		<div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4">
			<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
				{/* Left Side: Search & Filter Dropdowns */}
				<div className="flex flex-wrap items-center gap-3 flex-1">
					{/* Search Input */}
					<div className="relative w-full sm:w-[240px] md:w-[260px] lg:w-[300px]">
						<Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
						<Input
							type="text"
							value={searchQuery}
							onChange={(e) => onSearchChange(e.target.value)}
							placeholder={t(localizationConstants.rotRutSearchPlaceholder)}
							className="pl-9 h-10 text-xs bg-white border-slate-200 rounded-lg focus-visible:ring-1 focus-visible:ring-slate-400"
						/>
					</div>

					{/* Type Filter Buttons */}
					<div className="inline-flex h-10 p-1 bg-slate-100 rounded-lg border border-slate-200 text-xs items-center">
						<button
							type="button"
							onClick={() => onTypeFilterChange("all")}
							className={`h-8 px-3 rounded-md font-medium transition-all cursor-pointer ${
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
							className={`h-8 px-3 rounded-md font-medium transition-all cursor-pointer ${
								typeFilter === "rot"
									? "bg-[#111721] text-white shadow-2xs font-semibold"
									: "text-slate-600 hover:text-slate-900"
							}`}
						>
							<Translate text={localizationConstants.rotRutFilterTypeRot} />
						</button>
						<button
							type="button"
							onClick={() => onTypeFilterChange("rut")}
							className={`h-8 px-3 rounded-md font-medium transition-all cursor-pointer ${
								typeFilter === "rut"
									? "bg-[#111721] text-white shadow-2xs font-semibold"
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
						<SelectTrigger className="w-[140px] h-10 text-xs bg-white border-slate-200 shadow-2xs rounded-lg">
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
						<SelectTrigger className="w-[140px] h-10 text-xs bg-white border-slate-200 shadow-2xs rounded-lg">
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
						disabled={submittableCount === 0}
						className="h-10 text-xs font-semibold bg-[#111721] hover:bg-slate-800 text-white gap-1.5 shadow-2xs cursor-pointer disabled:opacity-50 rounded-lg px-4"
					>
						<Send className="w-3.5 h-3.5" />
						<Translate text={localizationConstants.rotRutBtnSubmitSelected} />
						{submittableCount > 0 && (
							<span className="ml-1 px-1.5 py-0.2 bg-slate-700 text-white rounded-full text-[10px]">
								{submittableCount}
							</span>
						)}
					</Button>

					{/* Export & Print Utilities */}
					<Button
						type="button"
						variant="outline"
						size="icon"
						onClick={onExportExcel}
						className="h-10 w-10 border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs rounded-lg cursor-pointer"
						title={t(localizationConstants.rotRutBtnExport)}
					>
						<Download className="w-4 h-4" />
					</Button>
					<Button
						type="button"
						variant="outline"
						size="icon"
						onClick={onPrint}
						className="h-10 w-10 border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs rounded-lg cursor-pointer"
						title={t(localizationConstants.rotRutBtnPrint)}
					>
						<Printer className="w-4 h-4" />
					</Button>
					{onResetDemoData && (
						<Button
							type="button"
							variant="outline"
							size="icon"
							onClick={onResetDemoData}
							className="h-10 w-10 border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-900 shadow-2xs rounded-lg cursor-pointer"
							title={t(localizationConstants.rotRutResetData)}
						>
							<RotateCcw className="w-4 h-4" />
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}
