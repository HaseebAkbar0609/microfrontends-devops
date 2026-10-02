"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface ProcessBasicInfoCardProps {
	id: string;
	title: string;
	onTitleChange: (val: string) => void;
	date: string;
	onDateChange: (val: string) => void;
}

export function ProcessBasicInfoCard({
	id,
	title,
	onTitleChange,
	date,
	onDateChange,
}: ProcessBasicInfoCardProps) {
	const { t } = useTranslation();

	return (
		<div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
			<h3 className="text-xs font-bold text-slate-900">
				<Translate text={localizationConstants.processSectionBasicInfo} />
			</h3>

			<div className="space-y-3">
				{/* ID Field */}
				<div className="space-y-1">
					<Label className="text-[11px] font-medium text-slate-500">
						<Translate text={localizationConstants.processFieldId} />
					</Label>
					<Input
						value={id}
						readOnly
						disabled
						className="h-9 text-xs bg-slate-50 border-slate-200 text-slate-700 font-mono"
					/>
				</div>

				{/* Title and Date Row */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div className="space-y-1">
						<Label className="text-[11px] font-medium text-slate-500">
							<Translate text={localizationConstants.processFieldTitle} />
						</Label>
						<Input
							value={title}
							onChange={(e) => onTitleChange(e.target.value)}
							placeholder={t(localizationConstants.processFieldTitlePlaceholder)}
							className="h-9 text-xs bg-white border-slate-200 text-slate-900"
							required
						/>
					</div>

					<div className="space-y-1">
						<Label className="text-[11px] font-medium text-slate-500">
							<Translate text={localizationConstants.processFieldDate} />
						</Label>
						<Input
							type="date"
							value={date}
							onChange={(e) => onDateChange(e.target.value)}
							className="h-9 text-xs bg-white border-slate-200 text-slate-900 font-mono"
							required
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
