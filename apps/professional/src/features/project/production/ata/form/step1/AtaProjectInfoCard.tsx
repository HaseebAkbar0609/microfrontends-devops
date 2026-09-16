"use client";

import { Info } from "lucide-react";
import type { Control } from "react-hook-form";

import { FormInput } from "@/components/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { ProjectSectionCard } from "../../../components/ProjectSectionCard";
import { ATA_LONG_TEXT_MAX_LENGTH, ATA_TEXT_MAX_LENGTH } from "../../projectAta.config";
import type { AtaFormValues } from "../ataFormSchema";

export interface AtaProjectInfoCardProps {
	control: Control<AtaFormValues>;
	number: number;
	translateError: (message: string) => string;
}

const TEXTAREA = "min-h-24 resize-y";

/**
 * Step 1's "Projektinformation". Äta nummer is assigned by the project, so it
 * reads rather than edits. The frame draws "Rubrik" twice; the second is an
 * Underrubrik. The four statuses are free text, as drawn.
 */
export function AtaProjectInfoCard({ control, number, translateError }: AtaProjectInfoCardProps) {
	const t = useTranslate();
	const short = { maxLength: ATA_TEXT_MAX_LENGTH };
	const long = { maxLength: ATA_LONG_TEXT_MAX_LENGTH };

	return (
		<ProjectSectionCard
			titleKey={localizationConstants.projectAtaProjectInfo}
			icon={<Info className="h-5 w-5 text-slate-700" aria-hidden />}
		>
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<div className="grid gap-1">
					<Label htmlFor="ata-number">
						<Translate text={localizationConstants.projectAtaNumber} />
					</Label>
					<Input
						id="ata-number"
						value={t(localizationConstants.projectAtaLabel, { number })}
						readOnly
						aria-readonly
						className="h-10 bg-slate-50 text-slate-700"
					/>
				</div>
				<div aria-hidden className="hidden sm:block" />
				<FormInput control={control} name="info.heading" label={localizationConstants.projectAtaHeading} required inputProps={short} translateError={translateError} />
				<FormInput control={control} name="info.subheading" label={localizationConstants.projectAtaSubheading} inputProps={short} translateError={translateError} />
				<FormInput control={control} name="info.proposedAction" type="textarea" label={localizationConstants.projectAtaProposedAction} inputClassName={TEXTAREA} inputProps={long} translateError={translateError} />
				<FormInput control={control} name="info.action" type="textarea" label={localizationConstants.createAtaAction} inputClassName={TEXTAREA} inputProps={long} translateError={translateError} />
				<FormInput control={control} name="info.qualityStatus" label={localizationConstants.createAtaQualityStatus} inputProps={short} translateError={translateError} />
				<FormInput control={control} name="info.reason" label={localizationConstants.createAtaReason} inputProps={short} translateError={translateError} />
				<FormInput control={control} name="info.economyStatus" label={localizationConstants.projectAtaEconomyStatus} inputProps={short} translateError={translateError} />
				<FormInput control={control} name="info.location" label={localizationConstants.createAtaColPosition} inputProps={short} translateError={translateError} />
				<FormInput
					control={control}
					name="info.description"
					type="textarea"
					label={localizationConstants.createAtaDescription}
					className="sm:col-span-2"
					inputClassName={TEXTAREA}
					inputProps={long}
					translateError={translateError}
				/>
			</div>
		</ProjectSectionCard>
	);
}

export default AtaProjectInfoCard;
