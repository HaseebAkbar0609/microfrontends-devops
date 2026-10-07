"use client";

import React, { useState, useMemo } from "react";
import { Server, Edit, ArrowUpDown } from "lucide-react";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { DataItEmployeeOverview, DataItSystemItem } from "../../types/dataItOverview.types";
import { showToast } from "@/lib/toast";

interface DataItDetailSystemCardProps {
	employee: DataItEmployeeOverview;
}

type SortField = keyof DataItSystemItem;

export function DataItDetailSystemCard({ employee }: DataItDetailSystemCardProps) {
	const t = useTranslate();
	const [sortField, setSortField] = useState<SortField>("programName");
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

	const handleSort = (field: SortField) => {
		setSortDirection((prev) =>
			sortField === field && prev === "asc" ? "desc" : "asc",
		);
		setSortField(field);
	};

	const sortedItems = useMemo(() => {
		return [...employee.systems].sort((a, b) => {
			const mult = sortDirection === "asc" ? 1 : -1;
			const valA = String(a[sortField]);
			const valB = String(b[sortField]);
			return mult * valA.localeCompare(valB, undefined, { numeric: true });
		});
	}, [employee.systems, sortField, sortDirection]);

	const handleEdit = () => {
		showToast("info", t(localizationConstants.dataItToastComingSoon));
	};

	return (
		<div className="rounded-lg border border-slate-200 bg-white shadow-sm">
			{/* Card Header */}
			<div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
				<div className="flex items-center gap-2.5">
					<Server size={18} className="text-slate-600" />
					<h3 className="text-base font-semibold text-slate-900">
						{t(localizationConstants.dataItSystemCardTitle)}
					</h3>
				</div>
				<button
					type="button"
					onClick={handleEdit}
					className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none"
				>
					<Edit size={13} />
					<span>{t(localizationConstants.dataItBtnEdit)}</span>
				</button>
			</div>

			{/* System Table */}
			{sortedItems.length === 0 ? (
				<div className="p-8 text-center">
					<p className="text-sm font-medium text-slate-600">
						{t(localizationConstants.dataItEmptySystem)}
					</p>
					<p className="mt-1 text-xs text-slate-400">
						{t(localizationConstants.dataItEmptySystemDesc)}
					</p>
				</div>
			) : (
				<div className="overflow-x-auto">
					<table className="w-full min-w-[650px] border-collapse text-left text-sm">
						<thead>
							<tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold text-slate-500">
								<th className="px-6 py-3">
									<button
										type="button"
										onClick={() => handleSort("category")}
										className="inline-flex items-center gap-1 hover:text-slate-800"
									>
										{t(localizationConstants.dataItColSystemCategory)}
										<ArrowUpDown size={12} />
									</button>
								</th>
								<th className="px-6 py-3">
									<button
										type="button"
										onClick={() => handleSort("programName")}
										className="inline-flex items-center gap-1 hover:text-slate-800"
									>
										{t(localizationConstants.dataItColSystemProgram)}
										<ArrowUpDown size={12} />
									</button>
								</th>
								<th className="px-6 py-3">
									<button
										type="button"
										onClick={() => handleSort("email")}
										className="inline-flex items-center gap-1 hover:text-slate-800"
									>
										{t(localizationConstants.dataItColSystemEmail)}
										<ArrowUpDown size={12} />
									</button>
								</th>
								<th className="px-6 py-3">
									<button
										type="button"
										onClick={() => handleSort("passwordStatus")}
										className="inline-flex items-center gap-1 hover:text-slate-800"
									>
										{t(localizationConstants.dataItColSystemPassword)}
										<ArrowUpDown size={12} />
									</button>
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-100 text-slate-700">
							{sortedItems.map((item) => (
								<tr key={item.id} className="hover:bg-slate-50/60">
									<td className="px-6 py-3 font-medium text-slate-900">{item.category}</td>
									<td className="px-6 py-3">{item.programName}</td>
									<td className="px-6 py-3 text-slate-500">{item.email}</td>
									<td className="px-6 py-3 font-mono text-xs text-slate-500">
										{item.passwordStatus}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}
