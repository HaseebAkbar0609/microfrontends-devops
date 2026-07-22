"use client";

import type { Control } from "react-hook-form";
import { FormInput, FormSelect } from "@/components/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { CreateCustomerFormData } from "../../types";

interface InvoiceStepProps {
	readonly control: Control<CreateCustomerFormData>;
}

const PAYMENT_TERMS_OPTIONS = [
	{ value: "0", label: <Translate text={localizationConstants.paymentTermsUnpaid} /> },
	{ value: "10", label: <Translate text={localizationConstants.paymentTerms10Days} /> },
	{ value: "15", label: <Translate text={localizationConstants.paymentTerms15Days} /> },
	{ value: "30", label: <Translate text={localizationConstants.paymentTerms30Days} /> },
	{ value: "45", label: <Translate text={localizationConstants.paymentTerms45Days} /> },
	{ value: "60", label: <Translate text={localizationConstants.paymentTerms60Days} /> },
];

const DELIVERY_TERMS_OPTIONS = [
	{ value: "exw", label: "Ex Works (EXW)" },
	{ value: "fca", label: "Free Carrier (FCA)" },
	{ value: "cpt", label: "Carriage Paid To (CPT)" },
	{ value: "cif", label: "Cost, Insurance & Freight (CIF)" },
	{ value: "dap", label: "Delivered at Place (DAP)" },
];

const DELIVERY_METHOD_OPTIONS = [
	{ value: "email", label: <Translate text={localizationConstants.deliveryMethodEmail} /> },
	{ value: "post", label: <Translate text={localizationConstants.deliveryMethodPost} /> },
	{ value: "edelivery", label: <Translate text={localizationConstants.deliveryMethodEDelivery} /> },
];

const INTEREST_INVOICING_OPTIONS = [
	{ value: "yes", label: <Translate text={localizationConstants.interestInvoicingYes} /> },
	{ value: "no", label: <Translate text={localizationConstants.interestInvoicingNo} /> },
];

const CURRENCY_OPTIONS = [
	{ value: "SEK", label: "SEK - Svensk krona" },
	{ value: "EUR", label: "EUR - Euro" },
	{ value: "USD", label: "USD - Amerikansk dollar" },
	{ value: "NOK", label: "NOK - Norsk krona" },
	{ value: "DKK", label: "DKK - Dansk krona" },
];

const PRICE_LIST_OPTIONS = [
	{ value: "standard", label: <Translate text={localizationConstants.priceListStandard} /> },
	{ value: "premium", label: <Translate text={localizationConstants.priceListPremium} /> },
	{ value: "custom", label: <Translate text={localizationConstants.priceListCustom} /> },
];

const VAT_TYPE_OPTIONS = [
	{ value: "standard", label: <Translate text={localizationConstants.vatTypeStandard} /> },
	{ value: "reduced", label: <Translate text={localizationConstants.vatTypeReduced} /> },
	{ value: "low", label: <Translate text={localizationConstants.vatTypeLow} /> },
	{ value: "zero", label: <Translate text={localizationConstants.vatTypeZero} /> },
];

const CUSTOMER_RESPONSIBLE_OPTIONS = [
	{ value: "anna_svensson", label: "Anna Svensson" },
	{ value: "erik_karlsson", label: "Erik Karlsson" },
	{ value: "johan_lindberg", label: "Johan Lindberg" },
	{ value: "maria_nilsson", label: "Maria Nilsson" },
];

export function InvoiceStep({ control }: InvoiceStepProps) {
	return (
		<div className="flex flex-col gap-6">
			{/* Betal- och leveransvilkor */}
			<Card>
				<CardHeader className="h-14 flex flex-row items-center border-b border-slate-200 px-6 py-0 [.border-b]:pb-0">
					<CardTitle className="text-base font-medium">
						<Translate text={localizationConstants.paymentDeliverySection} />
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 items-start">
						<FormSelect
							control={control}
							name="paymentTerms"
							label={localizationConstants.paymentTermsLabel}
							placeholder={localizationConstants.placeholderSelectPaymentTerms}
							options={PAYMENT_TERMS_OPTIONS}
						/>
						<FormSelect
							control={control}
							name="deliveryTerms"
							label={localizationConstants.deliveryTermsLabel}
							placeholder={localizationConstants.placeholderSelectDeliveryTerms}
							options={DELIVERY_TERMS_OPTIONS}
						/>
						<FormSelect
							control={control}
							name="deliveryMethod"
							label={localizationConstants.deliveryMethodLabel}
							placeholder={localizationConstants.placeholderSelectDeliveryMethod}
							options={DELIVERY_METHOD_OPTIONS}
						/>
						<FormSelect
							control={control}
							name="interestInvoicing"
							label={localizationConstants.interestInvoicingLabel}
							placeholder={localizationConstants.placeholderSelect}
							options={INTEREST_INVOICING_OPTIONS}
						/>
					</div>
				</CardContent>
			</Card>

			{/* Fakturering */}
			<Card>
				<CardHeader className="h-14 flex flex-row items-center border-b border-slate-200 px-6 py-0 [.border-b]:pb-0">
					<CardTitle className="text-base font-medium">
						<Translate text={localizationConstants.invoicingSection} />
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 items-start">
						<FormSelect
							control={control}
							name="priceList"
							label={localizationConstants.priceListLabel}
							placeholder={localizationConstants.placeholderSelectPriceList}
							options={PRICE_LIST_OPTIONS}
						/>
						<FormSelect
							control={control}
							name="currency"
							label={localizationConstants.currencyLabel}
							placeholder={localizationConstants.placeholderSelectCurrency}
							options={CURRENCY_OPTIONS}
						/>
						<FormInput
							control={control}
							name="invoiceDiscount"
							label={localizationConstants.invoiceDiscountLabel}
							placeholder={localizationConstants.placeholderAmount}
						/>
						<FormInput
							control={control}
							name="invoiceFee"
							label={localizationConstants.invoiceFeeLabel}
							placeholder={localizationConstants.placeholderAmount}
						/>
						<FormInput
							control={control}
							name="shippingFee"
							label={localizationConstants.shippingFeeLabel}
							placeholder={localizationConstants.placeholderAmount}
						/>
						<FormInput
							control={control}
							name="pricesInclVat"
							label={localizationConstants.pricesInclVatLabel}
							placeholder={localizationConstants.placeholderSelect}
						/>
					</div>
				</CardContent>
			</Card>

			{/* Referenser */}
			<Card>
				<CardHeader className="h-14 flex flex-row items-center border-b border-slate-200 px-6 py-0 [.border-b]:pb-0">
					<CardTitle className="text-base font-medium">
						<Translate text={localizationConstants.referencesSection} />
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 items-start">
						<FormInput
							control={control}
							name="ourReference"
							label={localizationConstants.ourReferenceLabel}
							placeholder={localizationConstants.placeholderNotes}
						/>
						<FormSelect
							control={control}
							name="customerResponsible"
							label={localizationConstants.customerResponsibleLabel}
							placeholder={localizationConstants.placeholderSelectCustomerResponsible}
							options={CUSTOMER_RESPONSIBLE_OPTIONS}
						/>
						<FormInput
							control={control}
							name="externalReference"
							label={localizationConstants.externalReferenceLabel}
							placeholder={localizationConstants.placeholderNotes}
						/>
						<FormInput
							control={control}
							name="yourReference"
							label={localizationConstants.yourReferenceLabel}
							placeholder={localizationConstants.placeholderNotes}
						/>
					</div>
				</CardContent>
			</Card>

			{/* Bokföring */}
			<Card>
				<CardHeader className="h-14 flex flex-row items-center border-b border-slate-200 px-6 py-0 [.border-b]:pb-0">
					<CardTitle className="text-base font-medium">
						<Translate text={localizationConstants.accountingSection} />
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 items-start">
						<FormInput
							control={control}
							name="vatNumber"
							label={localizationConstants.vatNumberLabel}
							placeholder={localizationConstants.placeholderVatRegNo}
						/>
						<FormSelect
							control={control}
							name="vatType"
							label={localizationConstants.vatTypeLabel}
							placeholder={localizationConstants.placeholderSelectVatType}
							options={VAT_TYPE_OPTIONS}
						/>
						<FormInput
							control={control}
							name="salesAccount"
							label={localizationConstants.salesAccountLabel}
							placeholder={localizationConstants.placeholderNotes}
						/>
						<FormInput
							control={control}
							name="costCenter"
							label={localizationConstants.costCenterLabel}
							placeholder={localizationConstants.placeholderNotes}
						/>
						<FormInput
							control={control}
							name="project"
							label={localizationConstants.projectLabel}
							placeholder={localizationConstants.placeholderNotes}
						/>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
