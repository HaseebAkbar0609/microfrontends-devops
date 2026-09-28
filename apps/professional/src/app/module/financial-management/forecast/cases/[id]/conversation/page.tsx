import React from "react";
import { CaseConversationPage } from "@/features/financial-management/components/cases/conversation";
import { FORECAST_CASES_BASE_ROUTE } from "@/features/financial-management/constants/cases.constants";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;

	return <CaseConversationPage id={id} basePath={FORECAST_CASES_BASE_ROUTE} />;
}
