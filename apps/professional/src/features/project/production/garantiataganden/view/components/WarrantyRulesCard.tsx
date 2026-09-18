"use client";

import { BellRing } from "lucide-react";

import { InfoField } from "@/features/purchase/components/shared/InfoFieldGrid";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { ProjectSectionCard } from "../../../components/ProjectSectionCard";
import type { WarrantyCommitment } from "../../types";

/**
 * A field the frame draws as several lines. An empty list falls back to
 * `InfoField`'s missing-value mark rather than an empty box — passing an empty
 * array as children would render nothing at all.
 */
function InfoLines({ labelKey, lines }: { labelKey: TranslationKeys; lines: readonly string[] }) {
	if (lines.length === 0) return <InfoField labelKey={labelKey} />;

	return (
		<InfoField labelKey={labelKey}>
			{lines.map((line, index) => (
				<span key={`${line}-${index}`} className="block truncate" title={line}>
					{line}
				</span>
			))}
		</InfoField>
	);
}

/**
 * Regler: when the reminder goes out and who it reaches. Read-only — there is
 * no endpoint behind it, and the frame offers nothing to change it with.
 */
export function WarrantyRulesCard({ commitment }: { commitment: WarrantyCommitment }) {
	return (
		<ProjectSectionCard
			titleKey={localizationConstants.projectWarrantySectionRules}
			icon={<BellRing className="h-5 w-5 text-slate-700" aria-hidden />}
		>
			<dl className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 xl:grid-cols-4">
				<InfoField labelKey={localizationConstants.projectWarrantyRuleDate} value={commitment.date} />
				<InfoLines labelKey={localizationConstants.projectWarrantyRuleEmails} lines={commitment.reminderEmails} />
				<InfoLines labelKey={localizationConstants.projectWarrantyRuleContacts} lines={commitment.reminderContacts} />
				<InfoField labelKey={localizationConstants.projectWarrantyRuleReminderDate} value={commitment.reminderDate} />
			</dl>
		</ProjectSectionCard>
	);
}

export default WarrantyRulesCard;
