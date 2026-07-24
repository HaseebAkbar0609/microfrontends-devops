"use client";

import { useState } from "react";
import { useFormContext, type Control } from "react-hook-form";
import type { CreateSupplierFormData } from "../../types";
import { FormInput, FormSelect } from "@/components/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import { Trash2 } from "lucide-react";
import localizationConstants from "@/utils/translation/constants";

interface SupplierContactStepProps {
	readonly control: Control<CreateSupplierFormData>;
}

const ROLE_OPTIONS = [
	{ value: "bestallare", label: <Translate text={localizationConstants.roleBestallare} /> },
	{ value: "kontaktperson", label: <Translate text={localizationConstants.roleKontaktperson} /> },
	{ value: "fakturakontakt", label: <Translate text={localizationConstants.roleFakturakontakt} /> },
	{ value: "tekniskkontakt", label: <Translate text={localizationConstants.roleTekniskkontakt} /> },
];

export function SupplierContactStep({ control }: SupplierContactStepProps) {
	const [contactCount, setContactCount] = useState(1);
	const { setValue, getValues } = useFormContext<CreateSupplierFormData>();

	const handleAddContact = () => {
		if (contactCount < 5) {
			setContactCount((prev) => prev + 1);
		}
	};

	const handleRemoveContact = (removeIdx: number) => {
		if (contactCount <= 1) return;

		for (let i = removeIdx + 1; i < contactCount; i++) {
			const targetSlot = i;
			const nextSlot = i + 1;

			setValue(
				`contactPerson${targetSlot}FirstName` as keyof CreateSupplierFormData,
				getValues(`contactPerson${nextSlot}FirstName` as keyof CreateSupplierFormData) || "",
			);
			setValue(
				`contactPerson${targetSlot}LastName` as keyof CreateSupplierFormData,
				getValues(`contactPerson${nextSlot}LastName` as keyof CreateSupplierFormData) || "",
			);
			setValue(
				`contactPerson${targetSlot}Mobile` as keyof CreateSupplierFormData,
				getValues(`contactPerson${nextSlot}Mobile` as keyof CreateSupplierFormData) || "",
			);
			setValue(
				`contactPerson${targetSlot}Email` as keyof CreateSupplierFormData,
				getValues(`contactPerson${nextSlot}Email` as keyof CreateSupplierFormData) || "",
			);
			setValue(
				`contactPerson${targetSlot}Role` as keyof CreateSupplierFormData,
				getValues(`contactPerson${nextSlot}Role` as keyof CreateSupplierFormData) || "",
			);
			setValue(
				`contactPerson${targetSlot}PersonalNo` as keyof CreateSupplierFormData,
				getValues(`contactPerson${nextSlot}PersonalNo` as keyof CreateSupplierFormData) || "",
			);
		}

		const lastSlot = contactCount;
		setValue(`contactPerson${lastSlot}FirstName` as keyof CreateSupplierFormData, "");
		setValue(`contactPerson${lastSlot}LastName` as keyof CreateSupplierFormData, "");
		setValue(`contactPerson${lastSlot}Mobile` as keyof CreateSupplierFormData, "");
		setValue(`contactPerson${lastSlot}Email` as keyof CreateSupplierFormData, "");
		setValue(`contactPerson${lastSlot}Role` as keyof CreateSupplierFormData, "");
		setValue(`contactPerson${lastSlot}PersonalNo` as keyof CreateSupplierFormData, "");

		setContactCount((prev) => prev - 1);
	};

	return (
		<div className="flex flex-col gap-6">
			{/* Kontakt Section */}
			<Card>
				<CardHeader className="h-14 flex flex-row items-center border-b border-slate-200 px-6 py-0 [.border-b]:pb-0">
					<CardTitle className="text-base font-medium">
						<Translate text={localizationConstants.contactSection} />
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 items-start">
						<FormInput
							control={control}
							name="phone"
							label={localizationConstants.phoneLabel}
							placeholder={localizationConstants.placeholderPhone}
							type="tel"
							labelClassName="text-[#09090B]"
						/>
						<FormInput
							control={control}
							name="email"
							label={localizationConstants.emailLabel}
							placeholder={localizationConstants.placeholderEmail}
							type="email"
							labelClassName="text-[#09090B]"
						/>
						<FormInput
							control={control}
							name="website"
							label={localizationConstants.websiteLabel}
							placeholder={localizationConstants.placeholderWebsite}
							labelClassName="text-[#09090B]"
						/>
						<FormInput
							control={control}
							name="contactNotes"
							label={localizationConstants.notesLabel}
							placeholder={localizationConstants.placeholderNotes}
							labelClassName="text-[#09090B]"
						/>
					</div>
				</CardContent>
			</Card>

			{/* Kontaktpersoner Section */}
			<Card>
				<CardHeader className="h-14 flex flex-row items-center justify-between space-y-0 border-b border-slate-200 px-6 py-0 [.border-b]:pb-0">
					<CardTitle className="text-base font-medium">
						<Translate text={localizationConstants.contactPersonsSection} />
					</CardTitle>
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={handleAddContact}
						disabled={contactCount >= 5}
						className="h-8 gap-1.5 bg-black hover:bg-black px-6 text-sm font-medium text-white hover:text-white"
					>
						<Translate text={localizationConstants.addContactButton} />
					</Button>
				</CardHeader>
				<CardContent>
					{Array.from({ length: contactCount }, (_, index) => (
						<div key={`contact-person-${index + 1}`} className="mb-4 last:mb-0">
							<div className="mb-3 flex items-center justify-between border-b border-slate-200 bg-slate-100 px-3 py-2">
								<h4 className="text-sm font-semibold text-slate-900">
									<Translate text={localizationConstants.contactPersonLabel} />{" "}
									{String(index + 1).padStart(2, "0")}
								</h4>
								{contactCount > 1 && (
									<button
										type="button"
										onClick={() => handleRemoveContact(index + 1)}
										className="rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
									>
										<Trash2 className="h-4 w-4" />
									</button>
								)}
							</div>
							<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 items-start">
								<FormInput
									control={control}
									name={`contactPerson${index + 1}FirstName` as keyof CreateSupplierFormData}
									label={localizationConstants.firstNameLabel}
									placeholder={localizationConstants.placeholderFirstName}
									labelClassName="text-[#09090B]"
								/>
								<FormInput
									control={control}
									name={`contactPerson${index + 1}LastName` as keyof CreateSupplierFormData}
									label={localizationConstants.lastNameLabel}
									placeholder={localizationConstants.placeholderLastName}
									labelClassName="text-[#09090B]"
								/>
								<FormInput
									control={control}
									name={`contactPerson${index + 1}Mobile` as keyof CreateSupplierFormData}
									label={localizationConstants.mobilePhoneLabel}
									placeholder={localizationConstants.placeholderMobile}
									type="tel"
									labelClassName="text-[#09090B]"
								/>
								<FormInput
									control={control}
									name={`contactPerson${index + 1}Email` as keyof CreateSupplierFormData}
									label={localizationConstants.emailLabel}
									placeholder={localizationConstants.placeholderEmail}
									type="email"
									labelClassName="text-[#09090B]"
								/>
								<FormSelect
									control={control}
									name={`contactPerson${index + 1}Role` as keyof CreateSupplierFormData}
									label={localizationConstants.roleLabel}
									placeholder={localizationConstants.placeholderSelectRole}
									options={ROLE_OPTIONS}
									labelClassName="text-[#09090B]"
								/>
								<FormInput
									control={control}
									name={`contactPerson${index + 1}PersonalNo` as keyof CreateSupplierFormData}
									label={localizationConstants.personalNoLabel}
									placeholder={localizationConstants.placeholderPersonalNo}
									labelClassName="text-[#09090B]"
								/>
							</div>
						</div>
					))}
				</CardContent>
			</Card>
		</div>
	);
}
