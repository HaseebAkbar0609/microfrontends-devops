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

interface InvoiceAddressCardProps {
	customer: CustomerDetailData;
	onUpdate: (updates: Partial<CustomerDetailData>) => void;
}

export const InvoiceAddressCard: React.FC<InvoiceAddressCardProps> = ({
	customer,
	onUpdate,
}) => {
	const [isEditing, setIsEditing] = useState(false);
	const [draft, setDraft] = useState({
		invoiceAddress: customer.invoiceAddress || "",
		invoicePostalCode: customer.invoicePostalCode || "",
		invoiceCity: customer.invoiceCity || "",
		invoiceCountry: customer.invoiceCountry || "Sverige",
	});

	const handleEdit = () => {
		setDraft({
			invoiceAddress: customer.invoiceAddress || "",
			invoicePostalCode: customer.invoicePostalCode || "",
			invoiceCity: customer.invoiceCity || "",
			invoiceCountry: customer.invoiceCountry || "Sverige",
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
			title={<Translate text={localizationConstants.customerDetailCardInvoiceAddress} />}
			icon={<Receipt className="h-5 w-5 text-slate-500" />}
			isEditing={isEditing}
			onEdit={handleEdit}
			onSave={handleSave}
			onCancel={handleCancel}
		>
			{isEditing ? (
				<div className="grid grid-cols-2 gap-y-4 gap-x-6">
					<EditableField
						label={<Translate text={localizationConstants.customerDetailAddressLabel} />}
						value={draft.invoiceAddress}
						onChange={(val) => setDraft((prev) => ({ ...prev, invoiceAddress: val }))}
						className="col-span-2"
					/>
					<EditableField
						label={<Translate text={localizationConstants.customerDetailPostcodeLabel} />}
						value={draft.invoicePostalCode}
						onChange={(val) => setDraft((prev) => ({ ...prev, invoicePostalCode: val }))}
					/>
					<EditableField
						label={<Translate text={localizationConstants.customerDetailCityLabel} />}
						value={draft.invoiceCity}
						onChange={(val) => setDraft((prev) => ({ ...prev, invoiceCity: val }))}
					/>
					<EditableField
						label={<Translate text={localizationConstants.customerDetailCountryLabel} />}
						value={draft.invoiceCountry}
						onChange={(val) => setDraft((prev) => ({ ...prev, invoiceCountry: val }))}
						className="col-span-2"
					/>
				</div>
			) : (
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
			)}
		</CustomerDetailCard>
	);
};
