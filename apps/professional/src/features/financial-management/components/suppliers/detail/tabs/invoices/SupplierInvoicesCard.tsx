"use client";

import React from "react";
import { Receipt } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { SupplierInvoiceRow } from "../../../../../types/supplierDetail.types";
import { SupplierDetailCard } from "../../cards/SupplierDetailCard";

interface SupplierInvoicesCardProps {
	invoices?: SupplierInvoiceRow[];
}

export function SupplierInvoicesCard({ invoices = [] }: SupplierInvoicesCardProps) {
	return (
		<SupplierDetailCard
			title={<Translate text={localizationConstants.supplierDetailTabInvoices} />}
			icon={<Receipt className="h-5 w-5" />}
		>
			{invoices.length === 0 ? (
				<div className="py-8 text-center text-xs text-slate-400">
					<Translate text={localizationConstants.supplierDetailInvoicesEmpty} />
				</div>
			) : (
				<div className="overflow-hidden rounded-lg border border-slate-200">
					<table className="w-full text-left text-xs">
						<thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
							<tr>
								<th className="py-2.5 px-3">
									<Translate text={localizationConstants.supplierInvoiceColNumber} />
								</th>
								<th className="py-2.5 px-3">
									<Translate text={localizationConstants.supplierInvoiceColDate} />
								</th>
								<th className="py-2.5 px-3">
									<Translate text={localizationConstants.supplierInvoiceColDueDate} />
								</th>
								<th className="py-2.5 px-3">
									<Translate text={localizationConstants.supplierInvoiceColTotal} />
								</th>
								<th className="py-2.5 px-3 text-right">
									<Translate text={localizationConstants.supplierInvoiceColStatus} />
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-100 bg-white">
							{invoices.map((inv) => (
								<tr key={inv.id} className="hover:bg-slate-50">
									<td className="py-2.5 px-3 font-medium text-slate-900">{inv.invoiceNumber}</td>
									<td className="py-2.5 px-3 text-slate-600">{inv.date}</td>
									<td className="py-2.5 px-3 text-slate-600">{inv.dueDate}</td>
									<td className="py-2.5 px-3 font-semibold text-slate-800">{inv.totalAmount}</td>
									<td className="py-2.5 px-3 text-right">
										<span
											className={`inline-flex items-center justify-center rounded-md px-2.5 py-0.5 text-xs font-semibold text-white ${
												inv.status === "paid"
													? "bg-[#16A34A]"
													: inv.status === "pending"
														? "bg-amber-500"
														: "bg-rose-500"
											}`}
										>
											{inv.status === "paid" ? (
												<Translate text={localizationConstants.supplierInvoiceStatusPaid} />
											) : inv.status === "pending" ? (
												<Translate text={localizationConstants.supplierInvoiceStatusPending} />
											) : (
												<Translate text={localizationConstants.supplierInvoiceStatusOverdue} />
											)}
										</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</SupplierDetailCard>
	);
}
