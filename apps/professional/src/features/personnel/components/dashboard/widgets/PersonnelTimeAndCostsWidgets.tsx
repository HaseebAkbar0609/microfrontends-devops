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
			emptyTitle: localizationConstants.wTimeReportingTitle,
			emptyDescription: localizationConstants.wTimeReportingDesc,
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

					<div className="space-y-1.5 pt-1.5 border-t border-slate-200/60 text-xs">
						<Row
							label={localizationConstants.wApprovedReports}
							value={`${timeReporting.approved}`}
						/>
						<Row
							label={localizationConstants.wPendingReview}
							value={
								<span className="inline-flex items-center gap-1 font-semibold text-amber-700">
									<span>{timeReporting.pending}</span>
									<span className="h-2 w-2 rounded-full bg-amber-500" />
								</span>
							}
						/>
						<Row
							label={localizationConstants.wTotalHoursLogged}
							value={`${timeReporting.totalHoursLogged} h`}
						/>
					</div>

					<div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs mt-auto">
						<span className="text-slate-500 font-medium whitespace-nowrap">
							{timeReporting.overtimeHours} h <Translate text={localizationConstants.wOvertimeHours} />
						</span>
						<Link
							href={`${PERSONNEL_MODULE_BASE_URL}/worktime`}
							className="inline-flex items-center gap-0.5 text-blue-600 hover:text-blue-800 font-medium shrink-0"
						>
							<Translate text={localizationConstants.viewTimeReportingAction} />
							<ArrowUpRight className="h-3 w-3" />
						</Link>
					</div>
				</Content>
			),
			expandedContent: (
				<div className="space-y-4">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
						<div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
							<span className="text-xs text-slate-500 font-medium">Inlämnade</span>
							<p className="text-2xl font-bold text-slate-900 mt-1">{timeReporting.submitted} / {timeReporting.total}</p>
						</div>
						<div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
							<span className="text-xs text-emerald-800 font-medium">Godkända rapporter</span>
							<p className="text-2xl font-bold text-emerald-900 mt-1">{timeReporting.approved}</p>
						</div>
						<div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
							<span className="text-xs text-amber-800 font-medium">Väntar på granskning</span>
							<p className="text-2xl font-bold text-amber-900 mt-1">{timeReporting.pending}</p>
						</div>
						<div className="p-3 rounded-lg bg-rose-50 border border-rose-200">
							<span className="text-xs text-rose-800 font-medium">Saknade rapporter</span>
							<p className="text-2xl font-bold text-rose-900 mt-1">{timeReporting.missing}</p>
						</div>
					</div>

					<div className="rounded-lg border border-slate-200 p-4 space-y-2 bg-white text-xs">
						<h4 className="font-semibold text-sm text-slate-900">Total Arbetstid denna vecka</h4>
						<div className="flex justify-between py-1 border-b border-slate-100">
							<span>Loggade timmar totalt</span>
							<span className="font-bold text-slate-900">{timeReporting.totalHoursLogged} timmar</span>
						</div>
						<div className="flex justify-between py-1 border-b border-slate-100">
							<span>Övertidstimmar</span>
							<span className="font-bold text-amber-700">{timeReporting.overtimeHours} timmar</span>
						</div>
					</div>
				</div>
			),
		},

		// 6) Personalkostnader
		personnelCosts: {
			title: localizationConstants.wPersonnelCostsTitle,
			icon: Coins,
			emptyTitle: localizationConstants.wPersonnelCostsTitle,
			emptyDescription: localizationConstants.wPersonnelCostsDesc,
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
						<span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 whitespace-nowrap">
							<span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
							{formatSek(Math.abs(costs.varianceSek))}{" "}
							<Translate text={localizationConstants.wUnderBudget} />
						</span>
					</div>

					<div className="space-y-1.5 pt-1.5 border-t border-slate-200/60 text-xs">
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

					<div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs mt-auto">
						<span className="text-slate-500 font-medium whitespace-nowrap">
							<Translate text={localizationConstants.wBudgetLabel} />: {formatSek(costs.budgetSek)}
						</span>
						<Link
							href="/module/financial-management/economy"
							className="inline-flex items-center gap-0.5 text-blue-600 hover:text-blue-800 font-medium shrink-0"
						>
							<Translate text={localizationConstants.viewReportsAction} />
							<ArrowUpRight className="h-3 w-3" />
						</Link>
					</div>
				</Content>
			),
			expandedContent: (
				<div className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
						<div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
							<span className="text-xs text-slate-500 font-medium">Faktisk Kostnad Månad</span>
							<p className="text-2xl font-bold text-slate-900 mt-1">{formatSek(costs.totalCostSek)}</p>
						</div>
						<div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
							<span className="text-xs text-slate-500 font-medium">Budgeterad Kostnad</span>
							<p className="text-2xl font-bold text-slate-900 mt-1">{formatSek(costs.budgetSek)}</p>
						</div>
						<div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
							<span className="text-xs text-emerald-800 font-medium">Avvikelse</span>
							<p className="text-2xl font-bold text-emerald-900 mt-1">{formatSek(costs.varianceSek)}</p>
							<p className="text-[11px] text-emerald-700 mt-0.5 font-medium">Under budgeterad nivå</p>
						</div>
					</div>

					<div className="rounded-lg border border-slate-200 p-4 space-y-2 bg-white text-xs">
						<h4 className="font-semibold text-sm text-slate-900">Kostnadsspecifikation</h4>
						<div className="flex justify-between py-1.5 border-b border-slate-100">
							<span>Grundlöner & arvoden</span>
							<span className="font-bold text-slate-900">{formatSek(costs.salariesSek)}</span>
						</div>
						<div className="flex justify-between py-1.5 border-b border-slate-100">
							<span>Övertidskostnader</span>
							<span className="font-bold text-slate-900">{formatSek(costs.overtimeSek)}</span>
						</div>
						<div className="flex justify-between py-1.5 border-b border-slate-100">
							<span>Arbetsgivaravgifter & förmåner (Sociala avgifter)</span>
							<span className="font-bold text-slate-900">{formatSek(costs.benefitsSek)}</span>
						</div>
					</div>
				</div>
			),
		},

		// 7) AI Personalassistent
		aiPersonalAssistant: {
			title: localizationConstants.wAiAssistantTitle,
			icon: Bot,
			emptyTitle: localizationConstants.wAiAssistantTitle,
			emptyDescription: localizationConstants.wAiAssistantDesc,
			content: <AiPersonalAssistantContent state={state} />,
			expandedContent: (
				<div className="space-y-4">
					<div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/70">
						<h4 className="text-sm font-bold text-blue-950 flex items-center gap-1.5">
							<Bot className="h-4 w-4 text-blue-600" />
							AI Personalassistent — Fullskärm
						</h4>
						<p className="text-xs text-blue-800/80 mt-1">
							Ställ frågor om bemanning, lagstadgad vila, kollektivavtal eller sammanställning av tidrapporter.
						</p>
					</div>
					<AiPersonalAssistantContent state={state} />
				</div>
			),
		},
	};
}
