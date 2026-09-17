"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Translate } from "@/utils/translation/translate";
import { useTranslation } from "react-i18next";
import localizationConstants from "@/utils/translation/constants";
import {
	KNOWN_AUTHORITIES_LIST,
} from "../../../constants/authorities.constants";
import {
	getAuthorityCategoryLabel,
	type AuthorityCategoryOption,
	AUTHORITY_CATEGORY_OPTIONS,
} from "../../../utils/authoritiesLocalization";
import type { AuthorityCategory } from "../../../types/authorities.types";

interface AuthorityBasicInfoCardProps {
	authorityName: string;
	onAuthorityNameChange: (val: string) => void;
	category: AuthorityCategory;
	onCategoryChange: (cat: AuthorityCategory) => void;
	date: string;
	onDateChange: (val: string) => void;
	documentName: string;
	onDocumentNameChange: (val: string) => void;
	referenceNumber: string;
	onReferenceNumberChange: (val: string) => void;
	responsiblePerson: string;
	onResponsiblePersonChange: (val: string) => void;
	errorMessage?: string;
}

export function AuthorityBasicInfoCard({
	authorityName,
	onAuthorityNameChange,
	category,
	onCategoryChange,
	date,
	onDateChange,
	documentName,
	onDocumentNameChange,
	referenceNumber,
	onReferenceNumberChange,
	responsiblePerson,
	onResponsiblePersonChange,
	errorMessage,
}: AuthorityBasicInfoCardProps) {
	const { t } = useTranslation();

	return (
		<div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
			<div className="px-6 py-4 border-b border-slate-100 bg-white">
				<h2 className="text-sm font-bold text-slate-900">
					<Translate text={localizationConstants.sectionBasicInfoAuthority} />
				</h2>
			</div>

			<div className="p-6 space-y-4 text-xs">
				{/* Authority & Category */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<Label className="text-xs font-semibold text-slate-700 mb-1.5 block">
							<Translate text={localizationConstants.fieldAuthorityName} />{" "}
							<span className="text-rose-500">*</span>
						</Label>
						<select
							value={authorityName}
							onChange={(e) => onAuthorityNameChange(e.target.value)}
							className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400 cursor-pointer shadow-2xs"
						>
							{KNOWN_AUTHORITIES_LIST.map((auth) => (
								<option key={auth} value={auth}>
									{auth}
								</option>
							))}
						</select>
					</div>

					<div>
						<Label className="text-xs font-semibold text-slate-700 mb-1.5 block">
							<Translate text={localizationConstants.fieldAuthorityCategory} />{" "}
							<span className="text-rose-500">*</span>
						</Label>
						<select
							value={category}
							onChange={(e) => onCategoryChange(e.target.value as AuthorityCategory)}
							className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400 cursor-pointer shadow-2xs"
						>
							{AUTHORITY_CATEGORY_OPTIONS.map((opt: AuthorityCategoryOption) => (
								<option key={opt.value} value={opt.value}>
									{getAuthorityCategoryLabel(opt.value, t)}
								</option>
							))}
						</select>
					</div>
				</div>

				{/* Document Name & Date */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<Label className="text-xs font-semibold text-slate-700 mb-1.5 block">
							<Translate text={localizationConstants.fieldAuthorityDocumentName} />{" "}
							<span className="text-rose-500">*</span>
						</Label>
						<Input
							type="text"
							value={documentName}
							onChange={(e) => onDocumentNameChange(e.target.value)}
							placeholder={t(localizationConstants.fieldAuthoritySubject)}
							className={`h-10 text-xs rounded-lg ${
								errorMessage
									? "border-rose-500 focus-visible:ring-rose-400"
									: "border-slate-200"
							}`}
						/>
						{errorMessage && (
							<p className="text-[11px] text-rose-500 mt-1">{errorMessage}</p>
						)}
					</div>

					<div>
						<Label className="text-xs font-semibold text-slate-700 mb-1.5 block">
							<Translate text={localizationConstants.colAuthorityDate} />
						</Label>
						<Input
							type="date"
							value={date}
							onChange={(e) => onDateChange(e.target.value)}
							className="h-10 text-xs border-slate-200 rounded-lg"
						/>
					</div>
				</div>

				{/* Reference / Case Number & Responsible Person */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<Label className="text-xs font-semibold text-slate-700 mb-1.5 block">
							<Translate text={localizationConstants.fieldAuthorityReference} />
						</Label>
						<Input
							type="text"
							value={referenceNumber}
							onChange={(e) => onReferenceNumberChange(e.target.value)}
							placeholder="SKV-2025-001"
							className="h-10 text-xs border-slate-200 rounded-lg"
						/>
					</div>

					<div>
						<Label className="text-xs font-semibold text-slate-700 mb-1.5 block">
							<Translate text={localizationConstants.fieldAuthorityResponsible} />
						</Label>
						<Input
							type="text"
							value={responsiblePerson}
							onChange={(e) => onResponsiblePersonChange(e.target.value)}
							placeholder="Erik Eriksson"
							className="h-10 text-xs border-slate-200 rounded-lg"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default AuthorityBasicInfoCard;
