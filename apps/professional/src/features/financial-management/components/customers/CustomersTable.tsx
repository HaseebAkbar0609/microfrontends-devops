"use client";

import React from "react";
import { ArrowUpDown, Eye, MoreVertical } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { CustomerOverviewItem } from "../../types/customers.types";

interface CustomersTableProps {
	items: CustomerOverviewItem[];
	isLoading?: boolean;
	onView?: (id: string) => void;
	onMore?: (id: string) => void;
}

export function CustomersTable({
	items,
	isLoading,
	onView,
	onMore,
}: CustomersTableProps) {
	if (isLoading) {
		return (
			<div className="flex h-48 items-center justify-center">
				<p className="text-xs text-slate-500 animate-pulse">
					<Translate text={localizationConstants.loadingLabel} />...
				</p>
			</div>
		);
	}

	if (items.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-16 px-4 text-center">
				<p className="text-sm font-semibold text-slate-700">
					<Translate text={localizationConstants.customerTableNoResults} />
				</p>
			</div>
		);
	}

	return (
		<div className="overflow-x-auto">
			<table className="w-full text-left text-xs text-slate-700 whitespace-nowrap">
				<thead>
					<tr className="border-b border-slate-200 text-slate-500 font-medium text-xs">
						<th className="py-3.5 pl-6 pr-4 font-normal">
							<div className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900">
								<span>
									<Translate text={localizationConstants.customerTableColNo} />
								</span>
								<ArrowUpDown className="h-3 w-3 text-slate-400" />
							</div>
						</th>
						<th className="py-3.5 px-4 font-normal">
							<div className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900">
								<span>
									<Translate text={localizationConstants.customerTableColName} />
								</span>
								<ArrowUpDown className="h-3 w-3 text-slate-400" />
							</div>
						</th>
						<th className="py-3.5 px-4 font-normal">
							<div className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900">
								<span>
									<Translate text={localizationConstants.customerTableColOrgNo} />
								</span>
								<ArrowUpDown className="h-3 w-3 text-slate-400" />
							</div>
						</th>
						<th className="py-3.5 px-4 font-normal">
							<div className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900">
								<span>
									<Translate text={localizationConstants.customerTableColAddress} />
								</span>
								<ArrowUpDown className="h-3 w-3 text-slate-400" />
							</div>
						</th>
						<th className="py-3.5 px-4 font-normal">
							<div className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900">
								<span>
									<Translate text={localizationConstants.customerTableColPostalCode} />
								</span>
								<ArrowUpDown className="h-3 w-3 text-slate-400" />
							</div>
						</th>
						<th className="py-3.5 px-4 font-normal">
							<div className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900">
								<span>
									<Translate text={localizationConstants.customerTableColCity} />
								</span>
								<ArrowUpDown className="h-3 w-3 text-slate-400" />
							</div>
						</th>
						<th className="py-3.5 px-4 font-normal">
							<div className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900">
								<span>
									<Translate text={localizationConstants.customerTableColCountry} />
								</span>
								<ArrowUpDown className="h-3 w-3 text-slate-400" />
							</div>
						</th>
						<th className="py-3.5 px-4 font-normal">
							<div className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900">
								<span>
									<Translate text={localizationConstants.customerTableColPhone} />
								</span>
								<ArrowUpDown className="h-3 w-3 text-slate-400" />
							</div>
						</th>
						<th className="py-3.5 px-4 font-normal">
							<div className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900">
								<span>
									<Translate text={localizationConstants.customerTableColEmail} />
								</span>
								<ArrowUpDown className="h-3 w-3 text-slate-400" />
							</div>
						</th>
						<th className="py-3.5 px-4 font-normal">
							<div className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900">
								<span>
									<Translate text={localizationConstants.customerTableColStatus} />
								</span>
								<ArrowUpDown className="h-3 w-3 text-slate-400" />
							</div>
						</th>
						<th className="py-3.5 pl-4 pr-6 text-right w-20" />
					</tr>
				</thead>
				<tbody className="divide-y divide-slate-100 bg-white">
					{items.map((item) => (
						<tr
							key={item.id}
							className="hover:bg-slate-50/80 transition-colors"
						>
							<td className="py-4 pl-6 pr-4 font-semibold text-slate-900">
								{item.customerNo}
							</td>
							<td className="py-4 px-4 font-semibold text-slate-900">
								{item.name}
							</td>
							<td className="py-4 px-4 text-slate-600 font-mono text-[11px]">
								{item.orgNo || "—"}
							</td>
							<td className="py-4 px-4 text-slate-600">
								{item.address || "—"}
							</td>
							<td className="py-4 px-4 text-slate-600">
								{item.postNr || "—"}
							</td>
							<td className="py-4 px-4 text-slate-600">
								{item.city || "—"}
							</td>
							<td className="py-4 px-4 text-slate-600">
								{item.country || "Sweden"}
							</td>
							<td className="py-4 px-4 text-slate-600">
								{item.phone || "—"}
							</td>
							<td className="py-4 px-4 text-slate-600">
								{item.email || "—"}
							</td>
							<td className="py-4 px-4">
								<span
									className={`inline-flex items-center justify-center rounded-full px-3 py-0.5 text-xs font-semibold ${
										item.status === "active"
											? "bg-emerald-600 text-white"
											: item.status === "prospect"
												? "bg-amber-500 text-white"
												: "bg-slate-300 text-slate-800"
									}`}
								>
									{item.status === "active" ? (
										<Translate text={localizationConstants.customerStatusActive} />
									) : item.status === "prospect" ? (
										<Translate text={localizationConstants.customerStatusProspect} />
									) : (
										<Translate text={localizationConstants.customerStatusInactive} />
									)}
								</span>
							</td>
							<td className="py-4 pl-4 pr-6 text-right">
								<div className="flex items-center justify-end gap-2 text-slate-400">
									<button
										type="button"
										onClick={() => onView?.(item.id)}
										className="p-1 hover:text-slate-800 rounded transition-colors cursor-pointer"
										title="View"
									>
										<Eye className="h-4 w-4" />
									</button>
									<button
										type="button"
										onClick={() => onMore?.(item.id)}
										className="p-1 hover:text-slate-800 rounded transition-colors cursor-pointer"
										title="More"
									>
										<MoreVertical className="h-4 w-4" />
									</button>
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
