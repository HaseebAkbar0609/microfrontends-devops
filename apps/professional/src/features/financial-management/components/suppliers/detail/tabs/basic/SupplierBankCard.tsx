"use client";

import React, { useState } from "react";
import { Landmark } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { SupplierDetailData } from "../../../../../types/supplierDetail.types";
import {
	SupplierDetailCard,
	DetailField,
	EditableField,
} from "../../cards/SupplierDetailCard";

interface SupplierBankCardProps {
	supplier: SupplierDetailData;
	onUpdate: (updates: Partial<SupplierDetailData>) => void;
}

export function SupplierBankCard({ supplier, onUpdate }: SupplierBankCardProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState({
		bankName: supplier.bankName || "",
		bankAccount: supplier.bankAccount || "",
		bankgiro: supplier.bankgiro || "",
		plusgiro: supplier.plusgiro || "",
		iban: supplier.iban || "",
		bic: supplier.bic || "",
	});

	const handleSave = () => {
		onUpdate(formData);
		setIsEditing(false);
	};

	const handleCancel = () => {
		setFormData({
			bankName: supplier.bankName || "",
			bankAccount: supplier.bankAccount || "",
			bankgiro: supplier.bankgiro || "",
			plusgiro: supplier.plusgiro || "",
			iban: supplier.iban || "",
			bic: supplier.bic || "",
		});
		setIsEditing(false);
	};

	return (
		<SupplierDetailCard
			title={<Translate text={localizationConstants.supplierDetailCardBank} />}
			icon={<Landmark className="h-5 w-5" />}
			isEditing={isEditing}
			onEdit={() => setIsEditing(true)}
			onSave={handleSave}
			onCancel={handleCancel}
		>
			<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
				{isEditing ? (
					<>
						<EditableField
							label={<Translate text={localizationConstants.supplierBankLabel} />}
							value={formData.bankName}
							onChange={(val) => setFormData((prev) => ({ ...prev, bankName: val }))}
						/>
						<EditableField
							label={<Translate text={localizationConstants.supplierBankAccountLabel} />}
							value={formData.bankAccount}
							onChange={(val) => setFormData((prev) => ({ ...prev, bankAccount: val }))}
						/>
						<EditableField
							label={<Translate text={localizationConstants.supplierBankgiroLabel} />}
							value={formData.bankgiro}
							onChange={(val) => setFormData((prev) => ({ ...prev, bankgiro: val }))}
						/>
						<EditableField
							label={<Translate text={localizationConstants.supplierPlusgiroLabel} />}
							value={formData.plusgiro}
							onChange={(val) => setFormData((prev) => ({ ...prev, plusgiro: val }))}
						/>
						<EditableField
							label={<Translate text={localizationConstants.supplierIbanLabel} />}
							value={formData.iban}
							onChange={(val) => setFormData((prev) => ({ ...prev, iban: val }))}
						/>
						<EditableField
							label={<Translate text={localizationConstants.supplierBicLabel} />}
							value={formData.bic}
							onChange={(val) => setFormData((prev) => ({ ...prev, bic: val }))}
						/>
					</>
				) : (
					<>
						<DetailField
							label={<Translate text={localizationConstants.supplierBankLabel} />}
							value={supplier.bankName}
						/>
						<DetailField
							label={<Translate text={localizationConstants.supplierBankAccountLabel} />}
							value={supplier.bankAccount}
						/>
						<DetailField
							label={<Translate text={localizationConstants.supplierBankgiroLabel} />}
							value={supplier.bankgiro}
						/>
						<DetailField
							label={<Translate text={localizationConstants.supplierPlusgiroLabel} />}
							value={supplier.plusgiro}
						/>
						<DetailField
							label={<Translate text={localizationConstants.supplierIbanLabel} />}
							value={supplier.iban}
						/>
						<DetailField
							label={<Translate text={localizationConstants.supplierBicLabel} />}
							value={supplier.bic}
						/>
					</>
				)}
			</div>
		</SupplierDetailCard>
	);
}
