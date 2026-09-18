"use client";

import React from "react";
import { Star, FileText, Folder, Download, Trash2 } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type {
	CustomerDetailData,
	CustomerDetailRatings,
} from "@/features/financial-management/types/customerDetail.types";
import type { CustomerAttachedDocument } from "@/features/financial-management/types/createCustomer.types";
import { CustomerDetailCard } from "../cards/CustomerDetailCard";

interface AssessmentTabProps {
	customer: CustomerDetailData;
	onEdit: (step: number) => void;
	onDeleteDocument?: (docId: string) => void;
}

interface RatingRowProps {
	label: React.ReactNode;
	score: number;
}

const RatingRow: React.FC<RatingRowProps> = ({ label, score }) => {
	return (
		<div className="flex items-center justify-between py-2.5">
			<span className="text-xs font-medium text-slate-700 dark:text-slate-300">
				{label}
			</span>
			<div className="flex items-center gap-1.5">
				<div className="flex items-center gap-0.5">
					{[1, 2, 3, 4, 5].map((starIndex) => (
						<Star
							key={starIndex}
							className={`h-4 w-4 ${
								starIndex <= score
									? "fill-amber-400 text-amber-400"
									: "text-slate-200 dark:text-slate-700"
							}`}
						/>
					))}
				</div>
				<span className="ml-1.5 min-w-[28px] text-right text-xs font-semibold text-slate-500 dark:text-slate-400">
					{score}/5
				</span>
			</div>
		</div>
	);
};

export const AssessmentTab: React.FC<AssessmentTabProps> = ({
	customer,
	onEdit,
	onDeleteDocument,
}) => {
	const ratings: CustomerDetailRatings = customer.ratings || {
		solvency: 5,
		cooperation: 4,
		clarity: 5,
		availability: 4,
		environment: 5,
		timeliness: 4,
	};

	return (
		<div className="space-y-6">
			{/* Ratings Card */}
			<CustomerDetailCard
				title={<Translate text={localizationConstants.customerDetailCardAssessment} />}
				icon={<Star className="h-5 w-5 text-slate-500" />}
				onEdit={() => onEdit(3)}
			>
				<div className="grid grid-cols-1 divide-y divide-slate-100 md:grid-cols-2 md:gap-x-12 md:divide-y-0 dark:divide-slate-800">
					<div className="divide-y divide-slate-100 dark:divide-slate-800">
						<RatingRow
							label={<Translate text={localizationConstants.customerDetailRatingSolvency} />}
							score={ratings.solvency}
						/>
						<RatingRow
							label={<Translate text={localizationConstants.customerDetailRatingCooperation} />}
							score={ratings.cooperation}
						/>
						<RatingRow
							label={<Translate text={localizationConstants.customerDetailRatingClarity} />}
							score={ratings.clarity}
						/>
					</div>
					<div className="divide-y divide-slate-100 dark:divide-slate-800">
						<RatingRow
							label={<Translate text={localizationConstants.customerDetailRatingAvailability} />}
							score={ratings.availability}
						/>
						<RatingRow
							label={<Translate text={localizationConstants.customerDetailRatingEnvironment} />}
							score={ratings.environment}
						/>
						<RatingRow
							label={<Translate text={localizationConstants.customerDetailRatingTimeliness} />}
							score={ratings.timeliness}
						/>
					</div>
				</div>
			</CustomerDetailCard>

			{/* Documents Card */}
			<CustomerDetailCard
				title={<Translate text={localizationConstants.customerDetailCardDocuments} />}
				icon={<Folder className="h-5 w-5 text-slate-500" />}
				onEdit={() => onEdit(3)}
			>
				<div className="overflow-x-auto">
					<table className="w-full text-left text-xs">
						<thead>
							<tr className="border-b border-slate-200 text-slate-400 dark:border-slate-800 dark:text-slate-500">
								<th className="pb-3 font-medium">
									<Translate text={localizationConstants.customerDetailColDate} />
								</th>
								<th className="pb-3 font-medium">
									<Translate text={localizationConstants.customerDetailColName} />
								</th>
								<th className="pb-3 font-medium">
									<Translate text={localizationConstants.customerDetailColSize} />
								</th>
								<th className="pb-3 font-medium">
									<Translate text={localizationConstants.customerDetailColFile} />
								</th>
								<th className="pb-3 text-right font-medium">
									<Translate text={localizationConstants.customerDetailColActions} />
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
							{customer.documents && customer.documents.length > 0 ? (
								customer.documents.map((doc: CustomerAttachedDocument) => (
									<tr
										key={doc.id}
										className="text-slate-700 transition-colors hover:bg-slate-50/50 dark:text-slate-300 dark:hover:bg-slate-800/40"
									>
										<td className="py-3.5 text-slate-500 dark:text-slate-400">
											{doc.dateAdded || "-"}
										</td>
										<td className="py-3.5 font-medium">{doc.name}</td>
										<td className="py-3.5 text-slate-500 dark:text-slate-400">
											{doc.size || "-"}
										</td>
										<td className="py-3.5">
											<span className="inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
												<FileText className="h-3 w-3" />
												PDF
											</span>
										</td>
										<td className="py-3.5 text-right">
											<div className="flex items-center justify-end gap-2">
												{doc.url && (
													<a
														href={doc.url}
														target="_blank"
														rel="noopener noreferrer"
														className="rounded p-1 text-slate-400 transition-colors hover:text-slate-700 dark:hover:text-slate-200"
														title="Download"
													>
														<Download className="h-4 w-4" />
													</a>
												)}
												{onDeleteDocument && (
													<button
														type="button"
														onClick={() => onDeleteDocument(doc.id)}
														className="rounded p-1 text-slate-400 transition-colors hover:text-red-500 dark:hover:text-red-400"
														title="Delete"
													>
														<Trash2 className="h-4 w-4" />
													</button>
												)}
											</div>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td
										colSpan={5}
										className="py-8 text-center text-slate-400 dark:text-slate-500"
									>
										<Translate text={localizationConstants.customerDetailDocumentsEmpty} />
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</CustomerDetailCard>

			{/* Additional Information Card */}
			<CustomerDetailCard
				title={<Translate text={localizationConstants.customerDetailCardAdditionalInfo} />}
				icon={<FileText className="h-5 w-5 text-slate-500" />}
				onEdit={() => onEdit(3)}
			>
				{customer.notes ? (
					<p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700 dark:text-slate-300">
						{customer.notes}
					</p>
				) : (
					<p className="italic text-slate-400 dark:text-slate-500 text-xs">
						<Translate text={localizationConstants.customerDetailNotesEmpty} />
					</p>
				)}
			</CustomerDetailCard>
		</div>
	);
};
