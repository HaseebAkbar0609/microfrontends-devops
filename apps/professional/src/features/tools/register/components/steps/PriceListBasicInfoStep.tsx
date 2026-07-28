"use client";

import type { Control } from "react-hook-form";
import type { CreatePriceListFormData } from "../../types";
import { FormInput, FormSelect, FormDatePicker } from "@/components/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface PriceListBasicInfoStepProps {
	readonly control: Control<CreatePriceListFormData>;
}

const TODAY = new Date().toISOString().split("T")[0];

const KATEGORI_OPTIONS = [
	{ value: "service", label: <Translate text={localizationConstants.priceListCategoryService} /> },
	{ value: "privat", label: <Translate text={localizationConstants.priceListCategoryPrivate} /> },
];

const ENHET_OPTIONS = [
	{ value: "styck", label: <Translate text={localizationConstants.priceListUnitStyck} /> },
	{ value: "timme", label: <Translate text={localizationConstants.priceListUnitTimme} /> },
	{ value: "meter", label: <Translate text={localizationConstants.priceListUnitMeter} /> },
	{ value: "kg", label: <Translate text={localizationConstants.priceListUnitKg} /> },
	{ value: "kvm", label: <Translate text={localizationConstants.priceListUnitKvm} /> },
	{ value: "lm", label: <Translate text={localizationConstants.priceListUnitLm} /> },
];

const KUND_OPTIONS = [
	{ value: "service", label: <Translate text={localizationConstants.priceListCustomerService} /> },
	{ value: "foretag", label: <Translate text={localizationConstants.priceListCustomerForetag} /> },
];

const LEVERANTOR_OPTIONS = [
	{ value: "styck", label: <Translate text={localizationConstants.priceListSupplierStyck} /> },
	{ value: "timme", label: <Translate text={localizationConstants.priceListSupplierTimme} /> },
];

const SKAPAD_AV_OPTIONS = [
	{ value: "kalle_andersson", label: "Kalle Andersson" },
	{ value: "anna_svensson", label: "Anna Svensson" },
	{ value: "erik_lindberg", label: "Erik Lindberg" },
];

export function PriceListBasicInfoStep({ control }: PriceListBasicInfoStepProps) {
	return (
		<div className="flex flex-col gap-6">
			<Card>
				<CardHeader className="h-14 flex flex-row items-center border-b border-slate-200 px-6 py-0 [.border-b]:pb-0">
					<CardTitle className="text-base font-medium">
						<Translate text={localizationConstants.priceListBasicInfoTab} />
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 items-start">
						<FormInput
							control={control}
							name="kod"
							label={localizationConstants.priceListCodeLabel}
							placeholder={localizationConstants.priceListCodePlaceholder}
						/>
						<FormInput
							control={control}
							name="benamning"
							label={localizationConstants.priceListNameLabel}
							placeholder={localizationConstants.priceListNamePlaceholder}
						/>
						<FormDatePicker
							control={control}
							name="datum"
							label={localizationConstants.priceListDateLabel}
							placeholder={TODAY}
						/>
						<FormSelect
							control={control}
							name="skapadAv"
							label={localizationConstants.priceListCreatedByLabel}
							options={SKAPAD_AV_OPTIONS}
							placeholder={localizationConstants.priceListSelectPlaceholder}
						/>
						<FormInput
							control={control}
							name="kommentar"
							label={localizationConstants.priceListCommentLabel}
							className="lg:col-span-2"
							placeholder={localizationConstants.priceListCommentPlaceholder}
						/>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="h-14 flex flex-row items-center border-b border-slate-200 px-6 py-0 [.border-b]:pb-0">
					<CardTitle className="text-base font-medium">
						<Translate text={localizationConstants.priceListSettingsSection} />
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 items-start">
						<FormSelect
							control={control}
							name="kategori"
							label={localizationConstants.priceListCategoryLabel}
							options={KATEGORI_OPTIONS}
							placeholder={localizationConstants.priceListSelectPlaceholder}
						/>
						<FormSelect
							control={control}
							name="enhet"
							label={localizationConstants.priceListUnitLabel}
							options={ENHET_OPTIONS}
							placeholder={localizationConstants.priceListSelectPlaceholder}
						/>
						<FormSelect
							control={control}
							name="kund"
							label={localizationConstants.priceListCustomerLabel}
							options={KUND_OPTIONS}
							placeholder={localizationConstants.priceListSelectPlaceholder}
						/>
						<FormSelect
							control={control}
							name="leverantor"
							label={localizationConstants.priceListSupplierLabel}
							options={LEVERANTOR_OPTIONS}
							placeholder={localizationConstants.priceListSelectPlaceholder}
						/>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
