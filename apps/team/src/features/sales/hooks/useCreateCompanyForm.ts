"use client";

import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { showToast } from "@/lib/toast";
import {
	EMPTY_SALES_COMPANY_DRAFT,
	salesCompanyDraftSchema,
	type SalesCompanyDraftValues,
} from "../schemas/salesCompany.schema";
import type { SalesCompany } from "../types";
import { useSalesCompanies } from "./useSalesCompanies";

type UseCreateCompanyFormOptions = {
	onCreated?: (company: SalesCompany) => void;
};

/**
 * Owns the draft, validation and submit for registering a company. The dialog
 * stays layout and wiring.
 */
export function useCreateCompanyForm({
	onCreated,
}: UseCreateCompanyFormOptions = {}) {
	const { addCompany } = useSalesCompanies();
	const t = useTranslate();

	const form = useForm<SalesCompanyDraftValues>({
		resolver: zodResolver(salesCompanyDraftSchema),
		defaultValues: EMPTY_SALES_COMPANY_DRAFT,
		mode: "onSubmit",
	});

	const reset = useCallback(() => {
		form.reset(EMPTY_SALES_COMPANY_DRAFT);
	}, [form]);

	const submit = form.handleSubmit(async (values) => {
		try {
			const company = await addCompany(values);
			showToast("success", t(localizationConstants.salesCompanyCreatedToast));
			reset();
			onCreated?.(company);
		} catch {
			showToast("error", t(localizationConstants.salesRecordSaveFailed));
		}
	});

	return { form, submit, reset };
}
