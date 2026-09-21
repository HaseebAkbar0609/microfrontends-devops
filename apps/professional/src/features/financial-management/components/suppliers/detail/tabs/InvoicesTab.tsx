"use client";

import React from "react";
import type { SupplierDetailData } from "../../../../types/supplierDetail.types";
import { SupplierInvoicesCard } from "./invoices/SupplierInvoicesCard";

interface InvoicesTabProps {
	supplier: SupplierDetailData;
}

export function InvoicesTab({ supplier }: InvoicesTabProps) {
	return (
		<div className="space-y-6">
			<SupplierInvoicesCard invoices={supplier.invoices} />
		</div>
	);
}
