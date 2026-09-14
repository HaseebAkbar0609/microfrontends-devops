"use client";

import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CreateBankAccountWizard } from "@/features/financial-management/components/bank/CreateBankAccountWizard";
import { useBank } from "@/features/financial-management/hooks/useBank";
import { BANK_BASE_ROUTE } from "@/features/financial-management/constants/bank.constants";

function CreateBankAccountPageContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const stepParam = searchParams.get("step");
	const initialStep: 1 | 2 = stepParam === "2" ? 2 : 1;
	const { createAccount } = useBank("bankkonton");

	return (
		<CreateBankAccountWizard
			initialStep={initialStep}
			onBack={() => router.push(BANK_BASE_ROUTE)}
			onSave={(data) => {
				createAccount(data);
				router.push(BANK_BASE_ROUTE);
			}}
		/>
	);
}

export default function CreateBankAccountPage() {
	return (
		<Suspense fallback={<div className="p-6">Laddar...</div>}>
			<CreateBankAccountPageContent />
		</Suspense>
	);
}
