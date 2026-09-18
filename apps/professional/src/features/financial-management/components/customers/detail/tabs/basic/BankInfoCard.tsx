"use client";

import React, { useState } from "react";
import { Landmark } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { CustomerDetailData } from "@/features/financial-management/types/customerDetail.types";
import {
	CustomerDetailCard,
	DetailField,
	EditableField,
} from "../../cards/CustomerDetailCard";

interface BankInfoCardProps {
	customer: CustomerDetailData;
	onUpdate: (updates: Partial<CustomerDetailData>) => void;
}

export const BankInfoCard: React.FC<BankInfoCardProps> = ({
	customer,
	onUpdate,
}) => {
	const [isEditing, setIsEditing] = useState(false);
	const [draft, setDraft] = useState({
		bankgiro: customer.bankgiro || "",
		plusgiro: customer.plusgiro || "",
		iban: customer.iban || "",
		bic: customer.bic || "",
	});

	const handleEdit = () => {
		setDraft({
			bankgiro: customer.bankgiro || "",
			plusgiro: customer.plusgiro || "",
			iban: customer.iban || "",
			bic: customer.bic || "",
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
			title={<Translate text={localizationConstants.customerDetailCardBank} />}
			icon={<Landmark className="h-5 w-5 text-slate-500" />}
			isEditing={isEditing}
			onEdit={handleEdit}
			onSave={handleSave}
			onCancel={handleCancel}
		>
			{isEditing ? (
				<div className="grid grid-cols-2 gap-y-4 gap-x-6">
					<EditableField
						label={<Translate text={localizationConstants.customerDetailBankgiroLabel} />}
						value={draft.bankgiro}
						onChange={(val) => setDraft((prev) => ({ ...prev, bankgiro: val }))}
					/>
					<EditableField
						label={<Translate text={localizationConstants.customerDetailPlusgiroLabel} />}
						value={draft.plusgiro}
						onChange={(val) => setDraft((prev) => ({ ...prev, plusgiro: val }))}
					/>
					<EditableField
						label={<Translate text={localizationConstants.customerDetailIbanLabel} />}
						value={draft.iban}
						onChange={(val) => setDraft((prev) => ({ ...prev, iban: val }))}
						className="col-span-2"
					/>
					<EditableField
						label={<Translate text={localizationConstants.customerDetailBicSwiftLabel} />}
						value={draft.bic}
						onChange={(val) => setDraft((prev) => ({ ...prev, bic: val }))}
						className="col-span-2"
					/>
				</div>
			) : (
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
			)}
		</CustomerDetailCard>
	);
};
