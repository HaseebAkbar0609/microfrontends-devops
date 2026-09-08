"use client";

import type { Control } from "react-hook-form";
import { FormInput } from "@/components/form/FormInput";
import { FormSelect } from "@/components/form/FormSelect";
import { FormTextarea } from "@/components/form/FormTextarea";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { isMediaField } from "../schemas/contentSection.schema";
import type { ContentField, ContentRowValues } from "../types";
import { toMediaList } from "../utils/mediaValues";
import { MediaInput } from "./MediaInput";

type SectionFieldInputProps = {
	control: Control<ContentRowValues>;
	field: ContentField;
};

/**
 * Renders one configured field. The section config is the only thing that
 * decides which control appears, so adding a field is a data change.
 */
export function SectionFieldInput({ control, field }: SectionFieldInputProps) {
	if (field.type === "textarea") {
		return (
			<FormTextarea
				control={control}
				name={field.name}
				label={field.labelKey}
				placeholder={field.placeholderKey}
				rows={4}
			/>
		);
	}

	if (field.type === "select") {
		return (
			<FormSelect
				control={control}
				name={field.name}
				label={field.labelKey}
				placeholder={localizationConstants.contentSelectPlaceholder}
				options={(field.options ?? []).map((option) => ({
					value: option.id,
					label: <Translate text={option.labelKey} />,
				}))}
			/>
		);
	}

	if (isMediaField(field.type)) {
		return (
			<FormField
				control={control}
				name={field.name}
				render={({ field: controlled }) => (
					<FormItem className="grid gap-2">
						<FormLabel>
							<Translate text={field.labelKey} />
						</FormLabel>
						<MediaInput
							id={field.name}
							kind={field.type === "video" ? "video" : "image"}
							multiple={field.type !== "image"}
							value={toMediaList(controlled.value)}
							onChange={controlled.onChange}
						/>
					</FormItem>
				)}
			/>
		);
	}

	return (
		<FormInput
			control={control}
			name={field.name}
			label={field.labelKey}
			placeholder={field.placeholderKey}
			type={field.type === "date" ? "date" : "text"}
		/>
	);
}

export default SectionFieldInput;
