"use client";

import React, { useState } from "react";
import { Phone } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { SupplierDetailData } from "../../../../../types/supplierDetail.types";
import {
	SupplierDetailCard,
	DetailField,
	EditableField,
} from "../../cards/SupplierDetailCard";

interface SupplierContactCardProps {
	supplier: SupplierDetailData;
	onUpdate: (updates: Partial<SupplierDetailData>) => void;
}

export function SupplierContactCard({
	supplier,
	onUpdate,
}: SupplierContactCardProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState({
		phone: supplier.phone,
		email: supplier.email,
		website: supplier.website || "",
		contactNotes: supplier.contactNotes || "",
	});

	const handleSave = () => {
		onUpdate(formData);
		setIsEditing(false);
	};

	const handleCancel = () => {
		setFormData({
			phone: supplier.phone,
			email: supplier.email,
			website: supplier.website || "",
			contactNotes: supplier.contactNotes || "",
		});
		setIsEditing(false);
	};

	return (
		<SupplierDetailCard
			title={<Translate text={localizationConstants.supplierDetailCardContact} />}
			icon={<Phone className="h-5 w-5" />}
			isEditing={isEditing}
			onEdit={() => setIsEditing(true)}
			onSave={handleSave}
			onCancel={handleCancel}
		>
			<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
				{isEditing ? (
					<>
						<EditableField
							label={<Translate text={localizationConstants.supplierPhoneLabel} />}
							value={formData.phone}
							onChange={(val) => setFormData((prev) => ({ ...prev, phone: val }))}
						/>
						<EditableField
							label={<Translate text={localizationConstants.supplierEmailLabel} />}
							value={formData.email}
							onChange={(val) => setFormData((prev) => ({ ...prev, email: val }))}
						/>
						<EditableField
							label={<Translate text={localizationConstants.supplierWebsiteLabel} />}
							value={formData.website}
							onChange={(val) => setFormData((prev) => ({ ...prev, website: val }))}
						/>
						<div className="sm:col-span-2 lg:col-span-3">
							<EditableField
								label={<Translate text={localizationConstants.supplierNotesLabel} />}
								value={formData.contactNotes}
								onChange={(val) => setFormData((prev) => ({ ...prev, contactNotes: val }))}
							/>
						</div>
					</>
				) : (
					<>
						<DetailField
							label={<Translate text={localizationConstants.supplierPhoneLabel} />}
							value={supplier.phone}
						/>
						<DetailField
							label={<Translate text={localizationConstants.supplierEmailLabel} />}
							value={supplier.email}
						/>
						<DetailField
							label={<Translate text={localizationConstants.supplierWebsiteLabel} />}
							value={
								supplier.website ? (
									<a
										href={supplier.website.startsWith("http") ? supplier.website : `https://${supplier.website}`}
										target="_blank"
										rel="noopener noreferrer"
										className="text-blue-600 hover:underline"
									>
										{supplier.website}
									</a>
								) : (
									"-"
								)
							}
						/>
						<div className="sm:col-span-2 lg:col-span-3">
							<DetailField
								label={<Translate text={localizationConstants.supplierNotesLabel} />}
								value={supplier.contactNotes}
							/>
						</div>
					</>
				)}
			</div>
		</SupplierDetailCard>
	);
}
