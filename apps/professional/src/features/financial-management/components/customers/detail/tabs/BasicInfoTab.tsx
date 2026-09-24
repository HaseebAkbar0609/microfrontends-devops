"use client";

import React from "react";
import type { CustomerDetailData } from "@/features/financial-management/types/customerDetail.types";
import { CustomerInfoCard } from "./basic/CustomerInfoCard";
import { BankInfoCard } from "./basic/BankInfoCard";
import { VisitingAddressCard } from "./basic/VisitingAddressCard";
import { InvoiceAddressCard } from "./basic/InvoiceAddressCard";

interface BasicInfoTabProps {
	customer: CustomerDetailData;
	onUpdate: (updates: Partial<CustomerDetailData>) => void;
}

export const BasicInfoTab: React.FC<BasicInfoTabProps> = ({
	customer,
	onUpdate,
}) => {
	return (
		<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
			<CustomerInfoCard customer={customer} onUpdate={onUpdate} />
			<BankInfoCard customer={customer} onUpdate={onUpdate} />
			<VisitingAddressCard customer={customer} onUpdate={onUpdate} />
			<InvoiceAddressCard customer={customer} onUpdate={onUpdate} />
		</div>
	);
};
