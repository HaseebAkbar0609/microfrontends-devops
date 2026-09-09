"use client";

import type { Control } from "react-hook-form";
import { FormInput } from "@/components/form/FormInput";
import { FormSelect } from "@/components/form/FormSelect";
import { FormTextarea } from "@/components/form/FormTextarea";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import type { RegisterFormValues } from "../../schemas/registerSection.schema";
import type { MarketingField } from "../../types";

type RegisterFieldInputProps = {
	control: Control<RegisterFormValues>;
	field: MarketingField;
};

/**
 * Renders one configured field. Adding a column to a register is a config
 * change; the prototype had no textarea branch at all, so a multi-line event
 * programme was edited in a single-line input.
 */
export function RegisterFieldInput({ control, field }: RegisterFieldInputProps) {
	if (field.type === "textarea") {
		return (
			<FormTextarea
				control={control}
				name={field.name}
				label={field.labelKey}
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
				placeholder={localizationConstants.marketingSelectPlaceholder}
				options={(field.options ?? []).map((option) => ({
					value: option.id,
					label: <Translate text={option.labelKey} />,
				}))}
			/>
		);
	}

	return (
		<FormInput
			control={control}
			name={field.name}
			label={field.labelKey}
			type={field.type === "date" ? "date" : "text"}
		/>
	);
}

export default RegisterFieldInput;
