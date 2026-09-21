"use client";

import React, { useState } from "react";
import { Building2 } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { SupplierDetailData } from "../../../../../types/supplierDetail.types";
import {
	SupplierDetailCard,
	DetailField,
	EditableField,
} from "../../cards/SupplierDetailCard";

interface SupplierInfoCardProps {
	supplier: SupplierDetailData;
	onUpdate: (updates: Partial<SupplierDetailData>) => void;
}

export function SupplierInfoCard({ supplier, onUpdate }: SupplierInfoCardProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState({
		levNr: supplier.levNr,
		status: supplier.status,
		name: supplier.name,
		mainCategory: supplier.mainCategory,
		department: supplier.department || "",
		region: supplier.region || "",
		orgNo: supplier.orgNo,
		vatRegNo: supplier.vatRegNo || "",
	});

	const handleSave = () => {
		onUpdate(formData);
		setIsEditing(false);
	};

	const handleCancel = () => {
		setFormData({
			levNr: supplier.levNr,
			status: supplier.status,
			name: supplier.name,
			mainCategory: supplier.mainCategory,
			department: supplier.department || "",
			region: supplier.region || "",
			orgNo: supplier.orgNo,
			vatRegNo: supplier.vatRegNo || "",
		});
		setIsEditing(false);
	};

	return (
		<SupplierDetailCard
			title={<Translate text={localizationConstants.supplierDetailCardSupplier} />}
			icon={<Building2 className="h-5 w-5" />}
			isEditing={isEditing}
			onEdit={() => setIsEditing(true)}
			onSave={handleSave}
			onCancel={handleCancel}
		>
			<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
				{isEditing ? (
					<>
						<EditableField
							label={<Translate text={localizationConstants.supplierNoLabel} />}
							value={formData.levNr}
							onChange={(val) => setFormData((prev) => ({ ...prev, levNr: val }))}
						/>
						<EditableField
							label={<Translate text={localizationConstants.supplierStatusLabel} />}
							value={formData.status}
							onChange={(val) => setFormData((prev) => ({ ...prev, status: val }))}
						/>
						<EditableField
							label={<Translate text={localizationConstants.supplierCompanyNameLabel} />}
							value={formData.name}
							onChange={(val) => setFormData((prev) => ({ ...prev, name: val }))}
						/>
						<EditableField
							label={<Translate text={localizationConstants.supplierMainCategoryLabel} />}
							value={formData.mainCategory}
							onChange={(val) => setFormData((prev) => ({ ...prev, mainCategory: val }))}
						/>
						<EditableField
							label={<Translate text={localizationConstants.supplierDepartmentLabel} />}
							value={formData.department}
							onChange={(val) => setFormData((prev) => ({ ...prev, department: val }))}
						/>
						<EditableField
							label={<Translate text={localizationConstants.supplierRegionLabel} />}
							value={formData.region}
							onChange={(val) => setFormData((prev) => ({ ...prev, region: val }))}
						/>
						<EditableField
							label={<Translate text={localizationConstants.supplierOrgNoLabel} />}
							value={formData.orgNo}
							onChange={(val) => setFormData((prev) => ({ ...prev, orgNo: val }))}
						/>
						<EditableField
							label={<Translate text={localizationConstants.supplierVatRegNoLabel} />}
							value={formData.vatRegNo}
							onChange={(val) => setFormData((prev) => ({ ...prev, vatRegNo: val }))}
						/>
					</>
				) : (
					<>
						<DetailField
							label={<Translate text={localizationConstants.supplierNoLabel} />}
							value={supplier.levNr}
						/>
						<DetailField
							label={<Translate text={localizationConstants.supplierStatusLabel} />}
							value={
								<span
									className={`inline-flex items-center justify-center rounded-md px-2.5 py-0.5 text-xs font-semibold text-white ${
										supplier.status === "active"
											? "bg-[#16A34A]"
											: supplier.status === "prospect"
												? "bg-amber-500"
												: "bg-slate-400"
									}`}
								>
									{supplier.status === "active" ? (
										<Translate text={localizationConstants.supplierStatusActive} />
									) : supplier.status === "prospect" ? (
										<Translate text={localizationConstants.supplierStatusProspect} />
									) : (
										<Translate text={localizationConstants.supplierStatusInactive} />
									)}
								</span>
							}
						/>
						<DetailField
							label={<Translate text={localizationConstants.supplierCompanyNameLabel} />}
							value={supplier.name}
						/>
						<DetailField
							label={<Translate text={localizationConstants.supplierMainCategoryLabel} />}
							value={supplier.mainCategory}
						/>
						<DetailField
							label={<Translate text={localizationConstants.supplierDepartmentLabel} />}
							value={supplier.department}
						/>
						<DetailField
							label={<Translate text={localizationConstants.supplierRegionLabel} />}
							value={supplier.region}
						/>
						<DetailField
							label={<Translate text={localizationConstants.supplierOrgNoLabel} />}
							value={supplier.orgNo}
						/>
						<DetailField
							label={<Translate text={localizationConstants.supplierVatRegNoLabel} />}
							value={supplier.vatRegNo}
						/>
					</>
				)}
			</div>
		</SupplierDetailCard>
	);
}
