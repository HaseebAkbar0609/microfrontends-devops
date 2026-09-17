"use client";

import { useCallback, useState } from "react";

import { useQueryParams } from "@/hooks/useQueryParams";
import * as store from "../services/supplierAtaService";
import { ATA_SUPPLIER_QUERY_PARAM } from "../supplierAta.config";
import { SupplierAtaPanel, SupplierGroupPanel } from "./SupplierAtaPanels";

export interface SupplierAtaTabProps {
	projectId: string;
}

/**
 * ÄTA-Leverantör /UE. The selected supplier lives in `?leverantor=`, so View
 * ÄTA's back links, the browser's back button and a switch to ÄTA - kund and
 * back all return to it; an unknown id shows Alla. Each selection gets a fresh
 * panel, so search, filter, sort and page start over when it changes.
 */
export function SupplierAtaTab({ projectId }: SupplierAtaTabProps) {
	const { query, changeQueries } = useQueryParams();
	const [suppliers] = useState(() => store.listSuppliers(projectId));
	const selectedId = query.get(ATA_SUPPLIER_QUERY_PARAM);
	const selected = suppliers.find((supplier) => supplier.id === selectedId);

	const onSelect = useCallback(
		(supplierId: string | null) => changeQueries({ [ATA_SUPPLIER_QUERY_PARAM]: supplierId }),
		[changeQueries],
	);

	return selected ? (
		<SupplierAtaPanel key={selected.id} projectId={projectId} suppliers={suppliers} supplier={selected} onSelect={onSelect} />
	) : (
		<SupplierGroupPanel key=":all" projectId={projectId} suppliers={suppliers} onSelect={onSelect} />
	);
}

export default SupplierAtaTab;
