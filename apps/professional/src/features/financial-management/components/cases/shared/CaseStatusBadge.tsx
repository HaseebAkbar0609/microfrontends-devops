"use client";

import React from "react";
import { Translate } from "@/utils/translation/translate";
import { CASE_STATUS_META } from "../../../constants/cases.constants";
import type { CaseStatus } from "../../../types/cases.types";

interface CaseStatusBadgeProps {
	status: CaseStatus;
	className?: string;
}

export function CaseStatusBadge({ status, className = "" }: CaseStatusBadgeProps) {
	const config = CASE_STATUS_META[status] || CASE_STATUS_META.not_started;

	return (
		<span
			className={`inline-flex items-center justify-center px-3 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap shadow-2xs ${config.bgClass} ${config.textClass} ${className}`}
		>
			<Translate text={config.labelKey} />
		</span>
	);
}

export default CaseStatusBadge;
