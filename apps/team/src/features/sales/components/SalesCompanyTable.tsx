"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import localizationConstants from "@/utils/translation/constants";
import { SALES_STICKY_ACTION_HEAD_CLASS } from "../constants/salesTheme";
import { Translate } from "@/utils/translation/translate";
import type {
	SalesCompany,
	SalesCompanyStatus,
	SalesSortKey,
	SalesStatusFilter,
} from "../types";
import type { SalesSort } from "../hooks/useSalesCompanyFilters";
import { SalesCompanyRow } from "./SalesCompanyRow";

type SalesCompanyTableProps = {
	companies: SalesCompany[];
	sort: SalesSort;
	statusFilter: SalesStatusFilter;
	onToggleSort: (key: SalesSortKey) => void;
	onStatusChange: (companyId: string, status: SalesCompanyStatus) => void;
};

type ColumnConfig = {
	labelKey: string;
	sortKey?: SalesSortKey;
	className?: string;
};

/** Column order and which of them are sortable. */
const COLUMNS: ColumnConfig[] = [
	{ labelKey: localizationConstants.salesColumnCompany, sortKey: "name" },
	{ labelKey: localizationConstants.salesColumnOrgNumber },
	{ labelKey: localizationConstants.salesColumnCategory, sortKey: "category" },
	{ labelKey: localizationConstants.salesColumnRegion, sortKey: "region" },
	{
		labelKey: localizationConstants.salesColumnContact,
		sortKey: "contactPerson",
	},
	{ labelKey: localizationConstants.salesColumnPhone, sortKey: "mobile" },
	{ labelKey: localizationConstants.salesColumnEmail, sortKey: "email" },
	{ labelKey: localizationConstants.salesColumnSeller, sortKey: "seller" },
	{ labelKey: localizationConstants.salesColumnStatus, sortKey: "status" },
	{ labelKey: localizationConstants.salesColumnQuote },
	{
		labelKey: localizationConstants.salesColumnInvoiced,
		sortKey: "invoiced",
		className: "text-right",
	},
	{ labelKey: localizationConstants.salesColumnDemoAccount },
	{ labelKey: localizationConstants.salesColumnTestAccount },
	{
		labelKey: localizationConstants.salesColumnAction,
		className: `text-right ${SALES_STICKY_ACTION_HEAD_CLASS}`,
	},
];

const EMPTY_MESSAGE_BY_FILTER: Partial<Record<SalesStatusFilter, string>> = {
	demo: localizationConstants.salesEmptyDemoCompanies,
	test: localizationConstants.salesEmptyTestCompanies,
};

function SortIcon({ active, direction }: { active: boolean; direction: 1 | -1 }) {
	if (!active) return <ArrowUpDown className="size-3.5 text-slate-400" />;
	return direction === 1 ? (
		<ArrowUp className="size-3.5 text-slate-700" />
	) : (
		<ArrowDown className="size-3.5 text-slate-700" />
	);
}

export function SalesCompanyTable({
	companies,
	sort,
	statusFilter,
	onToggleSort,
	onStatusChange,
}: SalesCompanyTableProps) {
	const emptyMessageKey =
		EMPTY_MESSAGE_BY_FILTER[statusFilter] ??
		localizationConstants.salesEmptyCompanies;

	return (
		<div className="overflow-x-auto">
			<Table>
				<TableHeader>
					<TableRow>
						{COLUMNS.map((column) => (
							<TableHead
								key={column.labelKey}
								className={`text-xs font-medium tracking-wide text-slate-500 ${column.className ?? ""}`}
							>
								{column.sortKey ? (
									<button
										type="button"
										onClick={() => onToggleSort(column.sortKey as SalesSortKey)}
										className="inline-flex cursor-pointer items-center gap-1 hover:text-slate-900"
									>
										<Translate text={column.labelKey} />
										<SortIcon
											active={sort.key === column.sortKey}
											direction={sort.direction}
										/>
									</button>
								) : (
									<Translate text={column.labelKey} />
								)}
							</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{companies.length === 0 ? (
						<TableRow>
							<TableCell
								colSpan={COLUMNS.length}
								className="py-10 text-center text-sm text-slate-500"
							>
								<Translate text={emptyMessageKey} />
							</TableCell>
						</TableRow>
					) : (
						companies.map((company) => (
							<SalesCompanyRow
								key={company.id}
								company={company}
								onStatusChange={onStatusChange}
							/>
						))
					)}
				</TableBody>
			</Table>
		</div>
	);
}
