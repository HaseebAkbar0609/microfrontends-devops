"use client";

import { useCallback, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type FieldErrors, type FieldPath, type Resolver } from "react-hook-form";

import { PROJECT_LIST_ROWS } from "../../../../data/projectsOverview.mock";
import { todayIso } from "../../../../shared/todayIso";
import { buildProjectRecordInfo } from "../../../data/projectRecordInfo.mock";
import { ataUrls } from "../../ataNav";
import { editBlockReason, isLocked } from "../../ataRules";
import { firstErrorPath } from "../../form/firstErrorPath";
import * as customerStore from "../../services/projectAtaService";
import * as store from "../services/supplierAtaService";
import { buildSupplierAtaFormSchema, supplierDraftOf, type SupplierAtaFormValues } from "./supplierAtaFormSchema";

/**
 * A supplier's ÄTA as the project reviews it: the record, its supplier, the
 * project's customer ÄTAs it may link to, and a form over what may change.
 * Nothing reaches the store until Spara or Godkänna; `persist` is the only
 * write besides approving.
 */
export function useSupplierAtaView(projectId: string, ataId: string) {
	const project = PROJECT_LIST_ROWS.find((row) => row.id === projectId);
	const [ata] = useState(() => store.getSupplierAta(projectId, ataId));
	const [supplier] = useState(() => (ata ? store.getSupplier(projectId, ata.supplierId) : undefined));
	const [recordInfo] = useState(() => buildProjectRecordInfo(projectId));
	const [customerAtas] = useState(() => customerStore.listAtas(projectId).map(({ id, number }) => ({ id, number })));
	const [schema] = useState(() => buildSupplierAtaFormSchema(customerAtas.map((customerAta) => customerAta.id)));
	const [defaultValues] = useState(() => supplierDraftOf(ata));

	const form = useForm<SupplierAtaFormValues>({
		resolver: zodResolver(schema) as Resolver<SupplierAtaFormValues>,
		defaultValues,
		mode: "onTouched",
	});

	const status = ata?.status ?? "ej_granskad";

	/** Focuses the first invalid field after a failed save. */
	const reveal = useCallback(
		(errors: FieldErrors<SupplierAtaFormValues>) => {
			const path = firstErrorPath(errors);
			if (path) setTimeout(() => form.setFocus(path as FieldPath<SupplierAtaFormValues>), 0);
		},
		[form],
	);

	/** Saves rows, names and link. The link is checked against the customer ÄTAs as they are now. */
	const persist = useCallback(
		(values: SupplierAtaFormValues) =>
			store.updateSupplierAta(
				projectId,
				ataId,
				{
					lineItems: values.lineItems,
					documents: values.documents.map(({ id, documentName }) => ({ id, documentName })),
					linkedCustomerAtaId: values.linkedCustomerAtaId,
				},
				{ today: todayIso(), customerAtaIds: customerStore.listAtas(projectId).map((customerAta) => customerAta.id) },
			),
		[ataId, projectId],
	);

	return {
		form,
		project,
		ata,
		supplier,
		recordInfo,
		customerAtas,
		missing: !project || !ata || !supplier,
		status,
		locked: isLocked(status),
		lockReason: editBlockReason(status),
		listUrl: ataUrls.supplierList(projectId, ata?.supplierId),
		reveal,
		persist,
	};
}

export type SupplierAtaViewState = ReturnType<typeof useSupplierAtaView>;
