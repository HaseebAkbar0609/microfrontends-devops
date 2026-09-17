"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import localizationConstants from "@/utils/translation/constants";
import type { AtaEmptyState } from "../../list/useProjectAtaList";
import { ATA_STATUS_META } from "../../projectAta.config";
import * as store from "../services/supplierAtaService";
import { SUPPLIER_ATA_STATUSES, type SupplierGroupSortField } from "../supplierAta.config";
import { groupSupplierAtas, matchesSupplierGroup, sortSupplierGroups } from "../supplierAtaGroups";
import { useSupplierListControls } from "./useSupplierListControls";

/**
 * "Vald leverantör/ UE: Alla" — one row per supplier. The status filter narrows
 * the ÄTAs behind each row, so the counts and the summary box describe what
 * the filter leaves; a supplier with nothing left drops out while a filter or
 * search is active.
 */
export function useSupplierGroups(projectId: string) {
	const { t, i18n } = useTranslation();
	const controls = useSupplierListControls<SupplierGroupSortField>();
	const [suppliers] = useState(() => store.listSuppliers(projectId));
	const [atas] = useState(() => store.listSupplierAtas(projectId));
	const { filter, search, sortField, sortDir } = controls;
	const narrowed = filter !== null || search.trim().length > 0;

	const filterOptions = useMemo(
		() => SUPPLIER_ATA_STATUSES.map((value) => ({ value, label: t(ATA_STATUS_META[value].labelKey) })),
		[t],
	);

	const groups = useMemo(() => {
		const shown = filter ? atas.filter((ata) => ata.status === filter) : atas;
		const rows = groupSupplierAtas(suppliers, shown).filter(
			(row) => matchesSupplierGroup(row, search) && (!narrowed || row.count > 0),
		);
		return sortSupplierGroups(rows, sortField, sortDir, i18n.language);
	}, [atas, filter, i18n.language, narrowed, search, sortDir, sortField, suppliers]);

	const summary = useMemo(
		() => groups.reduce((sum, row) => ({ total: sum.total + row.total, count: sum.count + row.count }), { total: 0, count: 0 }),
		[groups],
	);

	const emptyState: AtaEmptyState = narrowed
		? { titleKey: localizationConstants.projectAtaNoMatches }
		: { titleKey: localizationConstants.projectAtaSupplierEmpty, descriptionKey: localizationConstants.projectAtaSupplierEmptyDesc };

	return { controls, filterOptions, page: controls.paginate(groups), summary, emptyState };
}
