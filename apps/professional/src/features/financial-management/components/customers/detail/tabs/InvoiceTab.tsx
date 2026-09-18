"use client";

import React from "react";
import type { CustomerDetailData } from "@/features/financial-management/types/customerDetail.types";
import { InvoiceTermsCard } from "./invoice/InvoiceTermsCard";
import { InvoicingCard } from "./invoice/InvoicingCard";
import { ReferencesCard } from "./invoice/ReferencesCard";
import { AccountingCard } from "./invoice/AccountingCard";
import { RotRutCard } from "./invoice/RotRutCard";

interface InvoiceTabProps {
	customer: CustomerDetailData;
	onUpdate: (updates: Partial<CustomerDetailData>) => void;
}

export const InvoiceTab: React.FC<InvoiceTabProps> = ({
	customer,
	onUpdate,
}) => {
	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
				<InvoiceTermsCard customer={customer} onUpdate={onUpdate} />
				<InvoicingCard customer={customer} onUpdate={onUpdate} />
				<ReferencesCard customer={customer} onUpdate={onUpdate} />
				<AccountingCard customer={customer} onUpdate={onUpdate} />
			</div>
			<RotRutCard customer={customer} onUpdate={onUpdate} />
		</div>
	);
};
