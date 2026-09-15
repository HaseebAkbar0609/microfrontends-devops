"use client";

import React, { Suspense } from "react";
import { CreateBankAccountPage } from "@/features/financial-management/components/bank/create";

export default function CreateBankAccountRoutePage() {
	return (
		<Suspense fallback={<div className="p-6 flex items-center justify-center min-h-[200px]" />}>
			<CreateBankAccountPage />
		</Suspense>
	);
}
