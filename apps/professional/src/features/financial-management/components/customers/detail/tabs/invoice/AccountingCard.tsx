"use client";

import React, { useState } from "react";
import { Calculator } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { CustomerDetailData } from "@/features/financial-management/types/customerDetail.types";
import {
	CustomerDetailCard,
	DetailField,
	EditableField,
} from "../../cards/CustomerDetailCard";

interface AccountingCardProps {
	customer: CustomerDetailData;
	onUpdate: (updates: Partial<CustomerDetailData>) => void;
}

export const AccountingCard: React.FC<AccountingCardProps> = ({
	customer,
	onUpdate,
}) => {
	const [isEditing, setIsEditing] = useState(false);
	const [draft, setDraft] = useState({
		vatNumber: customer.vatNumber || customer.vatRegNo || "",
		vatType: customer.vatType || "SE MOMS 25%",
		salesAccount: customer.salesAccount || "3001 - Försäljning inom Sverige",
		costCenter: customer.costCenter || "",
		project: customer.project || "",
	});

	const handleEdit = () => {
		setDraft({
			vatNumber: customer.vatNumber || customer.vatRegNo || "",
			vatType: customer.vatType || "SE MOMS 25%",
			salesAccount: customer.salesAccount || "3001 - Försäljning inom Sverige",
			costCenter: customer.costCenter || "",
			project: customer.project || "",
		});
		setIsEditing(true);
	};

	const handleCancel = () => {
		setIsEditing(false);
	};

	const handleSave = () => {
		onUpdate({
			...draft,
			vatRegNo: draft.vatNumber,
		});
		setIsEditing(false);
	};

	return (
		<CustomerDetailCard
			title={<Translate text={localizationConstants.customerDetailCardAccounting} />}
			icon={<Calculator className="h-5 w-5 text-slate-500" />}
			isEditing={isEditing}
			onEdit={handleEdit}
			onSave={handleSave}
			onCancel={handleCancel}
		>
			{isEditing ? (
				<div className="grid grid-cols-2 gap-y-4 gap-x-6">
					<EditableField
						label={<Translate text={localizationConstants.customerDetailVatNumberAccountingLabel} />}
						value={draft.vatNumber}
						onChange={(val) => setDraft((prev) => ({ ...prev, vatNumber: val }))}
					/>
					<EditableField
						label={<Translate text={localizationConstants.customerDetailVatTypeLabel} />}
						value={draft.vatType}
						onChange={(val) => setDraft((prev) => ({ ...prev, vatType: val }))}
					/>
					<div className="col-span-2">
						<EditableField
							label={<Translate text={localizationConstants.customerDetailSalesAccountLabel} />}
							value={draft.salesAccount}
							onChange={(val) => setDraft((prev) => ({ ...prev, salesAccount: val }))}
						/>
					</div>
					<EditableField
						label={<Translate text={localizationConstants.customerDetailCostCenterLabel} />}
						value={draft.costCenter}
						onChange={(val) => setDraft((prev) => ({ ...prev, costCenter: val }))}
					/>
					<EditableField
						label={<Translate text={localizationConstants.customerDetailProjectLabel} />}
						value={draft.project}
						onChange={(val) => setDraft((prev) => ({ ...prev, project: val }))}
					/>
				</div>
			) : (
				<div className="grid grid-cols-2 gap-y-4 gap-x-6">
					<DetailField
						label={<Translate text={localizationConstants.customerDetailVatNumberAccountingLabel} />}
						value={customer.vatNumber || customer.vatRegNo}
					/>
					<DetailField
						label={<Translate text={localizationConstants.customerDetailVatTypeLabel} />}
						value={customer.vatType}
					/>
					<DetailField
						label={<Translate text={localizationConstants.customerDetailSalesAccountLabel} />}
						value={customer.salesAccount}
						className="col-span-2"
					/>
					<DetailField
						label={<Translate text={localizationConstants.customerDetailCostCenterLabel} />}
						value={customer.costCenter}
					/>
					<DetailField
						label={<Translate text={localizationConstants.customerDetailProjectLabel} />}
						value={customer.project}
					/>
				</div>
			)}
		</CustomerDetailCard>
	);
};
