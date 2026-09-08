"use client";

import React from "react";
import Link from "next/link";
import {
	ArrowUpRight,
	Building,
	Building2,
	ClipboardList,
	CreditCard,
	ReceiptText,
} from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import {
	WidgetContent as Content,
	WidgetRow as Row,
} from "@/features/widgetdashboard/components/WidgetContent";
import type { WidgetProps } from "@/features/widgetdashboard/types/dashboard";
import type { EconomyDashboardState } from "../../../types/economyDashboard.types";
import {
	formatPercent,
	formatSek,
} from "../../../utils/economyFormatters";

export function createEconomyOperationsWidgets(
	state: EconomyDashboardState,
): Record<string, WidgetProps> {
	const { accountsReceivable, accountsPayable, invoicingPipeline, projectEconomy, orderEconomy } = state;

	return {
		// 11) Kundfordringar (A/R)
		accountsReceivable: {
			title: localizationConstants.accountsReceivableWidgetTitle,
			icon: CreditCard,
			content: (
				<Content>
					<Row
						label={localizationConstants.arTotalOpen}
						value={<span className="font-bold text-slate-900">{formatSek(accountsReceivable.totalOpen)}</span>}
					/>
					<Row
						label={localizationConstants.arNotDue}
						value={formatSek(accountsReceivable.notDue)}
					/>
					<div className="space-y-1 py-1 border-t border-slate-200/60">
						<div className="flex items-center justify-between text-[11px] text-amber-700">
							<span>
								<Translate text={localizationConstants.arOverdue1to30} />
							</span>
							<span className="font-medium">{formatSek(accountsReceivable.overdue1to30)}</span>
						</div>
						<div className="flex items-center justify-between text-[11px] text-orange-700">
							<span>
								<Translate text={localizationConstants.arOverdue31to60} />
							</span>
							<span className="font-medium">{formatSek(accountsReceivable.overdue31to60)}</span>
						</div>
						<div className="flex items-center justify-between text-[11px] text-rose-700 font-semibold">
							<span>
								<Translate text={localizationConstants.arOverdue60Plus} />
							</span>
							<span>{formatSek(accountsReceivable.overdue60Plus)}</span>
						</div>
					</div>

					<div className="rounded-md bg-slate-50 p-2 border border-slate-200/60 text-xs">
						<span className="text-[10px] uppercase font-semibold text-slate-500 block">
							<Translate text={localizationConstants.arTopOverdueCustomer} />
						</span>
						<div className="flex items-baseline justify-between mt-0.5 font-medium text-slate-800">
							<span>{accountsReceivable.topOverdueCustomer}</span>
							<span>
								{formatSek(accountsReceivable.topOverdueAmount)} ({accountsReceivable.topOverdueDays}{" "}
								<Translate text={localizationConstants.daysShortUnit} />)
							</span>
						</div>
					</div>

					<div className="pt-1 flex items-center justify-between">
						<Link
							href="/module/financial-management/invoice"
							className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:text-blue-800 transition-colors"
						>
							<Translate text={localizationConstants.viewInvoicesAction} />
							<ArrowUpRight size={12} />
						</Link>
					</div>
				</Content>
			),
		},

		// 12) Leverantörsskulder (A/P)
		accountsPayable: {
			title: localizationConstants.accountsPayableWidgetTitle,
			icon: Building2,
			content: (
				<Content>
					<Row
						label={localizationConstants.apTotalOpen}
						value={<span className="font-bold text-slate-900">{formatSek(accountsPayable.totalOpen)}</span>}
					/>
					<div className="space-y-1 py-1 border-t border-slate-200/60">
						<Row
							label={localizationConstants.apDue7Days}
							value={formatSek(accountsPayable.dueNext7Days)}
						/>
						<Row
							label={localizationConstants.apDue8to30Days}
							value={formatSek(accountsPayable.due8to30Days)}
						/>
						<div className="flex items-center justify-between text-xs text-rose-700 font-semibold">
							<span>
								<Translate text={localizationConstants.apOverdue} />
							</span>
							<span>{formatSek(accountsPayable.overdue)}</span>
						</div>
					</div>

					<div className="rounded-md bg-slate-50 p-2 border border-slate-200/60 text-xs">
						<span className="text-[10px] uppercase font-semibold text-slate-500 block">
							<Translate text={localizationConstants.apLargestPayment} />
						</span>
						<div className="flex items-baseline justify-between mt-0.5 font-medium text-slate-800">
							<span>{accountsPayable.largestUpcomingPaymentSupplier}</span>
							<span>
								{formatSek(accountsPayable.largestUpcomingPaymentAmount)} (<Translate text={accountsPayable.largestUpcomingDueDateKey} />)
							</span>
						</div>
					</div>

					<div className="pt-1 flex items-center justify-between">
						<Link
							href="/module/financial-management/economy"
							className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:text-blue-800 transition-colors"
						>
							<Translate text={localizationConstants.viewExpensesAction} />
							<ArrowUpRight size={12} />
						</Link>
					</div>
				</Content>
			),
		},

		// 14) Fakturering
		invoicing: {
			title: localizationConstants.invoicingWidgetTitle,
			icon: ReceiptText,
			content: (
				<Content>
					<Row
						label={localizationConstants.invDrafts}
						value={`${invoicingPipeline.draftCount} (${formatSek(invoicingPipeline.draftAmount)})`}
					/>
					<Row
						label={localizationConstants.invReadyToSend}
						value={`${invoicingPipeline.readyCount} (${formatSek(invoicingPipeline.readyAmount)})`}
					/>
					<Row
						label={localizationConstants.invSentMtd}
						value={
							<span className="font-semibold text-emerald-700">
								{invoicingPipeline.sentCount} ({formatSek(invoicingPipeline.sentAmount)})
							</span>
						}
					/>
					<Row
						label={localizationConstants.invCreditNotes}
						value={
							<span className="text-slate-600">
								{invoicingPipeline.creditCount} ({formatSek(invoicingPipeline.creditAmount)})
							</span>
						}
					/>
					<div className="pt-1 flex items-center justify-between">
						<Link
							href="/module/financial-management/invoice"
							className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:text-blue-800 transition-colors"
						>
							<Translate text={localizationConstants.viewInvoicesAction} />
							<ArrowUpRight size={12} />
						</Link>
					</div>
				</Content>
			),
		},

		// 16) Projektekonomi
		projectEconomy: {
			title: localizationConstants.projectEconomyWidgetTitle,
			icon: Building,
			content: (
				<Content>
					{projectEconomy.map((proj) => (
						<div key={proj.id} className="space-y-1 pb-1.5 pt-0.5 border-b border-slate-200/40 last:border-0 last:pb-0">
							<div className="flex items-baseline justify-between text-xs font-semibold text-slate-800">
								<span>{proj.name}</span>
								<span className="text-[11px] font-medium text-slate-500">
									<Translate text={localizationConstants.orderAvgExpectedMargin} />: {formatPercent(proj.marginPercent, 0)}
								</span>
							</div>
							<div className="h-1.5 w-full rounded-full bg-slate-200">
								<div
									className="h-1.5 rounded-full bg-blue-600"
									style={{ width: `${proj.progressPercent}%` }}
								/>
							</div>
							<div className="flex items-center justify-between text-[10px] text-slate-500">
								<span>
									<Translate text={localizationConstants.projProgressLabel} />: {proj.progressPercent}%
								</span>
								<span>
									<Translate text={localizationConstants.forecast} />: {formatSek(proj.forecastCompletionAmount)}
								</span>
							</div>
						</div>
					))}
				</Content>
			),
		},

		// 17) Orderekonomi
		orderEconomy: {
			title: localizationConstants.orderEconomyWidgetTitle,
			icon: ClipboardList,
			content: (
				<Content>
					<Row
						label={localizationConstants.orderNewOrders}
						value={`${orderEconomy.newOrdersCount} (${formatSek(orderEconomy.newOrdersAmount)})`}
					/>
					<Row
						label={localizationConstants.orderBacklogValue}
						value={<span className="font-bold text-slate-900">{formatSek(orderEconomy.backlogAmount)}</span>}
					/>
					<Row
						label={localizationConstants.orderAvgExpectedMargin}
						value={formatPercent(orderEconomy.avgExpectedMarginPercent, 0)}
					/>
					<div className="mt-1.5 rounded-md bg-slate-50 p-2 border border-slate-200/60 text-xs">
						<span className="text-[10px] uppercase font-semibold text-slate-500 block">
							<Translate text={localizationConstants.orderLargestOrder} />:
						</span>
						<div className="flex items-baseline justify-between mt-0.5 font-medium text-slate-800">
							<span>{orderEconomy.largestOrderTitle}</span>
							<span className="font-bold">{formatSek(orderEconomy.largestOrderAmount)}</span>
						</div>
					</div>
				</Content>
			),
		},
	};
}
