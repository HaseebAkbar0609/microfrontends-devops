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

					<div className="pt-2 border-t border-slate-200/60 flex items-center justify-end text-xs">
						<Link
							href={`${PERSONNEL_MODULE_BASE_URL}/overview`}
							className="inline-flex items-center gap-0.5 text-blue-600 hover:text-blue-800 font-medium"
						>
							<Translate text={localizationConstants.viewCalendarAction} />
							<ArrowUpRight className="h-3 w-3" />
						</Link>
					</div>
				</Content>
			),
		},

		// 9) Senaste aktiviteter
		recentActivities: {
			title: localizationConstants.wActivitiesTitle,
			icon: Zap,
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

					<div className="pt-2 border-t border-slate-200/60 flex items-center justify-end text-xs">
						<Link
							href={`${PERSONNEL_MODULE_BASE_URL}/overview`}
							className="inline-flex items-center gap-0.5 text-blue-600 hover:text-blue-800 font-medium"
						>
							<Translate text={localizationConstants.viewPersonnelOverviewAction} />
							<ArrowUpRight className="h-3 w-3" />
						</Link>
					</div>
				</Content>
			),
		},

		// 10) Kompetenser
		competences: {
			title: localizationConstants.wCompetencesTitle,
			icon: GraduationCap,
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

					<div className="pt-2 border-t border-slate-200/60 flex items-center justify-end text-xs">
						<Link
							href={`${PERSONNEL_MODULE_BASE_URL}/competences`}
							className="inline-flex items-center gap-0.5 text-blue-600 hover:text-blue-800 font-medium"
						>
							<Translate text={localizationConstants.viewCompetencesAction} />
							<ArrowUpRight className="h-3 w-3" />
						</Link>
					</div>
				</Content>
			),
		},
	};
}
