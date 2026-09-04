"use client";

import { useCallback } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { SALES_STATUSES } from "../../constants/salesStatuses";
import {
	getSalesCategoryLabelKey,
	getSalesRegionLabelKey,
} from "../../constants/salesTaxonomy";
import { useSalesCompanies } from "../../hooks/useSalesCompanies";
import type { SalesCompany, SalesCompanyStatus } from "../../types";
import { SalesNotFound } from "../SalesNotFound";
import { SalesPageHeader } from "../SalesPageHeader";
import { CompanyActivityLogCard } from "./CompanyActivityLogCard";
import { CompanyCreditsafeCard } from "./CompanyCreditsafeCard";
import { CompanyDetailsCard } from "./CompanyDetailsCard";
import { CompanyDocumentsCard } from "./CompanyDocumentsCard";
import {
	CompanyKeyFiguresCard,
	CompanyNotesCard,
	CompanyOwnersCard,
} from "./CompanyKeyFiguresCard";
import { CompanyNextStepCard } from "./CompanyNextStepCard";
import { TrialAccountsCard } from "./TrialAccountsCard";

type CompanyDetailPageProps = {
	companyId: string;
};

function CompanySubtitle({ company }: { company: SalesCompany }) {
	const categoryKey = getSalesCategoryLabelKey(company.category);
	const regionKey = getSalesRegionLabelKey(company.region);
	const parts = [
		categoryKey ? <Translate key="category" text={categoryKey} /> : null,
		regionKey ? <Translate key="region" text={regionKey} /> : null,
		company.trade ? <span key="trade">{company.trade}</span> : null,
	].filter(Boolean);

	if (parts.length === 0) return null;

	return (
		<p className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
			{parts.map((part, index) => (
				<span key={index} className="inline-flex items-center gap-1.5">
					{index > 0 ? <span aria-hidden>·</span> : null}
					{part}
				</span>
			))}
		</p>
	);
}

export default function CompanyDetailPage({
	companyId,
}: CompanyDetailPageProps) {
	const { getCompany, updateCompany } = useSalesCompanies();
	const t = useTranslate();
	const company = getCompany(companyId);

	const handleChange = useCallback(
		(patch: Partial<SalesCompany>) => updateCompany(companyId, patch),
		[companyId, updateCompany],
	);

	if (!company) {
		return (
			<SalesNotFound
				titleKey={localizationConstants.salesCompanyNotFoundTitle}
			/>
		);
	}

	return (
		<div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto bg-white px-6 py-6">
			<SalesPageHeader
				title={
					company.name || t(localizationConstants.salesUnnamedCompany)
				}
				subtitle={<CompanySubtitle company={company} />}
				trail={[{ label: company.name || companyId }]}
				actions={
					<Select
						value={company.status}
						onValueChange={(value) =>
							handleChange({ status: value as SalesCompanyStatus })
						}
					>
						<SelectTrigger
							aria-label={t(localizationConstants.salesStatusSelectLabel)}
							className="h-10 w-48"
						>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{SALES_STATUSES.map((status) => (
								<SelectItem key={status.id} value={status.id}>
									<Translate text={status.labelKey} />
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				}
			/>

			<div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
				<div className="flex flex-col gap-5">
					<CompanyDetailsCard company={company} onChange={handleChange} />
					<CompanyKeyFiguresCard company={company} onChange={handleChange} />
					<CompanyCreditsafeCard company={company} onChange={handleChange} />
					<CompanyActivityLogCard company={company} onChange={handleChange} />
					<CompanyOwnersCard company={company} onChange={handleChange} />
					<CompanyNotesCard company={company} onChange={handleChange} />
				</div>

				<aside className="flex flex-col gap-5">
					<CompanyNextStepCard company={company} onChange={handleChange} />
					<CompanyDocumentsCard company={company} />
					<TrialAccountsCard
						company={company}
						kind="demo"
						onChange={handleChange}
					/>
					<TrialAccountsCard
						company={company}
						kind="test"
						onChange={handleChange}
					/>
				</aside>
			</div>
		</div>
	);
}
