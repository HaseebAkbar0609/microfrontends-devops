"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Server, Edit, ArrowUpDown, Plus, Trash2, Check, X } from "lucide-react";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { DataItEmployeeOverview, DataItSystemItem } from "../../types/dataItOverview.types";
import { showToast } from "@/lib/toast";
import { DataItAddSystemDialog } from "./DataItAddSystemDialog";

interface DataItDetailSystemCardProps {
	employee: DataItEmployeeOverview;
	onUpdateEmployee?: (updated: DataItEmployeeOverview) => void;
}

type SortField = keyof DataItSystemItem;

export function DataItDetailSystemCard({
	employee,
	onUpdateEmployee,
}: DataItDetailSystemCardProps) {
	const t = useTranslate();
	const [isEditing, setIsEditing] = useState(false);
	const [items, setItems] = useState<DataItSystemItem[]>(employee.systems);
	const [addDialogOpen, setAddDialogOpen] = useState(false);
	const [sortField, setSortField] = useState<SortField>("programName");
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

	useEffect(() => {
		setItems(employee.systems);
	}, [employee]);

	const handleSort = (field: SortField) => {
		setSortDirection((prev) => (sortField === field && prev === "asc" ? "desc" : "asc"));
		setSortField(field);
	};

	const sortedItems = useMemo(() => {
		return [...items].sort((a, b) => {
			const mult = sortDirection === "asc" ? 1 : -1;
			const valA = String(a[sortField]);
			const valB = String(b[sortField]);
			return mult * valA.localeCompare(valB, undefined, { numeric: true });
		});
	}, [items, sortField, sortDirection]);

	const handleRemoveItem = (id: string) => {
		setItems((prev) => prev.filter((item) => item.id !== id));
	};

	const handleSave = () => {
		const updated: DataItEmployeeOverview = { ...employee, systems: items };
		onUpdateEmployee?.(updated);
		showToast("success", t(localizationConstants.dataItToastSaveSuccess));
		setIsEditing(false);
	};

	const handleCancel = () => {
		setItems(employee.systems);
		setIsEditing(false);
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
				{!isEditing ? (
					<button
						type="button"
						onClick={() => setIsEditing(true)}
						className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none"
					>
						<Edit size={13} />
						<span>{t(localizationConstants.dataItBtnEdit)}</span>
					</button>
				) : (
					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={() => setAddDialogOpen(true)}
							className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
						>
							<Plus size={13} />
							<span>{t(localizationConstants.dataItAddSystemBtn)}</span>
						</button>
						<button
							type="button"
							onClick={handleCancel}
							className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
						>
							<X size={13} />
							<span>{t(localizationConstants.dataItBtnCancel)}</span>
						</button>
						<button
							type="button"
							onClick={handleSave}
							className="inline-flex items-center gap-1 rounded-md bg-slate-950 px-3 py-1 text-xs font-medium text-white hover:bg-slate-800"
						>
							<Check size={13} />
							<span>{t(localizationConstants.dataItBtnSave)}</span>
						</button>
					</div>
				)}
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
					<table className="w-full min-w-[700px] border-collapse text-left text-sm">
						<thead>
							<tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold text-slate-500">
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
								<th className="px-6 py-3">{t(localizationConstants.dataItColSystemCategory)}</th>
								<th className="px-6 py-3">{t(localizationConstants.dataItColSystemEmail)}</th>
								<th className="px-6 py-3">{t(localizationConstants.dataItColSystemPassword)}</th>
								{isEditing && <th className="px-4 py-3 text-right" />}
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-100 text-slate-700">
							{sortedItems.map((item) => (
								<tr key={item.id} className="hover:bg-slate-50/60">
									<td className="px-6 py-3 font-medium text-slate-900">{item.programName}</td>
									<td className="px-6 py-3">{item.category}</td>
									<td className="px-6 py-3 text-slate-500">{item.email}</td>
									<td className="px-6 py-3 font-mono text-xs text-slate-500">
										{item.passwordStatus}
									</td>
									{isEditing && (
										<td className="px-4 py-3 text-right">
											<button
												type="button"
												onClick={() => handleRemoveItem(item.id)}
												className="rounded p-1 text-slate-400 hover:text-rose-600"
											>
												<Trash2 size={14} />
											</button>
										</td>
									)}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}

			<DataItAddSystemDialog
				open={addDialogOpen}
				onOpenChange={setAddDialogOpen}
				existingSystems={items}
				employeeEmail={employee.email}
				onAdd={(newItem) => setItems((prev) => [...prev, newItem])}
			/>
		</div>
	);
}
