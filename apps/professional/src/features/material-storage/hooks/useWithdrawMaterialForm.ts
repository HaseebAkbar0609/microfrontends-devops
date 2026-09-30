"use client";

import { useCallback, useEffect, useRef, useState, type BaseSyntheticEvent } from "react";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import {
	createWithdrawMaterialSchema,
	toWithdrawMaterialInput,
	type WithdrawIntent,
	type WithdrawMaterialFormValues,
} from "../components/withdraw/withdrawMaterial.schema";
import {
	MATERIAL_QUERY_KEYS,
	MATERIAL_UNIT_LABELS,
	WITHDRAWAL_DEFAULT_LINK_TYPE,
} from "../constants/materialStorage.constants";
import { materialWithdrawalService } from "../services/materialWithdrawalService";
import type { MaterialArticle, MaterialDepot } from "../types/materialStorage.types";
import type {
	MaterialDialogPreset,
	MaterialWithdrawalTransaction,
	WithdrawMaterialInput,
} from "../types/materialTransaction.types";
import { useMaterialFormatters } from "./useMaterialFormatters";
import { useMaterialStockLevel } from "./useMaterialStockLevel";
import { useWithdrawFieldResets } from "./useWithdrawFieldResets";

interface UseWithdrawMaterialFormOptions {
	preset: MaterialDialogPreset;
	articles: MaterialArticle[];
	depots: MaterialDepot[];
	/** Called after a successful withdrawal or draft, to close the dialog. */
	onDone: () => void;
}

/**
 * Form state for "Ta ut material". The dialog mounts afresh for every opening,
 * so the defaults are only the preset (depot, and the article with its Utpris
 * when opened from a row), linked to a project and added as an invoice line.
 */
export function useWithdrawMaterialForm({ preset, articles, depots, onDone }: UseWithdrawMaterialFormOptions) {
	const t = useTranslate();
	const queryClient = useQueryClient();
	const { formatCount, formatDecimalInput } = useMaterialFormatters();

	// The resolver is created once; it reads the current intent, articles and balance through refs.
	const intentRef = useRef<WithdrawIntent>("withdraw");
	const articlesRef = useRef(articles);
	const availableRef = useRef<number | undefined>(undefined);
	const [resolver] = useState(() => {
		const resolve: Resolver<WithdrawMaterialFormValues> = (values, context, options) =>
			zodResolver(
				createWithdrawMaterialSchema({
					intent: intentRef.current,
					unitOf: (articleId) => articlesRef.current.find((article) => article.id === articleId)?.unit,
					available: availableRef.current,
				}),
			)(values, context, options);
		return resolve;
	});

	const [defaultValues] = useState<WithdrawMaterialFormValues>(() => ({
		depotId: preset.depotId ?? "",
		articleId: preset.article?.id ?? "",
		quantity: "",
		linkType: WITHDRAWAL_DEFAULT_LINK_TYPE,
		linkId: "",
		workStepId: "",
		salesPrice: preset.article ? formatDecimalInput(preset.article.salesPrice) : "",
		addInvoiceLine: true,
		comment: "",
	}));

	const form = useForm<WithdrawMaterialFormValues>({ resolver, defaultValues });
	const [depotId, articleId] = useWatch({ control: form.control, name: ["depotId", "articleId"] });
	const available = useMaterialStockLevel(articleId, depotId)?.available;
	// Read during render: react-hook-form only tracks formState fields that render reads.
	const { isSubmitted } = form.formState;

	useEffect(() => {
		articlesRef.current = articles;
	}, [articles]);

	// A new balance can make a typed quantity too large, or fine again; after a submit, say so at once.
	useEffect(() => {
		availableRef.current = available;
		if (isSubmitted && form.getValues("quantity").trim()) void form.trigger("quantity");
	}, [available, isSubmitted, form]);

	/** Picking a material also fills in its Utpris, which stays editable. */
	const selectArticle = useCallback(
		(article: MaterialArticle) => {
			// Validating clears a "Välj ett material." left from an earlier submit.
			form.setValue("articleId", article.id, { shouldDirty: true, shouldValidate: true });
			form.setValue("salesPrice", formatDecimalInput(article.salesPrice), { shouldDirty: true });
			form.clearErrors("salesPrice");
			// The unit decides whether a typed quantity must be whole.
			if (form.getValues("quantity").trim()) void form.trigger("quantity");
		},
		[form, formatDecimalInput],
	);

	const clearArticle = useCallback(() => {
		form.setValue("articleId", "", { shouldDirty: true });
		form.setValue("salesPrice", "", { shouldDirty: true });
		form.clearErrors(["quantity", "salesPrice"]);
	}, [form]);

	useWithdrawFieldResets(form, clearArticle);

	const successMessage = (transaction: MaterialWithdrawalTransaction) =>
		t(localizationConstants.materialWithdrawSuccess, {
			quantity: formatCount(transaction.quantity ?? 0),
			unit: t(MATERIAL_UNIT_LABELS[transaction.unit]),
			material: articles.find((article) => article.id === transaction.articleId)?.name ?? "",
			depot: depots.find((depot) => depot.id === transaction.depotId)?.name ?? "",
		});

	const mutation = useMutation({
		mutationFn: ({ intent, input }: { intent: WithdrawIntent; input: WithdrawMaterialInput }) =>
			intent === "draft" ? materialWithdrawalService.saveDraft(input) : materialWithdrawalService.withdraw(input),
		onSuccess: (transaction, { intent }) => {
			void queryClient.invalidateQueries({ queryKey: MATERIAL_QUERY_KEYS.all });
			showToast(
				"success",
				intent === "draft" ? t(localizationConstants.materialWithdrawDraftSaved) : successMessage(transaction),
			);
			onDone();
		},
		onError: () => showToast("error", t(localizationConstants.materialWithdrawError)),
	});

	// The intent is set on click, before validation runs, so the resolver checks the right rules.
	const submitAs = (intent: WithdrawIntent) => (event?: BaseSyntheticEvent) => {
		intentRef.current = intent;
		return form.handleSubmit((values) => {
			if (mutation.isPending) return;
			mutation.mutate({ intent, input: toWithdrawMaterialInput(values) });
		})(event);
	};

	return {
		form,
		selectArticle,
		clearArticle,
		withdraw: submitAs("withdraw"),
		saveDraft: submitAs("draft"),
		isPending: mutation.isPending,
	};
}
