"use client";

import { useMemo, useState } from "react";
import {
	ActionsToolbar,
	type FilterConfig,
} from "@/components/table/ActionsToolbar";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import {
	SALES_MODULE_TABS,
	SALES_MODULE_TITLE_KEY,
	SALES_OVERVIEW_BREADCRUMBS,
} from "./constants/salesNav";
import {
	SALES_CATEGORIES,
	SALES_REGIONS,
} from "./constants/salesTaxonomy";
import { useSalesCompanies } from "./hooks/useSalesCompanies";
import { useSalesCompanyFilters } from "./hooks/useSalesCompanyFilters";
import { CreateCompanyDialog } from "./components/CreateCompanyDialog";
import { CsvImportExportActions } from "./components/CsvImportExportActions";
import { ModulePageHeader } from "@/components/layout/navigation";
import { SalesCompanyTable } from "./components/SalesCompanyTable";
import { SalesStatusSummaryCards } from "./components/SalesStatusSummaryCards";
import { formatCurrency, getInvoicedAmount } from "./utils/salesFormatters";

export default function SalesCrmPage() {
	const { companies, updateCompany } = useSalesCompanies();
	const {
		statusFilter,
		query,
		category,
		region,
		sort,
		counts,
		visibleCompanies,
		setQuery,
		setCategory,
		setRegion,
		toggleStatusFilter,
		toggleSort,
	} = useSalesCompanyFilters(companies);
	const [isCreateOpen, setIsCreateOpen] = useState(false);

	const invoicedTotal = useMemo(
		() =>
			visibleCompanies.reduce(
				(total, company) => total + getInvoicedAmount(company),
				0,
			),
		[visibleCompanies],
	);

	const filters = useMemo<FilterConfig[]>(
		() => [
			{
				label: localizationConstants.salesFilterCategoryLabel,
				value: category,
				onFilterChange: setCategory,
				options: SALES_CATEGORIES.map((option) => ({
					label: option.labelKey,
					value: option.id,
				})),
			},
			{
				label: localizationConstants.salesFilterRegionLabel,
				value: region,
				onFilterChange: setRegion,
				options: SALES_REGIONS.map((option) => ({
					label: option.labelKey,
					value: option.id,
				})),
			},
		],
		[category, region, setCategory, setRegion],
	);

	return (
		<div className="@container flex min-h-0 flex-1 flex-col overflow-y-auto bg-white">
			<ModulePageHeader
				title={SALES_MODULE_TITLE_KEY}
				tabs={SALES_MODULE_TABS}
				breadcrumbs={SALES_OVERVIEW_BREADCRUMBS}
			/>

			<div className="flex flex-col gap-5 px-5 py-5">
				<div className="flex flex-wrap items-center justify-between gap-3">
					<p className="text-sm text-slate-500">
						<Translate text={localizationConstants.salesCrmSubtitle} />
					</p>
					<CsvImportExportActions />
				</div>

				<SalesStatusSummaryCards
					counts={counts}
					activeFilter={statusFilter}
					onFilterChange={toggleStatusFilter}
				/>

				<section className="rounded-xl border border-slate-200 bg-white shadow-2xs">
					<div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-200 px-5 pt-5">
						<h2 className="text-base font-semibold text-slate-900">
							<Translate text={localizationConstants.salesCompaniesTitle} />
						</h2>
						<p className="pb-4 text-xs text-slate-500">
							<Translate
								text={localizationConstants.salesInvoicedInSelection}
							/>
							{": "}
							<span className="font-medium tabular-nums text-slate-700">
								{formatCurrency(invoicedTotal)}
							</span>
						</p>
					</div>

					<ActionsToolbar
						className="flex-wrap gap-y-3"
						searchValue={query}
						onSearchChange={setQuery}
						searchPlaceholder={localizationConstants.salesSearchPlaceholder}
						filters={filters}
						onCreateClick={() => setIsCreateOpen(true)}
						createButtonLabel={localizationConstants.salesCreateCompanyButton}
					/>

					<SalesCompanyTable
						companies={visibleCompanies}
						sort={sort}
						statusFilter={statusFilter}
						onToggleSort={toggleSort}
						onStatusChange={(companyId, status) =>
							updateCompany(companyId, { status })
						}
					/>
				</section>
			</div>

			<CreateCompanyDialog
				open={isCreateOpen}
				onOpenChange={setIsCreateOpen}
			/>
		</div>
	);
}
