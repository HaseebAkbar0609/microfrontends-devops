"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { BankOverviewPage } from "@/features/financial-management";
import type { BankTabType } from "@/features/financial-management";

function BankPageContent() {
	const searchParams = useSearchParams();
	const tabParam = (searchParams.get("tab") as BankTabType) || "bankkonton";

	return <BankOverviewPage initialTab={tabParam} />;
}

export default function EconomyBankPage() {
	return (
		<Suspense fallback={<div className="p-6">Laddar...</div>}>
			<BankPageContent />
		</Suspense>
	);
}
