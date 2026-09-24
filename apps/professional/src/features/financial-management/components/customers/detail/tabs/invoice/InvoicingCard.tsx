"use client";

import React, { useState } from "react";
import { Receipt } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { CustomerDetailData } from "@/features/financial-management/types/customerDetail.types";
import {
	CustomerDetailCard,
	DetailField,
	EditableField,
} from "../../cards/CustomerDetailCard";

interface InvoicingCardProps {
	customer: CustomerDetailData;
	onUpdate: (updates: Partial<CustomerDetailData>) => void;
}

export const InvoicingCard: React.FC<InvoicingCardProps> = ({
	customer,
	onUpdate,
}) => {
	const [isEditing, setIsEditing] = useState(false);
	const [draft, setDraft] = useState({
		invoiceMethod: customer.invoiceMethod || "E-postfaktura",
		invoiceEmail: customer.invoiceEmail || "",
		priceList: customer.priceList || "Standardprislista 2024",
		invoiceDiscount: customer.invoiceDiscount || "0 %",
		invoiceFee: customer.invoiceFee || "0,00 kr",
		shippingFee: customer.shippingFee || "0,00 kr",
		pricesInclVat: customer.pricesInclVat || "Exkl. moms",
		interestInvoicing: customer.interestInvoicing || "Ja",
	});

	const handleEdit = () => {
		setDraft({
			invoiceMethod: customer.invoiceMethod || "E-postfaktura",
			invoiceEmail: customer.invoiceEmail || "",
			priceList: customer.priceList || "Standardprislista 2024",
			invoiceDiscount: customer.invoiceDiscount || "0 %",
			invoiceFee: customer.invoiceFee || "0,00 kr",
			shippingFee: customer.shippingFee || "0,00 kr",
			pricesInclVat: customer.pricesInclVat || "Exkl. moms",
			interestInvoicing: customer.interestInvoicing || "Ja",
		});
		setIsEditing(true);
	};

	const handleCancel = () => {
		setIsEditing(false);
	};

	const handleSave = () => {
		onUpdate(draft);
		setIsEditing(false);
	};

	return (
		<CustomerDetailCard
			title={<Translate text={localizationConstants.customerDetailCardInvoicing} />}
			icon={<Receipt className="h-5 w-5 text-slate-500" />}
			isEditing={isEditing}
			onEdit={handleEdit}
			onSave={handleSave}
			onCancel={handleCancel}
		>
			{isEditing ? (
				<div className="grid grid-cols-2 gap-y-4 gap-x-6">
					<EditableField
						label={<Translate text={localizationConstants.customerDetailInvoiceMethodLabel} />}
						value={draft.invoiceMethod}
						onChange={(val) => setDraft((prev) => ({ ...prev, invoiceMethod: val }))}
					/>
					<EditableField
						label={<Translate text={localizationConstants.customerDetailInvoiceEmailLabel} />}
						value={draft.invoiceEmail}
						onChange={(val) => setDraft((prev) => ({ ...prev, invoiceEmail: val }))}
					/>
					<EditableField
						label={<Translate text={localizationConstants.customerDetailPriceListLabel} />}
						value={draft.priceList}
						onChange={(val) => setDraft((prev) => ({ ...prev, priceList: val }))}
					/>
					<EditableField
						label={<Translate text={localizationConstants.customerDetailInvoiceDiscountLabel} />}
						value={draft.invoiceDiscount}
						onChange={(val) => setDraft((prev) => ({ ...prev, invoiceDiscount: val }))}
					/>
					<EditableField
						label={<Translate text={localizationConstants.customerDetailInvoiceFeeLabel} />}
						value={draft.invoiceFee}
						onChange={(val) => setDraft((prev) => ({ ...prev, invoiceFee: val }))}
					/>
					<EditableField
						label={<Translate text={localizationConstants.customerDetailFreightFeeLabel} />}
						value={draft.shippingFee}
						onChange={(val) => setDraft((prev) => ({ ...prev, shippingFee: val }))}
					/>
					<EditableField
						label={<Translate text={localizationConstants.customerDetailPricesDisplayLabel} />}
						value={draft.pricesInclVat}
						onChange={(val) => setDraft((prev) => ({ ...prev, pricesInclVat: val }))}
					/>
					<EditableField
						label={<Translate text={localizationConstants.customerDetailInterestInvoicingLabel} />}
						value={draft.interestInvoicing}
						onChange={(val) => setDraft((prev) => ({ ...prev, interestInvoicing: val }))}
					/>
				</div>
			) : (
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
			)}
		</CustomerDetailCard>
	);
};
