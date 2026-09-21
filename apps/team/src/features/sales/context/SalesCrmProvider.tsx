"use client";

import { createContext, useCallback, useMemo, useRef, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import {
	archiveSalesCompany,
	companyInput,
	createSalesCompanies,
	createSalesCompany,
	listSalesCompanies,
	linkProfessionalAccount,
	patchSalesCompany,
} from "../api/salesCrmApi";
import type { SalesCompany } from "../types";
import { createEmptyCompany } from "../utils/salesFactories";

const QUERY_KEY = ["team-sales-crm-companies"] as const;
const EMPTY_COMPANIES: SalesCompany[] = [];

export type SalesCrmContextValue = {
	companies: SalesCompany[];
	isLoading: boolean;
	isError: boolean;
	getCompany: (companyId: string) => SalesCompany | undefined;
	addCompany: (patch: Partial<SalesCompany>) => Promise<SalesCompany>;
	addCompanies: (rows: Partial<SalesCompany>[]) => Promise<number>;
	updateCompany: (companyId: string, patch: Partial<SalesCompany>) => Promise<boolean>;
	removeCompany: (companyId: string) => Promise<boolean>;
	linkProfessional: (recordId: string, companyId: string) => Promise<boolean>;
};

export const SalesCrmContext = createContext<SalesCrmContextValue | null>(null);

function normalise(patch: Partial<SalesCompany>): SalesCompany {
	return { ...createEmptyCompany(), ...patch };
}

export function SalesCrmProvider({ children }: { children: ReactNode }) {
	const client = useQueryClient();
	const t = useTranslate();
	const pendingUpdates = useRef(new Map<string, Promise<unknown>>());
	const query = useQuery({ queryKey: QUERY_KEY, queryFn: listSalesCompanies });
	const companies = query.data ?? EMPTY_COMPANIES;

	const getCompany = useCallback(
		(companyId: string) => companies.find((item) => item.id === companyId),
		[companies],
	);

	const addCompany = useCallback(async (patch: Partial<SalesCompany>) => {
		const company = await createSalesCompany(companyInput(normalise(patch)));
		client.setQueryData<SalesCompany[]>(QUERY_KEY, (previous = []) => [company, ...previous]);
		return company;
	}, [client]);

	const addCompanies = useCallback(async (rows: Partial<SalesCompany>[]) => {
		if (!rows.length) return 0;
		let count = 0;
		for (let i = 0; i < rows.length; i += 100) {
			const created = await createSalesCompanies(
				rows.slice(i, i + 100).map((row) => companyInput(normalise(row))),
			);
			client.setQueryData<SalesCompany[]>(QUERY_KEY, (previous = []) => [
				...created,
				...previous,
			]);
			count += created.length;
		}
		return count;
	}, [client]);

	const updateCompany = useCallback(async (companyId: string, patch: Partial<SalesCompany>) => {
		const previous = pendingUpdates.current.get(companyId) ?? Promise.resolve();
		const operation = previous.catch(() => undefined).then(async () => {
			const {
				id: _id, createdAt: _createdAt, order: _order, payment: _payment,
				version: _version, professionalCompanyId: _professionalCompanyId, ...body
			} = patch;
			const updated = await patchSalesCompany(companyId, body);
			client.setQueryData<SalesCompany[]>(QUERY_KEY, (previous = []) =>
				previous.map((company) => company.id === companyId ? updated : company),
			);
			return true;
		});
		pendingUpdates.current.set(companyId, operation);
		try {
			return await operation;
		} catch {
			showToast("error", t(localizationConstants.salesRecordSaveFailed));
			return false;
		} finally {
			if (pendingUpdates.current.get(companyId) === operation) {
				pendingUpdates.current.delete(companyId);
			}
		}
	}, [client, t]);

	const removeCompany = useCallback(async (companyId: string) => {
		try {
			await archiveSalesCompany(companyId);
			client.setQueryData<SalesCompany[]>(QUERY_KEY, (previous = []) =>
				previous.filter((company) => company.id !== companyId),
			);
			return true;
		} catch {
			showToast("error", t(localizationConstants.salesRecordArchiveFailed));
			return false;
		}
	}, [client, t]);

	const linkProfessional = useCallback(async (recordId: string, companyId: string) => {
		try {
			const updated = await linkProfessionalAccount(recordId, companyId);
			client.setQueryData<SalesCompany[]>(QUERY_KEY, (previous = []) =>
				previous.map((company) => company.id === recordId ? updated : company),
			);
			showToast("success", t(localizationConstants.salesAccountLinkedToast));
			return true;
		} catch {
			showToast("error", t(localizationConstants.salesRecordSaveFailed));
			return false;
		}
	}, [client, t]);

	const value = useMemo<SalesCrmContextValue>(() => ({
		companies,
		isLoading: query.isPending,
		isError: query.isError,
		getCompany,
		addCompany,
		addCompanies,
		updateCompany,
		removeCompany,
		linkProfessional,
	}), [companies, query.isPending, query.isError, getCompany, addCompany, addCompanies, updateCompany, removeCompany, linkProfessional]);

	return <SalesCrmContext.Provider value={value}>{children}</SalesCrmContext.Provider>;
}
