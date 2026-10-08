"use client";

import { useId } from "react";
import type { Control } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormInput } from "@/components/form/FormInput";
import localizationConstants from "@/utils/translation/constants";
import { CONSULTANT_TYPE_LIMITS } from "../../constants/content.constants";
import type { ConsultantTypeFormValues } from "../../schemas/consultantType.schema";
import { ConsultantTypeBulletList } from "./ConsultantTypeBulletList";
import { DraftRowActions } from "./DraftRowActions";

type ConsultantTypeSectionCardProps = {
	control: Control<ConsultantTypeFormValues>;
	index: number;
	count: number;
	onMove: (from: number, to: number) => void;
	onRemove: () => void;
};

/** One section of the draft: its heading, its bullets and its place in the list. */
export function ConsultantTypeSectionCard({
	control,
	index,
	count,
	onMove,
	onRemove,
}: ConsultantTypeSectionCardProps) {
	const { t } = useTranslation();
	const label = t(localizationConstants.contentConsultantTypeSectionNumber, {
		number: index + 1,
	});
	const headingId = useId();

	return (
		<li
			aria-labelledby={headingId}
			className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4"
		>
			<div className="flex items-center justify-between gap-3">
				<h3 id={headingId} className="text-sm font-semibold text-slate-900">
					{label}
				</h3>
				<DraftRowActions
					index={index}
					count={count}
					itemLabel={label}
					removeLabelKey={localizationConstants.contentConsultantTypeRemoveSection}
					onMove={onMove}
					onRemove={onRemove}
				/>
			</div>

			<FormInput
				control={control}
				name={`sections.${index}.title`}
				label={localizationConstants.contentConsultantTypeSectionHeadingLabel}
				placeholder={localizationConstants.contentConsultantTypeSectionHeadingPlaceholder}
				inputClassName="bg-white"
				inputProps={{ maxLength: CONSULTANT_TYPE_LIMITS.sectionTitleLength }}
			/>

			<ConsultantTypeBulletList control={control} sectionIndex={index} />
		</li>
	);
}

export default ConsultantTypeSectionCard;
