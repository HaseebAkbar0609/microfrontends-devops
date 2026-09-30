"use client";

import { useEffect } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import type { WithdrawMaterialFormValues } from "../components/withdraw/withdrawMaterial.schema";
import { depotArticleIdsQuery } from "./useDepotArticles";

/**
 * Clears what a change makes wrong in "Ta ut material": another depot drops a
 * material it does not carry, another link type drops the chosen record, and
 * another record drops its arbetsmoment.
 */
export function useWithdrawFieldResets(form: UseFormReturn<WithdrawMaterialFormValues>, clearArticle: () => void) {
	const queryClient = useQueryClient();

	useEffect(() => {
		const dropArticleNotIn = async (depotId: string) => {
			const articleId = form.getValues("articleId");
			if (!depotId || !articleId) return;
			// If the list cannot load, the material stays; withdrawing it is still refused.
			const carried = await queryClient.fetchQuery(depotArticleIdsQuery(depotId)).catch(() => null);
			// Skipped if the depot was changed again while the list loaded.
			if (carried && form.getValues("depotId") === depotId && !carried.includes(articleId)) clearArticle();
		};

		const subscription = form.watch((values, { name }) => {
			if (name === "depotId") void dropArticleNotIn(values.depotId ?? "");
			if (name === "linkType") {
				form.setValue("linkId", "");
				form.clearErrors("linkId");
			}
			if (name === "linkId") form.setValue("workStepId", "");
		});
		return () => subscription.unsubscribe();
	}, [form, queryClient, clearArticle]);
}
