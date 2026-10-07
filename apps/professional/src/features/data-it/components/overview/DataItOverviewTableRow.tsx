"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Eye, MoreHorizontal, Trash2, Archive, RotateCcw, Edit } from "lucide-react";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { formatCurrency } from "@/utils/formatCurrency";
import type { DataItEmployeeOverview } from "../../types/dataItOverview.types";
import { DATA_IT_MODULE_BASE_URL } from "../../constants/dataItNav.config";

interface DataItOverviewTableRowProps {
	emp: DataItEmployeeOverview;
	onRequestDelete: (emp: DataItEmployeeOverview) => void;
	onRequestStatusChange: (emp: DataItEmployeeOverview) => void;
}

export function DataItOverviewTableRow({
	emp,
	onRequestDelete,
	onRequestStatusChange,
}: DataItOverviewTableRowProps) {
	const t = useTranslate();
	const [menuOpen, setMenuOpen] = useState(false);

	const totalCost =
		emp.equipment.reduce((s, e) => s + e.monthlyCost, 0) +
		emp.systems.reduce((s, sys) => s + sys.monthlyCost, 0);
	const formattedEq = String(emp.equipment.length).padStart(2, "0");
	const formattedSys = String(emp.systems.length).padStart(2, "0");
	const detailHref = `${DATA_IT_MODULE_BASE_URL}/overview/${encodeURIComponent(emp.id)}`;

	return (
		<tr className="transition-colors hover:bg-slate-50/70">
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
				{formatCurrency(totalCost)} {t(localizationConstants.dataItCurrencyPerMonth)}
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
						onClick={() => setMenuOpen((prev) => !prev)}
						className="inline-flex h-7 w-7 items-center justify-center rounded text-slate-400 hover:bg-slate-100 hover:text-slate-700"
					>
						<MoreHorizontal size={16} />
					</button>

					{menuOpen && (
						<>
							<div className="fixed inset-0 z-20" onClick={() => setMenuOpen(false)} />
							<div className="absolute right-0 top-full z-30 mt-1 min-w-[130px] rounded-md border border-slate-200 bg-white py-1 text-left shadow-lg">
								<Link
									href={detailHref}
									className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
									onClick={() => setMenuOpen(false)}
								>
									<Edit size={13} />
									<span>{t(localizationConstants.dataItActionEdit)}</span>
								</Link>
								<button
									type="button"
									onClick={() => {
										setMenuOpen(false);
										onRequestStatusChange(emp);
									}}
									className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
								>
									{emp.status === "ACTIVE" ? (
										<>
											<Archive size={13} />
											<span>{t(localizationConstants.dataItActionArchive)}</span>
										</>
									) : (
										<>
											<RotateCcw size={13} />
											<span>{t(localizationConstants.dataItActionActivate)}</span>
										</>
									)}
								</button>
								<button
									type="button"
									onClick={() => {
										setMenuOpen(false);
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
}
