"use client";

import React, { useState } from "react";
import { Phone } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { CustomerDetailData } from "@/features/financial-management/types/customerDetail.types";
import {
	CustomerDetailCard,
	DetailField,
	EditableField,
} from "../../cards/CustomerDetailCard";

interface ContactInfoCardProps {
	customer: CustomerDetailData;
	onUpdate: (updates: Partial<CustomerDetailData>) => void;
}

export const ContactInfoCard: React.FC<ContactInfoCardProps> = ({
	customer,
	onUpdate,
}) => {
	const [isEditing, setIsEditing] = useState(false);
	const [draft, setDraft] = useState({
		phone: customer.phone || "",
		email: customer.email || "",
		website: customer.website || "",
	});

	const handleEdit = () => {
		setDraft({
			phone: customer.phone || "",
			email: customer.email || "",
			website: customer.website || "",
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
			title={<Translate text={localizationConstants.customerDetailCardContact} />}
			icon={<Phone className="h-5 w-5 text-slate-500" />}
			isEditing={isEditing}
			onEdit={handleEdit}
			onSave={handleSave}
			onCancel={handleCancel}
		>
			{isEditing ? (
				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
					<EditableField
						label={<Translate text={localizationConstants.customerDetailPhoneLabel} />}
						value={draft.phone}
						onChange={(val) => setDraft((prev) => ({ ...prev, phone: val }))}
					/>
					<EditableField
						label={<Translate text={localizationConstants.customerDetailEmailLabel} />}
						value={draft.email}
						onChange={(val) => setDraft((prev) => ({ ...prev, email: val }))}
					/>
					<EditableField
						label={<Translate text={localizationConstants.customerDetailWebsiteLabel} />}
						value={draft.website}
						onChange={(val) => setDraft((prev) => ({ ...prev, website: val }))}
					/>
				</div>
			) : (
				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
					<DetailField
						label={<Translate text={localizationConstants.customerDetailPhoneLabel} />}
						value={customer.phone}
					/>
					<DetailField
						label={<Translate text={localizationConstants.customerDetailEmailLabel} />}
						value={customer.email}
					/>
					<DetailField
						label={<Translate text={localizationConstants.customerDetailWebsiteLabel} />}
						value={customer.website}
					/>
				</div>
			)}
		</CustomerDetailCard>
	);
};
