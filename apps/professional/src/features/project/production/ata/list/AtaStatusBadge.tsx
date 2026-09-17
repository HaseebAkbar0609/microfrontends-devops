"use client";

import { Badge } from "@/components/ui/badge";
import { Translate } from "@/utils/translation/translate";
import { ATA_STATUS_META } from "../projectAta.config";
import type { AtaStatus, SupplierAtaStatus } from "../types";

/**
 * The frames' status pills: OK green, Redovisad blue, Förhandling amber, a
 * supplier's unreviewed Ej granskad red. A draft has no pill in the frame, so
 * Utkast reads as plain text.
 */
export function AtaStatusBadge({ status }: { status: AtaStatus | SupplierAtaStatus }) {
	const meta = ATA_STATUS_META[status];

	if (!meta.badge) {
		return (
			<span className="text-sm text-slate-700">
				<Translate text={meta.labelKey} />
			</span>
		);
	}

	return (
		<Badge variant={meta.badge} className="px-2 py-0.5">
			<Translate text={meta.labelKey} />
		</Badge>
	);
}

export default AtaStatusBadge;
