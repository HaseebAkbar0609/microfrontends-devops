"use client";

import { ListPlus } from "lucide-react";
import { useFieldArray, type Control } from "react-hook-form";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { CONSULTANT_TYPE_LIMITS } from "../../constants/content.constants";
import {
	createEmptySection,
	type ConsultantTypeFormValues,
} from "../../schemas/consultantType.schema";
import { ConsultantTypeSectionCard } from "./ConsultantTypeSectionCard";

type ConsultantTypeSectionsEditorProps = {
	control: Control<ConsultantTypeFormValues>;
};

/**
 * The described sections, in the order the customer reads them. Rows are keyed
 * by the field array's id so a moved section keeps its own bullet editor.
 */
export function ConsultantTypeSectionsEditor({
	control,
}: ConsultantTypeSectionsEditorProps) {
	const t = useTranslate();
	const { fields, append, remove, move } = useFieldArray({
		control,
		name: "sections",
	});
	const atLimit = fields.length >= CONSULTANT_TYPE_LIMITS.sections;

	return (
		<div className="flex flex-col gap-3">
			<div className="flex flex-col gap-1">
				<p className="text-sm font-medium text-slate-900">
					{t(localizationConstants.contentConsultantTypeSectionsLabel)}
				</p>
				<p className="text-sm text-slate-500">
					{t(localizationConstants.contentConsultantTypeSectionsHint)}
				</p>
			</div>

			{fields.length === 0 ? (
				<p className="rounded-lg border border-dashed border-slate-300 px-4 py-5 text-center text-sm text-slate-500">
					{t(localizationConstants.contentConsultantTypeNoSections)}
				</p>
			) : (
				<ol className="flex flex-col gap-3">
					{fields.map((field, index) => (
						<ConsultantTypeSectionCard
							key={field.id}
							control={control}
							index={index}
							count={fields.length}
							onMove={move}
							onRemove={() => remove(index)}
						/>
					))}
				</ol>
			)}

			<div className="flex flex-wrap items-center gap-3">
				<Button
					type="button"
					variant="outline"
					disabled={atLimit}
					onClick={() => append(createEmptySection())}
				>
					<ListPlus className="size-4" aria-hidden />
					{t(localizationConstants.contentConsultantTypeAddSection)}
				</Button>
				{atLimit && (
					<p className="text-xs text-slate-500">
						{t(localizationConstants.contentConsultantTypeSectionLimit)}
					</p>
				)}
			</div>
		</div>
	);
}

export default ConsultantTypeSectionsEditor;
