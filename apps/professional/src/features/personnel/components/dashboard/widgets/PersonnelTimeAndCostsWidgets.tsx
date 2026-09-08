"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
	ArrowUpRight,
	Bot,
	Clock,
	Coins,
	Send,
	Sparkles,
} from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import {
	WidgetContent as Content,
	WidgetRow as Row,
} from "@/features/widgetdashboard/components/WidgetContent";
import type { WidgetProps } from "@/features/widgetdashboard/types/dashboard";
import type { PersonnelDashboardState } from "../../../types/personnelDashboard.types";
import { PERSONNEL_MODULE_BASE_URL } from "../../../constants/personnelNav.config";

function formatSek(amount: number): string {
	return `${amount.toLocaleString("sv-SE")} SEK`;
}

interface AiWidgetContentProps {
	state: PersonnelDashboardState;
}

function AiPersonalAssistantContent({ state: _state }: AiWidgetContentProps) {
	const t = useTranslate();
	const [activePrompt, setActivePrompt] = useState<string | null>(null);
	const [customInput, setCustomInput] = useState("");
	const [responseMessage, setResponseMessage] = useState<string | null>(null);

	const handleSelectPrompt = (promptKey: string, responseKey: string) => {
		setActivePrompt(promptKey);
		setResponseMessage(t(responseKey));
	};

	const handleSend = (e: React.FormEvent) => {
		e.preventDefault();
		if (!customInput.trim()) return;
		setActivePrompt("custom");
		setResponseMessage(
			`${t(localizationConstants.wAiResponseGeneral)}: "${customInput.trim()}"`,
		);
		setCustomInput("");
	};

	return (
		<Content>
			<div className="space-y-1.5">
				<p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
					<Translate text={localizationConstants.wAiRecentAdvice} />
				</p>

				<div className="space-y-1">
					<button
						type="button"
						onClick={() =>
							handleSelectPrompt(
								localizationConstants.wAiPromptMissingReports,
								localizationConstants.wAiResponseReminderSent,
							)
						}
						className={`w-full text-left text-xs p-1.5 rounded border transition-colors ${
							activePrompt === localizationConstants.wAiPromptMissingReports
								? "border-blue-500 bg-blue-50 text-blue-900 font-medium"
								: "border-slate-200 hover:border-blue-300 bg-white text-slate-700"
						}`}
					>
						⚠️ <Translate text={localizationConstants.wAiPromptMissingReports} />
					</button>

					<button
						type="button"
						onClick={() =>
							handleSelectPrompt(
								localizationConstants.wAiPromptStaffingGap,
								localizationConstants.wAiResponseStaffingAnalysis,
							)
						}
						className={`w-full text-left text-xs p-1.5 rounded border transition-colors ${
							activePrompt === localizationConstants.wAiPromptStaffingGap
								? "border-blue-500 bg-blue-50 text-blue-900 font-medium"
								: "border-slate-200 hover:border-blue-300 bg-white text-slate-700"
						}`}
					>
						💡 <Translate text={localizationConstants.wAiPromptStaffingGap} />
					</button>
				</div>

				{responseMessage && (
					<div className="mt-2 rounded-md bg-blue-50/80 p-2 border border-blue-200 text-xs text-blue-900 flex items-start gap-1.5">
						<Sparkles className="h-3.5 w-3.5 text-blue-600 shrink-0 mt-0.5" />
						<span>{responseMessage}</span>
					</div>
				)}
			</div>

			<form onSubmit={handleSend} className="pt-2 border-t border-slate-200/60 flex items-center gap-1.5">
				<input
					type="text"
					value={customInput}
					onChange={(e) => setCustomInput(e.target.value)}
					placeholder={t(localizationConstants.wAiAskAssistantPlaceholder)}
					className="flex-1 rounded border border-slate-200 px-2 py-1 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
				/>
				<button
					type="submit"
					className="rounded bg-blue-600 p-1 text-white hover:bg-blue-700 transition-colors"
					title={t(localizationConstants.wAiSendButton)}
					aria-label={t(localizationConstants.wAiSendButton)}
				>
					<Send className="h-3.5 w-3.5" />
				</button>
			</form>
		</Content>
	);
}

export function createPersonnelTimeAndCostsWidgets(
	state: PersonnelDashboardState,
): Record<string, WidgetProps> {
	const { timeReporting, costs } = state;

	return {
		// 5) Tidrapportering
		timeReporting: {
			title: localizationConstants.wTimeReportingTitle,
			icon: Clock,
			content: (
				<Content>
					<div className="flex items-center justify-between pb-1.5">
						<div className="flex items-baseline gap-1.5">
							<span className="text-2xl font-bold tracking-tight text-slate-900">
								{timeReporting.submitted}
							</span>
							<span className="text-xs font-medium text-slate-500">
								/ {timeReporting.total}
							</span>
						</div>
						<span className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700">
							<span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
							{timeReporting.missing} <Translate text={localizationConstants.wMissingReports} />
						</span>
					</div>

					<div className="space-y-1 pt-1.5 border-t border-slate-200/60 text-xs">
						<Row
							label={localizationConstants.wApprovedReports}
							value={`${timeReporting.approved}`}
						/>
						<Row
							label={localizationConstants.wPendingReview}
							value={`${timeReporting.pending}`}
						/>
						<Row
							label={localizationConstants.wTotalHoursLogged}
							value={`${timeReporting.totalHoursLogged} h`}
						/>
						<Row
							label={localizationConstants.wOvertimeHours}
							value={`${timeReporting.overtimeHours} h`}
						/>
					</div>

					<div className="pt-2 border-t border-slate-200/60 flex items-center justify-end text-xs">
						<Link
							href={`${PERSONNEL_MODULE_BASE_URL}/worktime`}
							className="inline-flex items-center gap-0.5 text-blue-600 hover:text-blue-800 font-medium"
						>
							<Translate text={localizationConstants.viewTimeReportingAction} />
							<ArrowUpRight className="h-3 w-3" />
						</Link>
					</div>
				</Content>
			),
		},

		// 6) Personalkostnader
		personnelCosts: {
			title: localizationConstants.wPersonnelCostsTitle,
			icon: Coins,
			content: (
				<Content>
					<div className="flex items-center justify-between pb-1.5">
						<div>
							<p className="text-2xl font-bold tracking-tight text-slate-900">
								{formatSek(costs.totalCostSek)}
							</p>
							<p className="text-[11px] text-slate-500">
								<Translate text={localizationConstants.wBudgetLabel} />: {formatSek(costs.budgetSek)}
							</p>
						</div>
						<span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
							<span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
							{formatSek(Math.abs(costs.varianceSek))}{" "}
							<Translate text={localizationConstants.wUnderBudget} />
						</span>
					</div>

					<div className="space-y-1 pt-1.5 border-t border-slate-200/60 text-xs">
						<Row
							label={localizationConstants.wSalaries}
							value={formatSek(costs.salariesSek)}
						/>
						<Row
							label={localizationConstants.wOvertimeCost}
							value={formatSek(costs.overtimeSek)}
						/>
						<Row
							label={localizationConstants.wBenefitsSocialFees}
							value={formatSek(costs.benefitsSek)}
						/>
					</div>

					<div className="pt-2 border-t border-slate-200/60 flex items-center justify-end text-xs">
						<Link
							href="/module/financial-management/economy"
							className="inline-flex items-center gap-0.5 text-blue-600 hover:text-blue-800 font-medium"
						>
							<Translate text={localizationConstants.viewReportsAction} />
							<ArrowUpRight className="h-3 w-3" />
						</Link>
					</div>
				</Content>
			),
		},

		// 7) AI Personalassistent
		aiPersonalAssistant: {
			title: localizationConstants.wAiAssistantTitle,
			icon: Bot,
			content: <AiPersonalAssistantContent state={state} />,
		},
	};
}
