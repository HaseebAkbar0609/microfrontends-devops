"use client";

import React, { useState } from "react";
import { Award, Star } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { SupplierDetailData } from "../../../../../types/supplierDetail.types";
import type {
	SupplierRatingField,
	SupplierRatings,
} from "../../../../../types/createSupplier.types";
import { SupplierDetailCard } from "../../cards/SupplierDetailCard";

const RATING_CRITERIA: { field: SupplierRatingField; labelKey: keyof typeof localizationConstants }[] = [
	{ field: "economy", labelKey: "supplierRatingEconomy" },
	{ field: "environment", labelKey: "supplierRatingEnvironment" },
	{ field: "quality", labelKey: "supplierRatingQuality" },
	{ field: "collaboration", labelKey: "supplierRatingCollaboration" },
	{ field: "timeliness", labelKey: "supplierRatingTimeliness" },
];

interface SupplierAssessmentCardProps {
	supplier: SupplierDetailData;
	onUpdate: (updates: Partial<SupplierDetailData>) => void;
}

export function SupplierAssessmentCard({
	supplier,
	onUpdate,
}: SupplierAssessmentCardProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [ratings, setRatings] = useState<SupplierRatings>(supplier.ratings);

	const handleSave = () => {
		onUpdate({ ratings });
		setIsEditing(false);
	};

	const handleCancel = () => {
		setRatings(supplier.ratings);
		setIsEditing(false);
	};

	const handleStarClick = (field: SupplierRatingField, score: number) => {
		if (!isEditing) return;
		setRatings((prev) => ({ ...prev, [field]: score }));
	};

	return (
		<SupplierDetailCard
			title={<Translate text={localizationConstants.supplierDetailCardAssessment} />}
			icon={<Award className="h-5 w-5" />}
			isEditing={isEditing}
			onEdit={() => setIsEditing(true)}
			onSave={handleSave}
			onCancel={handleCancel}
		>
			<div className="divide-y divide-slate-100">
				{RATING_CRITERIA.map((criterion) => {
					const score = isEditing ? ratings[criterion.field] || 0 : supplier.ratings[criterion.field] || 0;
					return (
						<div
							key={criterion.field}
							className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0"
						>
							<span className="text-xs font-medium text-slate-700">
								<Translate text={localizationConstants[criterion.labelKey]} />
							</span>
							<div className="flex items-center gap-1.5">
								{[1, 2, 3, 4, 5].map((star) => (
									<button
										key={star}
										type="button"
										disabled={!isEditing}
										onClick={() => handleStarClick(criterion.field, star)}
										className={`p-0.5 focus:outline-none ${isEditing ? "cursor-pointer hover:scale-110" : "cursor-default"}`}
									>
										<Star
											className={`h-5 w-5 ${
												star <= score
													? "fill-amber-400 text-amber-400"
													: "text-slate-200"
											}`}
										/>
									</button>
								))}
							</div>
						</div>
					);
				})}
			</div>
		</SupplierDetailCard>
	);
}
