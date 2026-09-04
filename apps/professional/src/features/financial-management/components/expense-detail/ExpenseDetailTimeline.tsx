"use client";

import React from "react";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { ExpenseItem, ExpenseTimelineEvent } from "../../types/expense.types";

interface ExpenseDetailTimelineProps {
	expense: ExpenseItem;
}

export function ExpenseDetailTimeline({ expense }: ExpenseDetailTimelineProps) {
	const timeline: ExpenseTimelineEvent[] = expense.timeline || [
		{
			id: "tl-1",
			titleKey: "expenseTimelineRegistered",
			date: expense.date,
			user: expense.attestResponsible || "System",
			status: "completed",
		},
		{
			id: "tl-2",
			titleKey: "expenseTimelineApproved",
			date: expense.approvalStatus === "approved" ? expense.date : "-",
			user: expense.approverName || "-",
			status: expense.approvalStatus === "approved" ? "completed" : "current",
		},
		{
			id: "tl-3",
			titleKey: "expenseTimelinePaymentSent",
			date: expense.paymentDate || "-",
			user: expense.paymentDate ? "Bankgiro" : "-",
			status: expense.paymentDate ? "completed" : "pending",
		},
	];

	return (
		<div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs mb-6">
			<h3 className="text-sm font-semibold text-slate-900 mb-4">
				<Translate text={localizationConstants.expenseDetailTimelineTitle} />
			</h3>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
				{timeline.map((event) => {
					const isCompleted = event.status === "completed";
					const isCurrent = event.status === "current";

					return (
						<div
							key={event.id}
							className={`p-3 rounded-lg border text-xs flex items-start gap-3 transition-colors ${
								isCompleted
									? "bg-emerald-50/40 border-emerald-200"
									: isCurrent
										? "bg-amber-50/40 border-amber-200"
										: "bg-slate-50/40 border-slate-200 opacity-60"
							}`}
						>
							<div className="mt-0.5">
								{isCompleted ? (
									<CheckCircle2 className="h-4 w-4 text-emerald-600" />
								) : isCurrent ? (
									<Clock className="h-4 w-4 text-amber-600" />
								) : (
									<Circle className="h-4 w-4 text-slate-300" />
								)}
							</div>

							<div>
								<span className="font-bold text-slate-900 block text-xs">
									{event.titleKey in localizationConstants ? (
										<Translate
											text={
												localizationConstants[
													event.titleKey as keyof typeof localizationConstants
												]
											}
										/>
									) : (
										event.titleKey
									)}
								</span>
								<span className="text-slate-500 block text-[11px] mt-0.5">
									{event.date !== "-" ? (
										event.date
									) : (
										<Translate text={localizationConstants.expenseDetailTimelineNotPerformed} />
									)}
								</span>
								{event.user && event.user !== "-" && (
									<span className="text-slate-400 block text-[11px]">
										{event.user}
									</span>
								)}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default ExpenseDetailTimeline;
