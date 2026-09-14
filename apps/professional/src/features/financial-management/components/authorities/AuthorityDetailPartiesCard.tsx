"use client";

import React from "react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { AuthorityPartyContact } from "../../types/authorities.types";

interface AuthorityDetailPartiesCardProps {
	customer?: AuthorityPartyContact;
	supplier?: AuthorityPartyContact;
}

export function AuthorityDetailPartiesCard({
	customer,
	supplier,
}: AuthorityDetailPartiesCardProps) {
	const defaultCustomer: AuthorityPartyContact = {
		companyName: "Acme Corporation AB",
		contactPerson: "Anna Andersson",
		address: "Storgatan 12",
		postalCodeCity: "111 22 Stockholm",
		email: "ekonomi@acme.se",
		phone: "08-123 456 78",
	};

	const defaultSupplier: AuthorityPartyContact = {
		companyName: "Cleaning Services AB",
		contactPerson: "Erik Eriksson",
		address: "Industrivägen 4B",
		postalCodeCity: "123 45 Solna",
		email: "info@cleaningservices.se",
		phone: "08-987 654 32",
	};

	const cust = customer || defaultCustomer;
	const supp = supplier || defaultSupplier;

	return (
		<div className="p-6 border-b border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/40">
			{/* Customer */}
			<div className="space-y-2">
				<span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
					<Translate text={localizationConstants.partyCustomer} />
				</span>
				<div className="text-xs text-slate-700 space-y-1">
					<p className="font-bold text-slate-900 text-sm">{cust.companyName}</p>
					{cust.contactPerson && <p>Att: {cust.contactPerson}</p>}
					{cust.address && <p>{cust.address}</p>}
					{cust.postalCodeCity && <p>{cust.postalCodeCity}</p>}
					{cust.email && <p className="text-slate-500">{cust.email}</p>}
					{cust.phone && <p className="text-slate-500">{cust.phone}</p>}
				</div>
			</div>

			{/* Supplier */}
			<div className="space-y-2">
				<span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
					<Translate text={localizationConstants.partySupplier} />
				</span>
				<div className="text-xs text-slate-700 space-y-1">
					<p className="font-bold text-slate-900 text-sm">{supp.companyName}</p>
					{supp.contactPerson && <p>Att: {supp.contactPerson}</p>}
					{supp.address && <p>{supp.address}</p>}
					{supp.postalCodeCity && <p>{supp.postalCodeCity}</p>}
					{supp.email && <p className="text-slate-500">{supp.email}</p>}
					{supp.phone && <p className="text-slate-500">{supp.phone}</p>}
				</div>
			</div>
		</div>
	);
}

export default AuthorityDetailPartiesCard;
