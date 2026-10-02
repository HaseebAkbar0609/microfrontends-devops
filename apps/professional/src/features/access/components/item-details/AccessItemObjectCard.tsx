"use client";

import { UserPlus } from "lucide-react";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { ACCESS_TYPE_LABELS } from "../../constants/access.constants";
import type { AccessItem } from "../../types/accessItems.types";
import { AccessSectionCard } from "../details/AccessSectionCard";

function Field({ label, children }: { label: TranslationKeys; children: React.ReactNode }) {
	return (
		<div className="min-w-0">
			<dt className="text-sm font-semibold text-slate-900">
				<Translate text={label} />
			</dt>
			<dd className="mt-1 break-words text-sm text-slate-500">{children}</dd>
		</div>
	);
}

/** "Access Object" card: the item's own fields, with where it opens shown as tags. */
export function AccessItemObjectCard({ item, onEdit }: { item: AccessItem; onEdit: () => void }) {
	const t = useTranslate();

	return (
		<AccessSectionCard
			icon={<UserPlus className="h-5 w-5" aria-hidden />}
			title={localizationConstants.accessItemSectionObject}
			onEdit={onEdit}
		>
			<dl className="grid gap-x-6 gap-y-4 p-4 sm:grid-cols-2 xl:grid-cols-4">
				<Field label={localizationConstants.accessItemFieldKeyId}>{item.nycId}</Field>
				<Field label={localizationConstants.accessColType}>{t(ACCESS_TYPE_LABELS[item.type])}</Field>
				<Field label={localizationConstants.accessItemColRegNo}>{item.regNo}</Field>
				<Field label={localizationConstants.accessItemColStartDate}>{item.startDate}</Field>
				<Field label={localizationConstants.accessItemFieldReturnDate}>{item.endDate}</Field>
				<Field label={localizationConstants.accessItemColAccessTo}>
					<span className="inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-900">
						{item.accessTo}
					</span>
				</Field>
			</dl>
		</AccessSectionCard>
	);
}
