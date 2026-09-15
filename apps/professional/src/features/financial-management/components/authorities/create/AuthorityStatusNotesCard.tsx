"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Translate } from "@/utils/translation/translate";
import { useTranslation } from "react-i18next";
import localizationConstants from "@/utils/translation/constants";
import type { AuthorityStatus } from "../../../types/authorities.types";
import { getAuthorityStatusLabel } from "../../../utils/authoritiesLocalization";

interface AuthorityStatusNotesCardProps {
	status: AuthorityStatus;
	onStatusChange: (status: AuthorityStatus) => void;
	notes: string;
	onNotesChange: (notes: string) => void;
}

export function AuthorityStatusNotesCard({
	status,
	onStatusChange,
	notes,
	onNotesChange,
}: AuthorityStatusNotesCardProps) {
	const { t } = useTranslation();

	return (
		<div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
			<div className="px-6 py-4 border-b border-slate-100 bg-white">
				<h2 className="text-sm font-bold text-slate-900">
					<Translate text={localizationConstants.sectionStatusNotesAuthority} />
				</h2>
			</div>

			<div className="p-6 space-y-4 text-xs">
				{/* Status Dropdown */}
				<div>
					<Label className="text-xs font-semibold text-slate-700 mb-1.5 block">
						<Translate text={localizationConstants.fieldAuthorityStatus} />
					</Label>
					<select
						value={status}
						onChange={(e) => onStatusChange(e.target.value as AuthorityStatus)}
						className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400 cursor-pointer shadow-2xs"
					>
						<option value="pending">{getAuthorityStatusLabel("pending", t)}</option>
						<option value="submitted">{getAuthorityStatusLabel("submitted", t)}</option>
						<option value="approved">{getAuthorityStatusLabel("approved", t)}</option>
						<option value="action_required">{getAuthorityStatusLabel("action_required", t)}</option>
					</select>
				</div>

				{/* Notes / Description */}
				<div>
					<Label className="text-xs font-semibold text-slate-700 mb-1.5 block">
						<Translate text={localizationConstants.fieldAuthorityDescription} />
					</Label>
					<Textarea
						value={notes}
						onChange={(e) => onNotesChange(e.target.value)}
						placeholder={t(localizationConstants.notesPlaceholderAuthority)}
						rows={4}
						className="text-xs rounded-lg border-slate-200 resize-none focus-visible:ring-1 focus-visible:ring-slate-400"
					/>
				</div>
			</div>
		</div>
	);
}

export default AuthorityStatusNotesCard;
