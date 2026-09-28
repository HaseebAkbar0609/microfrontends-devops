"use client";

import { useCallback, useEffect, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";

import { useCurrentUserName } from "@/hooks/useCurrentUserName";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { createPlan, getPlan, updatePlan } from "../services/timeplanService";
import { timeplanUrls } from "../timeplanNav";
import type { Timeplan, TimeplanDetails } from "../types";
import { timeplanDetailsSchema } from "./schema";

/**
 * A new plan's starting values.
 *
 * The form uses the current date for a new plan; persisted plans retain their
 * original creation date when edited.
 */
function emptyDetails(author: string): TimeplanDetails {
	return {
		kind: "main",
		type: "standard",
		startDate: "",
		endDate: "",
		createdById: author,
		createdDate: new Date().toISOString().slice(0, 10),
		revisedDate: "",
		description: "",
	};
}

function detailsOf(plan: Timeplan): TimeplanDetails {
	const { id: _id, projectId: _projectId, version: _version, tasks: _tasks, ...details } = plan;
	return details;
}

/**
 * The create and edit form: its state, and where each footer button goes.
 *
 * The plan is fetched through the project-scoped API after authentication.
 */
export function useTimeplanForm(projectId: string, planId?: string) {
	const t = useTranslate();
	const router = useRouter();
	const author = useCurrentUserName(localizationConstants.projectDiaryYou);

	const query = useQuery({
		queryKey: ["professional-project-timeplan", projectId, planId],
		queryFn: () => getPlan(projectId, planId!),
		enabled: Boolean(planId),
		retry: false,
	});
	const existing = query.data;

	const form = useForm<TimeplanDetails>({
		resolver: zodResolver(timeplanDetailsSchema) as Resolver<TimeplanDetails>,
		defaultValues: emptyDetails(author),
		mode: "onTouched",
	});
	useEffect(() => {
		if (existing) form.reset(detailsOf(existing));
	}, [existing, form]);
	useEffect(() => {
		if (!planId) form.setValue("createdById", author);
	}, [author, form, planId]);

	/* `handleSubmit`'s callback is synchronous, so `isSubmitting` is back to false
	   before a fast second click lands — which would create the plan twice. */
	const savedRef = useRef(false);

	/** Validates, saves, then goes to the list or to the plan's Gantt. */
	const save = useCallback(
		(destination: "list" | "view") =>
			form.handleSubmit(async (values) => {
				if (savedRef.current) return;
				savedRef.current = true;
				try {
					const plan = existing
						? await updatePlan(existing, values)
						: await createPlan(projectId, values);
					showToast("success", t(localizationConstants.projectTimeplanSavedToast));
					router.push(destination === "view"
						? timeplanUrls.view(projectId, plan.id)
						: timeplanUrls.list(projectId));
				} catch {
					savedRef.current = false;
					showToast("error", t(localizationConstants.genericError));
				}
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
		/** An edit route whose plan could not be fetched. */
		missing: Boolean(planId) && !existing,
		isLoading: Boolean(planId) && query.isLoading,
		isError: query.isError,
		authorName: existing?.createdById ?? author,
		save,
		cancel,
	};
}
