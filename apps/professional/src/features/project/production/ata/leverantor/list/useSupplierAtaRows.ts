"use client";

import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { todayIso } from "../../../../shared/todayIso";
import { supplierApproveBlockReason } from "../../ataRules";
import type { AtaEmptyState } from "../../list/useProjectAtaList";
import { ATA_ATTESTED_LABELS, ATA_STATUS_META } from "../../projectAta.config";
import * as customerStore from "../../services/projectAtaService";
import * as store from "../services/supplierAtaService";
import { SUPPLIER_ATA_STATUSES, type SupplierAtaSortField } from "../supplierAta.config";
import { matchesSupplierAta, sortSupplierAtaRows, toSupplierAtaRows, type SupplierAtaLabels } from "../supplierAtaRows";
import type { AtaSupplier, SupplierAta } from "../types";
import { useSupplierListControls } from "./useSupplierListControls";

/**
 * One supplier's ÄTAs: search, the status filter, sorting, paging, the summary
 * box, and Godkänna from the row menu. Linked ÄTAs are named by the project's
 * own customer ÄTAs, read once from that store.
 */
export function useSupplierAtaRows(projectId: string, supplier: AtaSupplier) {
	const { t, i18n } = useTranslation();
	const controls = useSupplierListControls<SupplierAtaSortField>();
	const [atas, setAtas] = useState(() => store.listSupplierAtas(projectId, supplier.id));
	const [customerNumbers] = useState(
		() => new Map(customerStore.listAtas(projectId).map((ata) => [ata.id, ata.number])),
	);
	const { filter, search, sortField, sortDir } = controls;

	const labels = useMemo<SupplierAtaLabels>(
		() => ({
			status: (status) => t(ATA_STATUS_META[status].labelKey),
			attested: (attested) => t(ATA_ATTESTED_LABELS[attested]),
			customerAta: (number) => t(localizationConstants.projectAtaLabel).replace("{number}", String(number)),
		}),
		[t],
	);

	const filterOptions = useMemo(
		() => SUPPLIER_ATA_STATUSES.map((value) => ({ value, label: labels.status(value) })),
		[labels],
	);

	const rows = useMemo(
		() =>
			sortSupplierAtaRows(
				toSupplierAtaRows(atas, customerNumbers).filter((row) => matchesSupplierAta(row, filter, search, labels)),
				sortField,
				sortDir,
				labels,
				i18n.language,
			),
		[atas, customerNumbers, filter, i18n.language, labels, search, sortDir, sortField],
	);

	const summary = useMemo(
		() => ({ total: rows.reduce((sum, row) => sum + row.amount, 0), count: rows.length }),
		[rows],
	);

	const emptyState: AtaEmptyState & { values?: Record<string, string> } =
		atas.length === 0
			? { titleKey: localizationConstants.projectAtaSupplierNoAtas, values: { name: supplier.name } }
			: { titleKey: localizationConstants.projectAtaNoMatches };

	const approve = useCallback(
		(ata: SupplierAta) => {
			const reason = supplierApproveBlockReason(ata.status, ata.lineItems);
			const approved = reason ? undefined : store.approveSupplierAta(projectId, ata.id, todayIso());
			setAtas(store.listSupplierAtas(projectId, supplier.id));
			showToast(
				approved ? "success" : "error",
				t(approved ? localizationConstants.viewAtaApproveSuccess : (reason ?? localizationConstants.projectAtaSupplierAlreadyApproved)),
			);
		},
		[projectId, supplier.id, t],
	);

	return { controls, filterOptions, page: controls.paginate(rows), summary, emptyState, approve };
}
