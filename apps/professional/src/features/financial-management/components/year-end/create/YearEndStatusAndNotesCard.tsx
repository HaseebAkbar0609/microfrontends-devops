"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Translate } from "@/utils/translation/translate";
import { useTranslation } from "react-i18next";
import localizationConstants from "@/utils/translation/constants";
import type { YearEndStatus } from "../../../types/yearEnd.types";
import { getYearEndStatusLabel } from "../../../utils/yearEndLocalization";

interface YearEndStatusAndNotesCardProps {
	status: YearEndStatus;
	onStatusChange: (status: YearEndStatus) => void;
	notes: string;
	onNotesChange: (notes: string) => void;
}

export function YearEndStatusAndNotesCard({
	status,
	onStatusChange,
	notes,
	onNotesChange,
}: YearEndStatusAndNotesCardProps) {
	const { t } = useTranslation();

	return (
		<div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
			<div className="px-6 py-4 border-b border-slate-100 bg-white">
				<h2 className="text-sm font-bold text-slate-900">
					<Translate text={localizationConstants.sectionAdditionalInfoYearEnd} />
				</h2>
			</div>

			<div className="p-6 space-y-4 text-xs">
				{/* Status Dropdown */}
				<div>
					<Label className="text-xs font-semibold text-slate-700 mb-1.5 block">
						<Translate text={localizationConstants.colStatus} />
					</Label>
					<select
						value={status}
						onChange={(e) => onStatusChange(e.target.value as YearEndStatus)}
						className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400 cursor-pointer shadow-2xs"
					>
						<option value="completed">{getYearEndStatusLabel("completed", t)}</option>
						<option value="in_progress">{getYearEndStatusLabel("in_progress", t)}</option>
						<option value="not_started">{getYearEndStatusLabel("not_started", t)}</option>
					</select>
				</div>

				{/* Notes Textarea */}
				<div>
					<Label className="text-xs font-semibold text-slate-700 mb-1.5 block">
						<Translate text={localizationConstants.fieldNotes} />
					</Label>
					<Textarea
						value={notes}
						onChange={(e) => onNotesChange(e.target.value)}
						placeholder={t(localizationConstants.notesPlaceholderYearEnd)}
						rows={4}
						className="text-xs rounded-lg border-slate-200 resize-none focus-visible:ring-1 focus-visible:ring-slate-400"
					/>
				</div>
			</div>
		</div>
	);
}

export default YearEndStatusAndNotesCard;
