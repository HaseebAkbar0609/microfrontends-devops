"use client";

import React from "react";

import { MultiFileUploadField, type PendingUploadFile } from "@/components/form";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import type { CasePickRejection } from "../../../utils/caseAttachments";

export interface CaseUploadCardProps {
	titleKey: TranslationKeys;
	/** The icon the images card draws beside its title. */
	icon?: React.ReactNode;
	headingKey: TranslationKeys;
	hintKey: TranslationKeys;
	accept: string;
	/** The card's own ceiling, named in the refusal when a pick exceeds it. */
	maxCount: number;
	pending: PendingUploadFile[];
	placeholderKey: TranslationKeys;
	onSelect: (files: File[]) => void;
	onRemovePending: (name: string) => void;
	onUpload: () => void;
	rejection: CasePickRejection | null;
	/** The table or the gallery of what has been added. */
	children: React.ReactNode;
}

/**
 * One upload card on the Dokuments tab: what may be added, the picker, and
 * what has been added so far.
 *
 * Documents and images differ only in their labels, their rules and what they
 * show underneath, so both draw this card.
 */
export function CaseUploadCard({
	titleKey,
	icon,
	headingKey,
	hintKey,
	accept,
	maxCount,
	pending,
	placeholderKey,
	onSelect,
	onRemovePending,
	onUpload,
	rejection,
	children,
}: CaseUploadCardProps) {
	const t = useTranslate();

	return (
		<div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
			<h2 className="flex items-center gap-2 border-b border-slate-100 px-6 py-4 text-sm font-bold text-slate-900">
				{icon}
				<Translate text={titleKey} />
			</h2>

			<div className="space-y-4 px-6 py-5">
				<div>
					<p className="text-xs font-semibold text-slate-700">
						<Translate text={headingKey} />
					</p>
					<p className="mt-0.5 text-xs text-slate-400">
						<Translate text={hintKey} />
					</p>
				</div>

				<MultiFileUploadField
					pendingFiles={pending}
					onSelectFiles={onSelect}
					onRemovePending={onRemovePending}
					onUpload={onUpload}
					accept={accept}
					placeholder={placeholderKey}
					buttonLabel={localizationConstants.casesBtnUpload}
				/>

				{rejection && (
					<p className="text-xs text-red-600">
						{t(rejection.key, { name: rejection.name ?? "", max: maxCount })}
					</p>
				)}

				{children}
			</div>
		</div>
	);
}

export default CaseUploadCard;
