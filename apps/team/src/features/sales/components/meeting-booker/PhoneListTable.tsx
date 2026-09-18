"use client";

import { PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { SALES_CATEGORIES, SALES_REGIONS } from "../../constants/salesTaxonomy";
import {
	SALES_STICKY_ACTION_CELL_CLASS,
	SALES_STICKY_ACTION_HEAD_CLASS,
} from "../../constants/salesTheme";
import type { SalesCompany } from "../../types";

const HEAD_CLASS = "h-11 text-xs font-medium uppercase tracking-wide text-slate-500";

const COLUMNS = [
	localizationConstants.salesColumnCompany,
	localizationConstants.salesColumnOrgNumber,
	localizationConstants.salesColumnContact,
	localizationConstants.salesColumnPhone,
	localizationConstants.salesColumnCategory,
	localizationConstants.salesColumnRegion,
];

function useTaxonomyLabel() {
	const t = useTranslate();
	return (options: { id: string; labelKey: string }[], id: string) => {
		const option = options.find((entry) => entry.id === id);
		return option ? t(option.labelKey) : id;
	};
}

type PhoneListTableProps = {
	companies: SalesCompany[];
	selectedCompanyId: string | null;
	onSelect: (companyId: string) => void;
};

/** The companies to work through, with the customer card one click away. */
export function PhoneListTable({
	companies,
	selectedCompanyId,
	onSelect,
}: PhoneListTableProps) {
	const label = useTaxonomyLabel();

	return (
		<section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs">
			<h2 className="border-b border-slate-200 px-5 py-4 text-base font-semibold text-slate-900">
				<Translate text={localizationConstants.salesBookerPhoneListTitle} />
			</h2>

			{companies.length === 0 ? (
				<p className="px-5 py-8 text-center text-sm text-slate-500">
					<Translate text={localizationConstants.salesBookerPhoneListEmpty} />
				</p>
			) : (
				<div className="overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow>
								{COLUMNS.map((labelKey) => (
									<TableHead key={labelKey} className={cn(HEAD_CLASS, "px-5")}>
										<Translate text={labelKey} />
									</TableHead>
								))}
								<TableHead
									className={cn(HEAD_CLASS, "px-5 text-right", SALES_STICKY_ACTION_HEAD_CLASS)}
								>
									<Translate text={localizationConstants.salesColumnAction} />
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{companies.map((company) => (
								<TableRow
									key={company.id}
									data-selected={company.id === selectedCompanyId}
									className="group data-[selected=true]:bg-slate-50"
								>
									<TableCell className="px-5 py-3 font-medium text-slate-900">
										{company.name}
									</TableCell>
									<TableCell className="px-5 tabular-nums text-slate-600">
										{company.organisationNumber}
									</TableCell>
									<TableCell className="px-5 text-slate-600">
										{company.contactPerson}
									</TableCell>
									<TableCell className="px-5 tabular-nums text-slate-600">
										{company.mobile && (
											<a className="hover:underline" href={`tel:${company.mobile}`}>
												{company.mobile}
											</a>
										)}
									</TableCell>
									<TableCell className="px-5 text-slate-600">
										{label(SALES_CATEGORIES, company.category)}
									</TableCell>
									<TableCell className="px-5 text-slate-600">
										{label(SALES_REGIONS, company.region)}
									</TableCell>
									<TableCell
										className={cn(
											"px-5 text-right",
											SALES_STICKY_ACTION_CELL_CLASS,
											"group-data-[selected=true]:bg-slate-50",
										)}
									>
										<Button
											type="button"
											variant="outline"
											className="h-9 gap-2 active:scale-[0.98]"
											onClick={() => onSelect(company.id)}
										>
											<PhoneCall className="h-4 w-4" />
											<Translate
												text={localizationConstants.salesBookerOpenCardButton}
											/>
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			)}
		</section>
	);
}
