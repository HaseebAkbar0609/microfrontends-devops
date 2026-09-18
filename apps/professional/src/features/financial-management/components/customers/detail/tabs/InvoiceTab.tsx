"use client";

import React from "react";
import {
	Truck,
	Receipt,
	UserCheck,
	Calculator,
	Home,
} from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { CustomerDetailData } from "@/features/financial-management/types/customerDetail.types";
import {
	CustomerDetailCard,
	DetailField,
} from "../cards/CustomerDetailCard";

interface InvoiceTabProps {
	customer: CustomerDetailData;
	onEdit: (step: number) => void;
}

export const InvoiceTab: React.FC<InvoiceTabProps> = ({
	customer,
	onEdit,
}) => {
	const rotRutActiveText = customer.isRotRutEnabled ? (
		<Translate text={localizationConstants.customerDetailYes} />
	) : (
		<Translate text={localizationConstants.customerDetailNo} />
	);

	return (
		<div className="space-y-6">
			{/* 2x2 Grid of Financial Settings */}
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
				{/* Payment & Delivery Terms */}
				<CustomerDetailCard
					title={<Translate text={localizationConstants.customerDetailCardInvoiceTerms} />}
					icon={<Truck className="h-5 w-5 text-slate-500" />}
					onEdit={() => onEdit(4)}
				>
					<div className="grid grid-cols-2 gap-y-4 gap-x-6">
						<DetailField
							label={<Translate text={localizationConstants.customerDetailPaymentTermsLabel} />}
							value={customer.paymentTerms}
						/>
						<DetailField
							label={<Translate text={localizationConstants.customerDetailOverdueInterestLabel} />}
							value={customer.overdueInterest}
						/>
						<DetailField
							label={<Translate text={localizationConstants.customerDetailDeliveryTermsLabel} />}
							value={customer.deliveryTerms}
						/>
						<DetailField
							label={<Translate text={localizationConstants.customerDetailDeliveryMethodLabel} />}
							value={customer.deliveryMethod}
						/>
					</div>
				</CustomerDetailCard>

				{/* Invoicing Settings */}
				<CustomerDetailCard
					title={<Translate text={localizationConstants.customerDetailCardInvoicing} />}
					icon={<Receipt className="h-5 w-5 text-slate-500" />}
					onEdit={() => onEdit(4)}
				>
					<div className="grid grid-cols-2 gap-y-4 gap-x-6">
						<DetailField
							label={<Translate text={localizationConstants.customerDetailInvoiceMethodLabel} />}
							value={customer.invoiceMethod}
						/>
						<DetailField
							label={<Translate text={localizationConstants.customerDetailInvoiceEmailLabel} />}
							value={customer.invoiceEmail}
						/>
						<DetailField
							label={<Translate text={localizationConstants.customerDetailPriceListLabel} />}
							value={customer.priceList}
						/>
						<DetailField
							label={<Translate text={localizationConstants.customerDetailInvoiceDiscountLabel} />}
							value={customer.invoiceDiscount}
						/>
						<DetailField
							label={<Translate text={localizationConstants.customerDetailInvoiceFeeLabel} />}
							value={customer.invoiceFee}
						/>
						<DetailField
							label={<Translate text={localizationConstants.customerDetailFreightFeeLabel} />}
							value={customer.shippingFee}
						/>
						<DetailField
							label={<Translate text={localizationConstants.customerDetailPricesDisplayLabel} />}
							value={customer.pricesInclVat}
						/>
						<DetailField
							label={<Translate text={localizationConstants.customerDetailInterestInvoicingLabel} />}
							value={customer.interestInvoicing}
						/>
					</div>
				</CustomerDetailCard>

				{/* References */}
				<CustomerDetailCard
					title={<Translate text={localizationConstants.customerDetailCardReferences} />}
					icon={<UserCheck className="h-5 w-5 text-slate-500" />}
					onEdit={() => onEdit(4)}
				>
					<div className="grid grid-cols-2 gap-y-4 gap-x-6">
						<DetailField
							label={<Translate text={localizationConstants.customerDetailOurReferenceLabel} />}
							value={customer.ourReference}
						/>
						<DetailField
							label={<Translate text={localizationConstants.customerDetailCustomerManagerLabel} />}
							value={customer.customerResponsible}
						/>
						<DetailField
							label={<Translate text={localizationConstants.customerDetailYourReferenceLabel} />}
							value={customer.yourReference}
						/>
						<DetailField
							label={<Translate text={localizationConstants.customerDetailExternalReferenceLabel} />}
							value={customer.externalReference}
						/>
					</div>
				</CustomerDetailCard>

				{/* Accounting / Bookkeeping */}
				<CustomerDetailCard
					title={<Translate text={localizationConstants.customerDetailCardAccounting} />}
					icon={<Calculator className="h-5 w-5 text-slate-500" />}
					onEdit={() => onEdit(4)}
				>
					<div className="grid grid-cols-2 gap-y-4 gap-x-6">
						<DetailField
							label={<Translate text={localizationConstants.customerDetailVatNumberAccountingLabel} />}
							value={customer.vatNumber || customer.vatRegNo}
						/>
						<DetailField
							label={<Translate text={localizationConstants.customerDetailVatTypeLabel} />}
							value={customer.vatType}
						/>
						<DetailField
							label={<Translate text={localizationConstants.customerDetailSalesAccountLabel} />}
							value={customer.salesAccount}
							className="col-span-2"
						/>
						<DetailField
							label={<Translate text={localizationConstants.customerDetailCostCenterLabel} />}
							value={customer.costCenter}
						/>
						<DetailField
							label={<Translate text={localizationConstants.customerDetailProjectLabel} />}
							value={customer.project}
						/>
					</div>
				</CustomerDetailCard>
			</div>

			{/* ROT / RUT Card */}
			<CustomerDetailCard
				title={<Translate text={localizationConstants.customerDetailCardRotRut} />}
				icon={<Home className="h-5 w-5 text-slate-500" />}
				onEdit={() => onEdit(4)}
			>
				<div className="grid grid-cols-1 gap-y-4 gap-x-6 md:grid-cols-3">
					<DetailField
						label={<Translate text={localizationConstants.customerDetailRotRutActiveLabel} />}
						value={rotRutActiveText}
					/>
					<DetailField
						label={<Translate text={localizationConstants.customerDetailRotRutTypeLabel} />}
						value={customer.rotRutType}
					/>
					<DetailField
						label={<Translate text={localizationConstants.customerDetailPropertyDesignationLabel} />}
						value={customer.propertyDesignation}
					/>
					<DetailField
						label={<Translate text={localizationConstants.customerDetailApartmentNoLabel} />}
						value={customer.apartmentNumber}
					/>
					<DetailField
						label={<Translate text={localizationConstants.customerDetailBrfOrgNoLabel} />}
						value={customer.brfOrgNo}
					/>
				</div>
			</CustomerDetailCard>
		</div>
	);
};
