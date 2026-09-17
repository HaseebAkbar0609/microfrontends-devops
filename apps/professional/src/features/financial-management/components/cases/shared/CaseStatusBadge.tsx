"use client";

import React from "react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { TranslationKeys } from "@/utils/translation/constants";
import type { CaseStatus } from "../../types/cases.types";

interface CaseStatusBadgeProps {
	status: CaseStatus;
	className?: string;
}

const STATUS_CONFIG: Record<
	CaseStatus,
	{ labelKey: TranslationKeys; bgClass: string; textClass: string; borderClass: string }
> = {
	not_started: {
		labelKey: localizationConstants.casesStatusNotStarted,
		bgClass: "bg-slate-100",
		textClass: "text-slate-700",
		borderClass: "border-slate-200",
	},
	ongoing: {
		labelKey: localizationConstants.casesStatusOngoing,
		bgClass: "bg-blue-50",
		textClass: "text-blue-700",
		borderClass: "border-blue-200",
	},
	completed: {
		labelKey: localizationConstants.casesStatusCompleted,
		bgClass: "bg-emerald-50",
		textClass: "text-emerald-700",
		borderClass: "border-emerald-200",
	},
	closed: {
		labelKey: localizationConstants.casesStatusClosed,
		bgClass: "bg-slate-100",
		textClass: "text-slate-600",
		borderClass: "border-slate-200",
	},
	rejected: {
		labelKey: localizationConstants.casesStatusRejected,
		bgClass: "bg-rose-50",
		textClass: "text-rose-700",
		borderClass: "border-rose-200",
	},
};

export function CaseStatusBadge({ status, className = "" }: CaseStatusBadgeProps) {
	const config = STATUS_CONFIG[status] || STATUS_CONFIG.not_started;

	return (
		<span
			className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border uppercase tracking-wider ${config.bgClass} ${config.textClass} ${config.borderClass} ${className}`}
		>
			<Translate text={config.labelKey} />
		</span>
	);
}

export default CaseStatusBadge;
