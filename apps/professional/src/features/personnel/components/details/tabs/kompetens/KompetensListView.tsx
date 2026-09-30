"use client";

import React from "react";
import { Search, Filter, Plus, ChevronDown } from "lucide-react";
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
import { CompetenceItem } from "../../../../types/competence.types";
import { KompetensTableHeader } from "./list/KompetensTableHeader";
import { KompetensTableRow } from "./list/KompetensTableRow";
import { KompetensDeleteDialog } from "./list/KompetensDeleteDialog";

interface KompetensListViewProps {
	competences: CompetenceItem[];
	searchQuery: string;
	onSearchChange: (query: string) => void;
	selectedFilter: "all" | "active" | "expire_soon" | "expired" | "archived";
	onFilterChange: (
		filter: "all" | "active" | "expire_soon" | "expired" | "archived"
	) => void;
	onAddClick: () => void;
	onOpenDetail: (item: CompetenceItem) => void;
	onArchiveClick?: (id: string) => void;
	onDeleteClick: (item: CompetenceItem) => void;
	deleteConfirmItem: CompetenceItem | null;
	onConfirmDelete: (id: string) => void;
	onCancelDelete: () => void;
	onPreviewDoc?: (name: string) => void;
	onSwitchToMedarbetarsamtal?: () => void;
}

export function KompetensListView({
	competences,
	searchQuery,
	onSearchChange,
	selectedFilter,
	onFilterChange,
	onAddClick,
	onOpenDetail,
	onArchiveClick,
	onDeleteClick,
	deleteConfirmItem,
	onConfirmDelete,
	onCancelDelete,
	onPreviewDoc,
	onSwitchToMedarbetarsamtal,
}: KompetensListViewProps) {
	const { t } = useTranslation();

	return (
		<div className="space-y-4">
			{/* Top Selector & Title */}
			<div className="space-y-3">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<button
							type="button"
							className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800 shadow-2xs hover:bg-slate-50 cursor-pointer transition-colors"
						>
							<span>
								<Translate text={localizationConstants.kompetensDropdownLabel} />
							</span>
							<ChevronDown className="h-3.5 w-3.5 text-slate-400" />
						</button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start" className="w-48 bg-white border border-slate-200 shadow-md">
						<DropdownMenuItem className="text-xs font-semibold text-slate-900 bg-slate-100 cursor-default">
							<Translate text={localizationConstants.kompetensDropdownLabel} />
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={onSwitchToMedarbetarsamtal}
							className="text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 cursor-pointer"
						>
							<Translate text={localizationConstants.medarbetarsamtalDropdownLabel} />
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>

				<h2 className="text-base font-bold text-slate-900 tracking-tight">
					<Translate text={localizationConstants.kompetensListTitle} />
				</h2>
			</div>

			{/* Toolbar */}
			<div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
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
									{selectedFilter === "active" && (
										<Translate text={localizationConstants.kompetensFilterActive} />
									)}
									{selectedFilter === "expire_soon" && (
										<Translate text={localizationConstants.kompetensFilterExpireSoon} />
									)}
									{selectedFilter === "expired" && (
										<Translate text={localizationConstants.kompetensFilterExpired} />
									)}
									{selectedFilter === "archived" && (
										<Translate text={localizationConstants.kompetensFilterArchived} />
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
								<Translate text={localizationConstants.kompetensFilterAll} />
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => onFilterChange("active")}
								className={`cursor-pointer ${
									selectedFilter === "active" ? "font-bold bg-slate-100" : ""
								}`}
							>
								<Translate text={localizationConstants.kompetensFilterActive} />
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => onFilterChange("expire_soon")}
								className={`cursor-pointer ${
									selectedFilter === "expire_soon" ? "font-bold bg-slate-100" : ""
								}`}
							>
								<Translate text={localizationConstants.kompetensFilterExpireSoon} />
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => onFilterChange("expired")}
								className={`cursor-pointer ${
									selectedFilter === "expired" ? "font-bold bg-slate-100" : ""
								}`}
							>
								<Translate text={localizationConstants.kompetensFilterExpired} />
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => onFilterChange("archived")}
								className={`cursor-pointer text-slate-600 ${
									selectedFilter === "archived" ? "font-bold bg-slate-100" : ""
								}`}
							>
								<Translate text={localizationConstants.kompetensFilterArchived} />
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				<div className="flex items-center gap-2">
					<Button
						type="button"
						onClick={onAddClick}
						className="h-9 px-4 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white cursor-pointer shadow-2xs gap-1.5"
					>
						<Plus className="h-3.5 w-3.5" />
						<Translate text={localizationConstants.kompetensBtnAdd} />
					</Button>
				</div>
			</div>

			{/* Table Card */}
			<div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
				<div className="overflow-x-auto">
					<table className="w-full text-xs text-left">
						<KompetensTableHeader />
						<tbody className="divide-y divide-slate-100">
							{competences.length === 0 ? (
								<tr>
									<td
										colSpan={8}
										className="py-12 text-center text-slate-400 text-xs"
									>
										<Translate text={localizationConstants.kompetensEmptyList} />
									</td>
								</tr>
							) : (
								competences.map((item) => (
									<KompetensTableRow
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

			{/* Delete Confirmation Dialog */}
			<KompetensDeleteDialog
				deleteConfirmItem={deleteConfirmItem}
				onConfirmDelete={onConfirmDelete}
				onCancelDelete={onCancelDelete}
			/>
		</div>
	);
}
