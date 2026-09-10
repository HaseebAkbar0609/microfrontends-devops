"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Building2 } from "lucide-react";
import { useAuthStatus } from "@/context/AuthContext";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { getCompanyInfo } from "../services/companyService";
import type { CompanyInfo } from "../types";

const CompanyInfoTab = () => {
	const { company } = useAuthStatus();
	const [info, setInfo] = useState<CompanyInfo | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	useEffect(() => {
		let cancelled = false;
		if (!company?.id) {
			setLoading(false);
			return;
		}
		setLoading(true);
		setError(false);
		getCompanyInfo(company.id)
			.then((data) => !cancelled && setInfo(data))
			.catch(() => !cancelled && setError(true))
			.finally(() => !cancelled && setLoading(false));
		return () => {
			cancelled = true;
		};
	}, [company?.id]);

	if (loading) {
		return <div className="h-40 animate-pulse rounded-xl bg-slate-100" aria-label="Loading company information" />;
	}

	if (error || !info) {
		return (
			<div className="flex min-h-48 flex-col items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-6 text-center text-red-700">
				<AlertCircle className="h-6 w-6" />
				<p>Company information could not be loaded.</p>
			</div>
		);
	}

	const fields = [
		{ label: localizationConstants.companyInfoName, value: info.company_name },
		{ label: localizationConstants.companyInfoOrgNr, value: info.organization_number || "—" },
		{ label: localizationConstants.offerQuotedCategory, value: info.category_info?.name || "—" },
	];

	return (
		<section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
			<header className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-slate-50 px-6 py-5">
				<span className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-600"><Building2 className="h-5 w-5" /></span>
				<div><h2 className="text-lg font-semibold text-slate-900">{info.company_name}</h2><p className="text-sm text-slate-500"><Translate text={localizationConstants.companyTabInfo} /></p></div>
			</header>
			<div className="grid grid-cols-1 gap-6 px-6 py-6 sm:grid-cols-2 lg:grid-cols-3">
				{fields.map((field) => (
					<div key={field.label} className="rounded-lg border border-slate-100 bg-slate-50/60 p-4">
						<p className="text-xs font-semibold uppercase tracking-wide text-slate-500"><Translate text={field.label} /></p>
						<p className="mt-2 break-words text-sm font-medium text-slate-900">{field.value}</p>
					</div>
				))}
			</div>
		</section>
	);
};

export default CompanyInfoTab;
