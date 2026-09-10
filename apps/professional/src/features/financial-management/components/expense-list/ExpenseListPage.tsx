"use client";

import React from "react";
import { SupplierInvoiceView } from "./SupplierInvoiceView";

export function ExpenseListPage() {
	return (
		<div className="flex flex-1 flex-col bg-slate-50/50 px-6 pt-5 pb-8">
			<SupplierInvoiceView />
		</div>
	);
}


export default ExpenseListPage;
