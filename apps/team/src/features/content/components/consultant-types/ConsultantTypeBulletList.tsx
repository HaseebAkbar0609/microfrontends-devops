"use client";

import { Plus } from "lucide-react";
import { useFieldArray, type Control } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormInput } from "@/components/form/FormInput";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { CONSULTANT_TYPE_LIMITS } from "../../constants/content.constants";
import type { ConsultantTypeFormValues } from "../../schemas/consultantType.schema";
import { DraftRowActions } from "./DraftRowActions";

type ConsultantTypeBulletListProps = {
	control: Control<ConsultantTypeFormValues>;
	sectionIndex: number;
};

/** The bullets under one section heading: add, edit, reorder and remove. */
export function ConsultantTypeBulletList({
	control,
	sectionIndex,
}: ConsultantTypeBulletListProps) {
	const { t } = useTranslation();
	const { fields, append, remove, move } = useFieldArray({
		control,
		name: `sections.${sectionIndex}.bullets`,
	});
	const atLimit = fields.length >= CONSULTANT_TYPE_LIMITS.bulletsPerSection;

	return (
		<div className="flex flex-col gap-2">
			<p className="text-sm font-medium text-slate-900">
				{t(localizationConstants.contentConsultantTypeBulletsLabel)}
			</p>

			{fields.length === 0 ? (
				<p className="text-sm text-slate-500">
					{t(localizationConstants.contentConsultantTypeNoBullets)}
				</p>
			) : (
				<ol className="flex flex-col gap-2">
					{fields.map((field, index) => {
						const label = t(localizationConstants.contentConsultantTypeBulletNumber, {
							number: index + 1,
						});
						return (
							<li key={field.id} className="flex items-start gap-1">
								<FormInput
									control={control}
									name={`sections.${sectionIndex}.bullets.${index}.text`}
									placeholder={localizationConstants.contentConsultantTypeBulletPlaceholder}
									className="min-w-0 flex-1"
									inputClassName="bg-white"
									inputProps={{
										"aria-label": label,
										maxLength: CONSULTANT_TYPE_LIMITS.bulletLength,
									}}
								/>
								<DraftRowActions
									index={index}
									count={fields.length}
									itemLabel={label}
									removeLabelKey={localizationConstants.contentConsultantTypeRemoveBullet}
									onMove={move}
									onRemove={() => remove(index)}
									// Centres the 32px buttons on the 40px (48px on 2xl) input.
									className="pt-1 2xl:pt-2"
								/>
							</li>
						);
					})}
				</ol>
			)}

			<div className="flex flex-wrap items-center gap-3">
				<Button
					type="button"
					variant="outline"
					size="sm"
					disabled={atLimit}
					onClick={() => append({ text: "" })}
				>
					<Plus className="size-4" aria-hidden />
					{t(localizationConstants.contentConsultantTypeAddBullet)}
				</Button>
				{atLimit && (
					<p className="text-xs text-slate-500">
						{t(localizationConstants.contentConsultantTypeBulletLimit)}
					</p>
				)}
			</div>
		</div>
	);
}

export default ConsultantTypeBulletList;
