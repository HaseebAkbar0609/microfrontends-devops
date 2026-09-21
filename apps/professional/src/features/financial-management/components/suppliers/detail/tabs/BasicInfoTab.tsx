"use client";

import React from "react";
import type { SupplierDetailData } from "../../../../types/supplierDetail.types";
import { SupplierInfoCard } from "./basic/SupplierInfoCard";
import { SupplierAddressesCard } from "./basic/SupplierAddressesCard";
import { SupplierBankCard } from "./basic/SupplierBankCard";
import { SupplierPaymentTermsCard } from "./basic/SupplierPaymentTermsCard";

interface BasicInfoTabProps {
	supplier: SupplierDetailData;
	onUpdate: (updates: Partial<SupplierDetailData>) => void;
}

export function BasicInfoTab({ supplier, onUpdate }: BasicInfoTabProps) {
	return (
		<div className="space-y-6">
			<SupplierInfoCard supplier={supplier} onUpdate={onUpdate} />
			<SupplierAddressesCard supplier={supplier} onUpdate={onUpdate} />
			<SupplierBankCard supplier={supplier} onUpdate={onUpdate} />
			<SupplierPaymentTermsCard supplier={supplier} onUpdate={onUpdate} />
		</div>
	);
}
