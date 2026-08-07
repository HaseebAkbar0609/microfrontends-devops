"use client";

import type { Control } from "react-hook-form";
import type { CreateAgreementFormData } from "../../types/agreementCreate";
import { FormInput, FormSelect, FormDatePicker } from "@/components/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Handshake } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface AgreementInformationStepProps {
	readonly control: Control<CreateAgreementFormData>;
}

const DEPARTMENT_OPTIONS = [
	{ value: "overhead", label: "Overhead" },
	{ value: "entreprenad", label: "Entreprenad" },
	{ value: "service", label: "Service" },
	{ value: "personal", label: "Personal" },
];

const OBJECT_OPTIONS = [
	{ value: "it-utrustning", label: "It - Utrustning" },
	{ value: "kontor", label: "Kontor" },
	{ value: "fordon", label: "Fordon" },
	{ value: "projekt", label: "Projekt" },
];

export function AgreementInformationStep({ control }: AgreementInformationStepProps) {
	return (
		<div className="flex flex-col gap-6">
			<Card>
				<CardHeader className="h-14 flex flex-row items-center border-b border-slate-200 px-6 py-0 [.border-b]:pb-0">
					<CardTitle className="flex items-center gap-2 text-base font-medium">
						<Handshake className="h-5 w-5 text-slate-700" />
						<Translate text={localizationConstants.agreementDetailAvtalDetails} />
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 items-start">
						<FormSelect
							control={control}
							name="avdelning"
							label={
								<>
									<Translate text={localizationConstants.agreementDetailAvdelning} />{" "}
									<span className="text-red-500">*</span>
								</>
							}
							placeholder={localizationConstants.agreementDetailAvdelning}
							options={DEPARTMENT_OPTIONS}
						/>
						<FormSelect
							control={control}
							name="objekt"
							label={
								<>
									<Translate text={localizationConstants.agreementCreateObjekt} />{" "}
									<span className="text-red-500">*</span>
								</>
							}
							placeholder={localizationConstants.agreementCreateObjekt}
							options={OBJECT_OPTIONS}
						/>
						<div className="lg:col-span-2">
							<FormInput
								control={control}
								name="ansvarig"
								label={localizationConstants.agreementDetailAnsvarig}
								placeholder={localizationConstants.agreementDetailAnsvarig}
							/>
						</div>
						<div className="lg:col-span-2">
							<FormInput
								control={control}
								name="anteckning"
								label={localizationConstants.agreementCreateAnteckning}
								placeholder={localizationConstants.agreementCreateAnteckning}
							/>
						</div>
						<FormDatePicker
							control={control}
							name="startdatum"
							label={
								<>
									<Translate text={localizationConstants.agreementDetailStartdatum} />{" "}
									<span className="text-red-500">*</span>
								</>
							}
						/>
						<FormDatePicker
							control={control}
							name="slutdatum"
							label={localizationConstants.agreementDetailSlutdatum}
						/>
						<FormDatePicker
							control={control}
							name="aktionsdatum"
							label={localizationConstants.agreementDetailAktionDatum}
						/>
						<FormDatePicker
							control={control}
							name="paminnelseDatum"
							label={localizationConstants.agreementDetailPaminnelseDatum}
						/>
						<div className="lg:col-span-2">
							<FormInput
								control={control}
								name="paminnelseText"
								label={localizationConstants.agreementCreatePaminnelseText}
								placeholder={localizationConstants.agreementCreatePaminnelseText}
							/>
						</div>
						<div className="lg:col-span-2">
							<FormInput
								control={control}
								name="avtalsprioritet"
								label={localizationConstants.agreementDetailAvtalsprioritet}
								placeholder={localizationConstants.agreementDetailAvtalsprioritet}
							/>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
