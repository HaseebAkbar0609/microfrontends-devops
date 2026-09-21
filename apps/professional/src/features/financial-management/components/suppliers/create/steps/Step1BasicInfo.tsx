"use client";

import React from "react";
import type { UseFormReturn } from "react-hook-form";
import type { CreateSupplierFormData } from "../../../../types/createSupplier.types";
import { SupplierCompanyInfoCard } from "../sections/SupplierCompanyInfoCard";
import { SupplierAddressesCard } from "../sections/SupplierAddressesCard";
import { SupplierBankInfoCard } from "../sections/SupplierBankInfoCard";
import { SupplierPaymentTermsCard } from "../sections/SupplierPaymentTermsCard";

interface Step1BasicInfoProps {
	form: UseFormReturn<CreateSupplierFormData>;
}

export function Step1BasicInfo({ form }: Step1BasicInfoProps) {
	return (
		<div className="space-y-6">
			<SupplierCompanyInfoCard form={form} />
			<SupplierAddressesCard form={form} />
			<SupplierBankInfoCard form={form} />
			<SupplierPaymentTermsCard form={form} />
		</div>
	);
}
