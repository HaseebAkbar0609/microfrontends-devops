"use client";

import React from "react";
import { Building2, Landmark, MapPin, Receipt } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { CustomerDetailData } from "@/features/financial-management/types/customerDetail.types";
import {
	CustomerDetailCard,
	DetailField,
} from "../cards/CustomerDetailCard";

interface BasicInfoTabProps {
	customer: CustomerDetailData;
	onEdit: (step: number) => void;
}

export const BasicInfoTab: React.FC<BasicInfoTabProps> = ({
	customer,
	onEdit,
}) => {
	const customerTypeLabel =
		customer.entityType === "company" ? (
			<Translate text={localizationConstants.customerDetailCompanyType} />
		) : (
			<Translate text={localizationConstants.customerDetailIndividualType} />
		);

	return (
		<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
			{/* Customer Details Card */}
			<CustomerDetailCard
				title={<Translate text={localizationConstants.customerDetailCardCustomer} />}
				icon={<Building2 className="h-5 w-5 text-slate-500" />}
				onEdit={() => onEdit(1)}
			>
				<div className="grid grid-cols-2 gap-y-4 gap-x-6">
					<DetailField
						label={<Translate text={localizationConstants.customerDetailCustomerNoLabel} />}
						value={customer.customerNo}
					/>
					<DetailField
						label={<Translate text={localizationConstants.customerDetailCustomerTypeLabel} />}
						value={customerTypeLabel}
					/>
					<DetailField
						label={<Translate text={localizationConstants.customerDetailCustomerNameLabel} />}
						value={customer.name}
						className="col-span-2"
					/>
					<DetailField
						label={<Translate text={localizationConstants.customerDetailOrgNumberLabel} />}
						value={customer.orgNo}
					/>
					<DetailField
						label={<Translate text={localizationConstants.customerDetailVatNumberLabel} />}
						value={customer.vatRegNo}
					/>
					<DetailField
						label={<Translate text={localizationConstants.customerDetailGlnLabel} />}
						value={customer.gln}
					/>
					<DetailField
						label={<Translate text={localizationConstants.customerDetailPeppolIdLabel} />}
						value={customer.peppolId}
					/>
				</div>
			</CustomerDetailCard>

			{/* Bank Information Card */}
			<CustomerDetailCard
				title={<Translate text={localizationConstants.customerDetailCardBank} />}
				icon={<Landmark className="h-5 w-5 text-slate-500" />}
				onEdit={() => onEdit(1)}
			>
				<div className="grid grid-cols-2 gap-y-4 gap-x-6">
					<DetailField
						label={<Translate text={localizationConstants.customerDetailBankgiroLabel} />}
						value={customer.bankgiro}
					/>
					<DetailField
						label={<Translate text={localizationConstants.customerDetailPlusgiroLabel} />}
						value={customer.plusgiro}
					/>
					<DetailField
						label={<Translate text={localizationConstants.customerDetailIbanLabel} />}
						value={customer.iban}
						className="col-span-2"
					/>
					<DetailField
						label={<Translate text={localizationConstants.customerDetailBicSwiftLabel} />}
						value={customer.bic}
						className="col-span-2"
					/>
				</div>
			</CustomerDetailCard>

			{/* Visiting Address Card */}
			<CustomerDetailCard
				title={<Translate text={localizationConstants.customerDetailCardVisitingAddress} />}
				icon={<MapPin className="h-5 w-5 text-slate-500" />}
				onEdit={() => onEdit(1)}
			>
				<div className="grid grid-cols-2 gap-y-4 gap-x-6">
					<DetailField
						label={<Translate text={localizationConstants.customerDetailAddressLabel} />}
						value={customer.visitingAddress}
						className="col-span-2"
					/>
					<DetailField
						label={<Translate text={localizationConstants.customerDetailPostcodeLabel} />}
						value={customer.visitingPostalCode}
					/>
					<DetailField
						label={<Translate text={localizationConstants.customerDetailCityLabel} />}
						value={customer.visitingCity}
					/>
					<DetailField
						label={<Translate text={localizationConstants.customerDetailCountryLabel} />}
						value={customer.visitingCountry}
						className="col-span-2"
					/>
				</div>
			</CustomerDetailCard>

			{/* Invoice Address Card */}
			<CustomerDetailCard
				title={<Translate text={localizationConstants.customerDetailCardInvoiceAddress} />}
				icon={<Receipt className="h-5 w-5 text-slate-500" />}
				onEdit={() => onEdit(1)}
			>
				<div className="grid grid-cols-2 gap-y-4 gap-x-6">
					<DetailField
						label={<Translate text={localizationConstants.customerDetailAddressLabel} />}
						value={customer.invoiceAddress}
						className="col-span-2"
					/>
					<DetailField
						label={<Translate text={localizationConstants.customerDetailPostcodeLabel} />}
						value={customer.invoicePostalCode}
					/>
					<DetailField
						label={<Translate text={localizationConstants.customerDetailCityLabel} />}
						value={customer.invoiceCity}
					/>
					<DetailField
						label={<Translate text={localizationConstants.customerDetailCountryLabel} />}
						value={customer.invoiceCountry}
						className="col-span-2"
					/>
				</div>
			</CustomerDetailCard>
		</div>
	);
};
