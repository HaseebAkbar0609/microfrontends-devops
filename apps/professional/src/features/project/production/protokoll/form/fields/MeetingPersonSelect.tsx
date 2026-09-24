"use client";

import type { Control, FieldPathByValue, FieldValues } from "react-hook-form";

import { FormSelect } from "@/components/form";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import type { ProjectPerson } from "../../../hooks/useProjectPeople";
import { PersonLabel } from "../../components/PersonLabel";

export interface MeetingPersonSelectProps<T extends FieldValues> {
	control: Control<T>;
	name: FieldPathByValue<T, string>;
	labelKey: TranslationKeys;
	people: ProjectPerson[];
	required?: boolean;
	translateError: (message: string) => string;
	className?: string;
}

/**
 * One of the project's people — Ansvarig, Värd, a point's Ansvarig. The name is
 * the value. Not `searchable`: FormSelect's search box filters nothing, and a
 * project's list is short.
 */
export function MeetingPersonSelect<T extends FieldValues>({
	control,
	name,
	labelKey,
	people,
	required,
	translateError,
	className,
}: MeetingPersonSelectProps<T>) {
	return (
		<FormSelect
			control={control}
			name={name}
			label={labelKey}
			placeholder={localizationConstants.projectProtocolPersonPlaceholder}
			options={people.map((person) => ({ value: person.name, label: <PersonLabel person={person} /> }))}
			required={required}
			translateError={translateError}
			className={className}
		/>
	);
}

export default MeetingPersonSelect;
