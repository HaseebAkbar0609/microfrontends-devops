"use client";

import { useState } from "react";
import type { Control } from "react-hook-form";
import type { CreateCustomerFormData } from "../../types";
import { FormInput, FormSelect } from "@/components/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import { Trash2 } from "lucide-react";
import localizationConstants from "@/utils/translation/constants";

interface ContactStepProps {
	readonly control: Control<CreateCustomerFormData>;
}

const ROLE_OPTIONS = [
	{ value: "bestallare", label: <Translate text={localizationConstants.roleBestallare} /> },
	{ value: "kontaktperson", label: <Translate text={localizationConstants.roleKontaktperson} /> },
	{ value: "fakturakontakt", label: <Translate text={localizationConstants.roleFakturakontakt} /> },
	{ value: "tekniskkontakt", label: <Translate text={localizationConstants.roleTekniskkontakt} /> },
];

export function ContactStep({ control }: ContactStepProps) {
	const [contactCount, setContactCount] = useState(1);

	const handleAddContact = () => {
		if (contactCount < 5) {
			setContactCount((prev) => prev + 1);
		}
	};

	const handleRemoveContact = () => {
		if (contactCount > 1) {
			setContactCount((prev) => prev - 1);
		}
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
						/>
						<FormInput
							control={control}
							name="email"
							label={localizationConstants.emailLabel}
							placeholder={localizationConstants.placeholderEmail}
							type="email"
						/>
						<FormInput
							control={control}
							name="website"
							label={localizationConstants.websiteLabel}
							placeholder={localizationConstants.placeholderWebsite}
						/>
						<FormInput
							control={control}
							name="contactNotes"
							label={localizationConstants.notesLabel}
							placeholder={localizationConstants.placeholderNotes}
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
										onClick={handleRemoveContact}
										className="rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
									>
										<Trash2 className="h-4 w-4" />
									</button>
								)}
							</div>
							<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 items-start">
								<FormInput
									control={control}
									name={`contactPerson${index + 1}FirstName` as keyof CreateCustomerFormData}
									label={localizationConstants.firstNameLabel}
									placeholder={localizationConstants.placeholderFirstName}
								/>
								<FormInput
									control={control}
									name={`contactPerson${index + 1}LastName` as keyof CreateCustomerFormData}
									label={localizationConstants.lastNameLabel}
									placeholder={localizationConstants.placeholderLastName}
								/>
								<FormInput
									control={control}
									name={`contactPerson${index + 1}Mobile` as keyof CreateCustomerFormData}
									label={localizationConstants.mobilePhoneLabel}
									placeholder={localizationConstants.placeholderMobile}
									type="tel"
								/>
								<FormInput
									control={control}
									name={`contactPerson${index + 1}Email` as keyof CreateCustomerFormData}
									label={localizationConstants.emailLabel}
									placeholder={localizationConstants.placeholderEmail}
									type="email"
								/>
								<FormSelect
									control={control}
									name={`contactPerson${index + 1}Role` as keyof CreateCustomerFormData}
									label={localizationConstants.roleLabel}
									placeholder={localizationConstants.placeholderSelectRole}
									options={ROLE_OPTIONS}
								/>
								<FormInput
									control={control}
									name={`contactPerson${index + 1}PersonalNo` as keyof CreateCustomerFormData}
									label={localizationConstants.personalNoLabel}
									placeholder={localizationConstants.placeholderPersonalNo}
								/>
							</div>
						</div>
					))}
				</CardContent>
			</Card>
		</div>
	);
}
