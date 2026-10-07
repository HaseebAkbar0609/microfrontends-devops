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
					{employees.map((emp) => (
						<DataItOverviewTableRow
							key={emp.id}
							emp={emp}
							onRequestDelete={onRequestDelete}
							onRequestArchive={onRequestArchive}
						/>
					))}
				</tbody>
			</table>
		</div>
	);
}
