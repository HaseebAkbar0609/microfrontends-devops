"use client";

import React, { Suspense } from "react";
import { useRouter } from "next/navigation";
import { CreateBankLoanWizard } from "@/features/financial-management/components/bank/CreateBankLoanWizard";
import { useBank } from "@/features/financial-management/hooks/useBank";
import { BANK_BASE_ROUTE } from "@/features/financial-management/constants/bank.constants";

function CreateBankLoanPageContent() {
	const router = useRouter();
	const { createLoan } = useBank("lan-finansiering");

	return (
		<CreateBankLoanWizard
			onBack={() => router.push(`${BANK_BASE_ROUTE}?tab=lan-finansiering`)}
			onSave={(data) => {
				createLoan(data);
				router.push(`${BANK_BASE_ROUTE}?tab=lan-finansiering`);
			}}
		/>
	);
}

export default function CreateBankLoanPage() {
	return (
		<Suspense fallback={<div className="p-6">Laddar...</div>}>
			<CreateBankLoanPageContent />
		</Suspense>
	);
}
