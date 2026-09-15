"use client";

import { Check, Clock } from "lucide-react";

import { Translate } from "@/utils/translation/translate";
import { SUPPLIER_STATUS_LABELS } from "./supplierPlan.config";
import type { SupplierPlanStatus } from "./types";

/**
 * The list frame's status: a green check for Godkänd, an amber clock for
 * Granskas, and plain text for Ej klar.
 */
export function SupplierStatusBadge({ status }: { status: SupplierPlanStatus }) {
	const label = <Translate text={SUPPLIER_STATUS_LABELS[status]} />;

	if (status === "not_ready") {
		return <span className="text-sm whitespace-nowrap text-slate-900">{label}</span>;
	}

	const approved = status === "approved";
	const Icon = approved ? Check : Clock;

	return (
		<span
			className={
				approved
					? "inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium whitespace-nowrap text-emerald-700"
					: "inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-xs font-medium whitespace-nowrap text-amber-700"
			}
		>
			<Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
			{label}
		</span>
	);
}

export default SupplierStatusBadge;
