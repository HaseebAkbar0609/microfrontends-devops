"use client";

import React, { useState } from "react";
import { Building2 } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { CustomerDetailData } from "@/features/financial-management/types/customerDetail.types";
import {
	CustomerDetailCard,
	DetailField,
	EditableField,
} from "../../cards/CustomerDetailCard";

interface CustomerInfoCardProps {
	customer: CustomerDetailData;
	onUpdate: (updates: Partial<CustomerDetailData>) => void;
}

export const CustomerInfoCard: React.FC<CustomerInfoCardProps> = ({
	customer,
	onUpdate,
}) => {
	const [isEditing, setIsEditing] = useState(false);
	const [draft, setDraft] = useState({
		name: customer.name,
		entityType: customer.entityType,
		orgNo: customer.orgNo,
		vatRegNo: customer.vatRegNo,
		gln: customer.gln || "",
		peppolId: customer.peppolId || "",
	});

	const handleEdit = () => {
		setDraft({
			name: customer.name,
			entityType: customer.entityType,
			orgNo: customer.orgNo,
			vatRegNo: customer.vatRegNo,
			gln: customer.gln || "",
			peppolId: customer.peppolId || "",
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

	const customerTypeLabel =
		customer.entityType === "company" ? (
			<Translate text={localizationConstants.customerDetailCompanyType} />
		) : (
			<Translate text={localizationConstants.customerDetailIndividualType} />
		);

	return (
		<CustomerDetailCard
			title={<Translate text={localizationConstants.customerDetailCardCustomer} />}
			icon={<Building2 className="h-5 w-5 text-slate-500" />}
			isEditing={isEditing}
			onEdit={handleEdit}
			onSave={handleSave}
			onCancel={handleCancel}
		>
			{isEditing ? (
				<div className="grid grid-cols-2 gap-y-4 gap-x-6">
					<DetailField
						label={<Translate text={localizationConstants.customerDetailCustomerNoLabel} />}
						value={customer.customerNo}
					/>
					<div className="flex flex-col">
						<label className="mb-1 text-xs font-medium text-slate-500 dark:text-slate-400">
							<Translate text={localizationConstants.customerDetailCustomerTypeLabel} />
						</label>
						<select
							value={draft.entityType}
							onChange={(e) =>
								setDraft((prev) => ({
									...prev,
									entityType: e.target.value as "company" | "private",
								}))
							}
							className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-slate-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
						>
							<option value="company">Företag</option>
							<option value="private">Privatperson</option>
						</select>
					</div>
					<EditableField
						label={<Translate text={localizationConstants.customerDetailCustomerNameLabel} />}
						value={draft.name}
						onChange={(val) => setDraft((prev) => ({ ...prev, name: val }))}
						className="col-span-2"
					/>
					<EditableField
						label={<Translate text={localizationConstants.customerDetailOrgNumberLabel} />}
						value={draft.orgNo}
						onChange={(val) => setDraft((prev) => ({ ...prev, orgNo: val }))}
					/>
					<EditableField
						label={<Translate text={localizationConstants.customerDetailVatNumberLabel} />}
						value={draft.vatRegNo}
						onChange={(val) => setDraft((prev) => ({ ...prev, vatRegNo: val }))}
					/>
					<EditableField
						label={<Translate text={localizationConstants.customerDetailGlnLabel} />}
						value={draft.gln}
						onChange={(val) => setDraft((prev) => ({ ...prev, gln: val }))}
					/>
					<EditableField
						label={<Translate text={localizationConstants.customerDetailPeppolIdLabel} />}
						value={draft.peppolId}
						onChange={(val) => setDraft((prev) => ({ ...prev, peppolId: val }))}
					/>
				</div>
			) : (
				<div className="grid grid-cols-2 gap-y-4 gap-x-6">
					<DetailField
						label={<Translate text={localizationConstants.customerDetailCustomerNoLabel} />}
						value={customer.customerNo}
					/>
					<DetailField
						label={<Translate text={localizationConstants.customerDetailCustomerTypeLabel} />}
						value={customerTypeLabel}
					/>
					<DetailField
						label={<Translate text={localizationConstants.customerDetailCustomerNameLabel} />}
						value={customer.name}
						className="col-span-2"
					/>
					<DetailField
						label={<Translate text={localizationConstants.customerDetailOrgNumberLabel} />}
						value={customer.orgNo}
					/>
					<DetailField
						label={<Translate text={localizationConstants.customerDetailVatNumberLabel} />}
						value={customer.vatRegNo}
					/>
					<DetailField
						label={<Translate text={localizationConstants.customerDetailGlnLabel} />}
						value={customer.gln}
					/>
					<DetailField
						label={<Translate text={localizationConstants.customerDetailPeppolIdLabel} />}
						value={customer.peppolId}
					/>
				</div>
			)}
		</CustomerDetailCard>
	);
};
