"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Translate } from "@/utils/translation/translate";
import { useTranslation } from "react-i18next";
import localizationConstants from "@/utils/translation/constants";
import {
	KNOWN_AUTHORITIES_LIST,
	AUTHORITY_CATEGORIES_LIST,
} from "../../constants/authorities.constants";
import type { AuthorityFormData } from "../../types/authorities.types";

interface AuthorityBasicStepProps {
	formData: AuthorityFormData;
	errors: Record<string, string>;
	onChange: (data: AuthorityFormData) => void;
	onClearError: (field: string) => void;
}

export function AuthorityBasicStep({
	formData,
	errors,
	onChange,
	onClearError,
}: AuthorityBasicStepProps) {
	const { t } = useTranslation();

	const updateField = <K extends keyof AuthorityFormData>(
		key: K,
		val: AuthorityFormData[K],
	) => {
		onChange({ ...formData, [key]: val });
		if (errors[key]) {
			onClearError(key);
		}
	};

	return (
		<div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-5">
			<div>
				<h3 className="text-sm font-semibold text-slate-900 mb-1">
					<Translate text={localizationConstants.tabGrundlaggandeInfo} />
				</h3>
				<p className="text-xs text-slate-500">
					Ange grundläggande uppgifter för myndighetsärendet.
				</p>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				{/* ID / Ärendenummer */}
				<div>
					<Label className="text-xs font-semibold text-slate-700 mb-1.5 block">
						<Translate text={localizationConstants.colAuthorityId} />
					</Label>
					<Input
						type="text"
						value={formData.caseNr || ""}
						onChange={(e) => updateField("caseNr", e.target.value)}
						placeholder="001"
						className="h-10 bg-white border-slate-200 text-sm rounded-lg"
					/>
				</div>

				{/* Myndighet Name */}
				<div>
					<Label className="text-xs font-semibold text-slate-700 mb-1.5 block">
						<Translate text={localizationConstants.fieldAuthorityName} /> *
					</Label>
					<select
						value={formData.authorityName || "Skatteverket"}
						onChange={(e) => updateField("authorityName", e.target.value)}
						className={`h-10 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 ${
							errors.authorityName ? "border-rose-500" : "border-slate-200"
						}`}
					>
						{KNOWN_AUTHORITIES_LIST.map((auth) => (
							<option key={auth} value={auth}>
								{auth}
							</option>
						))}
					</select>
					{errors.authorityName && (
						<p className="text-xs text-rose-500 mt-1">{errors.authorityName}</p>
					)}
				</div>

				{/* Kategori */}
				<div>
					<Label className="text-xs font-semibold text-slate-700 mb-1.5 block">
						<Translate text={localizationConstants.fieldAuthorityCategory} /> *
					</Label>
					<select
						value={formData.category || "Govt Docs"}
						onChange={(e) =>
							updateField(
								"category",
								e.target.value as AuthorityFormData["category"],
							)
						}
						className={`h-10 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 ${
							errors.category ? "border-rose-500" : "border-slate-200"
						}`}
					>
						{AUTHORITY_CATEGORIES_LIST.map((cat) => (
							<option key={cat} value={cat}>
								{cat}
							</option>
						))}
					</select>
					{errors.category && (
						<p className="text-xs text-rose-500 mt-1">{errors.category}</p>
					)}
				</div>

				{/* Datum */}
				<div>
					<Label className="text-xs font-semibold text-slate-700 mb-1.5 block">
						<Translate text={localizationConstants.colAuthorityDate} />
					</Label>
					<Input
						type="date"
						value={formData.date || ""}
						onChange={(e) => updateField("date", e.target.value)}
						className="h-10 bg-white border-slate-200 text-sm rounded-lg"
					/>
				</div>

				{/* Dokumentets namn / Ämne */}
				<div className="sm:col-span-2">
					<Label className="text-xs font-semibold text-slate-700 mb-1.5 block">
						<Translate text={localizationConstants.fieldAuthorityDocumentName} /> *
					</Label>
					<Input
						type="text"
						value={formData.documentName || ""}
						onChange={(e) => {
							updateField("documentName", e.target.value);
							updateField("subject", e.target.value);
						}}
						placeholder="info"
						className={`h-10 bg-white border text-sm rounded-lg ${
							errors.documentName ? "border-rose-500" : "border-slate-200"
						}`}
					/>
					{errors.documentName && (
						<p className="text-xs text-rose-500 mt-1">{errors.documentName}</p>
					)}
				</div>

				{/* Ansvarig */}
				<div>
					<Label className="text-xs font-semibold text-slate-700 mb-1.5 block">
						<Translate text={localizationConstants.fieldAuthorityResponsible} />
					</Label>
					<Input
						type="text"
						value={formData.responsiblePerson || ""}
						onChange={(e) => updateField("responsiblePerson", e.target.value)}
						placeholder="Erik Eriksson"
						className="h-10 bg-white border-slate-200 text-sm rounded-lg"
					/>
				</div>

				{/* Status */}
				<div>
					<Label className="text-xs font-semibold text-slate-700 mb-1.5 block">
						<Translate text={localizationConstants.fieldAuthorityStatus} />
					</Label>
					<select
						value={formData.status || "pending"}
						onChange={(e) =>
							updateField("status", e.target.value as AuthorityFormData["status"])
						}
						className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
					>
						<option value="pending">{t(localizationConstants.statusPending)}</option>
						<option value="submitted">{t(localizationConstants.statusSubmitted)}</option>
						<option value="approved">{t(localizationConstants.statusApproved)}</option>
						<option value="action_required">{t(localizationConstants.statusActionRequired)}</option>
					</select>
				</div>

				{/* Referensnummer */}
				<div>
					<Label className="text-xs font-semibold text-slate-700 mb-1.5 block">
						<Translate text={localizationConstants.fieldAuthorityReference} />
					</Label>
					<Input
						type="text"
						value={formData.referenceNumber || ""}
						onChange={(e) => updateField("referenceNumber", e.target.value)}
						placeholder="SKV-2025-001"
						className="h-10 bg-white border-slate-200 text-sm rounded-lg"
					/>
				</div>

				{/* Deadline */}
				<div>
					<Label className="text-xs font-semibold text-slate-700 mb-1.5 block">
						<Translate text={localizationConstants.fieldAuthorityDeadline} />
					</Label>
					<Input
						type="date"
						value={formData.dueDate || ""}
						onChange={(e) => updateField("dueDate", e.target.value)}
						className="h-10 bg-white border-slate-200 text-sm rounded-lg"
					/>
				</div>

				{/* Beskrivning */}
				<div className="sm:col-span-2">
					<Label className="text-xs font-semibold text-slate-700 mb-1.5 block">
						<Translate text={localizationConstants.fieldAuthorityDescription} />
					</Label>
					<Textarea
						value={formData.subject || ""}
						onChange={(e) => updateField("subject", e.target.value)}
						placeholder="Beskrivning av ärendet..."
						rows={3}
						className="bg-white border-slate-200 text-sm rounded-lg resize-none"
					/>
				</div>
			</div>
		</div>
	);
}

export default AuthorityBasicStep;
