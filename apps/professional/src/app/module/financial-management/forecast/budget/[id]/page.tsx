"use client";

import React, { use } from "react";
import {
	BudgetDetailRoute,
	FORECAST_BUDGET_BASE_ROUTE,
} from "@/features/financial-management";

interface PageProps {
	params: Promise<{ id: string }>;
}

export default function ForecastBudgetDetailRoute({ params }: PageProps) {
	const { id } = use(params);
	return <BudgetDetailRoute id={id} basePath={FORECAST_BUDGET_BASE_ROUTE} />;
}
