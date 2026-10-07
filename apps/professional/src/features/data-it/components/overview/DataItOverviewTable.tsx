"use client";

import React from "react";
import { ArrowUpDown } from "lucide-react";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type {
	DataItEmployeeOverview,
	DataItSortState,
	DataItOverviewSortField,
} from "../../types/dataItOverview.types";
import { DataItOverviewTableRow } from "./DataItOverviewTableRow";

interface DataItOverviewTableProps {
	isLoading?: boolean;
	employees: DataItEmployeeOverview[];
	sortState: DataItSortState;
	onSort: (field: DataItOverviewSortField) => void;
	onRequestDelete: (emp: DataItEmployeeOverview) => void;
	onRequestStatusChange: (emp: DataItEmployeeOverview) => void;
}

export function DataItOverviewTable({
	isLoading,
	employees,
	sortState,
	onSort,
	onRequestDelete,
	onRequestStatusChange,
}: DataItOverviewTableProps) {
	const t = useTranslate();

	const renderSortIcon = (field: DataItOverviewSortField) => (
		<button
			type="button"
			onClick={() => onSort(field)}
			className="ml-1 inline-flex text-slate-400 hover:text-slate-700"
			aria-label={t(localizationConstants.dataItAriaSortBy, { field })}
		>
			<ArrowUpDown size={12} className={sortState.field === field ? "text-slate-800" : ""} />
		</button>
	);

	if (isLoading) {
		return (
			<div className="overflow-x-auto p-4">
				<div className="space-y-3">
					{[1, 2, 3, 4, 5].map((i) => (
						<div key={i} className="h-10 w-full animate-pulse rounded bg-slate-100" />
					))}
				</div>
			</div>
		);
	}

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
							<div className="flex items-center">
								<span>{t(localizationConstants.dataItColId)}</span>
								{renderSortIcon("id")}
							</div>
						</th>
						<th className="px-4 py-3">
							<div className="flex items-center">
								<span>{t(localizationConstants.dataItColName)}</span>
								{renderSortIcon("name")}
							</div>
						</th>
						<th className="px-4 py-3">
							<div className="flex items-center">
								<span>{t(localizationConstants.dataItColEmail)}</span>
								{renderSortIcon("email")}
							</div>
						</th>
						<th className="px-4 py-3">
							<div className="flex items-center">
								<span>{t(localizationConstants.dataItColRole)}</span>
								{renderSortIcon("role")}
							</div>
						</th>
						<th className="px-4 py-3">
							<div className="flex items-center">
								<span>{t(localizationConstants.dataItColEquipment)}</span>
								{renderSortIcon("equipment")}
							</div>
						</th>
						<th className="px-4 py-3">
							<div className="flex items-center">
								<span>{t(localizationConstants.dataItColSystem)}</span>
								{renderSortIcon("system")}
							</div>
						</th>
						<th className="px-4 py-3">
							<div className="flex items-center">
								<span>{t(localizationConstants.dataItColTotalCost)}</span>
								{renderSortIcon("cost")}
							</div>
						</th>
						<th className="px-4 py-3">
							<div className="flex items-center">
								<span>{t(localizationConstants.dataItColStatus)}</span>
								{renderSortIcon("status")}
							</div>
						</th>
						<th className="px-4 py-3 text-right" />
					</tr>
				</thead>
				<tbody className="divide-y divide-slate-100 text-slate-700">
					{employees.map((emp) => (
						<DataItOverviewTableRow
							key={emp.id}
							emp={emp}
							onRequestDelete={onRequestDelete}
							onRequestStatusChange={onRequestStatusChange}
						/>
					))}
				</tbody>
			</table>
		</div>
	);
}
