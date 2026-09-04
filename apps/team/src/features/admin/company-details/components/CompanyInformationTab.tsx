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
			<form onSubmit={handleSubmit(onSubmit)} className="flex h-full min-h-0 flex-col">
				<div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto pb-1 pr-1">
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
				</div>

				<div className="shrink-0 flex items-center justify-end gap-3 py-3 bg-white border-t border-[#E2E8F0]">
					<button
						type="button"
						className="cursor-pointer h-9 px-4 text-sm font-medium text-[#374151] border border-[#E2E8F0] rounded-md hover:bg-slate-50 transition-colors"
						onClick={() => {
							const lastSaved = lastSavedRef.current;
							if (lastSaved) {
								form.reset(lastSaved);
							}
						}}
					>
						<Translate text={localizationConstants.cancelLabel} />
					</button>
					<Button
						type="submit"
						className="h-9 px-5 gap-1.5 bg-[#09090B] text-white text-sm font-medium hover:bg-[#27272A]"
					>
						<Save size={16} />
						<Translate text={localizationConstants.save} />
					</Button>
				</div>
			</form>
		</Form>
	);
}
