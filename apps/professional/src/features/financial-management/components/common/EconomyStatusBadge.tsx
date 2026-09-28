"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Translate } from "@/utils/translation/translate";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";

export type EconomyStatusVariant =
	| "active"
	| "inactive"
	| "pending"
	| "approved"
	| "rejected"
	| "submitted"
	| "paid"
	| "draft"
	| "in_progress"
	| "neutral";

interface EconomyStatusBadgeProps {
	status: string;
	label?: string | TranslationKeys;
	labelKey?: string | TranslationKeys;
	variant?: EconomyStatusVariant;
	className?: string;
}

const VARIANT_STYLES: Record<EconomyStatusVariant, string> = {
	active: "bg-emerald-50 text-emerald-700 border border-emerald-200/80",
	approved: "bg-emerald-50 text-emerald-700 border border-emerald-200/80",
	paid: "bg-emerald-50 text-emerald-700 border border-emerald-200/80",
	inactive: "bg-slate-100 text-slate-600 border border-slate-200/80",
	draft: "bg-slate-100 text-slate-600 border border-slate-200/80",
	neutral: "bg-slate-100 text-slate-700 border border-slate-200/80",
	pending: "bg-amber-50 text-amber-700 border border-amber-200/80",
	rejected: "bg-rose-50 text-rose-700 border border-rose-200/80",
	submitted: "bg-blue-50 text-blue-700 border border-blue-200/80",
	in_progress: "bg-blue-50 text-blue-700 border border-blue-200/80",
};

function resolveVariant(status: string, explicitVariant?: EconomyStatusVariant): EconomyStatusVariant {
	if (explicitVariant) return explicitVariant;
	const s = status.toLowerCase();

	if (["active", "aktiv", "klar", "approved", "godkänd", "paid", "betald"].includes(s)) {
		return "active";
	}
	if (["inactive", "inaktiv", "draft", "utkast", "ej_paborjad", "archived", "arkiverad", "closed", "stängd"].includes(s)) {
		return "inactive";
	}
	if (["pending", "under_behandling", "under_review", "väntar", "reklamerad", "ledig"].includes(s)) {
		return "pending";
	}
	if (["rejected", "avvisad", "avslagen", "ej_godkand", "overdue", "forfallen"].includes(s)) {
		return "rejected";
	}
	if (["submitted", "inskickad", "in_progress", "pagar", "ej_attesterad", "sent", "skickad"].includes(s)) {
		return "submitted";
	}

	return "neutral";
}

function getDefaultLabel(status: string): string | TranslationKeys {
	const s = status.toLowerCase();
	if (s === "active" || s === "aktiv") return localizationConstants.activeStatus;
	if (s === "inactive" || s === "inaktiv") return localizationConstants.inactiveStatus;
	return status;
}

export function EconomyStatusBadge({
	status,
	label,
	labelKey,
	variant,
	className,
}: EconomyStatusBadgeProps) {
	const resolved = resolveVariant(status, variant);
	const resolvedLabel = label ?? labelKey ?? getDefaultLabel(status);

	return (
		<span
			className={cn(
				"inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap shadow-2xs transition-colors",
				VARIANT_STYLES[resolved],
				className,
			)}
		>
			{typeof resolvedLabel === "string" ? (
				<Translate text={resolvedLabel} />
			) : (
				resolvedLabel
			)}
		</span>
	);
}

export default EconomyStatusBadge;
