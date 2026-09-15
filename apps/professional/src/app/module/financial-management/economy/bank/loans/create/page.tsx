"use client";

import React, { Suspense } from "react";
import { CreateBankLoanPage } from "@/features/financial-management/components/bank/create";

export default function CreateBankLoanRoutePage() {
	return (
		<Suspense fallback={<div className="p-6 flex items-center justify-center min-h-[200px]" />}>
			<CreateBankLoanPage />
		</Suspense>
	);
}
