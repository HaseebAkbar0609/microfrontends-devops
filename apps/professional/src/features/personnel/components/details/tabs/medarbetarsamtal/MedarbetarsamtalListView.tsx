"use client";

import React from "react";
import { Search, Filter, Calendar, Plus, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import {
	MedarbetarsamtalItem,
	MedarbetarsamtalKpiData,
} from "../../../../types/medarbetarsamtal.types";
import { MedarbetarsamtalKpiCards } from "./MedarbetarsamtalKpiCards";
import { MedarbetarsamtalTableHeader } from "./list/MedarbetarsamtalTableHeader";
import { MedarbetarsamtalTableRow } from "./list/MedarbetarsamtalTableRow";
import { MedarbetarsamtalDeleteDialog } from "./list/MedarbetarsamtalDeleteDialog";

interface MedarbetarsamtalListViewProps {
	reviews: MedarbetarsamtalItem[];
	kpis: MedarbetarsamtalKpiData;
	searchQuery: string;
	onSearchChange: (q: string) => void;
	selectedFilter: "all" | "positiv" | "neutral" | "needs_attention" | "archived";
	onFilterChange: (
		filter: "all" | "positiv" | "neutral" | "needs_attention" | "archived"
	) => void;
	onScheduleClick?: () => void;
	onNewReviewClick: () => void;
	onOpenDetail: (item: MedarbetarsamtalItem) => void;
	onArchiveClick?: (id: string) => void;
	onDeleteClick: (item: MedarbetarsamtalItem) => void;
	deleteConfirmItem: MedarbetarsamtalItem | null;
	onConfirmDelete: (id: string) => void;
	onCancelDelete: () => void;
	onPreviewDoc?: (name: string) => void;
	onSwitchToKompetens?: () => void;
}

export function MedarbetarsamtalListView({
	reviews,
	kpis,
	searchQuery,
	onSearchChange,
	selectedFilter,
	onFilterChange,
	onScheduleClick,
	onNewReviewClick,
	onOpenDetail,
	onArchiveClick,
	onDeleteClick,
	deleteConfirmItem,
	onConfirmDelete,
	onCancelDelete,
	onPreviewDoc,
	onSwitchToKompetens,
}: MedarbetarsamtalListViewProps) {
	const { t } = useTranslation();

	return (
		<div className="space-y-5">
			{/* Top Selector */}
			<div>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<button
							type="button"
							className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800 shadow-2xs hover:bg-slate-50 cursor-pointer transition-colors"
						>
							<span>
								<Translate
									text={localizationConstants.medarbetarsamtalDropdownLabel}
								/>
							</span>
							<ChevronDown className="h-3.5 w-3.5 text-slate-400" />
						</button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start" className="w-48 bg-white border border-slate-200 shadow-md">
						<DropdownMenuItem
							onClick={onSwitchToKompetens}
							className="text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 cursor-pointer"
						>
							<Translate text={localizationConstants.kompetensDropdownLabel} />
						</DropdownMenuItem>
						<DropdownMenuItem className="text-xs font-semibold text-slate-900 bg-slate-100 cursor-default">
							<Translate
								text={localizationConstants.medarbetarsamtalDropdownLabel}
							/>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{/* KPI Cards Row */}
			<MedarbetarsamtalKpiCards kpis={kpis} />

			{/* Toolbar */}
			<div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
				<div className="flex items-center gap-2 flex-1 max-w-md">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
						<Input
							value={searchQuery}
							onChange={(e) => onSearchChange(e.target.value)}
							placeholder={t(localizationConstants.searchPlaceholder)}
							className="h-9 pl-9 pr-3 text-xs bg-white border-slate-200"
						/>
					</div>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								type="button"
								variant="outline"
								size="sm"
								className={`h-9 px-3 text-xs font-medium border-slate-200 text-slate-700 bg-white hover:bg-slate-50 cursor-pointer shadow-2xs gap-1.5 ${
									selectedFilter !== "all"
										? "border-slate-800 bg-slate-50 font-semibold"
										: ""
								}`}
							>
								<Filter className="h-3.5 w-3.5 text-slate-500" />
								<span>
									{selectedFilter === "all" && (
										<Translate text={localizationConstants.filter} />
									)}
									{selectedFilter === "positiv" && (
										<Translate
											text={localizationConstants.medarbetarsamtalFilterPositiv}
										/>
									)}
									{selectedFilter === "neutral" && (
										<Translate
											text={localizationConstants.medarbetarsamtalFilterNeutral}
										/>
									)}
									{selectedFilter === "needs_attention" && (
										<Translate
											text={localizationConstants.medarbetarsamtalFilterAttention}
										/>
									)}
									{selectedFilter === "archived" && (
										<Translate
											text={localizationConstants.medarbetarsamtalFilterArchived}
										/>
									)}
								</span>
								<ChevronDown className="h-3 w-3 text-slate-400" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align="start"
							className="w-48 bg-white border border-slate-200 shadow-md text-xs"
						>
							<DropdownMenuItem
								onClick={() => onFilterChange("all")}
								className={`cursor-pointer ${
									selectedFilter === "all" ? "font-bold bg-slate-100" : ""
								}`}
							>
								<Translate
									text={localizationConstants.medarbetarsamtalFilterAll}
								/>
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => onFilterChange("positiv")}
								className={`cursor-pointer ${
									selectedFilter === "positiv" ? "font-bold bg-slate-100" : ""
								}`}
							>
								<Translate
									text={localizationConstants.medarbetarsamtalFilterPositiv}
								/>
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => onFilterChange("neutral")}
								className={`cursor-pointer ${
									selectedFilter === "neutral" ? "font-bold bg-slate-100" : ""
								}`}
							>
								<Translate
									text={localizationConstants.medarbetarsamtalFilterNeutral}
								/>
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => onFilterChange("needs_attention")}
								className={`cursor-pointer ${
									selectedFilter === "needs_attention"
										? "font-bold bg-slate-100"
										: ""
								}`}
							>
								<Translate
									text={localizationConstants.medarbetarsamtalFilterAttention}
								/>
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => onFilterChange("archived")}
								className={`cursor-pointer text-slate-600 ${
									selectedFilter === "archived" ? "font-bold bg-slate-100" : ""
								}`}
							>
								<Translate
									text={localizationConstants.medarbetarsamtalFilterArchived}
								/>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				<div className="flex items-center gap-2">
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={onScheduleClick}
						className="h-9 px-3.5 text-xs font-medium border-slate-200 bg-white hover:bg-slate-50 text-slate-700 cursor-pointer shadow-2xs gap-1.5"
					>
						<Calendar className="h-3.5 w-3.5 text-slate-500" />
						<Translate
							text={localizationConstants.medarbetarsamtalBtnSchedule}
						/>
					</Button>

					<Button
						type="button"
						onClick={onNewReviewClick}
						className="h-9 px-4 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white cursor-pointer shadow-2xs gap-1.5"
					>
						<Plus className="h-3.5 w-3.5" />
						<Translate text={localizationConstants.medarbetarsamtalBtnNew} />
					</Button>
				</div>
			</div>

			{/* Table Card */}
			<div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
				<div className="overflow-x-auto">
					<table className="w-full text-xs text-left">
						<MedarbetarsamtalTableHeader />
						<tbody className="divide-y divide-slate-100">
							{reviews.length === 0 ? (
								<tr>
									<td
										colSpan={6}
										className="py-12 text-center text-slate-400 text-xs"
									>
										<Translate
											text={localizationConstants.medarbetarsamtalEmptyList}
										/>
									</td>
								</tr>
							) : (
								reviews.map((item) => (
									<MedarbetarsamtalTableRow
										key={item.id}
										item={item}
										onOpenDetail={onOpenDetail}
										onPreviewDoc={onPreviewDoc}
										onArchiveClick={onArchiveClick}
										onDeleteClick={onDeleteClick}
									/>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>

			{/* Delete Confirmation Alert Dialog */}
			<MedarbetarsamtalDeleteDialog
				deleteConfirmItem={deleteConfirmItem}
				onConfirmDelete={onConfirmDelete}
				onCancelDelete={onCancelDelete}
			/>
		</div>
	);
}
