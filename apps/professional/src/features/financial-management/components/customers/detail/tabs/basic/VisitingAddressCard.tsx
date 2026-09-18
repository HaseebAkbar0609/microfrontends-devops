"use client";

import React, { useState } from "react";
import { MapPin } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { CustomerDetailData } from "@/features/financial-management/types/customerDetail.types";
import {
	CustomerDetailCard,
	DetailField,
	EditableField,
} from "../../cards/CustomerDetailCard";

interface VisitingAddressCardProps {
	customer: CustomerDetailData;
	onUpdate: (updates: Partial<CustomerDetailData>) => void;
}

export const VisitingAddressCard: React.FC<VisitingAddressCardProps> = ({
	customer,
	onUpdate,
}) => {
	const [isEditing, setIsEditing] = useState(false);
	const [draft, setDraft] = useState({
		visitingAddress: customer.visitingAddress || "",
		visitingPostalCode: customer.visitingPostalCode || "",
		visitingCity: customer.visitingCity || "",
		visitingCountry: customer.visitingCountry || "Sverige",
	});

	const handleEdit = () => {
		setDraft({
			visitingAddress: customer.visitingAddress || "",
			visitingPostalCode: customer.visitingPostalCode || "",
			visitingCity: customer.visitingCity || "",
			visitingCountry: customer.visitingCountry || "Sverige",
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
			title={<Translate text={localizationConstants.customerDetailCardVisitingAddress} />}
			icon={<MapPin className="h-5 w-5 text-slate-500" />}
			isEditing={isEditing}
			onEdit={handleEdit}
			onSave={handleSave}
			onCancel={handleCancel}
		>
			{isEditing ? (
				<div className="grid grid-cols-2 gap-y-4 gap-x-6">
					<EditableField
						label={<Translate text={localizationConstants.customerDetailAddressLabel} />}
						value={draft.visitingAddress}
						onChange={(val) => setDraft((prev) => ({ ...prev, visitingAddress: val }))}
						className="col-span-2"
					/>
					<EditableField
						label={<Translate text={localizationConstants.customerDetailPostcodeLabel} />}
						value={draft.visitingPostalCode}
						onChange={(val) => setDraft((prev) => ({ ...prev, visitingPostalCode: val }))}
					/>
					<EditableField
						label={<Translate text={localizationConstants.customerDetailCityLabel} />}
						value={draft.visitingCity}
						onChange={(val) => setDraft((prev) => ({ ...prev, visitingCity: val }))}
					/>
					<EditableField
						label={<Translate text={localizationConstants.customerDetailCountryLabel} />}
						value={draft.visitingCountry}
						onChange={(val) => setDraft((prev) => ({ ...prev, visitingCountry: val }))}
						className="col-span-2"
					/>
				</div>
			) : (
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
			)}
		</CustomerDetailCard>
	);
};
