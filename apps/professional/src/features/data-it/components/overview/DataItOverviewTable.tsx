"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Eye, MoreHorizontal, ArrowUpDown, Trash2, Archive, Edit } from "lucide-react";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { formatCurrency } from "@/utils/formatCurrency";
import type {
	DataItEmployeeOverview,
	DataItSortState,
	DataItOverviewSortField,
} from "../../types/dataItOverview.types";
import { DATA_IT_MODULE_BASE_URL } from "../../constants/dataItNav.config";

interface DataItOverviewTableProps {
	employees: DataItEmployeeOverview[];
	sortState: DataItSortState;
	onSort: (field: DataItOverviewSortField) => void;
	onRequestDelete: (emp: DataItEmployeeOverview) => void;
	onRequestArchive: (emp: DataItEmployeeOverview) => void;
}

export function DataItOverviewTable({
	employees,
	sortState,
	onSort,
	onRequestDelete,
	onRequestArchive,
}: DataItOverviewTableProps) {
	const t = useTranslate();
	const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

	const renderSortIcon = (field: DataItOverviewSortField) => (
		<button
			type="button"
			onClick={() => onSort(field)}
			className="ml-1 inline-flex text-slate-400 hover:text-slate-700"
			aria-label={`Sort by ${field}`}
		>
			<ArrowUpDown size={12} className={sortState.field === field ? "text-slate-800" : ""} />
		</button>
	);

	if (employees.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center p-12 text-center">
				<p className="text-sm font-semibold text-slate-700">
					{t(localizationConstants.dataItEmptyOverview)}
				</p>
				<p className="mt-1 text-xs text-slate-400">
					{t(localizationConstants.dataItEmptyOverviewDesc)}
				</p>
			</div>
		);
	}

	return (
		<div className="overflow-x-auto">
			<table className="w-full min-w-[800px] border-collapse text-left text-sm">
				<thead>
					<tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold text-slate-500">
						<th className="px-4 py-3">
							<span className="inline-flex items-center">
								{t(localizationConstants.dataItColId)} {renderSortIcon("id")}
							</span>
						</th>
						<th className="px-4 py-3">
							<span className="inline-flex items-center">
								{t(localizationConstants.dataItColName)} {renderSortIcon("name")}
							</span>
						</th>
						<th className="px-4 py-3">
							<span className="inline-flex items-center">
								{t(localizationConstants.dataItColEmail)} {renderSortIcon("email")}
							</span>
						</th>
						<th className="px-4 py-3">
							<span className="inline-flex items-center">
								{t(localizationConstants.dataItColRole)} {renderSortIcon("role")}
							</span>
						</th>
						<th className="px-4 py-3">
							<span className="inline-flex items-center">
								{t(localizationConstants.dataItColEquipment)} {renderSortIcon("equipment")}
							</span>
						</th>
						<th className="px-4 py-3">
							<span className="inline-flex items-center">
								{t(localizationConstants.dataItColSystem)} {renderSortIcon("system")}
							</span>
						</th>
						<th className="px-4 py-3">
							<span className="inline-flex items-center">
								{t(localizationConstants.dataItColTotalCost)} {renderSortIcon("cost")}
							</span>
						</th>
						<th className="px-4 py-3">
							<span className="inline-flex items-center">
								{t(localizationConstants.dataItColStatus)} {renderSortIcon("status")}
							</span>
						</th>
						<th className="px-4 py-3 text-right">
							{t(localizationConstants.dataItActionView)}
						</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-slate-100 text-slate-700">
					{employees.map((emp) => {
						const totalCost =
							emp.equipment.reduce((s, e) => s + e.monthlyCost, 0) +
							emp.systems.reduce((s, sys) => s + sys.monthlyCost, 0);
						const formattedEq = String(emp.equipment.length).padStart(2, "0");
						const formattedSys = String(emp.systems.length).padStart(2, "0");
						const detailHref = `${DATA_IT_MODULE_BASE_URL}/overview/${encodeURIComponent(emp.id)}`;

						return (
							<tr key={emp.id} className="transition-colors hover:bg-slate-50/70">
								<td className="px-4 py-3 font-medium text-slate-900">
									<Link href={detailHref} className="hover:underline">
										{emp.id.startsWith("#") ? emp.id : `#${emp.id}`}
									</Link>
								</td>
								<td className="px-4 py-3">{emp.name}</td>
								<td className="px-4 py-3 text-slate-500">{emp.email}</td>
								<td className="px-4 py-3">
									<span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
										{emp.role}
									</span>
								</td>
								<td className="px-4 py-3 text-slate-600">{formattedEq}</td>
								<td className="px-4 py-3 text-slate-600">{formattedSys}</td>
								<td className="px-4 py-3 font-medium text-slate-800">
									{formatCurrency(totalCost)} kr/{t(localizationConstants.dataItMonthUnit)}
								</td>
								<td className="px-4 py-3">
									<span
										className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
											emp.status === "ACTIVE"
												? "bg-emerald-50 text-emerald-700"
												: "bg-slate-100 text-slate-500"
										}`}
									>
										{emp.status === "ACTIVE"
											? t(localizationConstants.dataItStatusActive)
											: t(localizationConstants.dataItStatusInactive)}
									</span>
								</td>
								<td className="px-4 py-3 text-right">
									<div className="relative inline-flex items-center gap-1.5">
										<Link
											href={detailHref}
											className="inline-flex h-7 w-7 items-center justify-center rounded text-slate-400 hover:bg-slate-100 hover:text-slate-700"
											title={t(localizationConstants.dataItActionView)}
										>
											<Eye size={16} />
										</Link>

										<button
											type="button"
											onClick={() =>
												setActiveMenuId((prev) => (prev === emp.id ? null : emp.id))
											}
											className="inline-flex h-7 w-7 items-center justify-center rounded text-slate-400 hover:bg-slate-100 hover:text-slate-700"
										>
											<MoreHorizontal size={16} />
										</button>

										{activeMenuId === emp.id && (
											<>
												<div
													className="fixed inset-0 z-20"
													onClick={() => setActiveMenuId(null)}
												/>
												<div className="absolute right-0 top-full z-30 mt-1 min-w-[130px] rounded-md border border-slate-200 bg-white py-1 text-left shadow-lg">
													<Link
														href={detailHref}
														className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
														onClick={() => setActiveMenuId(null)}
													>
														<Edit size={13} />
														<span>{t(localizationConstants.dataItActionEdit)}</span>
													</Link>
													<button
														type="button"
														onClick={() => {
															setActiveMenuId(null);
															onRequestArchive(emp);
														}}
														className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
													>
														<Archive size={13} />
														<span>{t(localizationConstants.dataItActionArchive)}</span>
													</button>
													<button
														type="button"
														onClick={() => {
															setActiveMenuId(null);
															onRequestDelete(emp);
														}}
														className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50"
													>
														<Trash2 size={13} />
														<span>{t(localizationConstants.dataItActionDelete)}</span>
													</button>
												</div>
											</>
										)}
									</div>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}
