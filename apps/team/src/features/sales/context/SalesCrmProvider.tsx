"use client";

import { createContext, useCallback, useMemo, useRef, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import {
	archiveSalesCompany,
	companyInput,
	companyPatchBody,
	createSalesCompanies,
	createSalesCompany,
	listSalesCompanies,
	linkProfessionalAccount,
	patchSalesCompany,
} from "../api/salesCrmApi";
import type { SalesActivity, SalesCompany } from "../types";
import { createEmptyCompany } from "../utils/salesFactories";
import { useSalesActivityMutations } from "../hooks/useSalesActivityMutations";

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
	addActivity: (companyId: string, activity: SalesActivity) => Promise<boolean>;
	updateActivity: (
		companyId: string,
		activityId: string,
		changes: Partial<Omit<SalesActivity, "id">>,
	) => Promise<boolean>;
	linkProfessional: (recordId: string, companyId: string) => Promise<boolean>;
};

export const SalesCrmContext = createContext<SalesCrmContextValue | null>(null);

const isConflict = (error: unknown) => isAxiosError(error) && error.response?.status === 409;

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
		client.setQueryData<SalesCompany[]>(QUERY_KEY, (current = []) =>
			// The cached version stays: only the server moves it, and a caller holding
			// an older copy of the company must not rewind it.
			current.map((company) => company.id === companyId
				? { ...company, ...patch, version: company.version }
				: company),
		);
		const operation = previous.catch(() => undefined).then(async () => {
			// Read the version when this save runs, not when it was queued: the save
			// before it in this tab has moved the version on.
			const version = client.getQueryData<SalesCompany[]>(QUERY_KEY)
				?.find((company) => company.id === companyId)?.version;
			let updated: SalesCompany;
			try {
				updated = await patchSalesCompany(companyId, companyPatchBody(patch, version));
			} catch (error) {
				// Reload before the next queued save runs, so it sends the new version.
				// Saves are per field, so that one then applies on top of the other change.
				if (isConflict(error)) await client.invalidateQueries({ queryKey: QUERY_KEY });
				throw error;
			}
			const isLatest = pendingUpdates.current.get(companyId) === operation;
			// A later save is still pending: keep its optimistic fields, take only the version.
			client.setQueryData<SalesCompany[]>(QUERY_KEY, (current = []) =>
				current.map((company) => company.id !== companyId
					? company
					: isLatest ? updated : { ...company, version: updated.version }),
			);
			return true;
		});
		pendingUpdates.current.set(companyId, operation);
		try {
			return await operation;
		} catch (error) {
			const conflict = isConflict(error);
			showToast("error", t(conflict
				? localizationConstants.salesRecordConflict
				: localizationConstants.salesRecordSaveFailed), `sales-save-${companyId}`);
			if (!conflict && pendingUpdates.current.get(companyId) === operation) {
				await client.invalidateQueries({ queryKey: QUERY_KEY });
			}
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

	const { addActivity, updateActivity } = useSalesActivityMutations(QUERY_KEY);

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
		addActivity,
		updateActivity,
		linkProfessional,
	}), [companies, query.isPending, query.isError, getCompany, addCompany, addCompanies, updateCompany, removeCompany, addActivity, updateActivity, linkProfessional]);

	return <SalesCrmContext.Provider value={value}>{children}</SalesCrmContext.Provider>;
}
