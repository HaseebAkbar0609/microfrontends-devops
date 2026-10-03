"use client";

import { Contact } from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { ACCESS_COMPANY_OPTIONS, ACCESS_PERSON_OPTIONS } from "../../data/accessNewOptions.mock";
import type { AccessNewKeyFormState } from "../../hooks/useAccessNewKeyForm";
import { AccessSectionCard } from "../details/AccessSectionCard";
import { AccessSelectField } from "./AccessFormField";

const COMPANY_OPTIONS = ACCESS_COMPANY_OPTIONS.map((value) => ({ value, label: value }));
const PERSON_OPTIONS = ACCESS_PERSON_OPTIONS.map((person) => ({ value: person.name, label: person.name }));

/** "Assign Access" card of step 2: which company and which person get the key. */
export function AccessNewAssignCard({ keyForm }: { keyForm: AccessNewKeyFormState }) {
	const { form, setField, errors } = keyForm;

	return (
		<AccessSectionCard icon={<Contact className="h-5 w-5" aria-hidden />} title={localizationConstants.accessNewSectionAssign}>
			<div className="grid gap-4 p-4 sm:grid-cols-2">
				<AccessSelectField
					id="access-new-company"
					label={localizationConstants.accessAssignedCompany}
					placeholder={localizationConstants.accessNewSelectPlaceholder}
					value={form.company}
					onChange={(value) => setField("company", value)}
					options={COMPANY_OPTIONS}
					error={errors.company}
				/>
				<AccessSelectField
					id="access-new-key-person"
					label={localizationConstants.accessAssignedPerson}
					placeholder={localizationConstants.accessNewSelectPlaceholder}
					value={form.person}
					onChange={(value) => setField("person", value)}
					options={PERSON_OPTIONS}
					error={errors.person}
				/>
			</div>
		</AccessSectionCard>
	);
}
