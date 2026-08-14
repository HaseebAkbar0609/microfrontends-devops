"use client";

import type { Control } from "react-hook-form";
import type { CreateCustomerFormData } from "../../types";
import { FormInput, FormSelect } from "@/components/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface BasicInfoStepProps {
	readonly control: Control<CreateCustomerFormData>;
}

const STATUS_OPTIONS = [
	{ value: "active", label: <Translate text={localizationConstants.activeStatus} /> },
	{ value: "inactive", label: <Translate text={localizationConstants.inactiveStatus} /> },
];

const MAIN_CATEGORY_OPTIONS = [
	{ value: "bygg", label: <Translate text={localizationConstants.categoryBygg} /> },
	{ value: "stada", label: <Translate text={localizationConstants.categoryStada} /> },
	{ value: "el", label: <Translate text={localizationConstants.categoryEl} /> },
	{ value: "ror", label: <Translate text={localizationConstants.categoryRor} /> },
	{ value: "ventilation", label: <Translate text={localizationConstants.categoryVentilation} /> },
	{ value: "malning", label: <Translate text={localizationConstants.categoryMalning} /> },
	{ value: "annat", label: <Translate text={localizationConstants.categoryAnnat} /> },
];

const PLUSGIRO_OPTIONS = [
	{ value: "plusgiro_standard", label: "PlusGirot Standard" },
	{ value: "plusgiro_foretag", label: "PlusGirot Företag" },
	{ value: "plusgiro_direkt", label: "PlusGirot Direkt" },
];

export function BasicInfoStep({ control }: BasicInfoStepProps) {
	return (
		<div className="flex flex-col gap-6">
			{/* Kund Section */}
			<Card>
				<CardHeader className="h-14 flex flex-row items-center border-b border-slate-200 px-6 py-0 [.border-b]:pb-0">
					<CardTitle className="text-base font-medium">
						<Translate text={localizationConstants.customerSection} />
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 items-start">
						<FormInput
							control={control}
							name="customerNo"
							label={localizationConstants.customerNoLabel}
							placeholder={localizationConstants.placeholderCustomerNo}
						/>
						<FormSelect
							control={control}
							name="status"
							label={localizationConstants.statusLabel}
							placeholder={localizationConstants.placeholderSelectStatus}
							options={STATUS_OPTIONS}
						/>
						<FormInput
							control={control}
							name="companyName"
							label={localizationConstants.companyNameLabel}
							placeholder={localizationConstants.placeholderCompanyName}
						/>
						<FormSelect
							control={control}
							name="mainCategory"
							label={localizationConstants.mainCategoryLabel}
							placeholder={localizationConstants.placeholderSelectCategory}
							options={MAIN_CATEGORY_OPTIONS}
						/>
						<FormInput
							control={control}
							name="department"
							label={localizationConstants.departmentLabel}
							placeholder={localizationConstants.placeholderDepartment}
						/>
						<FormInput
							control={control}
							name="region"
							label={localizationConstants.regionLabel}
							placeholder={localizationConstants.placeholderRegion}
						/>
						<FormInput
							control={control}
							name="orgNo"
							label={localizationConstants.orgNoLabel}
							placeholder={localizationConstants.placeholderOrgNo}
						/>
						<FormInput
							control={control}
							name="vatRegNo"
							label={localizationConstants.vatRegNoLabel}
							placeholder={localizationConstants.placeholderVatRegNo}
						/>
					</div>
				</CardContent>
			</Card>

			{/* Addresser Section */}
			<Card>
				<CardHeader className="h-14 flex flex-row items-center border-b border-slate-200 px-6 py-0 [.border-b]:pb-0">
					<CardTitle className="text-base font-medium">
						<Translate text={localizationConstants.addressesSection} />
					</CardTitle>
				</CardHeader>
				<CardContent>
					{/* Besökadress */}
					<div className="mb-6">
						<h4 className="mb-3 border-b border-slate-200 bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-900">
							<Translate text={localizationConstants.visitingAddressLabel} />
						</h4>
						<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 items-start">
							<FormInput
								control={control}
								name="visitingAddress"
								label={localizationConstants.visitingAddressLabel}
								placeholder={localizationConstants.placeholderAddress}
								className="lg:col-span-2"
							/>
							<FormInput
								control={control}
								name="visitingPostalCode"
								label={localizationConstants.postalCodeLabel}
								placeholder={localizationConstants.placeholderPostalCode}
							/>
							<FormInput
								control={control}
								name="visitingCity"
								label={localizationConstants.cityLabel}
								placeholder={localizationConstants.placeholderCity}
							/>
						</div>
					</div>

					{/* Fakturaadress */}
					<div>
						<h4 className="mb-3 border-b border-slate-200 bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-900">
							<Translate text={localizationConstants.invoiceAddressLabel} />
						</h4>
						<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 items-start">
							<FormInput
								control={control}
								name="invoiceAddress"
								label={localizationConstants.invoiceAddressLabel}
								placeholder={localizationConstants.placeholderAddress}
								className="lg:col-span-2"
							/>
							<FormInput
								control={control}
								name="invoicePostalCode"
								label={localizationConstants.postalCodeLabel}
								placeholder={localizationConstants.placeholderPostalCode}
							/>
							<FormInput
								control={control}
								name="invoiceCity"
								label={localizationConstants.cityLabel}
								placeholder={localizationConstants.placeholderCity}
							/>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Bank Information Section */}
			<Card>
				<CardHeader className="h-14 flex flex-row items-center border-b border-slate-200 px-6 py-0 [.border-b]:pb-0">
					<CardTitle className="text-base font-medium">
						<Translate text={localizationConstants.bankInfoSection} />
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 items-start">
						<FormInput
							control={control}
							name="bankName"
							label={localizationConstants.bankNameLabel}
							placeholder={localizationConstants.placeholderBankName}
						/>
						<FormInput
							control={control}
							name="bankAccount"
							label={localizationConstants.bankAccountLabel}
							placeholder={localizationConstants.placeholderBankAccount}
						/>
						<FormInput
							control={control}
							name="bankgiro"
							label={localizationConstants.bankgiroLabel}
							placeholder={localizationConstants.placeholderBankgiro}
						/>
						<FormSelect
							control={control}
							name="plusgiro"
							label={localizationConstants.plusgiroLabel}
							placeholder={localizationConstants.placeholderSelectPlusgiro}
							options={PLUSGIRO_OPTIONS}
						/>
						<FormInput
							control={control}
							name="iban"
							label={localizationConstants.ibanLabel}
							placeholder={localizationConstants.placeholderIban}
						/>
						<FormInput
							control={control}
							name="bic"
							label={localizationConstants.bicLabel}
							placeholder={localizationConstants.placeholderBic}
						/>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
