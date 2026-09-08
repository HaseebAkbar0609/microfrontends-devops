"use client";

import React from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import {
	EmployeeOverviewItem,
	SortField,
	SortOrder,
} from "../../../types/personnelOverview.types";
import { PersonnelTableRow } from "./PersonnelTableRow";

interface PersonnelTableProps {
	employees: EmployeeOverviewItem[];
	sortField: SortField;
	sortOrder: SortOrder;
	onSort: (field: SortField) => void;
	onViewProfile: (employee: EmployeeOverviewItem) => void;
	onDeactivate: (employee: EmployeeOverviewItem) => void;
}

export function PersonnelTable({
	employees,
	sortField,
	sortOrder,
	onSort,
	onViewProfile,
	onDeactivate,
}: PersonnelTableProps) {
	const { t } = useTranslation();

	const renderHeader = (labelKey: string, field: SortField) => {
		const isSorted = sortField === field;
		const ariaSort = isSorted ? (sortOrder === "asc" ? "ascending" : "descending") : "none";

		return (
			<th
				scope="col"
				aria-sort={ariaSort}
				onClick={() => onSort(field)}
				className="py-3 px-4 text-left font-semibold text-slate-700 select-none cursor-pointer hover:text-slate-900 group whitespace-nowrap"
			>
				<div className="inline-flex items-center gap-1.5">
					<span>
						<Translate text={labelKey} />
					</span>
					{isSorted ? (
						sortOrder === "asc" ? (
							<ArrowUp className="w-3 h-3 text-slate-900 shrink-0" />
						) : (
							<ArrowDown className="w-3 h-3 text-slate-900 shrink-0" />
						)
					) : (
						<ArrowUpDown className="w-3 h-3 text-slate-400 group-hover:text-slate-700 transition-colors shrink-0" />
					)}
				</div>
			</th>
		);
	};

	return (
		<div className="w-full overflow-x-auto">
			<table className="w-full border-collapse text-left">
				<thead>
					<tr className="border-b border-slate-200 bg-slate-50/60 text-xs uppercase tracking-wider">
						{renderHeader(localizationConstants.colContractNumber, "contractNumber")}
						{renderHeader(localizationConstants.colPerson, "name")}
						{renderHeader(localizationConstants.colRole, "role")}
						{renderHeader(localizationConstants.colIdNumber, "idNumber")}
						{renderHeader(localizationConstants.colStatus, "status")}
						{renderHeader(localizationConstants.colType, "employmentType")}
						{renderHeader(localizationConstants.colStartDate, "startDate")}
						{renderHeader(localizationConstants.colLocation, "location")}
						<th scope="col" className="py-3 px-4 text-right">
							<button
								type="button"
								disabled
								className="p-1 rounded text-slate-300 cursor-not-allowed opacity-50 inline-flex items-center justify-center"
								title={`${t(localizationConstants.colCustomizeHeader)} (${t(localizationConstants.comingSoon)})`}
								aria-label={`${t(localizationConstants.colCustomizeHeader)} (${t(localizationConstants.comingSoon)})`}
							>
								<Plus className="w-3.5 h-3.5" />
							</button>
						</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-slate-100 bg-white">
					{employees.length === 0 ? (
						<tr>
							<td colSpan={9} className="py-12 text-center text-slate-500 text-sm">
								<Translate text={localizationConstants.noEmployeesFound} />
							</td>
						</tr>
					) : (
						employees.map((employee) => (
							<PersonnelTableRow
								key={employee.id}
								employee={employee}
								onViewProfile={onViewProfile}
								onDeactivate={onDeactivate}
							/>
						))
					)}
				</tbody>
			</table>
		</div>
	);
}
