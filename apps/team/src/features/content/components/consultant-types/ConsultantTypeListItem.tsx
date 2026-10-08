"use client";

import { useId } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/dialog/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { pickCountKey } from "@/utils/pluralLabel";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import type { ConsultantType } from "../../types";

type ConsultantTypeListItemProps = {
	type: ConsultantType;
	isEditing: boolean;
	/** Saving the form or deleting this type: edit and delete wait. */
	isBusy: boolean;
	onEdit: () => void;
	onDelete: () => void;
};

/**
 * One saved consultant type. A type a consultation request uses cannot be
 * deleted, so its delete button is off and the reason is written out.
 */
export function ConsultantTypeListItem({
	type,
	isEditing,
	isBusy,
	onEdit,
	onDelete,
}: ConsultantTypeListItemProps) {
	const t = useTranslate();
	const inUseHintId = useId();
	const sectionCount = type.sections.length;

	return (
		<article
			className={`rounded-lg border p-4 ${
				isEditing ? "border-slate-900 bg-slate-50" : "border-slate-200 bg-white"
			}`}
		>
			<div className="flex items-start justify-between gap-3">
				<div className="min-w-0">
					<h3 className="truncate text-sm font-semibold text-slate-900">
						{type.name}
					</h3>
					<div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-500">
						<span>
							{`${sectionCount} ${t(
								pickCountKey(
									sectionCount,
									localizationConstants.contentConsultantTypeSectionCountSingular,
									localizationConstants.contentConsultantTypeSectionCountPlural,
								),
							)}`}
						</span>
						{type.in_use && (
							<span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800">
								{t(localizationConstants.contentConsultantTypeInUseBadge)}
							</span>
						)}
					</div>
					{type.in_use && (
						<p id={inUseHintId} className="mt-1 text-xs text-slate-500">
							{t(localizationConstants.contentConsultantTypeInUseHint)}
						</p>
					)}
				</div>

				<div className="flex shrink-0 items-center gap-1">
					<Button
						type="button"
						variant="ghost"
						size="icon"
						aria-label={`${t(localizationConstants.contentEditAction)}: ${type.name}`}
						onClick={onEdit}
						disabled={isBusy}
						className="size-8"
					>
						<Pencil className="size-4" aria-hidden />
					</Button>
					<ConfirmDialog
						title={t(localizationConstants.contentConsultantTypeDeleteTitle)}
						description={t(localizationConstants.contentConsultantTypeDeleteDescription)}
						confirmText={t(localizationConstants.contentDeleteAction)}
						cancelText={t(localizationConstants.contentCancelButton)}
						onConfirm={onDelete}
						trigger={
							<Button
								type="button"
								variant="ghost"
								size="icon"
								aria-label={`${t(localizationConstants.contentDeleteAction)}: ${type.name}`}
								aria-describedby={type.in_use ? inUseHintId : undefined}
								disabled={type.in_use || isBusy}
								className="size-8"
							>
								<Trash2 className="size-4" aria-hidden />
							</Button>
						}
					/>
				</div>
			</div>
		</article>
	);
}

export default ConsultantTypeListItem;
