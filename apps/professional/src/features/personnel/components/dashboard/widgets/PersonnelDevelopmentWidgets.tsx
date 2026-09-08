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

		// 12) Certifikat & Behörigheter
		certificates: {
			title: localizationConstants.wCertificatesTitle,
			icon: FileCheck,
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

		// 13) Bild
		teamImage: {
			title: localizationConstants.wImageTitle,
			icon: ImageIcon,
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

					<div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
						<span><Translate text={teamImage.captionKey} /></span>
						<button
							type="button"
							className="font-medium text-blue-600 hover:text-blue-800 transition-colors"
						>
							<Translate text={localizationConstants.wChangeImage} />
						</button>
					</div>
				</Content>
			),
		},

		// 14) Nyheter
		personnelNews: {
			title: localizationConstants.wNewsTitle,
			icon: Newspaper,
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

					<div className="pt-2 border-t border-slate-200/60 flex items-center justify-end text-xs">
						<Link
							href={`${PERSONNEL_MODULE_BASE_URL}/overview`}
							className="inline-flex items-center gap-0.5 text-blue-600 hover:text-blue-800 font-medium"
						>
							<Translate text={localizationConstants.newsReadMore} />
							<ArrowUpRight className="h-3 w-3" />
						</Link>
					</div>
				</Content>
			),
		},
	};
}
