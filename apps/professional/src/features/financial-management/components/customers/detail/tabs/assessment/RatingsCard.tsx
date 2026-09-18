"use client";

import React, { useState } from "react";
import { Star } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type {
	CustomerDetailData,
	CustomerDetailRatings,
} from "@/features/financial-management/types/customerDetail.types";
import { CustomerDetailCard } from "../../cards/CustomerDetailCard";

interface RatingsCardProps {
	customer: CustomerDetailData;
	onUpdate: (updates: Partial<CustomerDetailData>) => void;
}

interface RatingRowProps {
	label: React.ReactNode;
	score: number;
	isEditing?: boolean;
	onScoreChange?: (newScore: number) => void;
}

const RatingRow: React.FC<RatingRowProps> = ({
	label,
	score,
	isEditing = false,
	onScoreChange,
}) => {
	return (
		<div className="flex items-center justify-between py-2.5">
			<span className="text-xs font-medium text-slate-700 dark:text-slate-300">
				{label}
			</span>
			<div className="flex items-center gap-1.5">
				<div className="flex items-center gap-0.5">
					{[1, 2, 3, 4, 5].map((starIndex) => (
						<button
							key={starIndex}
							type="button"
							disabled={!isEditing}
							onClick={() => isEditing && onScoreChange && onScoreChange(starIndex)}
							className={`${
								isEditing ? "cursor-pointer hover:scale-110 transition-transform" : "cursor-default"
							}`}
						>
							<Star
								className={`h-4 w-4 ${
									starIndex <= score
										? "fill-amber-400 text-amber-400"
										: "text-slate-200 dark:text-slate-700"
								}`}
							/>
						</button>
					))}
				</div>
				<span className="ml-1.5 min-w-[28px] text-right text-xs font-semibold text-slate-500 dark:text-slate-400">
					{score}/5
				</span>
			</div>
		</div>
	);
};

export const RatingsCard: React.FC<RatingsCardProps> = ({
	customer,
	onUpdate,
}) => {
	const defaultRatings: CustomerDetailRatings = customer.ratings || {
		solvency: 5,
		cooperation: 4,
		clarity: 5,
		availability: 4,
		environment: 5,
		timeliness: 4,
	};

	const [isEditing, setIsEditing] = useState(false);
	const [draft, setDraft] = useState<CustomerDetailRatings>(defaultRatings);

	const handleEdit = () => {
		setDraft(customer.ratings || defaultRatings);
		setIsEditing(true);
	};

	const handleCancel = () => {
		setIsEditing(false);
	};

	const handleSave = () => {
		onUpdate({ ratings: draft });
		setIsEditing(false);
	};

	const updateCriteria = (key: keyof CustomerDetailRatings, val: number) => {
		setDraft((prev) => ({ ...prev, [key]: val }));
	};

	const activeRatings = isEditing ? draft : customer.ratings || defaultRatings;

	return (
		<CustomerDetailCard
			title={<Translate text={localizationConstants.customerDetailCardAssessment} />}
			icon={<Star className="h-5 w-5 text-slate-500" />}
			isEditing={isEditing}
			onEdit={handleEdit}
			onSave={handleSave}
			onCancel={handleCancel}
		>
			<div className="grid grid-cols-1 divide-y divide-slate-100 md:grid-cols-2 md:gap-x-12 md:divide-y-0 dark:divide-slate-800">
				<div className="divide-y divide-slate-100 dark:divide-slate-800">
					<RatingRow
						label={<Translate text={localizationConstants.customerDetailRatingSolvency} />}
						score={activeRatings.solvency}
						isEditing={isEditing}
						onScoreChange={(val) => updateCriteria("solvency", val)}
					/>
					<RatingRow
						label={<Translate text={localizationConstants.customerDetailRatingCooperation} />}
						score={activeRatings.cooperation}
						isEditing={isEditing}
						onScoreChange={(val) => updateCriteria("cooperation", val)}
					/>
					<RatingRow
						label={<Translate text={localizationConstants.customerDetailRatingClarity} />}
						score={activeRatings.clarity}
						isEditing={isEditing}
						onScoreChange={(val) => updateCriteria("clarity", val)}
					/>
				</div>
				<div className="divide-y divide-slate-100 dark:divide-slate-800">
					<RatingRow
						label={<Translate text={localizationConstants.customerDetailRatingAvailability} />}
						score={activeRatings.availability}
						isEditing={isEditing}
						onScoreChange={(val) => updateCriteria("availability", val)}
					/>
					<RatingRow
						label={<Translate text={localizationConstants.customerDetailRatingEnvironment} />}
						score={activeRatings.environment}
						isEditing={isEditing}
						onScoreChange={(val) => updateCriteria("environment", val)}
					/>
					<RatingRow
						label={<Translate text={localizationConstants.customerDetailRatingTimeliness} />}
						score={activeRatings.timeliness}
						isEditing={isEditing}
						onScoreChange={(val) => updateCriteria("timeliness", val)}
					/>
				</div>
			</div>
		</CustomerDetailCard>
	);
};
