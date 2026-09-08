"use client";

import React from "react";
import Link from "next/link";
import {
	Activity,
	ArrowUpRight,
	CalendarCheck,
	CheckCircle2,
	HardHat,
	TrendingUp,
	Users,
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

export function createPersonnelHealthAndOverviewWidgets(
	state: PersonnelDashboardState,
): Record<string, WidgetProps> {
	const { healthScore, overview, attendance, staffing } = state;

	return {
		// 1) Workforce Health Score
		workforceHealthScore: {
			title: localizationConstants.wHealthScoreTitle,
			icon: Activity,
			content: (
				<Content>
					<div className="flex items-center justify-between pb-1.5">
						<div className="flex items-baseline gap-1.5">
							<span className="text-2xl font-bold tracking-tight text-slate-900">
								{healthScore.score}
							</span>
							<span className="text-xs font-medium text-slate-500">
								/ {healthScore.maxScore}
							</span>
						</div>
						<span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
							<span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
							<Translate text={localizationConstants.wHealthScoreGood} />
						</span>
					</div>

					<div className="space-y-1 pt-1.5 border-t border-slate-200/60">
						<Row
							label={localizationConstants.wHealthScoreAttendanceRate}
							value={`${healthScore.attendanceRate}%`}
						/>
						<Row
							label={localizationConstants.wHealthScoreCoverage}
							value={`${healthScore.staffingCoverage}%`}
						/>
						<Row
							label={localizationConstants.wHealthScoreCompliance}
							value={
								<span className="inline-flex items-center gap-1 text-amber-700 font-semibold">
									<span>{healthScore.complianceRate}%</span>
									<span className="h-2 w-2 rounded-full bg-amber-500" />
								</span>
							}
						/>
					</div>

					<div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
						<span className="inline-flex items-center gap-1 font-medium text-emerald-700">
							<TrendingUp className="h-3.5 w-3.5" />
							<Translate text={localizationConstants.wHealthScoreTrend} />
						</span>
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

		// 2) Personalöversikt
		personalOverview: {
			title: localizationConstants.wPersonalOverviewTitle,
			icon: Users,
			content: (
				<Content>
					<div className="flex items-center justify-between pb-1.5">
						<div className="flex items-baseline gap-1.5">
							<span className="text-2xl font-bold tracking-tight text-slate-900">
								{overview.totalEmployees}
							</span>
							<span className="text-xs font-medium text-slate-500">
								<Translate text={localizationConstants.employeesUnit} />
							</span>
						</div>
						<span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
							<span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
							{overview.activeToday} <Translate text={localizationConstants.wActiveToday} />
						</span>
					</div>

					<div className="grid grid-cols-2 gap-2 pt-1.5 border-t border-slate-200/60 text-xs">
						<div className="rounded-md bg-slate-50 p-2 border border-slate-200/60">
							<p className="text-slate-500"><Translate text={localizationConstants.wActiveToday} /></p>
							<p className="text-base font-semibold text-slate-900 mt-0.5">{overview.activeToday}</p>
						</div>
						<div className="rounded-md bg-slate-50 p-2 border border-slate-200/60">
							<p className="text-slate-500"><Translate text={localizationConstants.wOnLeave} /></p>
							<p className="text-base font-semibold text-slate-900 mt-0.5">{overview.onLeave}</p>
						</div>
						<div className="rounded-md bg-slate-50 p-2 border border-slate-200/60">
							<p className="text-slate-500"><Translate text={localizationConstants.wNewThisMonth} /></p>
							<p className="text-base font-semibold text-emerald-700 mt-0.5">+{overview.newThisMonth}</p>
						</div>
						<div className="rounded-md bg-slate-50 p-2 border border-slate-200/60">
							<p className="text-slate-500"><Translate text={localizationConstants.wDeparturesThisMonth} /></p>
							<p className="text-base font-semibold text-rose-700 mt-0.5">-{overview.departuresThisMonth}</p>
						</div>
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

		// 3) Närvaro
		attendance: {
			title: localizationConstants.wAttendanceTitle,
			icon: CalendarCheck,
			content: (
				<Content>
					<div className="flex items-center justify-between pb-1.5">
						<div className="flex items-baseline gap-1.5">
							<span className="text-2xl font-bold tracking-tight text-slate-900">
								{attendance.present}
							</span>
							<span className="text-xs font-medium text-slate-500">
								/ {attendance.present + attendance.absentApproved + attendance.absentUnplanned}
							</span>
						</div>
						<span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
							{attendance.weeklyRate}% <Translate text={localizationConstants.wAttendanceRateWeekly} />
						</span>
					</div>

					<div className="space-y-1 pt-1.5 border-t border-slate-200/60 text-xs">
						<Row
							label={localizationConstants.wPresentEmployees}
							value={`${attendance.present} (${attendance.onSite} ${localizationConstants.wOnSiteWork ? "" : ""} / ${attendance.remote} distans)`}
						/>
						<Row
							label={localizationConstants.wAbsentApproved}
							value={`${attendance.absentApproved}`}
						/>
						<Row
							label={localizationConstants.wAbsentUnplanned}
							value={
								<span className="text-amber-700 font-semibold">
									{attendance.absentUnplanned}
								</span>
							}
						/>
					</div>

					<div className="pt-2 border-t border-slate-200/60 flex items-center justify-end text-xs">
						<Link
							href={`${PERSONNEL_MODULE_BASE_URL}/overview`}
							className="inline-flex items-center gap-0.5 text-blue-600 hover:text-blue-800 font-medium"
						>
							<Translate text={localizationConstants.viewAttendanceAction} />
							<ArrowUpRight className="h-3 w-3" />
						</Link>
					</div>
				</Content>
			),
		},

		// 4) Bemanning
		staffing: {
			title: localizationConstants.wStaffingTitle,
			icon: HardHat,
			content: (
				<Content>
					<div className="space-y-1.5 pb-1">
						{staffing.roles.map((role) => (
							<div
								key={role.id}
								className="flex items-center justify-between text-xs py-1 border-b border-slate-100 last:border-0"
							>
								<span className="text-slate-600 font-medium">
									<Translate text={role.roleKey} />
								</span>
								<div className="flex items-center gap-1.5">
									<span className="font-semibold text-slate-800">
										{role.assigned} / {role.needed}
									</span>
									{role.status === "met" && (
										<CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
									)}
									{role.status === "shortage" && (
										<span className="h-2 w-2 rounded-full bg-amber-500" />
									)}
									{role.status === "critical" && (
										<span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
									)}
								</div>
							</div>
						))}
					</div>

					<div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
						<span className="text-slate-500 font-medium">
							<Translate text={localizationConstants.wOpenPositions} />:{" "}
							<span className="font-bold text-slate-800">{staffing.openPositions}</span>
						</span>
						<Link
							href={`${PERSONNEL_MODULE_BASE_URL}/overview`}
							className="inline-flex items-center gap-0.5 text-blue-600 hover:text-blue-800 font-medium"
						>
							<Translate text={localizationConstants.viewStaffingAction} />
							<ArrowUpRight className="h-3 w-3" />
						</Link>
					</div>
				</Content>
			),
		},
	};
}
