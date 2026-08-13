"use client";

import { useState, useEffect } from "react";
import type { Control } from "react-hook-form";
import type { CreateAgreementFormData } from "../../types/agreementCreate";
import { FormInput, FormSelect, FormDatePicker } from "@/components/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Handshake } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { getAgreementDepartmentsAction } from "@/api-actions/agreements/agreements";

interface AgreementInformationStepProps {
	readonly control: Control<CreateAgreementFormData>;
}



export function AgreementInformationStep({ control }: AgreementInformationStepProps) {
	const [departmentOptions, setDepartmentOptions] = useState<{value: string, label: string}[]>([]);

	useEffect(() => {
		async function fetchDepartments() {
			try {
				const res = await getAgreementDepartmentsAction();
				if (res.success && res.data) {
					const options = res.data.map(d => ({ value: d, label: d }));
					
					// Make sure the current value is in the options array if it exists
					const currentValue = control._formValues.avdelning;
					if (currentValue && !options.find(o => o.value === currentValue)) {
						options.push({ value: currentValue, label: currentValue });
					}
					
					setDepartmentOptions(options);
				}
			} catch (error) {
				console.error("Failed to fetch departments", error);
			}
		}
		fetchDepartments();
	}, [control._formValues.avdelning]);

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
							options={departmentOptions}
						/>
						<FormInput
							control={control}
							name="objekt"
							label={
								<>
									<Translate text={localizationConstants.agreementCreateObjekt} />{" "}
									<span className="text-red-500">*</span>
								</>
							}
							placeholder={localizationConstants.agreementCreateObjekt}
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
