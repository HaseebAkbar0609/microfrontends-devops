"use client";

import React from "react";
import { Activity, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { RehabData } from "@/features/personnel/types/halsa.types";
import { RehabDocumentTable } from "./RehabDocumentTable";

interface RehabCardViewProps {
	data: RehabData;
	onEdit: () => void;
	onPreviewDoc: (name: string) => void;
	onDownloadDoc?: (name: string) => void;
}

export function RehabCardView({ data, onEdit, onPreviewDoc, onDownloadDoc }: RehabCardViewProps) {
	return (
		<div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between border-b border-slate-100 pb-4">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shadow-2xs">
						<Activity className="w-5 h-5" />
					</div>
					<div>
						<div className="flex items-center gap-2">
							<h3 className="text-base font-bold text-slate-900">
								<Translate text={localizationConstants.rehabCardTitle} />
							</h3>
							<Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100 text-xs px-2 py-0.5">
								<Translate text={localizationConstants.rehabStatusActive} />
							</Badge>
						</div>
					</div>
				</div>

				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={onEdit}
					className="h-8 px-3 text-xs border-slate-200 text-slate-700 hover:bg-slate-50 font-medium cursor-pointer"
				>
					<Pencil className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
					<Translate text={localizationConstants.rehabBtnEdit} />
				</Button>
			</div>

			{/* Info Grid (2 Columns, 7 Fields) */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Left Column */}
				<div className="space-y-4">
					<div className="space-y-1">
						<p className="text-xs text-slate-500 font-medium">
							<Translate text={localizationConstants.rehabFieldCenter} />
						</p>
						<p className="text-sm font-bold text-slate-900">{data.center}</p>
					</div>

					<div className="space-y-1">
						<p className="text-xs text-slate-500 font-medium">
							<Translate text={localizationConstants.rehabFieldStartDate} />
						</p>
						<p className="text-sm font-bold text-slate-900">{data.startDate}</p>
					</div>

					<div className="space-y-1.5">
						<p className="text-xs text-slate-500 font-medium">
							<Translate text={localizationConstants.rehabFieldCapacity} />
						</p>
						<div className="space-y-1">
							<p className="text-sm font-bold text-slate-900">{data.capacityReturnWork}</p>
							{data.capacityReturnWork.includes("%") && (
								<div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden max-w-xs">
									<div
										className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300"
										style={{ width: data.capacityReturnWork.trim() }}
									/>
								</div>
							)}
						</div>
					</div>

					<div className="space-y-1">
						<p className="text-xs text-slate-500 font-medium">
							<Translate text={localizationConstants.rehabFieldNextFollowup} />
						</p>
						<p className="text-sm font-bold text-slate-900">{data.nextFollowUpDate}</p>
					</div>
				</div>

				{/* Right Column */}
				<div className="space-y-4">
					<div className="space-y-1">
						<p className="text-xs text-slate-500 font-medium">
							<Translate text={localizationConstants.rehabFieldImprovement} />
						</p>
						<p className="text-sm font-bold text-slate-900">{data.areaForImprovement}</p>
					</div>

					<div className="space-y-1">
						<p className="text-xs text-slate-500 font-medium">
							<Translate text={localizationConstants.rehabFieldReturnDate} />
						</p>
						<p className="text-sm font-bold text-slate-900">{data.estimatedReturnDate}</p>
					</div>

					<div className="space-y-1">
						<p className="text-xs text-slate-500 font-medium">
							<Translate text={localizationConstants.rehabFieldFrequency} />
						</p>
						<p className="text-sm font-bold text-slate-900">
							{data.followUpFrequency === "Varje vecka" || data.followUpFrequency === "Every week" ? (
								<Translate text={localizationConstants.rehabFrequencyEveryWeek} />
							) : data.followUpFrequency === "Varannan vecka" || data.followUpFrequency === "Every two weeks" ? (
								<Translate text={localizationConstants.rehabFrequencyEveryTwoWeeks} />
							) : data.followUpFrequency === "Varje månad" || data.followUpFrequency === "Monthly" ? (
								<Translate text={localizationConstants.rehabFrequencyMonthly} />
							) : (
								data.followUpFrequency
							)}
						</p>
					</div>
				</div>
			</div>

			{/* Attached Documents Table */}
			<RehabDocumentTable
				documents={data.documents}
				onPreviewDoc={onPreviewDoc}
				onDownloadDoc={onDownloadDoc}
			/>
		</div>
	);
}
