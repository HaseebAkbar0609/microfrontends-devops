"use client";

import { ShieldCheck } from "lucide-react";

import { InfoField } from "@/features/purchase/components/shared/InfoFieldGrid";
import localizationConstants from "@/utils/translation/constants";
import { ProjectSectionCard } from "../../../components/ProjectSectionCard";
import type { WarrantyCommitment } from "../../types";

/**
 * The frame's first card: what the commitment is called and the day it falls
 * on — the two fields the list's dialog owns, shown here read-only.
 */
export function WarrantySummaryCard({ commitment }: { commitment: WarrantyCommitment }) {
	return (
		<ProjectSectionCard
			titleKey={localizationConstants.projectWarrantySectionInfo}
			icon={<ShieldCheck className="h-5 w-5 text-slate-700" aria-hidden />}
		>
			<dl className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
				<InfoField labelKey={localizationConstants.projectWarrantyFieldName} value={commitment.name} />
				<InfoField labelKey={localizationConstants.projectWarrantyFieldDate} value={commitment.date} />
			</dl>
		</ProjectSectionCard>
	);
}

export default WarrantySummaryCard;
