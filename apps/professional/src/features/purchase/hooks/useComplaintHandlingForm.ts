"use client";

import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { ROLES } from "@/constants/roles";
import { useAuthStatus } from "@/context/AuthContext";
import { hasPermission } from "@/lib/hasPermission";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import type { PurchaseComplaintResolution } from "../types/purchase.types";

/** The Lösningsstatus value that makes a resolution summary mandatory. */
export const RESOLVED_STATUS = "resolved";

/**
 * The ticket's rule — "require a resolution summary when marking a complaint as
 * Resolved" — as a conditional refinement rather than a check in the component,
 * so it fails through the same path as every other field.
 */
export const complaintResolutionSchema = z
	.object({
		decision: z.string().default(""),
		resolutionType: z.string().default(""),
		resolutionStatus: z.string().default(""),
		resolutionDate: z.string().default(""),
		internalNotes: z.string().default(""),
	})
	.refine(
		(value) =>
			value.resolutionStatus !== RESOLVED_STATUS ||
			value.internalNotes.trim().length > 0,
		{
			path: ["internalNotes"],
			message: localizationConstants.purchaseComplaintNotesRequired,
		},
	);

/**
 * Builds the payload a complaint-handling endpoint will take.
 *
 * Pure, like `buildComplaintPayload` and `buildPurchaseOrderPayload`, so the
 * shape is inspectable without mounting the screen and there is one obvious
 * call site to swap for the real request.
 */
export function buildComplaintHandlingPayload(input: {
	complaintId: string;
	resolution: PurchaseComplaintResolution;
	companyId: string | null;
}) {
	return {
		complaintId: input.complaintId,
		resolution: input.resolution,
		/**
		 * The company is this codebase's isolation unit — there is no
		 * `tenant_id` anywhere in the frontend. Whatever consumes this must
		 * still scope server-side; a client-supplied id is a hint, not a
		 * boundary.
		 */
		companyId: input.companyId,
	};
}

/**
 * State, validation and saving for the Lösning & Utfall card.
 *
 * Split out of the tab so the component stays layout and wiring, matching the
 * module's other form hooks.
 */
export function useComplaintHandlingForm(
	complaintId: string,
	initial: PurchaseComplaintResolution,
) {
	const { t } = useTranslation();
	const { company } = useAuthStatus();

	const [resolution, setResolution] =
		useState<PurchaseComplaintResolution>(initial);
	const [errors, setErrors] = useState<Record<string, string>>({});

	/** Clearing an error as its field is edited avoids stale red borders. */
	const patch = useCallback(
		(next: Partial<PurchaseComplaintResolution>) => {
			setResolution((previous) => ({ ...previous, ...next }));
			setErrors((previous) => {
				const remaining = { ...previous };
				for (const key of Object.keys(next)) delete remaining[key];
				return remaining;
			});
		},
		[],
	);

	const save = useCallback(() => {
		/**
		 * The button is wrapped in `PermissionGate`, but `save` is reachable
		 * from the hook, so it re-checks rather than trusting the rendered
		 * tree. This is a guard, not a boundary — the server must enforce it.
		 */
		if (!hasPermission(ROLES.MANAGER, "EDIT_PURCHASE")) {
			showToast(
				"error",
				t(localizationConstants.complaintCreateUnavailable),
			);
			return;
		}

		const result = complaintResolutionSchema.safeParse(resolution);
		if (!result.success) {
			const collected: Record<string, string> = {};
			for (const issue of result.error.issues) {
				const path = issue.path.join(".");
				if (path && !collected[path]) collected[path] = issue.message;
			}
			setErrors(collected);
			return;
		}

		setErrors({});

		void buildComplaintHandlingPayload({
			complaintId,
			resolution,
			companyId: company?.id ?? null,
		});

		showToast(
			"success",
			t(localizationConstants.purchaseComplaintHandlingSavedToast),
		);
	}, [company, complaintId, resolution, t]);

	const reset = useCallback(() => {
		setResolution(initial);
		setErrors({});
	}, [initial]);

	return { resolution, patch, errors, save, reset };
}
