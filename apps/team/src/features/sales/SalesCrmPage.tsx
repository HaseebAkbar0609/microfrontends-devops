"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { useSalesCompanies } from "./hooks/useSalesCompanies";
import { useSalesCompanyFilters } from "./hooks/useSalesCompanyFilters";
import { CompaniesCardHeader } from "./components/CompaniesCardHeader";
import { CreateCompanyDialog } from "./components/CreateCompanyDialog";
import { CsvImportExportActions } from "./components/CsvImportExportActions";
import { SalesCompanyTable } from "./components/SalesCompanyTable";
import { SalesStatusSummaryCards } from "./components/SalesStatusSummaryCards";
import { SellerFilterBar } from "./components/SellerFilterBar";

/** Prospects, leads, quotes and order confirmations in one flow. */
export default function SalesCrmPage() {
	const { companies, updateCompany, isLoading, isError } = useSalesCompanies();
	const {
		statusFilter,
		query,
		category,
		region,
		seller,
		sellers,
		sort,
		counts,
		visibleCompanies,
		setQuery,
		setCategory,
		setRegion,
		setSeller,
		toggleStatusFilter,
		toggleSort,
	} = useSalesCompanyFilters(companies);
	const [isCreateOpen, setIsCreateOpen] = useState(false);

	return (
		<div className="@container flex min-h-0 flex-1 flex-col overflow-y-auto bg-slate-50">
			<header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-6 py-4">
				<div>
					<h1 className="text-2xl font-semibold text-slate-900">
						<Translate text={localizationConstants.salesCrmOrgTitle} />
					</h1>
					<p className="text-sm text-slate-500">
						<Translate text={localizationConstants.salesCrmTitle} />
					</p>
				</div>

				<div className="flex flex-wrap items-center gap-3">
					<CsvImportExportActions />
					<Button
						type="button"
						variant="primary"
						className="h-10 gap-2 active:scale-[0.98]"
						onClick={() => setIsCreateOpen(true)}
					>
						<Plus className="h-4 w-4" />
						<Translate
							text={localizationConstants.salesRegisterNewCompanyButton}
						/>
					</Button>
				</div>
			</header>

			<div className="flex flex-col gap-5 p-6">
				{(isLoading || isError) && <p className="text-sm text-slate-600"><Translate text={isLoading ? localizationConstants.salesRecordLoading : localizationConstants.salesRecordLoadFailed} /></p>}
				<SellerFilterBar
					sellers={sellers}
					seller={seller}
					onSellerChange={setSeller}
				/>

				<SalesStatusSummaryCards
					counts={counts}
					activeFilter={statusFilter}
					onFilterChange={toggleStatusFilter}
				/>

				<section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs">
					<CompaniesCardHeader
						statusFilter={statusFilter}
						category={category}
						onCategoryChange={setCategory}
						region={region}
						onRegionChange={setRegion}
						query={query}
						onQueryChange={setQuery}
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

			<CreateCompanyDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
		</div>
	);
}
