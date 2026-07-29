"use client";

import { useMemo, useState } from "react";
import { mockDate } from "@/features/widgetdashboard/utils/mockDates";
import { EconomyInvoiceFilterId } from "../constants";
import { EconomyInvoice } from "../constants/mockData";

type SortOrder = "asc" | "desc" | null;

const RECENT_CUTOFF = mockDate(-30);

export function useInvoiceFilters(invoices: EconomyInvoice[]) {
	const [search, setSearchState] = useState("");
	const [filterId, setFilterIdState] =
		useState<EconomyInvoiceFilterId>("all");
	const [sortBy, setSortBy] = useState<string | undefined>(undefined);
	const [sortOrder, setSortOrder] = useState<SortOrder>(null);
	const [page, setPage] = useState(1);
	const [pageSize, setPageSizeState] = useState(10);

	const filtered = useMemo(() => {
		const term = search.trim().toLowerCase();
		let rows = invoices;

		if (filterId === "recent")
			rows = rows.filter((invoice) => invoice.date >= RECENT_CUTOFF);
		else if (filterId === "older")
			rows = rows.filter((invoice) => invoice.date < RECENT_CUTOFF);

		if (term)
			rows = rows.filter(
				(invoice) =>
					invoice.invoiceNo.toLowerCase().includes(term) ||
					invoice.billedTo.name.toLowerCase().includes(term),
			);

		if (sortBy && sortOrder) {
			const direction = sortOrder === "asc" ? 1 : -1;
			rows = [...rows].sort((a, b) => {
				if (sortBy === "amount")
					return (a.amount - b.amount) * direction;
				const left = String(a[sortBy as keyof EconomyInvoice] ?? "");
				const right = String(b[sortBy as keyof EconomyInvoice] ?? "");
				return left.localeCompare(right) * direction;
			});
		}

		return rows;
	}, [invoices, search, filterId, sortBy, sortOrder]);

	const paged = useMemo(
		() => filtered.slice((page - 1) * pageSize, page * pageSize),
		[filtered, page, pageSize],
	);

	const setSearch = (value: string) => {
		setSearchState(value);
		setPage(1);
	};

	const setFilterId = (value: EconomyInvoiceFilterId) => {
		setFilterIdState(value);
		setPage(1);
	};

	const setPageSize = (value: number) => {
		setPageSizeState(value);
		setPage(1);
	};

	const handleSort = (field: string, nextOrder: SortOrder) => {
		setSortBy(nextOrder ? field : undefined);
		setSortOrder(nextOrder);
		setPage(1);
	};

	return {
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
	};
}
