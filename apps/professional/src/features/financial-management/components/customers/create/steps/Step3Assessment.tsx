"use client";

import React from "react";
import type { UseFormReturn } from "react-hook-form";
import { Star } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type {
	CreateCustomerFormData,
	CustomerRatingField,
	CustomerRatings,
	CustomerAttachedDocument,
} from "../../../../types/createCustomer.types";
import { DocumentUploadZone } from "../sections/DocumentUploadZone";

const RATING_CRITERIA: { field: CustomerRatingField; labelKey: string }[] = [
	{ field: "economy", labelKey: "economyLabel" },
	{ field: "environment", labelKey: "environmentLabel" },
	{ field: "quality", labelKey: "qualityLabel" },
	{ field: "collaboration", labelKey: "collaborationLabel" },
	{ field: "punctuality", labelKey: "punctualityLabel" },
	{ field: "service", labelKey: "serviceLabel" },
];

interface Step3AssessmentProps {
	form: UseFormReturn<CreateCustomerFormData>;
	ratings: CustomerRatings;
	onRatingChange: (field: CustomerRatingField, score: number) => void;
	documents: CustomerAttachedDocument[];
	onAddDocument: (file: File) => void;
	onRemoveDocument: (id: string) => void;
}

export function Step3Assessment({
	form,
	ratings,
	onRatingChange,
	documents,
	onAddDocument,
	onRemoveDocument,
}: Step3AssessmentProps) {
	const { register } = form;

	return (
		<div className="space-y-6">
			{/* Card 1: Bedömning (5-stjärnigt betyg) */}
			<div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
				<h3 className="text-sm font-bold text-slate-900 tracking-tight">
					<Translate text={localizationConstants.assessmentSection} />
				</h3>

				<div className="divide-y divide-slate-100">
					{RATING_CRITERIA.map((criterion) => {
						const currentScore = ratings[criterion.field] || 0;
						return (
							<div
								key={criterion.field}
								className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
							>
								<span className="text-xs font-medium text-slate-700">
									<Translate text={criterion.labelKey} />
								</span>
								<div className="flex items-center gap-1.5">
									{[1, 2, 3, 4, 5].map((star) => (
										<button
											key={star}
											type="button"
											onClick={() => onRatingChange(criterion.field, star)}
											className="p-1 cursor-pointer transition-transform hover:scale-110 focus:outline-none"
											aria-label={`Betygsätt ${star} stjärnor`}
										>
											<Star
												className={`h-5 w-5 ${
													star <= currentScore
														? "fill-amber-400 text-amber-400"
														: "text-slate-300 hover:text-amber-200"
												}`}
											/>
										</button>
									))}
								</div>
							</div>
						);
					})}
				</div>
			</div>

			{/* Card 2: Dokumentuppladdning */}
			<DocumentUploadZone
				documents={documents}
				onAddDocument={onAddDocument}
				onRemoveDocument={onRemoveDocument}
			/>

			{/* Card 3: Tilläggsinformation */}
			<div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs space-y-3">
				<h3 className="text-sm font-bold text-slate-900 tracking-tight">
					<Translate text={localizationConstants.additionalInfoSection} />
				</h3>
				<div className="space-y-1.5">
					<label className="text-xs font-medium text-slate-700">
						<Translate text={localizationConstants.notesLabel} />
					</label>
					<Textarea
						{...register("notes")}
						placeholder="Övrig information eller historik om kunden..."
						className="text-xs min-h-[100px]"
					/>
				</div>
			</div>
		</div>
	);
}
