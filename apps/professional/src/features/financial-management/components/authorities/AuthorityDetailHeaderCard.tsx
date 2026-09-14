"use client";

import React from "react";
import { Building2 } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { AuthorityItem } from "../../types/authorities.types";

interface AuthorityDetailHeaderCardProps {
	authority: AuthorityItem;
}

export function AuthorityDetailHeaderCard({
	authority,
}: AuthorityDetailHeaderCardProps) {
	return (
		<div className="p-6 border-b border-slate-200">
			<div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
				{/* Company Info / Logo */}
				<div className="flex items-center gap-3">
					<div className="h-12 w-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-sm">
						<Building2 className="h-6 w-6" />
					</div>
					<div>
						<h2 className="text-base font-bold text-slate-900">
							{authority.supplier?.companyName || "Cleaning Services AB"}
						</h2>
						<p className="text-xs text-slate-500">
							{authority.authorityName} • {authority.category}
						</p>
					</div>
				</div>

				{/* Document Identifier */}
				<div className="sm:text-right">
					<span className="inline-block px-2.5 py-1 rounded bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider mb-1">
						{authority.documentName || "Ärende"}
					</span>
					<div className="text-lg font-bold text-slate-900">
						#{authority.caseNr || authority.id}
					</div>
				</div>
			</div>

			{/* Metadata Grid */}
			<div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-4 border-t border-slate-100 text-xs">
				<div>
					<span className="text-slate-400 block font-medium">
						<Translate text={localizationConstants.colAuthorityDate} />
					</span>
					<span className="text-slate-800 font-semibold">{authority.date || "2025-05-15"}</span>
				</div>
				<div>
					<span className="text-slate-400 block font-medium">
						<Translate text={localizationConstants.fieldAuthorityDeadline} />
					</span>
					<span className="text-slate-800 font-semibold">{authority.dueDate || "2025-06-15"}</span>
				</div>
				<div>
					<span className="text-slate-400 block font-medium">
						<Translate text={localizationConstants.fieldAuthorityPaymentTerms} />
					</span>
					<span className="text-slate-800 font-semibold">
						{authority.paymentTerms || "30 dagar netto"}
					</span>
				</div>
				<div>
					<span className="text-slate-400 block font-medium">
						<Translate text={localizationConstants.fieldAuthorityReference} />
					</span>
					<span className="text-slate-800 font-semibold">
						{authority.referenceNumber || authority.responsiblePerson || "SKV-9921"}
					</span>
				</div>
			</div>
		</div>
	);
}

export default AuthorityDetailHeaderCard;
