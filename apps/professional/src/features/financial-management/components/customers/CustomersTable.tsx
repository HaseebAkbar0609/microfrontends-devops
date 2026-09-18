"use client";

import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { CustomerOverviewItem } from "../../types/customers.types";

interface CustomersTableProps {
	items: CustomerOverviewItem[];
	isLoading?: boolean;
}

export function CustomersTable({ items, isLoading }: CustomersTableProps) {
	const t = useTranslate();

	if (isLoading) {
		return (
			<div className="flex h-48 items-center justify-center">
				<p className="text-xs text-slate-500 animate-pulse">
					{t(localizationConstants.loadingLabel)}...
				</p>
			</div>
		);
	}

	if (items.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-16 px-4 text-center">
				<p className="text-sm font-semibold text-slate-700">
					{t(localizationConstants.noDataFound)}
				</p>
			</div>
		);
	}

	return (
		<div className="overflow-x-auto">
			<table className="w-full text-left text-xs text-slate-700">
				<thead className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
					<tr>
						<th className="py-3.5 pl-6 pr-3">{t(localizationConstants.customerRegisterCustomerNo)}</th>
						<th className="px-3 py-3.5">{t(localizationConstants.customerRegisterCustomer)}</th>
						<th className="px-3 py-3.5">{t(localizationConstants.customerRegisterRegNo)}</th>
						<th className="px-3 py-3.5">{t(localizationConstants.customerRegisterCity)}</th>
						<th className="px-3 py-3.5">{t(localizationConstants.contactInformation)}</th>
						<th className="py-3.5 pl-3 pr-6 text-right">{t(localizationConstants.customerRegisterStatus)}</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-slate-100">
					{items.map((item) => (
						<tr
							key={item.id}
							className="hover:bg-slate-50/80 transition-colors"
						>
							<td className="py-4 pl-6 pr-3 font-semibold text-slate-900">
								{item.customerNo}
							</td>
							<td className="px-3 py-4">
								<div className="font-semibold text-slate-900">{item.name}</div>
								{item.category && (
									<div className="text-[11px] text-slate-400">{item.category}</div>
								)}
							</td>
							<td className="px-3 py-4 font-mono text-[11px] text-slate-600">
								{item.orgNo || "—"}
							</td>
							<td className="px-3 py-4">
								<div className="flex items-center gap-1.5 text-slate-600">
									<MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
									<span>{item.city ? `${item.city}` : "—"}</span>
								</div>
							</td>
							<td className="px-3 py-4 space-y-1">
								{item.email && (
									<div className="flex items-center gap-1.5 text-slate-600">
										<Mail className="h-3 w-3 text-slate-400 shrink-0" />
										<span className="truncate max-w-[180px]">{item.email}</span>
									</div>
								)}
								{item.phone && (
									<div className="flex items-center gap-1.5 text-slate-600">
										<Phone className="h-3 w-3 text-slate-400 shrink-0" />
										<span>{item.phone}</span>
									</div>
								)}
							</td>
							<td className="py-4 pl-3 pr-6 text-right">
								<span
									className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${
										item.status === "active"
											? "bg-emerald-50 text-emerald-700 border border-emerald-200"
											: item.status === "prospect"
												? "bg-amber-50 text-amber-700 border border-amber-200"
												: "bg-slate-100 text-slate-600 border border-slate-200"
									}`}
								>
									{item.status === "active"
										? t(localizationConstants.activeStatus)
										: item.status === "prospect"
											? t(localizationConstants.prospektStatus)
											: t(localizationConstants.inactiveStatus)}
								</span>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
