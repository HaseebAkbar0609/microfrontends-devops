"use client";

import React from "react";
import Link from "next/link";
import {
	AlertCircle,
	ArrowUpRight,
	BookOpen,
	FileCheck,
	ImageIcon,
	Newspaper,
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

export function createPersonnelDevelopmentWidgets(
	state: PersonnelDashboardState,
): Record<string, WidgetProps> {
	const { trainingPrograms, certificates, teamImage, news } = state;
	const cert = certificates[0];

	return {
		// 11) Utbildningar
		trainings: {
			title: localizationConstants.wTrainingsTitle,
			icon: BookOpen,
			emptyTitle: localizationConstants.wTrainingsTitle,
			emptyDescription: localizationConstants.wTrainingsDesc,
			content: (
				<Content>
					<div className="space-y-1.5 pb-1 text-xs">
						{trainingPrograms.map((prog) => (
							<div
								key={prog.id}
								className="flex items-center justify-between py-1 border-b border-slate-100 last:border-0"
							>
								<span className="text-slate-700 font-medium">
									<Translate text={prog.nameKey} />
								</span>
								<div className="flex items-center gap-1.5">
									{prog.status === "overdue" ? (
										<span className="inline-flex items-center gap-1 text-rose-700 font-bold">
											<span>{prog.enrolledCount}</span>
											<span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
										</span>
									) : (
										<span className="font-semibold text-slate-800">
											{prog.enrolledCount}
										</span>
									)}
								</div>
							</div>
						))}
					</div>

					<div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs mt-auto">
						<span className="text-slate-500 font-medium whitespace-nowrap">
							{trainingPrograms.length} <Translate text={localizationConstants.wTrainingProgramsLabel} />
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
					<div className="rounded-lg border border-slate-200 p-4 space-y-3 bg-white text-xs">
						<h4 className="font-semibold text-sm text-slate-900">Utbildningsprogram & Deltagarstatus</h4>
						<div className="space-y-2">
							{trainingPrograms.map((prog) => (
								<div key={prog.id} className="flex items-center justify-between p-2.5 rounded bg-slate-50 border border-slate-100">
									<div>
										<p className="font-semibold text-slate-900"><Translate text={prog.nameKey} /></p>
										<p className="text-[11px] text-slate-500 mt-0.5">{prog.enrolledCount} anmälda deltagare</p>
									</div>
									<span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${prog.status === "overdue" ? "bg-rose-100 text-rose-800" : "bg-emerald-100 text-emerald-800"}`}>
										{prog.status === "overdue" ? "Förfallen" : "Planerad"}
									</span>
								</div>
							))}
						</div>
					</div>
				</div>
			),
		},

		// 12) Certifikat & Behörigheter
		certificates: {
			title: localizationConstants.wCertificatesTitle,
			icon: FileCheck,
			emptyTitle: localizationConstants.wCertificatesTitle,
			emptyDescription: localizationConstants.wCertificatesDesc,
			content: (
				<Content>
					<div className="flex items-center justify-between pb-1.5">
						<div className="flex items-baseline gap-1.5">
							<span className="text-2xl font-bold tracking-tight text-slate-900">
								{cert?.validCount ?? 112}
							</span>
							<span className="text-xs font-medium text-slate-500">
								<Translate text={localizationConstants.wValidCertificates} />
							</span>
						</div>
						<div className="flex items-center gap-1 text-xs">
							<span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 font-semibold text-amber-700">
								{cert?.expiring30DaysCount ?? 6}{" "}
								<Translate text={localizationConstants.wExpiring30Days} />
							</span>
						</div>
					</div>

					<div className="space-y-1 pt-1.5 border-t border-slate-200/60 text-xs">
						<Row
							label={localizationConstants.wExpiredCertificates}
							value={
								<span className="inline-flex items-center gap-1 font-bold text-rose-600">
									<span>{cert?.expiredCount ?? 2}</span>
									<AlertCircle className="h-3.5 w-3.5" />
								</span>
							}
						/>
						<Row
							label={localizationConstants.wPendingRenewal}
							value={`${cert?.pendingRenewalCount ?? 4}`}
						/>
						<div className="pt-1 text-[11px] text-slate-500">
							<span className="font-semibold text-slate-700">
								<Translate text={localizationConstants.wCategoriesLabel} />:
							</span>{" "}
							<Translate text={localizationConstants.wCertCategoriesList} />
						</div>
					</div>

					<div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs mt-auto">
						<span className="text-slate-500 font-medium whitespace-nowrap">
							{(cert?.validCount ?? 112) + (cert?.expiring30DaysCount ?? 6) + (cert?.expiredCount ?? 2)} <Translate text={localizationConstants.wTotalCertificatesLabel} />
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
					<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
						<div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
							<span className="text-xs text-emerald-800 font-medium">Giltiga Certifikat</span>
							<p className="text-2xl font-bold text-emerald-900 mt-1">{cert?.validCount ?? 112}</p>
						</div>
						<div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
							<span className="text-xs text-amber-800 font-medium">Löper ut inom 30 dagar</span>
							<p className="text-2xl font-bold text-amber-900 mt-1">{cert?.expiring30DaysCount ?? 6}</p>
						</div>
						<div className="p-3 rounded-lg bg-rose-50 border border-rose-200">
							<span className="text-xs text-rose-800 font-medium">Utgångna</span>
							<p className="text-2xl font-bold text-rose-900 mt-1">{cert?.expiredCount ?? 2}</p>
						</div>
						<div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
							<span className="text-xs text-blue-800 font-medium">Förnyelse pågår</span>
							<p className="text-2xl font-bold text-blue-900 mt-1">{cert?.pendingRenewalCount ?? 4}</p>
						</div>
					</div>
				</div>
			),
		},

		// 13) Bild
		teamImage: {
			title: localizationConstants.wImageTitle,
			icon: ImageIcon,
			emptyTitle: localizationConstants.wImageTitle,
			emptyDescription: localizationConstants.wImageDesc,
			content: (
				<Content>
					<div className="relative aspect-[16/9] w-full overflow-hidden rounded-md border border-slate-200/70 bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex items-center justify-center">
						<div className="text-center p-3">
							<div className="mx-auto mb-1 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 shadow-sm">
								<ImageIcon className="h-5 w-5 text-blue-600" />
							</div>
							<p className="text-xs font-semibold text-slate-800">
								<Translate text={teamImage.captionKey} />
							</p>
							<p className="text-[11px] text-slate-500 mt-0.5">
								<Translate text={teamImage.titleKey} />
							</p>
						</div>
					</div>

					<div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500 mt-auto">
						<span className="truncate max-w-[180px]"><Translate text={teamImage.captionKey} /></span>
						<button
							type="button"
							className="font-medium text-blue-600 hover:text-blue-800 transition-colors shrink-0 cursor-pointer"
						>
							<Translate text={localizationConstants.wChangeImage} />
						</button>
					</div>
				</Content>
			),
			expandedContent: (
				<div className="space-y-4">
					<div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border border-slate-200 bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex items-center justify-center min-h-[300px]">
						<div className="text-center p-6">
							<div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-md">
								<ImageIcon className="h-7 w-7 text-blue-600" />
							</div>
							<p className="text-base font-bold text-slate-800">
								<Translate text={teamImage.captionKey} />
							</p>
							<p className="text-xs text-slate-500 mt-1">
								<Translate text={teamImage.titleKey} />
							</p>
						</div>
					</div>
				</div>
			),
		},

		// 14) Nyheter
		personnelNews: {
			title: localizationConstants.wNewsTitle,
			icon: Newspaper,
			emptyTitle: localizationConstants.wNewsTitle,
			emptyDescription: localizationConstants.wNewsDesc,
			content: (
				<Content>
					<div className="space-y-1.5 pb-1 text-xs">
						{news.map((item) => (
							<div
								key={item.id}
								className="flex items-start gap-2 py-1.5 border-b border-slate-100 last:border-0"
							>
								<Newspaper className="h-3.5 w-3.5 text-blue-500 shrink-0 mt-0.5" />
								<div className="flex-1 min-w-0">
									<p className="line-clamp-2 font-medium text-slate-800 leading-snug">
										<Translate text={item.titleKey} />
									</p>
									<span className="text-[11px] text-slate-400">
										<Translate text={item.dateKey} />
									</span>
								</div>
							</div>
						))}
					</div>

					<div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs mt-auto">
						<span className="text-slate-500 font-medium whitespace-nowrap">
							{news.length} <Translate text={localizationConstants.wNewsCountLabel} />
						</span>
						<Link
							href={`${PERSONNEL_MODULE_BASE_URL}/overview`}
							className="inline-flex items-center gap-0.5 text-blue-600 hover:text-blue-800 font-medium shrink-0"
						>
							<Translate text={localizationConstants.newsReadMore} />
							<ArrowUpRight className="h-3 w-3" />
						</Link>
					</div>
				</Content>
			),
			expandedContent: (
				<div className="space-y-4">
					<div className="space-y-3">
						{news.map((item) => (
							<div key={item.id} className="p-4 rounded-lg bg-slate-50 border border-slate-200">
								<div className="flex items-center justify-between">
									<span className="text-xs font-semibold text-blue-700"><Translate text={item.dateKey} /></span>
									<span className="text-xs text-slate-400">Internt meddelande</span>
								</div>
								<h4 className="text-sm font-bold text-slate-900 mt-1"><Translate text={item.titleKey} /></h4>
							</div>
						))}
					</div>
				</div>
			),
		},
	};
}
