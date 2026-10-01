"use client";

import { useCallback, useState } from "react";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import type { SalesActivity, SalesActivityType, SalesCompany } from "../types";
import { createId } from "../utils/salesFactories";
import { useSalesCompanies } from "./useSalesCompanies";

type ActivityDraft = {
	type: SalesActivityType;
	text: string;
	followUpAt: string;
};

const EMPTY_DRAFT: ActivityDraft = { type: "call", text: "", followUpAt: "" };

/**
 * Draft, validation and submit for the company diary. The card stays layout.
 */
export function useActivityLogForm(company: SalesCompany) {
	const { addActivity, updateActivity } = useSalesCompanies();
	const [draft, setDraft] = useState<ActivityDraft>(EMPTY_DRAFT);
	const [error, setError] = useState<string | null>(null);
	const t = useTranslate();

	const update = useCallback((patch: Partial<ActivityDraft>) => {
		setDraft((previous) => ({ ...previous, ...patch }));
		setError(null);
	}, []);

	const submit = useCallback(() => {
		if (!draft.text.trim()) {
			setError(localizationConstants.salesValidationActivityTextRequired);
			return;
		}

		const activity: SalesActivity = {
			id: createId("sa"),
			date: new Date().toISOString(),
			type: draft.type,
			text: draft.text.trim(),
			followUpAt: draft.followUpAt,
			done: false,
		};

		void addActivity(company.id, activity);
		setDraft({ ...EMPTY_DRAFT, type: draft.type });
		setError(null);
		showToast("success", t(localizationConstants.salesActivityAddedToast));
	}, [addActivity, company.id, draft, t]);

	const toggleDone = useCallback(
		(activityId: string) => {
			const activity = company.activities.find((item) => item.id === activityId);
			if (activity) void updateActivity(company.id, activityId, { done: !activity.done });
		},
		[company.activities, company.id, updateActivity],
	);

	return { draft, error, update, submit, toggleDone };
}
