"use client";

import React from "react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { AuthorityCompanyDetails } from "../../types/authorities.types";

interface AuthorityDetailCompanyFooterProps {
	companyDetails?: AuthorityCompanyDetails;
}

export function AuthorityDetailCompanyFooter({
	companyDetails,
}: AuthorityDetailCompanyFooterProps) {
	const defaultCompany: AuthorityCompanyDetails = {
		companyName: "Cleaning Services AB",
		address: "Industrivägen 4B, 123 45 Solna",
		vatNumber: "SE556123456701",
		orgNumber: "556123-4567",
		fTax: true,
		bankName: "Handelsbanken",
		bankNumber: "Bankgiro 123-4567",
		iban: "SE12 6000 0000 0001 2345 6789",
		bic: "HANDSEXX",
		swishNumber: "123 456 78 90",
		email: "info@cleaningservices.se",
		phone: "08-987 654 32",
	};

	const company = companyDetails || defaultCompany;

	return (
		<div className="p-6 bg-slate-50/70 border-t border-slate-200">
			<h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4">
				<Translate text={localizationConstants.authorityCompanyDetails} />
			</h4>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs text-slate-600">
				{/* Postadress */}
				<div className="space-y-1">
					<p className="font-bold text-slate-900">{company.companyName}</p>
					<p>{company.address}</p>
					<p>Sverige</p>
				</div>

				{/* Org & Moms */}
				<div className="space-y-1">
					<p>
						<span className="font-semibold text-slate-700">Org.nr:</span>{" "}
						{company.orgNumber}
					</p>
					<p>
						<span className="font-semibold text-slate-700">Momsreg.nr:</span>{" "}
						{company.vatNumber}
					</p>
					<p className="text-emerald-700 font-semibold flex items-center gap-1 mt-1">
						✓ Godkänd för F-skatt
					</p>
				</div>

				{/* Bankgiro & Swish */}
				<div className="space-y-1">
					<p>
						<span className="font-semibold text-slate-700">{company.bankName}</span>
					</p>
					<p>{company.bankNumber}</p>
					{company.swishNumber && (
						<p>
							<span className="font-semibold text-slate-700">Swish:</span>{" "}
							{company.swishNumber}
						</p>
					)}
				</div>

				{/* IBAN & Kontakt */}
				<div className="space-y-1">
					<p className="font-mono text-[11px] truncate">IBAN: {company.iban}</p>
					<p className="font-mono text-[11px]">BIC: {company.bic}</p>
					<p className="text-slate-500 pt-1">{company.email}</p>
				</div>
			</div>
		</div>
	);
}

export default AuthorityDetailCompanyFooter;
