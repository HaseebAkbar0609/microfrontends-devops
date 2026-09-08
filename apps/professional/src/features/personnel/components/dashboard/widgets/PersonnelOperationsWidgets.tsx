"use client";

import React from "react";
import Link from "next/link";
import {
	AlertTriangle,
	ArrowUpRight,
	CalendarDays,
	CheckCircle,
	GraduationCap,
	UserPlus,
	Zap,
} from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import {
	WidgetContent as Content,
	WidgetRow as Row,
} from "@/features/widgetdashboard/components/WidgetContent";
import type { WidgetProps } from "@/features/widgetdashboard/types/dashboard";
import type { PersonnelDashboardState } from "../../../types/personnelDashboard.types";
import { PERSONNEL_MODULE_BASE_URL } from "../../../constants/personnelNav.config";

export function createPersonnelOperationsWidgets(
	state: PersonnelDashboardState,
): Record<string, WidgetProps> {
	const { calendarEvents, recentActivities, competences } = state;

	return {
		// 8) Kalender
		personnelCalendar: {
			title: localizationConstants.wCalendarTitle,
			icon: CalendarDays,
			emptyTitle: localizationConstants.wCalendarTitle,
			emptyDescription: localizationConstants.wCalendarDesc,
			content: (
				<Content>
					<div className="space-y-1.5 pb-1">
						{calendarEvents.map((evt) => (
							<div
								key={evt.id}
								className="flex items-start gap-2 text-xs py-1 border-b border-slate-100 last:border-0"
							>
								<span className="shrink-0 rounded bg-slate-100 px-1.5 py-0.5 font-semibold text-slate-700">
									<Translate text={evt.dateKey} />
								</span>
								<div className="flex-1 min-w-0">
									<p className="truncate font-medium text-slate-800">
										<Translate text={evt.titleKey} />
									</p>
								</div>
							</div>
						))}
					</div>

					<div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs mt-auto">
						<span className="text-slate-500 font-medium whitespace-nowrap">
							{calendarEvents.length} <Translate text={localizationConstants.wEventsCountLabel} />
						</span>
						<Link
							href={`${PERSONNEL_MODULE_BASE_URL}/overview`}
							className="inline-flex items-center gap-0.5 text-blue-600 hover:text-blue-800 font-medium shrink-0"
						>
							<Translate text={localizationConstants.viewCalendarAction} />
							<ArrowUpRight className="h-3 w-3" />
						</Link>
					</div>
				</Content>
			),
			expandedContent: (
				<div className="space-y-4">
					<div className="rounded-lg border border-slate-200 p-4 space-y-3 bg-white text-xs">
						<h4 className="font-semibold text-sm text-slate-900">Kommande Händelser & Möten</h4>
						<div className="space-y-2">
							{calendarEvents.map((evt) => (
								<div key={evt.id} className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
									<div className="flex items-center gap-2">
										<span className="rounded bg-blue-100 text-blue-800 px-2 py-0.5 font-bold">
											<Translate text={evt.dateKey} />
										</span>
										<span className="font-medium text-slate-900">
											<Translate text={evt.titleKey} />
										</span>
									</div>
									<span className="text-slate-500">Obligatorisk närvaro</span>
								</div>
							))}
						</div>
					</div>
				</div>
			),
		},

		// 9) Senaste aktiviteter
		recentActivities: {
			title: localizationConstants.wActivitiesTitle,
			icon: Zap,
			emptyTitle: localizationConstants.wActivitiesTitle,
			emptyDescription: localizationConstants.wActivitiesDesc,
			content: (
				<Content>
					<div className="space-y-1.5 pb-1">
						{recentActivities.map((act) => (
							<div
								key={act.id}
								className="flex items-center gap-2 text-xs py-1 border-b border-slate-100 last:border-0"
							>
								<span className="shrink-0 font-mono text-[11px] text-slate-400 font-medium">
									{act.time}
								</span>
								<div className="flex-1 min-w-0 flex items-center gap-1.5">
									{act.category === "approval" && (
										<CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
									)}
									{act.category === "onboarding" && (
										<UserPlus className="h-3.5 w-3.5 text-blue-500 shrink-0" />
									)}
									{act.category === "absence" && (
										<AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
									)}
									{act.category === "staffing" && (
										<Zap className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
									)}
									<p className="truncate text-slate-700">
										<Translate text={act.textKey} />
									</p>
								</div>
							</div>
						))}
					</div>

					<div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs mt-auto">
						<span className="text-slate-500 font-medium whitespace-nowrap">
							<Translate text={localizationConstants.wRecentActionsLabel} />
						</span>
						<Link
							href={`${PERSONNEL_MODULE_BASE_URL}/overview`}
							className="inline-flex items-center gap-0.5 text-blue-600 hover:text-blue-800 font-medium shrink-0"
						>
							<Translate text={localizationConstants.viewPersonnelOverviewAction} />
							<ArrowUpRight className="h-3 w-3" />
						</Link>
					</div>
				</Content>
			),
			expandedContent: (
				<div className="space-y-4">
					<div className="rounded-lg border border-slate-200 p-4 space-y-2 bg-white text-xs">
						<h4 className="font-semibold text-sm text-slate-900">Fullständig Aktivitetslogg</h4>
						<div className="space-y-2">
							{recentActivities.map((act) => (
								<div key={act.id} className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
									<div className="flex items-center gap-2">
										<span className="font-mono text-slate-400 font-semibold">{act.time}</span>
										<span className="font-medium text-slate-800"><Translate text={act.textKey} /></span>
									</div>
									<span className="capitalize px-2 py-0.5 rounded bg-slate-200 text-slate-700 text-[10px] font-semibold">{act.category}</span>
								</div>
							))}
						</div>
					</div>
				</div>
			),
		},

		// 10) Kompetenser
		competences: {
			title: localizationConstants.wCompetencesTitle,
			icon: GraduationCap,
			emptyTitle: localizationConstants.wCompetencesTitle,
			emptyDescription: localizationConstants.wCompetencesDesc,
			content: (
				<Content>
					<div className="space-y-1.5 pb-1 text-xs">
						{competences.map((comp) => (
							<Row
								key={comp.id}
								label={comp.nameKey}
								value={
									comp.isGap ? (
										<span className="inline-flex items-center gap-1 font-semibold text-amber-700">
											<span>{comp.employeeCount}</span>
											<span className="h-2 w-2 rounded-full bg-amber-500" />
										</span>
									) : (
										<span>
											{comp.employeeCount}{" "}
											<span className="text-slate-500 font-normal">
												<Translate text={localizationConstants.employeesUnit} />
											</span>
										</span>
									)
								}
							/>
						))}
					</div>

					<div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs mt-auto">
						<span className="text-slate-500 font-medium whitespace-nowrap">
							{competences.length} <Translate text={localizationConstants.wCompetenceAreasLabel} />
						</span>
						<Link
							href={`${PERSONNEL_MODULE_BASE_URL}/competences`}
							className="inline-flex items-center gap-0.5 text-blue-600 hover:text-blue-800 font-medium shrink-0"
						>
							<Translate text={localizationConstants.viewCompetencesAction} />
							<ArrowUpRight className="h-3 w-3" />
						</Link>
					</div>
				</Content>
			),
			expandedContent: (
				<div className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
						{competences.map((comp) => (
							<div key={comp.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200">
								<div className="flex justify-between items-center">
									<span className="text-xs font-bold text-slate-800"><Translate text={comp.nameKey} /></span>
									<span className="font-bold text-slate-900">{comp.employeeCount} behöriga</span>
								</div>
								<div className="h-1.5 w-full bg-slate-200 rounded-full mt-2 overflow-hidden">
									<div className={`h-full rounded-full ${comp.isGap ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${comp.employeeCount * 8}%` }} />
								</div>
								{comp.isGap && <p className="text-[10px] text-amber-700 font-medium mt-1">Kompetensgap identifierat — rekommenderad utbildning pågår</p>}
							</div>
						))}
					</div>
				</div>
			),
		},
	};
}
