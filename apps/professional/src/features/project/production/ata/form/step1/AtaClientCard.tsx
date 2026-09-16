"use client";

import { Users } from "lucide-react";
import type { Control } from "react-hook-form";

import { FormInput } from "@/components/form";
import localizationConstants from "@/utils/translation/constants";
import { ProjectSectionCard } from "../../../components/ProjectSectionCard";
import { ATA_TEXT_MAX_LENGTH } from "../../projectAta.config";
import type { AtaFormValues } from "../ataFormSchema";

export interface AtaClientCardProps {
	control: Control<AtaFormValues>;
	translateError: (message: string) => string;
}

/** Step 1's "Beställare": the client, its contact and address, prefilled from the project record. */
export function AtaClientCard({ control, translateError }: AtaClientCardProps) {
	const inputProps = { maxLength: ATA_TEXT_MAX_LENGTH };

	return (
		<ProjectSectionCard
			titleKey={localizationConstants.projectAtaClient}
			icon={<Users className="h-5 w-5 text-slate-700" aria-hidden />}
		>
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<FormInput
					control={control}
					name="client.client"
					label={localizationConstants.projectAtaClient}
					required
					inputProps={inputProps}
					translateError={translateError}
				/>
				{/* The frame leaves the cell beside Beställare empty. */}
				<div aria-hidden className="hidden sm:block" />
				<FormInput control={control} name="client.name" label={localizationConstants.createAtaOrdererName} inputProps={inputProps} translateError={translateError} />
				<FormInput control={control} name="client.address" label={localizationConstants.createAtaAddress} inputProps={inputProps} translateError={translateError} />
				<FormInput
					control={control}
					name="client.postalCode"
					label={localizationConstants.projectAtaPostalCode}
					inputProps={{ maxLength: 6, inputMode: "numeric", autoComplete: "postal-code" }}
					translateError={translateError}
				/>
				<FormInput control={control} name="client.city" label={localizationConstants.createAtaCity} inputProps={inputProps} translateError={translateError} />
			</div>
		</ProjectSectionCard>
	);
}

export default AtaClientCard;
