"use client";

import React from "react";
import { ArrowUpDown } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { ImportAccountRow } from "@/features/financial-management/types/accountPlan.types";
import {
	IMPORT_ACTION_OPTIONS,
	MOMSKOD_OPTIONS,
} from "@/features/financial-management/constants/accountPlan.constants";

interface AccountPlanImportStep2MappingTableCardProps {
	readonly rows: ImportAccountRow[];
	readonly onUpdateRow: (id: string, updates: Partial<ImportAccountRow>) => void;
}

export function AccountPlanImportStep2MappingTableCard({
	rows,
	onUpdateRow,
}: AccountPlanImportStep2MappingTableCardProps) {
	return (
		<div className="w-full rounded-xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col gap-6">
			<h3 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-3">
				<Translate text={localizationConstants.mapInformationLabel} />
			</h3>

			<div className="overflow-x-auto">
				<table className="w-full text-left text-sm border-collapse min-w-[750px]">
					<thead>
						<tr className="border-b border-slate-200 bg-slate-50/50 text-xs font-semibold text-slate-600 uppercase tracking-wider">
							<th className="px-4 py-3">
								<div className="flex items-center gap-1.5">
									<Translate text={localizationConstants.accountLabel} />
									<ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
								</div>
							</th>
							<th className="px-4 py-3">
								<div className="flex items-center gap-1.5">
									<Translate text={localizationConstants.designationLabel} />
									<ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
								</div>
							</th>
							<th className="px-4 py-3">
								<Translate text={localizationConstants.actionLabel} />
							</th>
							<th className="px-4 py-3">
								<Translate text={localizationConstants.accountLabel} />
							</th>
							<th className="px-4 py-3">
								<Translate text={localizationConstants.vatCodePercentLabel} />
							</th>
							<th className="px-4 py-3">
								<Translate text={localizationConstants.designationLabel} />
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-100 bg-white">
						{rows.map((row) => (
							<tr key={row.id} className="hover:bg-slate-50/60 transition-colors">
								<td className="px-4 py-3 font-semibold text-slate-900">
									{row.sourceKonto}
								</td>
								<td className="px-4 py-3 text-slate-700">
									{row.sourceBenamning}
								</td>
								<td className="px-4 py-3">
									<select
										value={row.action}
										onChange={(e) =>
											onUpdateRow(row.id, {
												action: e.target.value as ImportAccountRow["action"],
											})
										}
										className="h-9 w-32 rounded-md border border-slate-300 bg-white px-2.5 text-xs text-slate-800 focus:border-slate-900 focus:outline-none"
									>
										{IMPORT_ACTION_OPTIONS.map((opt) => (
											<option key={opt.value} value={opt.value}>
												{opt.label}
											</option>
										))}
									</select>
								</td>
								<td className="px-4 py-3">
									<input
										type="text"
										value={row.targetKonto}
										onChange={(e) =>
											onUpdateRow(row.id, { targetKonto: e.target.value })
										}
										className="h-9 w-24 rounded-md border border-slate-300 bg-white px-2.5 text-xs text-slate-800 focus:border-slate-900 focus:outline-none"
									/>
								</td>
								<td className="px-4 py-3">
									<select
										value={row.momskodPercent}
										onChange={(e) =>
											onUpdateRow(row.id, { momskodPercent: e.target.value })
										}
										className="h-9 w-20 rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-800 focus:border-slate-900 focus:outline-none"
									>
										{MOMSKOD_OPTIONS.map((opt) => (
											<option key={opt.value} value={opt.value}>
												{opt.label}
											</option>
										))}
									</select>
								</td>
								<td className="px-4 py-3">
									<input
										type="text"
										value={row.targetBenamning}
										onChange={(e) =>
											onUpdateRow(row.id, { targetBenamning: e.target.value })
										}
										className="h-9 w-full max-w-xs rounded-md border border-slate-300 bg-white px-2.5 text-xs text-slate-800 focus:border-slate-900 focus:outline-none"
									/>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
