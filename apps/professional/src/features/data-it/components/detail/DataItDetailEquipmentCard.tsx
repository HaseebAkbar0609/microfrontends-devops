"use client";

import React, { useState, useMemo } from "react";
import { Laptop, Edit, ArrowUpDown } from "lucide-react";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { DataItEmployeeOverview, DataItEquipmentItem } from "../../types/dataItOverview.types";
import { showToast } from "@/lib/toast";

interface DataItDetailEquipmentCardProps {
	employee: DataItEmployeeOverview;
}

type SortField = keyof DataItEquipmentItem;

export function DataItDetailEquipmentCard({
	employee,
}: DataItDetailEquipmentCardProps) {
	const t = useTranslate();
	const [sortField, setSortField] = useState<SortField>("id");
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

	const handleSort = (field: SortField) => {
		setSortDirection((prev) =>
			sortField === field && prev === "asc" ? "desc" : "asc",
		);
		setSortField(field);
	};

	const sortedItems = useMemo(() => {
		return [...employee.equipment].sort((a, b) => {
			const mult = sortDirection === "asc" ? 1 : -1;
			const valA = String(a[sortField]);
			const valB = String(b[sortField]);
			return mult * valA.localeCompare(valB, undefined, { numeric: true });
		});
	}, [employee.equipment, sortField, sortDirection]);

	const handleEdit = () => {
		showToast("info", t(localizationConstants.dataItToastComingSoon));
	};

	return (
		<div className="rounded-lg border border-slate-200 bg-white shadow-sm">
			{/* Card Header */}
			<div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
				<div className="flex items-center gap-2.5">
					<Laptop size={18} className="text-slate-600" />
					<h3 className="text-base font-semibold text-slate-900">
						{t(localizationConstants.dataItEquipmentCardTitle)}
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

			{/* Equipment Table */}
			{sortedItems.length === 0 ? (
				<div className="p-8 text-center">
					<p className="text-sm font-medium text-slate-600">
						{t(localizationConstants.dataItEmptyEquipment)}
					</p>
					<p className="mt-1 text-xs text-slate-400">
						{t(localizationConstants.dataItEmptyEquipmentDesc)}
					</p>
				</div>
			) : (
				<div className="overflow-x-auto">
					<table className="w-full min-w-[700px] border-collapse text-left text-sm">
						<thead>
							<tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold text-slate-500">
								<th className="px-6 py-3">
									<button
										type="button"
										onClick={() => handleSort("id")}
										className="inline-flex items-center gap-1 hover:text-slate-800"
									>
										{t(localizationConstants.dataItColEquipmentId)}
										<ArrowUpDown size={12} />
									</button>
								</th>
								<th className="px-6 py-3">
									<button
										type="button"
										onClick={() => handleSort("category")}
										className="inline-flex items-center gap-1 hover:text-slate-800"
									>
										{t(localizationConstants.dataItColEquipmentCategory)}
										<ArrowUpDown size={12} />
									</button>
								</th>
								<th className="px-6 py-3">
									<button
										type="button"
										onClick={() => handleSort("type")}
										className="inline-flex items-center gap-1 hover:text-slate-800"
									>
										{t(localizationConstants.dataItColEquipmentType)}
										<ArrowUpDown size={12} />
									</button>
								</th>
								<th className="px-6 py-3">
									<button
										type="button"
										onClick={() => handleSort("brand")}
										className="inline-flex items-center gap-1 hover:text-slate-800"
									>
										{t(localizationConstants.dataItColEquipmentBrand)}
										<ArrowUpDown size={12} />
									</button>
								</th>
								<th className="px-6 py-3">
									<button
										type="button"
										onClick={() => handleSort("model")}
										className="inline-flex items-center gap-1 hover:text-slate-800"
									>
										{t(localizationConstants.dataItColEquipmentModel)}
										<ArrowUpDown size={12} />
									</button>
								</th>
								<th className="px-6 py-3">
									<button
										type="button"
										onClick={() => handleSort("serialNumber")}
										className="inline-flex items-center gap-1 hover:text-slate-800"
									>
										{t(localizationConstants.dataItColEquipmentSerial)}
										<ArrowUpDown size={12} />
									</button>
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-100 text-slate-700">
							{sortedItems.map((item) => (
								<tr key={item.id} className="hover:bg-slate-50/60">
									<td className="px-6 py-3 font-medium text-slate-900">{item.id}</td>
									<td className="px-6 py-3">{item.category}</td>
									<td className="px-6 py-3">{item.type}</td>
									<td className="px-6 py-3">{item.brand}</td>
									<td className="px-6 py-3">{item.model}</td>
									<td className="px-6 py-3 font-mono text-xs text-slate-500">
										{item.serialNumber}
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
