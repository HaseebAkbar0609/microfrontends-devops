"use client";

import React from "react";
import type { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Star } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type {
	CreateSupplierFormData,
	SupplierRatingField,
	SupplierRatings,
	SupplierAttachedDocument,
} from "../../../../types/createSupplier.types";
import { SupplierDocumentUploadZone } from "../sections/SupplierDocumentUploadZone";

const SUPPLIER_RATING_CRITERIA: { field: SupplierRatingField; labelKey: keyof typeof localizationConstants }[] = [
	{ field: "economy", labelKey: "supplierRatingEconomy" },
	{ field: "environment", labelKey: "supplierRatingEnvironment" },
	{ field: "quality", labelKey: "supplierRatingQuality" },
	{ field: "collaboration", labelKey: "supplierRatingCollaboration" },
	{ field: "timeliness", labelKey: "supplierRatingTimeliness" },
];

interface Step3AssessmentProps {
	form: UseFormReturn<CreateSupplierFormData>;
	ratings: SupplierRatings;
	onRatingChange: (field: SupplierRatingField, score: number) => void;
	documents: SupplierAttachedDocument[];
	onAddDocument: (doc: SupplierAttachedDocument) => void;
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
	const { t } = useTranslation();
	const { register } = form;

	return (
		<div className="space-y-6">
			{/* Card 1: Bedömning (5-stjärnigt betyg) */}
			<div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
				<div className="border-b border-slate-100 pb-4">
					<h3 className="text-sm font-bold text-slate-900 tracking-tight">
						<Translate text={localizationConstants.supplierCardAssessment} />
					</h3>
				</div>

				<div className="divide-y divide-slate-100">
					{SUPPLIER_RATING_CRITERIA.map((criterion) => {
						const currentScore = ratings[criterion.field] || 0;
						return (
							<div
								key={criterion.field}
								className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
							>
								<span className="text-xs font-medium text-slate-700">
									<Translate text={localizationConstants[criterion.labelKey]} />
								</span>
								<div className="flex items-center gap-1.5">
									{[1, 2, 3, 4, 5].map((star) => (
										<button
											key={star}
											type="button"
											onClick={() => onRatingChange(criterion.field, star)}
											className="p-1 cursor-pointer transition-transform hover:scale-110 focus:outline-none"
											aria-label={`Rate ${star} stars`}
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

			{/* Card 2: FÖRETAGSUPPGIFTER Dokumentuppladdning */}
			<SupplierDocumentUploadZone
				documents={documents}
				onAddDocument={onAddDocument}
				onRemoveDocument={onRemoveDocument}
			/>

			{/* Card 3: Tilläggsinformation */}
			<div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs space-y-3">
				<h3 className="text-sm font-bold text-slate-900 tracking-tight">
					<Translate text={localizationConstants.supplierCardAdditionalInfo} />
				</h3>
				<div className="space-y-1.5">
					<Textarea
						{...register("additionalNotes")}
						placeholder={t(localizationConstants.supplierAdditionalNotesPlaceholder)}
						className="text-xs min-h-[100px] bg-white"
					/>
				</div>
			</div>
		</div>
	);
}
