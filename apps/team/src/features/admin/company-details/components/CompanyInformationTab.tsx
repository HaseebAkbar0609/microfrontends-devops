"use client";

import type { UseFormReturn } from "react-hook-form";
import { Building2, MapPinned, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form, FormInput } from "@/components/form";
import { CollapsibleSection } from "@/components/common/CollapsibleSection";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { CompanyInformationFormValues } from "../schemas/companyInformation.schema";

type CompanyInformationTabProps = {
	form: UseFormReturn<CompanyInformationFormValues>;
	onSubmit: (data: CompanyInformationFormValues) => Promise<void>;
	lastSavedRef: { current: CompanyInformationFormValues | null };
};

export function CompanyInformationTab({
	form,
	onSubmit,
	lastSavedRef,
}: CompanyInformationTabProps) {
	const { handleSubmit, control } = form;

	return (
		<Form {...form}>
			<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
				<CollapsibleSection
					className="rounded-md border border-slate-200 bg-white py-4 shadow-sm"
					contentClassName="px-5"
					icon={<Building2 size={20} className="text-slate-700" />}
					title={<Translate text={localizationConstants.companyLabel} />}
					defaultOpen
				>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
						<FormInput
							control={control}
							name="companyName"
							label={localizationConstants.nameLabel}
							placeholder={localizationConstants.nameLabel}
						/>
						<FormInput
							control={control}
							name="orgNumber"
							label={localizationConstants.orgNumberLabel}
							placeholder={localizationConstants.adminOrgNumberPlaceholder}
						/>
						<FormInput
							control={control}
							name="vatNumber"
							label={localizationConstants.adminVatNumberLabel}
							placeholder={localizationConstants.adminVatNumberLabel}
						/>
						<FormInput
							control={control}
							name="sniCode"
							label={localizationConstants.adminSniCodeLabel}
							placeholder={localizationConstants.adminSniCodeLabel}
						/>
					</div>
				</CollapsibleSection>

				<CollapsibleSection
					className="rounded-md border border-slate-200 bg-white py-4 shadow-sm"
					contentClassName="space-y-6 px-5"
					icon={<MapPinned size={20} className="text-slate-700" />}
					title={<Translate text={localizationConstants.addressLabel} />}
					defaultOpen
				>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
						<FormInput
							control={control}
							name="postalAddress.streetAddress"
							label={localizationConstants.adminPostAddressLabel}
							placeholder={localizationConstants.adminPostAddressLabel}
						/>
						<FormInput
							control={control}
							name="postalAddress.postalCode"
							label={localizationConstants.postNrLabel}
							placeholder={localizationConstants.postNrLabel}
						/>
						<FormInput
							control={control}
							name="postalAddress.city"
							label={localizationConstants.ortLabel}
							placeholder={localizationConstants.ortLabel}
						/>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
						<FormInput
							control={control}
							name="visitingAddress.streetAddress"
							label={localizationConstants.adminVisitAddressLabel}
							placeholder={localizationConstants.adminVisitAddressLabel}
						/>
						<FormInput
							control={control}
							name="visitingAddress.postalCode"
							label={localizationConstants.postNrLabel}
							placeholder={localizationConstants.postNrLabel}
						/>
						<FormInput
							control={control}
							name="visitingAddress.city"
							label={localizationConstants.ortLabel}
							placeholder={localizationConstants.ortLabel}
						/>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
						<FormInput
							control={control}
							name="deliveryAddress.streetAddress"
							label={localizationConstants.adminDeliveryAddressLabel}
							placeholder={localizationConstants.adminDeliveryAddressLabel}
						/>
						<FormInput
							control={control}
							name="deliveryAddress.postalCode"
							label={localizationConstants.postNrLabel}
							placeholder={localizationConstants.postNrLabel}
						/>
						<FormInput
							control={control}
							name="deliveryAddress.city"
							label={localizationConstants.ortLabel}
							placeholder={localizationConstants.ortLabel}
						/>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
						<FormInput
							control={control}
							name="switchboardNumber"
							label={localizationConstants.adminSwitchboardLabel}
							placeholder={localizationConstants.adminSwitchboardLabel}
						/>
						<FormInput
							control={control}
							name="email"
							label={localizationConstants.emailLabel}
							placeholder={localizationConstants.emailLabel}
						/>
						<FormInput
							control={control}
							name="website"
							label={localizationConstants.adminHomepageLabel}
							placeholder={localizationConstants.adminHomepageLabel}
						/>
					</div>
				</CollapsibleSection>

				<div className="sticky bottom-0 mt-6 border-t border-slate-200 bg-white py-3 z-10">
					<div className="flex justify-end gap-4">
						<Button
							variant="outline"
							type="button"
							className="border border-slate-200 bg-white hover:bg-slate-50"
							onClick={() => {
								const lastSaved = lastSavedRef.current;
								if (lastSaved) {
									form.reset(lastSaved);
								}
							}}
						>
							<Translate text={localizationConstants.cancelLabel} />
						</Button>
						<Button
							type="submit"
							className="bg-[#09090B] text-white hover:bg-[#09090B]/90"
						>
							<Save size={16} />
							<Translate text={localizationConstants.save} />
						</Button>
					</div>
				</div>
			</form>
		</Form>
	);
}
