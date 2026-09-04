"use client";

import { useCallback, useState } from "react";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import type { SalesActivity, SalesActivityType, SalesCompany } from "../types";
import { createId } from "../utils/salesFactories";

type ActivityDraft = {
	type: SalesActivityType;
	text: string;
	followUpAt: string;
};

const EMPTY_DRAFT: ActivityDraft = { type: "call", text: "", followUpAt: "" };

/**
 * Draft, validation and submit for the company diary. The card stays layout.
 */
export function useActivityLogForm(
	company: SalesCompany,
	onChange: (patch: Partial<SalesCompany>) => void,
) {
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

		onChange({ activities: [activity, ...company.activities] });
		setDraft({ ...EMPTY_DRAFT, type: draft.type });
		setError(null);
		showToast("success", t(localizationConstants.salesActivityAddedToast));
	}, [company.activities, draft, onChange, t]);

	const toggleDone = useCallback(
		(activityId: string) => {
			onChange({
				activities: company.activities.map((activity) =>
					activity.id === activityId
						? { ...activity, done: !activity.done }
						: activity,
				),
			});
		},
		[company.activities, onChange],
	);

	return { draft, error, update, submit, toggleDone };
}
