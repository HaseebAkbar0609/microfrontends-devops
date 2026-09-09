"use client";

import React from "react";
import {
	ArrowUpRight,
	Bot,
	CalendarDays,
	CheckCircle2,
	Clock,
	ExternalLink,
	FileUp,
	Image as ImageIcon,
	Newspaper,
	ShieldCheck,
	Sparkles,
	Zap,
} from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import {
	WidgetContent as Content,
} from "@/features/widgetdashboard/components/WidgetContent";
import type { WidgetProps } from "@/features/widgetdashboard/types/dashboard";
import type { EconomyDashboardState } from "../../../types/economyDashboard.types";
import { formatSek } from "../../../utils/economyFormatters";

interface EngagementWidgetHandlers {
	activeAiQuestion: string | null;
	onSelectAiQuestion: (q: string) => void;
}

export function createEconomyEngagementWidgets(
	state: EconomyDashboardState,
	handlers?: EngagementWidgetHandlers,
): Record<string, WidgetProps> {
	const { aiAssistant, calendarEvents, recentActivities, imageBanner, newsItems } = state;

	return {
		// 7) AI Ekonomiassistent
		aiEconomyAssistant: {
			title: localizationConstants.aiEconomyAssistantWidgetTitle,
			icon: Bot,
			content: (
				<Content>
					<span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
						<Translate text={localizationConstants.aiSuggestedQuestionsTitle} />
					</span>
					<div className="flex flex-wrap gap-1.5 pt-0.5">
						{aiAssistant.suggestedQuestions.map((q) => {
							const isSelected = handlers?.activeAiQuestion === q;
							return (
								<button
									key={q}
									type="button"
									onClick={() => handlers?.onSelectAiQuestion(q)}
									className={`text-left text-[11px] px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
										isSelected
											? "bg-slate-900 text-white border-slate-900 shadow-xs"
											: "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
									}`}
								>
									<Translate text={q} />
								</button>
							);
						})}
					</div>

					<div className="mt-2 rounded-md bg-indigo-50/70 p-2.5 border border-indigo-100">
						<div className="flex items-start gap-1.5 text-xs text-indigo-950">
							<Sparkles size={14} className="shrink-0 mt-0.5 text-indigo-600" />
							<div>
								<span className="font-semibold block">
									<Translate text={localizationConstants.aiInsightTitle} />:
								</span>
								<p className="mt-0.5 text-[11px] leading-relaxed text-indigo-900">
									<Translate text={aiAssistant.insightTextKey} />
								</p>
							</div>
						</div>
					</div>
				</Content>
			),
		},

		// 8) Kalender
		financeCalendar: {
			title: localizationConstants.financeCalendarWidgetTitle,
			icon: CalendarDays,
			content: (
				<Content>
					<div className="space-y-1.5">
						{calendarEvents.map((evt) => (
							<div
								key={evt.id}
								className="flex items-center justify-between text-xs py-1 px-2 rounded-md bg-white border border-slate-200/70"
							>
								<div className="flex items-center gap-2">
									<span className={`w-1.5 h-6 rounded-full ${evt.color}`} />
									<div>
										<span className="font-semibold text-slate-800 block">
											<Translate text={evt.titleKey} />
										</span>
										<span className="text-[10px] text-slate-500 font-medium">
											{evt.dateStr}
										</span>
									</div>
								</div>
								{evt.amount && (
									<span className="font-semibold text-slate-800 text-[11px]">
										{formatSek(evt.amount)}
									</span>
								)}
							</div>
						))}
					</div>
				</Content>
			),
		},

		// 9) Senaste aktiviteter
		recentEconomyActivities: {
			title: localizationConstants.recentEconomyActivitiesWidgetTitle,
			icon: Zap,
			content: (
				<Content>
					<div className="space-y-2">
						{recentActivities.map((act) => (
							<div key={act.id} className="flex items-start gap-2 text-xs">
								<div className="mt-0.5 rounded-full bg-slate-100 p-1 text-slate-600 shrink-0">
									{act.type === "invoice_sent" ? (
										<FileUp size={12} className="text-blue-600" />
									) : act.type === "payment_received" ? (
										<CheckCircle2 size={12} className="text-emerald-600" />
									) : act.type === "expense_approved" ? (
										<ShieldCheck size={12} className="text-indigo-600" />
									) : (
										<Clock size={12} className="text-slate-500" />
									)}
								</div>
								<div className="flex-1 min-w-0">
									<p className="text-slate-800 truncate font-medium">
										{act.description}
									</p>
									<div className="flex items-center gap-2 text-[10px] text-slate-400">
										{act.timeAgo && <span>{act.timeAgo}</span>}
										{act.amount && (
											<span className="font-semibold text-slate-600">
												· {formatSek(act.amount)}
											</span>
										)}
									</div>
								</div>
							</div>
						))}
					</div>
				</Content>
			),
		},

		// 18) Bild (Banner)
		economyImage: {
			title: localizationConstants.economyImageWidgetTitle,
			icon: ImageIcon,
			content: (
				<Content>
					<div className="relative overflow-hidden rounded-md bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-3.5 text-white shadow-xs">
						<div className="relative z-10 space-y-1">
							<span className="text-xs font-bold text-white block">
								<Translate text={imageBanner.titleKey} />
							</span>
							<p className="text-[11px] text-slate-300 leading-relaxed">
								<Translate text={imageBanner.subtitleKey} />
							</p>
							<div className="pt-2">
								<span className="inline-flex items-center gap-1 rounded-sm bg-white/20 hover:bg-white/30 backdrop-blur-xs px-2.5 py-1 text-[11px] font-medium text-white transition-colors cursor-pointer">
									<Translate text={imageBanner.ctaKey} />
									<ArrowUpRight size={12} />
								</span>
							</div>
						</div>
					</div>
					<p className="text-[10px] text-slate-400 mt-1">
						<Translate text={imageBanner.captionKey} />
					</p>
				</Content>
			),
		},

		// 19) Nyheter
		economyNews: {
			title: localizationConstants.economyNewsWidgetTitle,
			icon: Newspaper,
			content: (
				<Content>
					<div className="space-y-2">
						{newsItems.map((news) => (
							<div
								key={news.id}
								className="rounded-md border border-slate-200/70 bg-white p-2 text-xs transition-colors hover:border-slate-300"
							>
								<div className="flex items-baseline justify-between gap-1">
									<span className="font-semibold text-slate-800 line-clamp-1">
										<Translate text={news.titleKey} />
									</span>
									<span className="text-[10px] text-slate-400 shrink-0">
										<Translate text={news.dateKey} />
									</span>
								</div>
								<div className="mt-1 flex justify-end">
									<span className="inline-flex items-center gap-1 text-[10px] font-medium text-blue-600 hover:text-blue-800 transition-colors cursor-pointer">
										<Translate text={news.readMoreKey} />
										<ExternalLink size={10} />
									</span>
								</div>
							</div>
						))}
					</div>
				</Content>
			),
		},
	};
}
