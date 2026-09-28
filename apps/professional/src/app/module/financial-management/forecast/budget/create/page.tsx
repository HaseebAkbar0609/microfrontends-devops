"use client";

import React from "react";
import {
	BudgetCreateRoute,
	FORECAST_BUDGET_BASE_ROUTE,
} from "@/features/financial-management";

export default function ForecastCreateBudgetRoute() {
	return <BudgetCreateRoute basePath={FORECAST_BUDGET_BASE_ROUTE} />;
}
