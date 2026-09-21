"use client";

import React, { useState } from "react";
import { MapPin } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { SupplierDetailData } from "../../../../../types/supplierDetail.types";
import {
	SupplierDetailCard,
	DetailField,
	EditableField,
} from "../../cards/SupplierDetailCard";

interface SupplierAddressesCardProps {
	supplier: SupplierDetailData;
	onUpdate: (updates: Partial<SupplierDetailData>) => void;
}

export function SupplierAddressesCard({
	supplier,
	onUpdate,
}: SupplierAddressesCardProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState({
		visitingAddress: supplier.visitingAddress,
		visitingPostalCode: supplier.visitingPostalCode,
		visitingCity: supplier.visitingCity,
		invoiceAddress: supplier.invoiceAddress || supplier.visitingAddress,
		invoicePostalCode: supplier.invoicePostalCode || supplier.visitingPostalCode,
		invoiceCity: supplier.invoiceCity || supplier.visitingCity,
	});

	const handleSave = () => {
		onUpdate(formData);
		setIsEditing(false);
	};

	const handleCancel = () => {
		setFormData({
			visitingAddress: supplier.visitingAddress,
			visitingPostalCode: supplier.visitingPostalCode,
			visitingCity: supplier.visitingCity,
			invoiceAddress: supplier.invoiceAddress || supplier.visitingAddress,
			invoicePostalCode: supplier.invoicePostalCode || supplier.visitingPostalCode,
			invoiceCity: supplier.invoiceCity || supplier.visitingCity,
		});
		setIsEditing(false);
	};

	return (
		<SupplierDetailCard
			title={<Translate text={localizationConstants.supplierDetailCardAddresses} />}
			icon={<MapPin className="h-5 w-5" />}
			isEditing={isEditing}
			onEdit={() => setIsEditing(true)}
			onSave={handleSave}
			onCancel={handleCancel}
		>
			<div className="space-y-6">
				{/* Visiting Address Section */}
				<div>
					<h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
						<Translate text={localizationConstants.supplierVisitingAddressLabel} />
					</h4>
					<div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
						{isEditing ? (
							<>
								<EditableField
									label={<Translate text={localizationConstants.supplierVisitingAddressLabel} />}
									value={formData.visitingAddress}
									onChange={(val) => setFormData((prev) => ({ ...prev, visitingAddress: val }))}
								/>
								<EditableField
									label={<Translate text={localizationConstants.supplierPostalCodeLabel} />}
									value={formData.visitingPostalCode}
									onChange={(val) => setFormData((prev) => ({ ...prev, visitingPostalCode: val }))}
								/>
								<EditableField
									label={<Translate text={localizationConstants.supplierCityLabel} />}
									value={formData.visitingCity}
									onChange={(val) => setFormData((prev) => ({ ...prev, visitingCity: val }))}
								/>
							</>
						) : (
							<>
								<DetailField
									label={<Translate text={localizationConstants.supplierVisitingAddressLabel} />}
									value={supplier.visitingAddress}
								/>
								<DetailField
									label={<Translate text={localizationConstants.supplierPostalCodeLabel} />}
									value={supplier.visitingPostalCode}
								/>
								<DetailField
									label={<Translate text={localizationConstants.supplierCityLabel} />}
									value={supplier.visitingCity}
								/>
							</>
						)}
					</div>
				</div>

				{/* Invoice Address Section */}
				<div className="border-t border-slate-100 pt-4 dark:border-slate-800">
					<h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
						<Translate text={localizationConstants.supplierInvoiceAddressLabel} />
					</h4>
					<div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
						{isEditing ? (
							<>
								<EditableField
									label={<Translate text={localizationConstants.supplierInvoiceAddressLabel} />}
									value={formData.invoiceAddress}
									onChange={(val) => setFormData((prev) => ({ ...prev, invoiceAddress: val }))}
								/>
								<EditableField
									label={<Translate text={localizationConstants.supplierPostalCodeLabel} />}
									value={formData.invoicePostalCode}
									onChange={(val) => setFormData((prev) => ({ ...prev, invoicePostalCode: val }))}
								/>
								<EditableField
									label={<Translate text={localizationConstants.supplierCityLabel} />}
									value={formData.invoiceCity}
									onChange={(val) => setFormData((prev) => ({ ...prev, invoiceCity: val }))}
								/>
							</>
						) : (
							<>
								<DetailField
									label={<Translate text={localizationConstants.supplierInvoiceAddressLabel} />}
									value={supplier.invoiceAddress || supplier.visitingAddress}
								/>
								<DetailField
									label={<Translate text={localizationConstants.supplierPostalCodeLabel} />}
									value={supplier.invoicePostalCode || supplier.visitingPostalCode}
								/>
								<DetailField
									label={<Translate text={localizationConstants.supplierCityLabel} />}
									value={supplier.invoiceCity || supplier.visitingCity}
								/>
							</>
						)}
					</div>
				</div>
			</div>
		</SupplierDetailCard>
	);
}
