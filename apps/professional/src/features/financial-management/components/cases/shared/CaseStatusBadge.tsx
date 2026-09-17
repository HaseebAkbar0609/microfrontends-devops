"use client";

import React from "react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { TranslationKeys } from "@/utils/translation/constants";
import type { CaseStatus } from "../../../types/cases.types";

interface CaseStatusBadgeProps {
	status: CaseStatus;
	className?: string;
}

const STATUS_CONFIG: Record<
	CaseStatus,
	{ labelKey: TranslationKeys; bgClass: string; textClass: string }
> = {
	not_started: {
		labelKey: localizationConstants.casesStatusNotStarted,
		bgClass: "bg-sky-400",
		textClass: "text-white",
	},
	ongoing: {
		labelKey: localizationConstants.casesStatusOngoing,
		bgClass: "bg-orange-500",
		textClass: "text-white",
	},
	completed: {
		labelKey: localizationConstants.casesStatusCompleted,
		bgClass: "bg-emerald-500",
		textClass: "text-white",
	},
	closed: {
		labelKey: localizationConstants.casesStatusClosed,
		bgClass: "bg-slate-500",
		textClass: "text-white",
	},
	rejected: {
		labelKey: localizationConstants.casesStatusRejected,
		bgClass: "bg-rose-500",
		textClass: "text-white",
	},
};

export function CaseStatusBadge({ status, className = "" }: CaseStatusBadgeProps) {
	const config = STATUS_CONFIG[status] || STATUS_CONFIG.not_started;

	return (
		<span
			className={`inline-flex items-center justify-center px-3 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap shadow-2xs ${config.bgClass} ${config.textClass} ${className}`}
		>
			<Translate text={config.labelKey} />
		</span>
	);
}

export default CaseStatusBadge;
