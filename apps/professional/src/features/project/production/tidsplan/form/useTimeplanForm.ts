"use client";

import { useCallback, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";

import { mockDate } from "@/features/widgetdashboard/utils/mockDates";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { createPlan, getPlan, updatePlan } from "../services/timeplanService";
import { TIMEPLAN_AUTHORS } from "../timeplan.config";
import { timeplanUrls } from "../timeplanNav";
import type { Timeplan, TimeplanDetails } from "../types";
import { timeplanDetailsSchema } from "./schema";

/**
 * A new plan's starting values.
 *
 * Datum opens on `mockDate(0)` rather than `new Date()`: every other date in this
 * module's mock world — the project rows, the seeded plans — is anchored to that
 * reference, so "today" has to be the same day here. Production should default
 * to the real date.
 */
function emptyDetails(): TimeplanDetails {
	return {
		kind: "main",
		type: "standard",
		startDate: "",
		endDate: "",
		createdById: TIMEPLAN_AUTHORS[0].id,
		createdDate: mockDate(0),
		revisedDate: "",
		description: "",
	};
}

function detailsOf(plan: Timeplan): TimeplanDetails {
	const { id: _id, projectId: _projectId, tasks: _tasks, ...details } = plan;
	return details;
}

/**
 * The create and edit form: its state, and where each footer button goes.
 *
 * The plan is resolved here, on the client, not in the route's server page. A
 * plan created in this browser exists only in this browser's copy of the store,
 * so a server-side lookup would 404 every plan the user had just made.
 */
export function useTimeplanForm(projectId: string, planId?: string) {
	const t = useTranslate();
	const router = useRouter();

	/* Read once: the store changes only when this form saves, and then it leaves. */
	const [existing] = useState(() =>
		planId ? getPlan(projectId, planId) : undefined,
	);

	const form = useForm<TimeplanDetails>({
		resolver: zodResolver(timeplanDetailsSchema) as Resolver<TimeplanDetails>,
		defaultValues: existing ? detailsOf(existing) : emptyDetails(),
		mode: "onTouched",
	});

	/* `handleSubmit`'s callback is synchronous, so `isSubmitting` is back to false
	   before a fast second click lands — which would create the plan twice. */
	const savedRef = useRef(false);

	/** Validates, saves, then goes to the list or to the plan's Gantt. */
	const save = useCallback(
		(destination: "list" | "view") =>
			form.handleSubmit((values) => {
				if (savedRef.current) return;
				const plan = existing
					? updatePlan(existing.id, values)
					: createPlan(projectId, values);
				if (!plan) return;
				savedRef.current = true;

				showToast("success", t(localizationConstants.projectTimeplanSavedToast));
				router.push(
					destination === "view"
						? timeplanUrls.view(projectId, plan.id)
						: timeplanUrls.list(projectId),
				);
			})(),
		[existing, form, projectId, router, t],
	);

	const cancel = useCallback(
		() => router.push(timeplanUrls.list(projectId)),
		[projectId, router],
	);

	return {
		form,
		isEdit: Boolean(planId),
		/** An edit route whose plan is not in the store — the page 404s. */
		missing: Boolean(planId) && !existing,
		save,
		cancel,
	};
}
