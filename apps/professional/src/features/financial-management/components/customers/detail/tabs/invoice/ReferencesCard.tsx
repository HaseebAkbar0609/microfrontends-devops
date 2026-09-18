"use client";

import React, { useState } from "react";
import { UserCheck } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { CustomerDetailData } from "@/features/financial-management/types/customerDetail.types";
import {
	CustomerDetailCard,
	DetailField,
	EditableField,
} from "../../cards/CustomerDetailCard";

interface ReferencesCardProps {
	customer: CustomerDetailData;
	onUpdate: (updates: Partial<CustomerDetailData>) => void;
}

export const ReferencesCard: React.FC<ReferencesCardProps> = ({
	customer,
	onUpdate,
}) => {
	const [isEditing, setIsEditing] = useState(false);
	const [draft, setDraft] = useState({
		ourReference: customer.ourReference || "",
		customerResponsible: customer.customerResponsible || "",
		yourReference: customer.yourReference || "",
		externalReference: customer.externalReference || "",
	});

	const handleEdit = () => {
		setDraft({
			ourReference: customer.ourReference || "",
			customerResponsible: customer.customerResponsible || "",
			yourReference: customer.yourReference || "",
			externalReference: customer.externalReference || "",
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
			title={<Translate text={localizationConstants.customerDetailCardReferences} />}
			icon={<UserCheck className="h-5 w-5 text-slate-500" />}
			isEditing={isEditing}
			onEdit={handleEdit}
			onSave={handleSave}
			onCancel={handleCancel}
		>
			{isEditing ? (
				<div className="grid grid-cols-2 gap-y-4 gap-x-6">
					<EditableField
						label={<Translate text={localizationConstants.customerDetailOurReferenceLabel} />}
						value={draft.ourReference}
						onChange={(val) => setDraft((prev) => ({ ...prev, ourReference: val }))}
					/>
					<EditableField
						label={<Translate text={localizationConstants.customerDetailCustomerManagerLabel} />}
						value={draft.customerResponsible}
						onChange={(val) => setDraft((prev) => ({ ...prev, customerResponsible: val }))}
					/>
					<EditableField
						label={<Translate text={localizationConstants.customerDetailYourReferenceLabel} />}
						value={draft.yourReference}
						onChange={(val) => setDraft((prev) => ({ ...prev, yourReference: val }))}
					/>
					<EditableField
						label={<Translate text={localizationConstants.customerDetailExternalReferenceLabel} />}
						value={draft.externalReference}
						onChange={(val) => setDraft((prev) => ({ ...prev, externalReference: val }))}
					/>
				</div>
			) : (
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
			)}
		</CustomerDetailCard>
	);
};
