"use client";

import {
	createContext,
	useCallback,
	useMemo,
	useState,
	type ReactNode,
} from "react";
import { SALES_COMPANIES_SEED } from "../constants/salesCompanies.mock";
import type { SalesCompany } from "../types";
import { createEmptyCompany } from "../utils/salesFactories";

export type SalesCrmContextValue = {
	companies: SalesCompany[];
	getCompany: (companyId: string) => SalesCompany | undefined;
	addCompany: (patch: Partial<SalesCompany>) => SalesCompany;
	addCompanies: (rows: Partial<SalesCompany>[]) => number;
	updateCompany: (companyId: string, patch: Partial<SalesCompany>) => void;
	removeCompany: (companyId: string) => void;
};

export const SalesCrmContext = createContext<SalesCrmContextValue | null>(null);

function normalise(patch: Partial<SalesCompany>): SalesCompany {
	return { ...createEmptyCompany(), ...patch };
}

/**
 * Holds the sales CRM for the length of the session.
 *
 * State deliberately lives in memory rather than `localStorage`: these records
 * carry contact names, e-mail addresses and phone numbers, and AGENTS.md forbids
 * plain-text PII in browser storage. It is mounted from the `/module/sales`
 * layout so edits survive navigation between the overview, company card, quote
 * builder and order confirmation.
 */
export function SalesCrmProvider({ children }: { children: ReactNode }) {
	const [companies, setCompanies] =
		useState<SalesCompany[]>(SALES_COMPANIES_SEED);

	const getCompany = useCallback(
		(companyId: string) => companies.find((item) => item.id === companyId),
		[companies],
	);

	const addCompany = useCallback((patch: Partial<SalesCompany>) => {
		const company = normalise(patch);
		setCompanies((previous) => [company, ...previous]);
		return company;
	}, []);

	const addCompanies = useCallback((rows: Partial<SalesCompany>[]) => {
		const created = rows.map(normalise);
		if (created.length === 0) return 0;
		setCompanies((previous) => [...created, ...previous]);
		return created.length;
	}, []);

	const updateCompany = useCallback(
		(companyId: string, patch: Partial<SalesCompany>) => {
			setCompanies((previous) =>
				previous.map((company) =>
					company.id === companyId ? { ...company, ...patch } : company,
				),
			);
		},
		[],
	);

	const removeCompany = useCallback((companyId: string) => {
		setCompanies((previous) =>
			previous.filter((company) => company.id !== companyId),
		);
	}, []);

	const value = useMemo<SalesCrmContextValue>(
		() => ({
			companies,
			getCompany,
			addCompany,
			addCompanies,
			updateCompany,
			removeCompany,
		}),
		[
			companies,
			getCompany,
			addCompany,
			addCompanies,
			updateCompany,
			removeCompany,
		],
	);

	return (
		<SalesCrmContext.Provider value={value}>
			{children}
		</SalesCrmContext.Provider>
	);
}
