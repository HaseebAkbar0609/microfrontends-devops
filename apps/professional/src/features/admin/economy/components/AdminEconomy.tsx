"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DynamicBreadcrumb } from "@/components/common";
import { DataTable, DataTableColumn } from "@/components/table/DataTable";
import { cn } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import {
	ECONOMY_INVOICE_COLUMNS,
	ECONOMY_INVOICE_FILTERS,
} from "../constants";
import { EconomyInvoice, formatInvoiceDate } from "../constants/mockData";
import { useInvoiceFilters } from "../hooks/useInvoiceFilters";
import { listEconomyInvoices } from "../services/invoiceService";

const AdminEconomy = () => {
	const router = useRouter();
	const t = useTranslate();
	const invoices = useMemo(() => listEconomyInvoices(), []);
	const {
		search,
		setSearch,
		filterId,
		setFilterId,
		sortBy,
		sortOrder,
		handleSort,
		page,
		setPage,
		pageSize,
		setPageSize,
		filtered,
		paged,
	} = useInvoiceFilters(invoices);

	const columns = useMemo<DataTableColumn<EconomyInvoice>[]>(() => {
		const cellRenderers: Partial<
			Record<
				(typeof ECONOMY_INVOICE_COLUMNS)[number]["key"],
				(row: EconomyInvoice) => React.ReactNode
			>
		> = {
			invoiceNo: (row) => (
				<span className="font-medium text-slate-950">
					{row.invoiceNo}
				</span>
			),
			date: (row) => <span>{formatInvoiceDate(row.date)}</span>,
			amount: (row) => <span>${row.amount}</span>,
			action: (row) => (
				<Button
					type="button"
					variant="outline"
					className="h-9 rounded-md border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 hover:bg-slate-50"
					onClick={() => router.push(`/admin/economy/${row.id}`)}
				>
					<Translate
						text={localizationConstants.economyOpenInvoice}
					/>
				</Button>
			),
		};

		return ECONOMY_INVOICE_COLUMNS.map((col) => ({
			key: col.key,
			label: col.label,
			sortable: col.sortable,
			render: cellRenderers[col.key],
		}));
	}, [router]);

	return (
		<div className="flex flex-col gap-6 p-6">
			<div>
				<h1 className="text-2xl font-semibold text-slate-900 mb-2">
					<Translate text={localizationConstants.adminEconomy} />
				</h1>
				<DynamicBreadcrumb
					variant="small"
					items={[
						{
							translationKey: localizationConstants.adminItem,
							href: "/admin/settings",
						},
						{
							translationKey: localizationConstants.adminEconomy,
						},
					]}
				/>
			</div>

			<div className="flex flex-wrap items-center gap-4">
				<div className="relative w-full max-w-xs">
					<Search className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
					<Input
						value={search}
						onChange={(event) => setSearch(event.target.value)}
						placeholder={t(localizationConstants.search)}
						className="h-9 rounded-none border-0 border-b border-slate-200 bg-transparent pl-6 text-sm shadow-none focus-visible:border-slate-400 focus-visible:ring-0"
					/>
				</div>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							type="button"
							variant="outline"
							className="h-9 gap-1.5 rounded-md border-slate-200 bg-white px-3 text-sm font-medium text-slate-900 hover:bg-slate-50"
						>
							<Translate text={localizationConstants.filter} />
							<ChevronDown className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						align="start"
						className="w-48 rounded-md border border-slate-200 bg-white p-1 shadow-md"
					>
						{ECONOMY_INVOICE_FILTERS.map((filter) => (
							<DropdownMenuItem
								key={filter.id}
								onClick={() => setFilterId(filter.id)}
								className={cn(
									"cursor-pointer rounded-md px-3 py-2 text-sm text-slate-700",
									filter.id === filterId &&
										"bg-slate-100 font-medium text-slate-900",
								)}
							>
								<Translate text={filter.label} />
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<DataTable
				data={paged}
				columns={columns}
				rowKey={(row) => row.id}
				bordered
				variant="striped"
				emptyMessageKey={localizationConstants.economyNoInvoices}
				sortBy={sortBy}
				sortOrder={sortOrder ?? undefined}
				onSort={handleSort}
				pagination={{
					page,
					pageSize,
					totalItems: filtered.length,
				}}
				onPageChange={setPage}
				onPageSizeChange={setPageSize}
			/>
		</div>
	);
};

export default AdminEconomy;
