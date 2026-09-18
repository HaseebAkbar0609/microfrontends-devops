"use client";

import React, { useState } from "react";
import { Truck } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { CustomerDetailData } from "@/features/financial-management/types/customerDetail.types";
import {
	CustomerDetailCard,
	DetailField,
	EditableField,
} from "../../cards/CustomerDetailCard";

interface InvoiceTermsCardProps {
	customer: CustomerDetailData;
	onUpdate: (updates: Partial<CustomerDetailData>) => void;
}

export const InvoiceTermsCard: React.FC<InvoiceTermsCardProps> = ({
	customer,
	onUpdate,
}) => {
	const [isEditing, setIsEditing] = useState(false);
	const [draft, setDraft] = useState({
		paymentTerms: customer.paymentTerms || "30 dagar",
		overdueInterest: customer.overdueInterest || "8.5 %",
		deliveryTerms: customer.deliveryTerms || "Fritt vårt lager",
		deliveryMethod: customer.deliveryMethod || "PostNord Företagspaket",
	});

	const handleEdit = () => {
		setDraft({
			paymentTerms: customer.paymentTerms || "30 dagar",
			overdueInterest: customer.overdueInterest || "8.5 %",
			deliveryTerms: customer.deliveryTerms || "Fritt vårt lager",
			deliveryMethod: customer.deliveryMethod || "PostNord Företagspaket",
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
			title={<Translate text={localizationConstants.customerDetailCardInvoiceTerms} />}
			icon={<Truck className="h-5 w-5 text-slate-500" />}
			isEditing={isEditing}
			onEdit={handleEdit}
			onSave={handleSave}
			onCancel={handleCancel}
		>
			{isEditing ? (
				<div className="grid grid-cols-2 gap-y-4 gap-x-6">
					<EditableField
						label={<Translate text={localizationConstants.customerDetailPaymentTermsLabel} />}
						value={draft.paymentTerms}
						onChange={(val) => setDraft((prev) => ({ ...prev, paymentTerms: val }))}
					/>
					<EditableField
						label={<Translate text={localizationConstants.customerDetailOverdueInterestLabel} />}
						value={draft.overdueInterest}
						onChange={(val) => setDraft((prev) => ({ ...prev, overdueInterest: val }))}
					/>
					<EditableField
						label={<Translate text={localizationConstants.customerDetailDeliveryTermsLabel} />}
						value={draft.deliveryTerms}
						onChange={(val) => setDraft((prev) => ({ ...prev, deliveryTerms: val }))}
					/>
					<EditableField
						label={<Translate text={localizationConstants.customerDetailDeliveryMethodLabel} />}
						value={draft.deliveryMethod}
						onChange={(val) => setDraft((prev) => ({ ...prev, deliveryMethod: val }))}
					/>
				</div>
			) : (
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
			)}
		</CustomerDetailCard>
	);
};
