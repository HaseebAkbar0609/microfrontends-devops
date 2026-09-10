"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock3 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { economyBreadcrumbs, ECONOMY_SECTIONS } from "../../constants/economyNav.config";

export function EconomySectionHub() {
	return (
		<div className="flex flex-1 flex-col bg-slate-50/50 min-h-screen">
			<PageHeader
				title={localizationConstants.economy}
				breadcrumbs={economyBreadcrumbs(localizationConstants.economy)}
				className="border-b-0 px-6 pt-5 pb-2"
			/>
			<div className="flex-1 px-6 pt-2 pb-8">
				<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
					{ECONOMY_SECTIONS.map((section) => (
						<Link
							key={section.id}
							href={section.href}
							className="group flex min-h-28 items-start justify-between rounded-lg border border-slate-200 bg-white p-5 shadow-2xs transition-colors hover:border-slate-400 hover:bg-slate-50"
						>
							<div className="flex items-start gap-3">
								{section.implemented ? (
									<CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
								) : (
									<Clock3 className="mt-0.5 h-5 w-5 text-slate-400" />
								)}
								<div>
									<h2 className="text-sm font-semibold text-slate-900">
										<Translate text={section.labelKey} />
									</h2>
									<p className="mt-1 text-xs text-slate-500">
										<Translate
											text={section.implemented ? localizationConstants.economyOpenModule : localizationConstants.economyComingSoon}
										/>
									</p>
								</div>
							</div>
							<ArrowRight className="h-4 w-4 text-slate-300 transition-colors group-hover:text-slate-700" />
						</Link>
					))}
				</div>
			</div>
		</div>
	);
}

export default EconomySectionHub;