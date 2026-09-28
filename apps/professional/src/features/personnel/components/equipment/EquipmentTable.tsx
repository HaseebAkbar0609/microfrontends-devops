"use client";

import React from "react";
import Link from "next/link";
import {
	MoreVertical,
	Pencil,
	History,
	Trash2,
	ArrowUpDown,
	ArrowUp,
	ArrowDown,
	AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { useTranslation } from "react-i18next";
import { CompanyAssetItem } from "../../types/equipment.types";
import { CATEGORY_LABEL_KEY_MAP } from "../../constants/equipment.constants";
import { EquipmentStatusBadge } from "./EquipmentStatusBadge";
import { PERSONNEL_MODULE_BASE_URL } from "../../constants/personnelNav.config";

interface EquipmentTableProps {
	assets: CompanyAssetItem[];
	sortField: keyof CompanyAssetItem;
	sortOrder: "asc" | "desc";
	onSort: (field: keyof CompanyAssetItem) => void;
	onEdit: (asset: CompanyAssetItem) => void;
	onViewHistory: (asset: CompanyAssetItem) => void;
	onDelete: (asset: CompanyAssetItem) => void;
}

export function EquipmentTable({
	assets,
	sortField,
	sortOrder,
	onSort,
	onEdit,
	onViewHistory,
	onDelete,
}: EquipmentTableProps) {
	const { t } = useTranslation();
	const todayStr = new Date().toISOString().split("T")[0];

	const renderSortIcon = (field: keyof CompanyAssetItem) => {
		if (sortField !== field) {
			return <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 ml-1 inline" />;
		}
		return sortOrder === "asc" ? (
			<ArrowUp className="w-3.5 h-3.5 text-slate-900 ml-1 inline" />
		) : (
			<ArrowDown className="w-3.5 h-3.5 text-slate-900 ml-1 inline" />
		);
	};

	return (
		<div className="w-full overflow-x-auto">
			<table className="w-full text-left text-xs border-collapse">
				<thead>
					<tr className="border-b border-slate-200 bg-white text-xs font-semibold text-slate-600 select-none">
						<th
							onClick={() => onSort("name")}
							className="py-3 px-4 cursor-pointer hover:text-slate-900"
						>
							<div className="flex items-center">
								<Translate text={localizationConstants.colAssetNameModel} />
								{renderSortIcon("name")}
							</div>
						</th>

						<th
							onClick={() => onSort("category")}
							className="py-3 px-4 cursor-pointer hover:text-slate-900"
						>
							<div className="flex items-center">
								<Translate text={localizationConstants.colCategory} />
								{renderSortIcon("category")}
							</div>
						</th>

						<th
							onClick={() => onSort("idNumber")}
							className="py-3 px-4 cursor-pointer hover:text-slate-900"
						>
							<div className="flex items-center">
								<Translate text={localizationConstants.colIdRegNumber} />
								{renderSortIcon("idNumber")}
							</div>
						</th>

						<th
							onClick={() => onSort("assignedEmployeeName")}
							className="py-3 px-4 cursor-pointer hover:text-slate-900"
						>
							<div className="flex items-center">
								<Translate text={localizationConstants.colAssignedTo} />
								{renderSortIcon("assignedEmployeeName")}
							</div>
						</th>

						<th
							onClick={() => onSort("status")}
							className="py-3 px-4 cursor-pointer hover:text-slate-900"
						>
							<div className="flex items-center">
								<Translate text={localizationConstants.colStatus} />
								{renderSortIcon("status")}
							</div>
						</th>

						<th
							onClick={() => onSort("lastInspectionDate")}
							className="py-3 px-4 cursor-pointer hover:text-slate-900"
						>
							<div className="flex items-center">
								<Translate text={localizationConstants.colLastInspection} />
								{renderSortIcon("lastInspectionDate")}
							</div>
						</th>

						<th
							onClick={() => onSort("nextInspectionDate")}
							className="py-3 px-4 cursor-pointer hover:text-slate-900"
						>
							<div className="flex items-center">
								<Translate text={localizationConstants.colNextInspection} />
								{renderSortIcon("nextInspectionDate")}
							</div>
						</th>

						<th className="py-3 px-4 text-right">
							<Translate text={localizationConstants.actionsMenuLabel} />
						</th>
					</tr>
				</thead>

				<tbody className="divide-y divide-slate-100 text-slate-700">
					{assets.length === 0 ? (
						<tr>
							<td colSpan={8} className="py-12 text-center text-slate-400">
								<Translate text={localizationConstants.noAssetsFound} />
							</td>
						</tr>
					) : (
						assets.map((asset) => {
							const isOverdue =
								Boolean(asset.nextInspectionDate) && asset.nextInspectionDate < todayStr;
							const categoryKey =
								CATEGORY_LABEL_KEY_MAP[asset.category] || localizationConstants.categoryPowerTools;

							return (
								<tr
									key={asset.id}
									className="hover:bg-slate-50/70 transition-colors text-xs"
								>
									{/* Asset Name */}
									<td className="py-3.5 px-4 font-medium text-slate-900 whitespace-nowrap">
										<div className="flex flex-col">
											<span>{asset.name}</span>
											{asset.department && (
												<span className="text-[11px] text-slate-400 font-normal">
													{asset.department}
												</span>
											)}
										</div>
									</td>

									{/* Category */}
									<td className="py-3.5 px-4 whitespace-nowrap">
										<span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200/60">
											<Translate text={categoryKey} />
										</span>
									</td>

									{/* ID / Reg.nr */}
									<td className="py-3.5 px-4 font-mono font-medium text-slate-800 whitespace-nowrap">
										{asset.idNumber}
									</td>

									{/* Assigned To */}
									<td className="py-3.5 px-4 whitespace-nowrap">
										{asset.assignedEmployeeName ? (
											<Link
												href={`${PERSONNEL_MODULE_BASE_URL}/details?id=${asset.assignedEmployeeId || "emp_anna_svensson"}&name=${encodeURIComponent(asset.assignedEmployeeName)}&tab=utrustning_fordon`}
												className="inline-flex items-center gap-2 group cursor-pointer"
											>
												<div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-bold shrink-0">
													{asset.assignedEmployeeName.slice(0, 2).toUpperCase()}
												</div>
												<span className="text-slate-800 font-medium group-hover:text-blue-600 group-hover:underline">
													{asset.assignedEmployeeName}
												</span>
											</Link>
										) : (
											<span className="text-slate-400 italic">
												<Translate text={localizationConstants.unassignedLabel} />
											</span>
										)}
									</td>

									{/* Status */}
									<td className="py-3.5 px-4 whitespace-nowrap">
										<EquipmentStatusBadge status={asset.status} />
									</td>

									{/* Last Inspection Date */}
									<td className="py-3.5 px-4 font-mono text-slate-600 whitespace-nowrap">
										{asset.lastInspectionDate || "—"}
									</td>

									{/* Next Inspection Date */}
									<td className="py-3.5 px-4 whitespace-nowrap">
										{asset.nextInspectionDate ? (
											<div className="inline-flex items-center gap-1.5 font-mono">
												<span
													className={
														isOverdue ? "text-rose-600 font-semibold" : "text-slate-700"
													}
												>
													{asset.nextInspectionDate}
												</span>
												{isOverdue && (
													<span className="inline-flex items-center gap-0.5 text-[10px] bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded border border-rose-200 font-medium">
														<AlertCircle className="w-3 h-3 text-rose-500" />
														<Translate text={localizationConstants.statusOverdueBadge} />
													</span>
												)}
											</div>
										) : (
											<span className="text-slate-400">—</span>
										)}
									</td>

									{/* Actions */}
									<td className="py-3.5 px-4 text-right whitespace-nowrap">
										<div className="inline-flex items-center gap-1.5 justify-end">
											<Button
												type="button"
												variant="outline"
												size="sm"
												onClick={() => onViewHistory(asset)}
												className="h-7 px-2.5 text-xs font-medium bg-slate-100/80 hover:bg-slate-200 border-slate-200 text-slate-800 cursor-pointer shadow-2xs gap-1"
											>
												<History className="w-3 h-3 text-slate-500" />
												<Translate text={localizationConstants.viewHistoryBtn} />
											</Button>

											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														type="button"
														variant="ghost"
														size="icon"
														className="h-7 w-7 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md cursor-pointer"
														aria-label={t(localizationConstants.actionsMenuLabel)}
													>
														<MoreVertical className="w-3.5 h-3.5" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end" className="w-36">
													<DropdownMenuItem
														onClick={() => onEdit(asset)}
														className="cursor-pointer gap-2 text-xs"
													>
														<Pencil className="w-3.5 h-3.5 text-slate-600" />
														<Translate text={localizationConstants.menuEdit} />
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() => onViewHistory(asset)}
														className="cursor-pointer gap-2 text-xs"
													>
														<History className="w-3.5 h-3.5 text-slate-600" />
														<Translate text={localizationConstants.viewHistoryBtn} />
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() => onDelete(asset)}
														className="cursor-pointer gap-2 text-xs text-rose-600 focus:text-rose-700 focus:bg-rose-50"
													>
														<Trash2 className="w-3.5 h-3.5 text-rose-600" />
														<Translate text={localizationConstants.btnDelete} />
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</div>
									</td>
								</tr>
							);
						})
					)}
				</tbody>
			</table>
		</div>
	);
}
