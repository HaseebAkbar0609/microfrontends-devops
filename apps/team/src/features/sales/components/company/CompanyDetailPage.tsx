"use client";

import { useCallback } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { SALES_CRM_HREF } from "../../constants/salesNav";
import { SALES_HEADER_GRADIENT_CLASS } from "../../constants/salesTheme";
import { SALES_STATUSES } from "../../constants/salesStatuses";
import {
	getSalesCategoryLabelKey,
	getSalesRegionLabelKey,
} from "../../constants/salesTaxonomy";
import { useSalesCompanies } from "../../hooks/useSalesCompanies";
import type { SalesCompany, SalesCompanyStatus } from "../../types";
import { SalesNotFound } from "../SalesNotFound";
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

	const categoryKey = getSalesCategoryLabelKey(company.category);
	const regionKey = getSalesRegionLabelKey(company.region);
	const description = [
		categoryKey ? t(categoryKey) : null,
		regionKey ? t(regionKey) : null,
		company.trade || null,
	]
		.filter(Boolean)
		.join(" · ");

	return (
		<div className="@container flex min-h-0 flex-1 flex-col overflow-y-auto bg-slate-50">
			<header
				className={`flex flex-wrap items-end justify-between gap-4 px-6 py-5 text-white ${SALES_HEADER_GRADIENT_CLASS}`}
			>
				<div className="min-w-0">
					<Link
						href={SALES_CRM_HREF}
						className="inline-flex items-center gap-2 text-sm text-white/80 transition-colors hover:text-white"
					>
						<ArrowLeft className="h-4 w-4" />
						<Translate text={localizationConstants.salesBackToCrmButton} />
					</Link>
					<h1 className="mt-1 truncate text-2xl font-semibold">
						{company.name || t(localizationConstants.salesUnnamedCompany)}
					</h1>
					{description && (
						<p className="truncate text-sm text-white/80">{description}</p>
					)}
				</div>

				<Select
					value={company.status}
					onValueChange={(value) =>
						handleChange({ status: value as SalesCompanyStatus })
					}
				>
					<SelectTrigger
						aria-label={t(localizationConstants.salesStatusSelectLabel)}
						className="h-10 w-48 bg-white text-slate-900"
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
			</header>

			<div className="@container grid gap-5 px-6 py-6 @4xl:grid-cols-[minmax(0,1fr)_360px]">
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
