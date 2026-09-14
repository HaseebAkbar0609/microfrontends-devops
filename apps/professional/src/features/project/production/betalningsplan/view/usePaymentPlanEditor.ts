"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { generateTempId } from "@/lib/tempId";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { todayIso } from "../../../shared/todayIso";
import { buildProjectRecordInfo } from "../../data/projectRecordInfo.mock";
import { PLAN_DOCUMENT_TYPE_KEY } from "../paymentPlan.config";
import { recomputeRetention, summarise } from "../paymentPlanMath";
import { paymentPlanUrls } from "../paymentPlanNav";
import * as store from "../services/paymentPlanService";
import type { AcontoValues, PaymentAconto, PaymentTerms, ProjectPaymentPlan } from "../types";

type PlanChange = (plan: ProjectPaymentPlan) => ProjectPaymentPlan;

/** Replaces the rows and recalculates every uninvoiced row's retention. */
const withAcontos = (plan: ProjectPaymentPlan, acontos: PaymentAconto[]): ProjectPaymentPlan => ({
	...plan,
	acontos: recomputeRetention(acontos, plan.terms),
});

/**
 * A payment plan's editing state: the saved plan, a draft of it, and whether
 * anything is unsaved.
 *
 * "Unsaved" is a reference check — `draft !== saved` — sound because the draft
 * is only ever replaced, never mutated. Invoicing writes straight to the store
 * and is refused while the draft is dirty, so an invoice is never raised against
 * a row that has not been saved.
 */
export function usePaymentPlanEditor(projectId: string, planId: string) {
	const { t } = useTranslation();
	const router = useRouter();

	const [saved, setSaved] = useState(() => store.getPlan(projectId, planId));
	const [draft, setDraft] = useState(saved);
	/* A sent plan's rows are locked until its pencil is pressed. */
	const [unlocked, setUnlocked] = useState(false);

	const dirty = draft !== saved;
	const projectInfo = useMemo(() => buildProjectRecordInfo(projectId), [projectId]);
	const summary = useMemo(() => (draft ? summarise(draft.acontos, draft.terms) : null), [draft]);

	/* A reload or closing the tab while dirty asks first. In-app links are not
	   covered: the App Router offers no way to block a route change. */
	useEffect(() => {
		if (!dirty) return;
		const warn = (event: BeforeUnloadEvent) => event.preventDefault();
		window.addEventListener("beforeunload", warn);
		return () => window.removeEventListener("beforeunload", warn);
	}, [dirty]);

	const change = useCallback((fn: PlanChange) => {
		setDraft((previous) => (previous ? fn(previous) : previous));
	}, []);

	const saveAconto = useCallback(
		(values: AcontoValues, id?: string) => {
			/* The id is made here, in the handler — never inside a state updater,
			   which Strict Mode runs twice. */
			const rowId = id ?? generateTempId();
			change((plan) => {
				const existing = plan.acontos.find((aconto) => aconto.id === rowId);
				const row: PaymentAconto = existing
					? { ...existing, ...values }
					: { ...values, id: rowId, retained: 0, paid: false };
				const acontos = existing
					? plan.acontos.map((aconto) => (aconto.id === rowId ? row : aconto))
					: [...plan.acontos, row];
				return withAcontos(plan, acontos);
			});
		},
		[change],
	);

	const removeAconto = useCallback(
		(id: string) =>
			change((plan) => withAcontos(plan, plan.acontos.filter((aconto) => aconto.id !== id))),
		[change],
	);

	const updateTerms = useCallback(
		(terms: PaymentTerms) => change((plan) => withAcontos({ ...plan, terms }, plan.acontos)),
		[change],
	);

	const addDocument = useCallback(
		(fileName: string) => {
			const document = {
				id: generateTempId(),
				date: todayIso(),
				typeKey: PLAN_DOCUMENT_TYPE_KEY,
				fileName,
			};
			change((plan) => ({ ...plan, documents: [...plan.documents, document] }));
		},
		[change],
	);

	const removeDocument = useCallback(
		(id: string) =>
			change((plan) => ({ ...plan, documents: plan.documents.filter((doc) => doc.id !== id) })),
		[change],
	);

	/** Writes the draft, moving Reviderad to today. */
	const persist = useCallback((): ProjectPaymentPlan | undefined => {
		if (!draft) return undefined;
		const next = { ...draft, revisedDate: todayIso() };
		store.savePlan(next);
		setSaved(next);
		setDraft(next);
		return next;
	}, [draft]);

	const save = useCallback(() => {
		if (!persist()) return;
		showToast("success", t(localizationConstants.toastPlanSaved));
	}, [persist, t]);

	const send = useCallback(() => {
		const plan = persist();
		if (!plan) return;
		store.markSent(plan.id);
		showToast("success", t(localizationConstants.toastPlanSent));
		router.push(paymentPlanUrls.list(projectId));
	}, [persist, projectId, router, t]);

	const createInvoice = useCallback(
		(acontoId: string) => {
			if (!saved || dirty) return;
			store.invoiceAconto(saved.id, acontoId, todayIso());
			const fresh = store.getPlan(projectId, saved.id);
			setSaved(fresh);
			setDraft(fresh);
			showToast("success", t(localizationConstants.projectPaymentPlanInvoiceCreatedToast));
		},
		[dirty, projectId, saved, t],
	);

	const discard = useCallback(() => {
		setDraft(saved);
		router.push(paymentPlanUrls.list(projectId));
	}, [projectId, router, saved]);

	return {
		plan: draft,
		projectInfo,
		summary,
		dirty,
		acontosEditable: draft?.status === "draft" || unlocked,
		unlockAcontos: () => setUnlocked(true),
		saveAconto,
		removeAconto,
		updateTerms,
		addDocument,
		removeDocument,
		save,
		send,
		createInvoice,
		discard,
	};
}

export type PaymentPlanEditor = ReturnType<typeof usePaymentPlanEditor>;
