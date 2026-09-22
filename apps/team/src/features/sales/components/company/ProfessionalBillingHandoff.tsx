"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import axios from "@/lib/axiosInstance";
import { Button } from "@/components/ui/button";
import {
	Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { useSalesCompanies } from "../../hooks/useSalesCompanies";
import type { SalesCompany } from "../../types";

type ProfessionalAccount = {
	company_id: string;
	company_name: string | null;
	organization_number: string | null;
};

function digits(value: string | null | undefined) {
	return (value ?? "").replace(/\D/g, "");
}

async function findMatchingAccounts(organisationNumber: string) {
	const matches = new Map<string, ProfessionalAccount>();
	for (const search of new Set([organisationNumber, digits(organisationNumber)])) {
		const response = await axios.get<{ data: ProfessionalAccount[] }>(
			"/api/v1/teams/professionals/accounts",
			{ params: { search, page: 1, page_size: 100 } },
		);
		for (const item of response.data.data) {
			if (digits(item.organization_number) === digits(organisationNumber)) {
				matches.set(item.company_id, item);
			}
		}
	}
	return [...matches.values()];
}

export function ProfessionalBillingHandoff({ company }: { company: SalesCompany }) {
	const t = useTranslate();
	const { linkProfessional } = useSalesCompanies();
	const [selected, setSelected] = useState("");
	const [busy, setBusy] = useState(false);
	const accounts = useQuery({
		queryKey: ["sales-professional-accounts", company.organisationNumber],
		queryFn: () => findMatchingAccounts(company.organisationNumber),
		enabled: !company.professionalCompanyId && digits(company.organisationNumber).length > 0,
	});

	if (company.professionalCompanyId) {
		return (
			<Button asChild className="w-full">
				<Link href={`/customers/professional/${company.professionalCompanyId}`}>
					<Translate text={localizationConstants.salesOpenBillingButton} />
				</Link>
			</Button>
		);
	}

	return (
		<div className="space-y-3">
			<label className="text-sm font-medium text-slate-700">
				<Translate text={localizationConstants.salesLinkProfessionalLabel} />
			</label>
			{accounts.data?.length ? (
				<>
					<Select value={selected} onValueChange={setSelected}>
						<SelectTrigger className="w-full" aria-label={t(localizationConstants.salesLinkProfessionalLabel)}>
							<SelectValue placeholder={t(localizationConstants.salesLinkProfessionalLabel)} />
						</SelectTrigger>
						<SelectContent>
							{accounts.data.map((item) => (
								<SelectItem key={item.company_id} value={item.company_id}>
									{item.company_name} ({item.organization_number})
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Button disabled={!selected || busy} onClick={async () => {
						setBusy(true);
						try { await linkProfessional(company.id, selected); }
						finally { setBusy(false); }
					}} className="w-full">
						<Translate text={localizationConstants.salesLinkProfessionalButton} />
					</Button>
				</>
			) : (
				<p className="text-sm text-slate-500">
					<Translate text={accounts.isError ? localizationConstants.salesRecordLoadFailed : localizationConstants.salesNoMatchingProfessional} />
				</p>
			)}
			<Button asChild variant="outline" className="w-full">
				<Link href="/customers/professional">
					<Translate text={localizationConstants.salesCreateProfessionalButton} />
				</Link>
			</Button>
		</div>
	);
}
