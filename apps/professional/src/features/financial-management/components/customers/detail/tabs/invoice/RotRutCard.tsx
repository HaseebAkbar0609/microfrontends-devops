"use client";

import React, { useState } from "react";
import { Home } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { CustomerDetailData } from "@/features/financial-management/types/customerDetail.types";
import {
	CustomerDetailCard,
	DetailField,
	EditableField,
} from "../../cards/CustomerDetailCard";

interface RotRutCardProps {
	customer: CustomerDetailData;
	onUpdate: (updates: Partial<CustomerDetailData>) => void;
}

export const RotRutCard: React.FC<RotRutCardProps> = ({
	customer,
	onUpdate,
}) => {
	const [isEditing, setIsEditing] = useState(false);
	const [draft, setDraft] = useState({
		isRotRutEnabled: customer.isRotRutEnabled ?? false,
		rotRutType: customer.rotRutType || "ROT",
		propertyDesignation: customer.propertyDesignation || "",
		apartmentNumber: customer.apartmentNumber || "",
		brfOrgNo: customer.brfOrgNo || "",
	});

	const handleEdit = () => {
		setDraft({
			isRotRutEnabled: customer.isRotRutEnabled ?? false,
			rotRutType: customer.rotRutType || "ROT",
			propertyDesignation: customer.propertyDesignation || "",
			apartmentNumber: customer.apartmentNumber || "",
			brfOrgNo: customer.brfOrgNo || "",
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

	const rotRutActiveText = customer.isRotRutEnabled ? (
		<Translate text={localizationConstants.customerDetailYes} />
	) : (
		<Translate text={localizationConstants.customerDetailNo} />
	);

	return (
		<CustomerDetailCard
			title={<Translate text={localizationConstants.customerDetailCardRotRut} />}
			icon={<Home className="h-5 w-5 text-slate-500" />}
			isEditing={isEditing}
			onEdit={handleEdit}
			onSave={handleSave}
			onCancel={handleCancel}
		>
			{isEditing ? (
				<div className="grid grid-cols-1 gap-y-4 gap-x-6 md:grid-cols-3">
					<div className="flex flex-col gap-1">
						<span className="text-[11px] font-medium text-slate-400 dark:text-slate-400">
							<Translate text={localizationConstants.customerDetailRotRutActiveLabel} />
						</span>
						<select
							value={draft.isRotRutEnabled ? "yes" : "no"}
							onChange={(e) =>
								setDraft((prev) => ({
									...prev,
									isRotRutEnabled: e.target.value === "yes",
								}))
							}
							className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-slate-400 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
						>
							<option value="yes">Ja</option>
							<option value="no">Nej</option>
						</select>
					</div>

					<EditableField
						label={<Translate text={localizationConstants.customerDetailRotRutTypeLabel} />}
						value={draft.rotRutType}
						onChange={(val) => setDraft((prev) => ({ ...prev, rotRutType: val }))}
					/>
					<EditableField
						label={<Translate text={localizationConstants.customerDetailPropertyDesignationLabel} />}
						value={draft.propertyDesignation}
						onChange={(val) => setDraft((prev) => ({ ...prev, propertyDesignation: val }))}
					/>
					<EditableField
						label={<Translate text={localizationConstants.customerDetailApartmentNoLabel} />}
						value={draft.apartmentNumber}
						onChange={(val) => setDraft((prev) => ({ ...prev, apartmentNumber: val }))}
					/>
					<EditableField
						label={<Translate text={localizationConstants.customerDetailBrfOrgNoLabel} />}
						value={draft.brfOrgNo}
						onChange={(val) => setDraft((prev) => ({ ...prev, brfOrgNo: val }))}
					/>
				</div>
			) : (
				<div className="grid grid-cols-1 gap-y-4 gap-x-6 md:grid-cols-3">
					<DetailField
						label={<Translate text={localizationConstants.customerDetailRotRutActiveLabel} />}
						value={rotRutActiveText}
					/>
					<DetailField
						label={<Translate text={localizationConstants.customerDetailRotRutTypeLabel} />}
						value={customer.rotRutType}
					/>
					<DetailField
						label={<Translate text={localizationConstants.customerDetailPropertyDesignationLabel} />}
						value={customer.propertyDesignation}
					/>
					<DetailField
						label={<Translate text={localizationConstants.customerDetailApartmentNoLabel} />}
						value={customer.apartmentNumber}
					/>
					<DetailField
						label={<Translate text={localizationConstants.customerDetailBrfOrgNoLabel} />}
						value={customer.brfOrgNo}
					/>
				</div>
			)}
		</CustomerDetailCard>
	);
};
