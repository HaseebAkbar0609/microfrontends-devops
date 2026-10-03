"use client";

import { useMemo } from "react";
import { Contact } from "lucide-react";
import { Input } from "@/components/ui/input";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { ACCESS_NEW_LIMITS } from "../../constants/accessNewLimits.constants";
import { useAccessNewDraft } from "../../context/AccessNewDraftContext";
import { validateInfo } from "../../utils/accessNew";
import { AccessSectionCard } from "../details/AccessSectionCard";
import { AccessFormField } from "./AccessFormField";

type TextField = "name" | "address" | "postalCode" | "city";

const FIELDS: { field: TextField; label: TranslationKeys; max?: number }[] = [
	{ field: "name", label: localizationConstants.accessFieldAccessName, max: ACCESS_NEW_LIMITS.name },
	{ field: "address", label: localizationConstants.address, max: ACCESS_NEW_LIMITS.address },
	{ field: "postalCode", label: localizationConstants.postalCode },
	{ field: "city", label: localizationConstants.city, max: ACCESS_NEW_LIMITS.city },
];

/** "Access Information" card: name, address, postal code and city, with inline errors once the user has tried to go on. */
export function AccessNewInfoCard() {
	const { info, setInfoField, showInfoErrors } = useAccessNewDraft();
	const errors = useMemo(() => (showInfoErrors ? validateInfo(info) : {}), [showInfoErrors, info]);

	return (
		<AccessSectionCard icon={<Contact className="h-5 w-5" aria-hidden />} title={localizationConstants.accessSectionInformation}>
			<div className="grid gap-4 p-4 sm:grid-cols-2">
				{FIELDS.map(({ field, label, max }) => (
					<AccessFormField key={field} id={`access-new-${field}`} label={label} error={errors[field]} max={max}>
						<Input
							id={`access-new-${field}`}
							value={info[field]}
							onChange={(event) => setInfoField(field, event.target.value)}
							aria-invalid={errors[field] ? true : undefined}
							aria-describedby={errors[field] ? `access-new-${field}-error` : undefined}
						/>
					</AccessFormField>
				))}
			</div>
		</AccessSectionCard>
	);
}
