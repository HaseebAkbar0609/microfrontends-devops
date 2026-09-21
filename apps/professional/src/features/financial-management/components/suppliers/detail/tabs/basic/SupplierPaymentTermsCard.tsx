"use client";

import React, { useState } from "react";
import { CreditCard } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { SupplierDetailData } from "../../../../../types/supplierDetail.types";
import {
	SupplierDetailCard,
	DetailField,
	EditableField,
} from "../../cards/SupplierDetailCard";

interface SupplierPaymentTermsCardProps {
	supplier: SupplierDetailData;
	onUpdate: (updates: Partial<SupplierDetailData>) => void;
}

export function SupplierPaymentTermsCard({
	supplier,
	onUpdate,
}: SupplierPaymentTermsCardProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState({
		paymentDays: supplier.paymentDays || "30",
		interestRate: supplier.interestRate || "8",
		invoiceFee: supplier.invoiceFee || "0",
		collectionFee: supplier.collectionFee || "180",
	});

	const handleSave = () => {
		onUpdate(formData);
		setIsEditing(false);
	};

	const handleCancel = () => {
		setFormData({
			paymentDays: supplier.paymentDays || "30",
			interestRate: supplier.interestRate || "8",
			invoiceFee: supplier.invoiceFee || "0",
			collectionFee: supplier.collectionFee || "180",
		});
		setIsEditing(false);
	};

	return (
		<SupplierDetailCard
			title={<Translate text={localizationConstants.supplierDetailCardPaymentTerms} />}
			icon={<CreditCard className="h-5 w-5" />}
			isEditing={isEditing}
			onEdit={() => setIsEditing(true)}
			onSave={handleSave}
			onCancel={handleCancel}
		>
			<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
				{isEditing ? (
					<>
						<EditableField
							label={<Translate text={localizationConstants.supplierPaymentDaysLabel} />}
							value={formData.paymentDays}
							onChange={(val) => setFormData((prev) => ({ ...prev, paymentDays: val }))}
						/>
						<EditableField
							label={<Translate text={localizationConstants.supplierInterestRateLabel} />}
							value={formData.interestRate}
							onChange={(val) => setFormData((prev) => ({ ...prev, interestRate: val }))}
						/>
						<EditableField
							label={<Translate text={localizationConstants.supplierInvoiceFeeLabel} />}
							value={formData.invoiceFee}
							onChange={(val) => setFormData((prev) => ({ ...prev, invoiceFee: val }))}
						/>
						<EditableField
							label={<Translate text={localizationConstants.supplierCollectionFeeLabel} />}
							value={formData.collectionFee}
							onChange={(val) => setFormData((prev) => ({ ...prev, collectionFee: val }))}
						/>
					</>
				) : (
					<>
						<DetailField
							label={<Translate text={localizationConstants.supplierPaymentDaysLabel} />}
							value={`${supplier.paymentDays || "30"} dagar`}
						/>
						<DetailField
							label={<Translate text={localizationConstants.supplierInterestRateLabel} />}
							value={`${supplier.interestRate || "8"} %`}
						/>
						<DetailField
							label={<Translate text={localizationConstants.supplierInvoiceFeeLabel} />}
							value={`${supplier.invoiceFee || "0"} kr`}
						/>
						<DetailField
							label={<Translate text={localizationConstants.supplierCollectionFeeLabel} />}
							value={`${supplier.collectionFee || "180"} kr`}
						/>
					</>
				)}
			</div>
		</SupplierDetailCard>
	);
}
