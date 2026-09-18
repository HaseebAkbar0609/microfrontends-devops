"use client";

import { useCallback, useMemo, useState } from "react";
import { SALES_STATUS_IDS } from "../constants/salesStatuses";
import type {
	SalesCompany,
	SalesCompanyStatus,
	SalesSortKey,
	SalesStatusFilter,
} from "../types";
import { compareText, getInvoicedAmount } from "../utils/salesFormatters";
import {
	hasActiveDemoAccount,
	hasActiveTestAccount,
} from "../utils/trialAccounts";

export type SalesSort = { key: SalesSortKey; direction: 1 | -1 };

/** Fields the free-text search scans. */
const SEARCHABLE_FIELDS: (keyof SalesCompany)[] = [
	"name",
	"organisationNumber",
	"contactPerson",
	"mobile",
	"email",
	"city",
	"trade",
	"seller",
	"accountManager",
];

function matchesQuery(company: SalesCompany, query: string): boolean {
	if (!query) return true;
	return SEARCHABLE_FIELDS.some((field) =>
		String(company[field] ?? "")
			.toLowerCase()
			.includes(query),
	);
}

function matchesStatusFilter(
	company: SalesCompany,
	filter: SalesStatusFilter,
): boolean {
	if (filter === "all") return true;
	if (filter === "demo") return hasActiveDemoAccount(company);
	if (filter === "test") return hasActiveTestAccount(company);
	return company.status === filter;
}

function sortValue(company: SalesCompany, key: SalesSortKey): string | number {
	if (key === "invoiced") return getInvoicedAmount(company);
	if (key === "status") return SALES_STATUS_IDS.indexOf(company.status);
	return String(company[key] ?? "");
}

/**
 * Search, filter and sort state for the company overview. Pure derivation from
 * the passed list, so it stays usable once the list comes from a query.
 */
export function useSalesCompanyFilters(companies: SalesCompany[]) {
	const [statusFilter, setStatusFilter] = useState<SalesStatusFilter>("all");
	const [query, setQuery] = useState("");
	const [category, setCategory] = useState("");
	const [region, setRegion] = useState("");
	const [seller, setSeller] = useState("");
	const [onlyTrialAccounts, setOnlyTrialAccounts] = useState(false);
	const [sort, setSort] = useState<SalesSort>({ key: "name", direction: 1 });

	const counts = useMemo(() => {
		const result: Record<string, number> = {};
		for (const status of SALES_STATUS_IDS) {
			result[status] = companies.filter(
				(company) => company.status === status,
			).length;
		}
		result.demo = companies.filter(hasActiveDemoAccount).length;
		result.test = companies.filter(hasActiveTestAccount).length;
		return result;
	}, [companies]);

	/** Sellers present in the data, for the seller filter. */
	const sellers = useMemo(
		() =>
			[
				...new Set(companies.map((company) => company.seller).filter(Boolean)),
			].sort(compareText),
		[companies],
	);

	const visibleCompanies = useMemo(() => {
		const normalisedQuery = query.trim().toLowerCase();
		const filtered = companies.filter(
			(company) =>
				matchesStatusFilter(company, statusFilter) &&
				matchesQuery(company, normalisedQuery) &&
				(!category || company.category === category) &&
				(!region || company.region === region) &&
				(!seller || company.seller === seller) &&
				(!onlyTrialAccounts ||
					hasActiveDemoAccount(company) ||
					hasActiveTestAccount(company)),
		);

		return [...filtered].sort((a, b) => {
			const left = sortValue(a, sort.key);
			const right = sortValue(b, sort.key);
			if (typeof left === "number" && typeof right === "number") {
				return (left - right) * sort.direction;
			}
			return compareText(String(left), String(right)) * sort.direction;
		});
	}, [
		companies,
		statusFilter,
		query,
		category,
		region,
		seller,
		onlyTrialAccounts,
		sort,
	]);

	const toggleStatusFilter = useCallback((next: SalesStatusFilter) => {
		setStatusFilter((current) => (current === next ? "all" : next));
	}, []);

	const toggleSort = useCallback((key: SalesSortKey) => {
		setSort((current) =>
			current.key === key
				? { key, direction: current.direction === 1 ? -1 : 1 }
				: { key, direction: 1 },
		);
	}, []);

	const setStatus = useCallback((next: SalesCompanyStatus | "") => {
		setStatusFilter(next === "" ? "all" : next);
	}, []);

	return {
		statusFilter,
		query,
		category,
		region,
		seller,
		onlyTrialAccounts,
		sellers,
		sort,
		counts,
		visibleCompanies,
		setQuery,
		setCategory,
		setRegion,
		setSeller,
		setOnlyTrialAccounts,
		setStatus,
		toggleStatusFilter,
		toggleSort,
	};
}
