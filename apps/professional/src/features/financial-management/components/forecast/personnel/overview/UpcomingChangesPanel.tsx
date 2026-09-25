"use client";

import { UserMinus, UserPlus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import {
	PERSONNEL_CHANGE_META,
	PERSONNEL_CHANGE_WINDOW_DAYS,
} from "../../../../constants/forecastPersonnel.constants";
import type { PersonnelChange } from "../../../../types/forecastPersonnel.types";

const CHANGE_ICON = { newHire: UserPlus, contractEnding: UserMinus };

/** One person joining or leaving: who, in what role, and when. */
function ChangeRow({ change }: { change: PersonnelChange }) {
	const t = useTranslate();
	const meta = PERSONNEL_CHANGE_META[change.kind];
	const Icon = CHANGE_ICON[change.kind];

	return (
		<li className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2.5">
			<span className={cn("flex size-8 shrink-0 items-center justify-center rounded-full", meta.iconClass)}>
				<Icon className="h-4 w-4" aria-hidden />
			</span>

			<div className="flex min-w-0 flex-1 flex-col">
				<span className="truncate text-sm font-semibold text-slate-900">{change.name}</span>
				<span className="truncate text-xs text-slate-500">{change.role}</span>
				<span className="text-xs text-slate-400 tabular-nums">{change.date}</span>
			</div>

			<Badge variant={meta.variant} className="shrink-0">
				{t(meta.labelKey)}
			</Badge>
		</li>
	);
}

export interface UpcomingChangesPanelProps {
	changes: PersonnelChange[];
}

/** Who joins or leaves inside the next thirty days. */
export function UpcomingChangesPanel({ changes }: UpcomingChangesPanelProps) {
	const t = useTranslate();

	return (
		<section className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
			<h3 className="text-base font-semibold text-slate-900">
				{t(localizationConstants.forecastPersonnelChangesTitle, { days: PERSONNEL_CHANGE_WINDOW_DAYS })}
			</h3>

			{changes.length === 0 ? (
				<p className="py-4 text-sm text-slate-500">
					<Translate text={localizationConstants.forecastPersonnelChangesEmpty} />
				</p>
			) : (
				<ul className="flex flex-col gap-2">
					{changes.map((change) => (
						<ChangeRow key={change.id} change={change} />
					))}
				</ul>
			)}
		</section>
	);
}

export default UpcomingChangesPanel;
