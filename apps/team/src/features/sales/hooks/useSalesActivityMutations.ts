"use client";

import { useCallback } from "react";
import { useQueryClient, type QueryKey } from "@tanstack/react-query";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { addSalesActivity, patchSalesActivity } from "../api/salesCrmApi";
import type { SalesActivity, SalesCompany } from "../types";

/**
 * Adds and changes activities through their own endpoints, never through a
 * company PATCH: a whole-list PATCH deletes whatever a colleague added since
 * this tab loaded. Both update the cached list first and undo it on failure.
 */
export function useSalesActivityMutations(queryKey: QueryKey) {
	const client = useQueryClient();
	const t = useTranslate();

	const setActivities = useCallback(
		(companyId: string, update: (activities: SalesActivity[]) => SalesActivity[]) => {
			client.setQueryData<SalesCompany[]>(queryKey, (current = []) =>
				current.map((company) => company.id === companyId
					? { ...company, activities: update(company.activities) }
					: company),
			);
		},
		[client, queryKey],
	);

	const addActivity = useCallback(async (companyId: string, activity: SalesActivity) => {
		setActivities(companyId, (activities) => [activity, ...activities]);
		try {
			const saved = await addSalesActivity(companyId, activity);
			// Upsert: a company PATCH answered in the meantime may have replaced the list.
			setActivities(companyId, (activities) => activities.some((item) => item.id === saved.id)
				? activities.map((item) => item.id === saved.id ? saved : item)
				: [saved, ...activities]);
			return true;
		} catch {
			showToast("error", t(localizationConstants.salesRecordSaveFailed));
			setActivities(companyId, (activities) => activities.filter((item) => item.id !== activity.id));
			return false;
		}
	}, [setActivities, t]);

	const updateActivity = useCallback(async (
		companyId: string,
		activityId: string,
		changes: Partial<Omit<SalesActivity, "id">>,
	) => {
		const previous = client.getQueryData<SalesCompany[]>(queryKey)
			?.find((company) => company.id === companyId)
			?.activities.find((item) => item.id === activityId);
		if (!previous) return false;
		setActivities(companyId, (activities) =>
			activities.map((item) => item.id === activityId ? { ...item, ...changes } : item));
		try {
			const saved = await patchSalesActivity(companyId, activityId, changes);
			setActivities(companyId, (activities) =>
				activities.map((item) => item.id === activityId ? saved : item));
			return true;
		} catch {
			showToast("error", t(localizationConstants.salesRecordSaveFailed));
			setActivities(companyId, (activities) =>
				activities.map((item) => item.id === activityId ? previous : item));
			return false;
		}
	}, [client, queryKey, setActivities, t]);

	return { addActivity, updateActivity };
}
